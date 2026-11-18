using System.Collections.Concurrent;
using CityVilleDotnet.Common.Utils;
using CityVilleDotnet.Common.Settings;
using SkiaSharp;

namespace CityVilleDotnet.Api.Middleware;

public class FallbackAssetMiddleware(
    RequestDelegate next,
    IWebHostEnvironment env,
    IConfiguration configuration,
    ILogger<FallbackAssetMiddleware> logger)
{
    private readonly Dictionary<string, string> _fallbacks = new(configuration.GetSection("assetFallbacks").Get<Dictionary<string, string>>() ?? [], StringComparer.OrdinalIgnoreCase);
    private readonly ConcurrentDictionary<(string File, int Height), byte[]> _resizedPlaceholders = new();
    private readonly ConcurrentDictionary<(string Icon, string Frame, int Height), byte[]> _iconImages = new();

    public async Task InvokeAsync(HttpContext context)
    {
        await next(context);

        if (context.Response.StatusCode == 404 && context.Request.Path.StartsWithSegments("/assets"))
        {
            var requestPath = context.Request.Path.Value!;
            var logPath = requestPath.Sanitize();
            var extension = Path.GetExtension(logPath).ToLowerInvariant();
            var contentType = extension switch
            {
                ".png" => "image/png",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".gif" => "image/gif",
                ".mp3" => "audio/mpeg",
                ".swf" => "application/x-shockwave-flash",
                ".css" => "text/css",
                _ => null
            };

            // Allow Games: en Linux los nombres distinguen mayusculas; el juego se hizo para Windows
            var sameFileOtherCase = FindIgnoringCase(requestPath);
            if (sameFileOtherCase is not null)
            {
                context.Response.StatusCode = 200;
                context.Response.ContentType = contentType ?? "application/octet-stream";
                context.Response.Headers.CacheControl = "public, max-age=86400";
                await context.Response.SendFileAsync(sameFileOtherCase);
                return;
            }

            if (contentType != null)
            {
                // Allow Games: carros sin dibujo -> se usa otro carro parecido que si tenemos (mismo sentido)
                var carFile = CarFallback(requestPath) ?? CarUiFallback(requestPath);
                if (carFile is not null)
                {
                    await SendFallbackAsync(context, carFile, contentType);
                    return;
                }

                var fallbackFile = GetConfiguredFallback(requestPath, logPath);

                if (fallbackFile is not null)
                {
                    logger.LogWarning("Asset not found: {RequestPath}, serving configured fallback: {FallbackFile}", logPath, fallbackFile);

                    await SendFallbackAsync(context, fallbackFile, contentType);
                    return;
                }

                // Allow Games: si existe el mismo objeto visto desde otro lado, o el objeto original de la skin, se usa ese dibujo
                if (extension == ".png")
                {
                    var alternate = GameSettingsManager.Instance.GetAssetAlternates(requestPath)
                        .Select(FindIgnoringCase)
                        .FirstOrDefault(x => x is not null);
                    if (alternate is not null)
                    {
                        logger.LogInformation("Asset not found: {RequestPath}, serving alternate: {Alternate}", logPath, alternate);
                        await SendFallbackAsync(context, alternate, contentType);
                        return;
                    }
                }

                var placeholder = GameSettingsManager.Instance.GetAssetPlaceholder(requestPath);

                // Allow Games: decoracion sin arte en el mapa -> se dibuja su icono con el tamano del andamio
                if (placeholder?.Icon is not null && extension == ".png")
                {
                    var iconFile = placeholder.Icon.Split('|')
                        .Select(x => FindIgnoringCase("/" + x.TrimStart('/')))
                        .Where(x => x is not null)
                        .OrderByDescending(x => new FileInfo(x!).Length)
                        .FirstOrDefault();
                    var frameFile = FindIgnoringCase(placeholder.Path);
                    if (iconFile is not null && frameFile is not null)
                    {
                        byte[]? drawn = null;
                        try { drawn = _iconImages.GetOrAdd((iconFile, frameFile, placeholder.Height ?? 0), x => RenderIcon(x.Icon, x.Frame, x.Height)); }
                        catch (Exception e) { logger.LogWarning(e, "Icon render failed for {RequestPath}", logPath); }
                        if (drawn is not null)
                        {
                            SetFallbackHeaders(context, "image/png");
                            await context.Response.Body.WriteAsync(drawn);
                            return;
                        }
                    }
                }
                var placeholderFile = placeholder is not null ? ResolveFallbackFile(logPath, placeholder.Path) : null;

                if (placeholder is not null && placeholderFile is not null)
                {
                    logger.LogWarning("Asset not found: {RequestPath}, serving construction placeholder: {PlaceholderFile}", logPath, placeholderFile);

                    if (placeholder.Height is null)
                    {
                        await SendFallbackAsync(context, placeholderFile, contentType);
                    }
                    else
                    {
                        byte[]? image = null;
                        try { image = _resizedPlaceholders.GetOrAdd((placeholderFile, placeholder.Height.Value), x => RenderPlaceholder(x.File, x.Height)); }
                        catch (Exception e) { logger.LogWarning(e, "Placeholder render failed, sending it unresized"); }

                        if (image is null) { await SendFallbackAsync(context, placeholderFile, contentType); return; }
                        SetFallbackHeaders(context, "image/png");
                        await context.Response.Body.WriteAsync(image);
                    }

                    return;
                }

                var defaultFile = Path.Combine(env.WebRootPath, "assets", $"default{extension}");

                if (File.Exists(defaultFile))
                {
                    logger.LogWarning("Asset not found: {RequestPath}, serving default fallback: {DefaultFile}", logPath, defaultFile);

                    await SendFallbackAsync(context, defaultFile, contentType);
                }
                else
                {
                    logger.LogWarning("Asset not found: {RequestPath}, but no default fallback exists at: {DefaultFile}", logPath, defaultFile);
                }
            }
        }
    }

    private static Dictionary<string, string>? _caseIndex;
    private static readonly object CaseLock = new();

    private string? FindIgnoringCase(string requestPath)
    {
        if (OperatingSystem.IsWindows()) return null;
        if (_caseIndex is null)
        {
            lock (CaseLock)
            {
                if (_caseIndex is null)
                {
                    var index = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                    var root = Path.Combine(env.WebRootPath, "assets");
                    try
                    {
                        foreach (var file in Directory.EnumerateFiles(root, "*", SearchOption.AllDirectories))
                            index.TryAdd("/assets/" + Path.GetRelativePath(root, file).Replace('\\', '/'), file);
                    }
                    catch (Exception e)
                    {
                        logger.LogWarning(e, "Could not index assets folder");
                    }
                    _caseIndex = index;
                }
            }
        }
        return _caseIndex.TryGetValue(Uri.UnescapeDataString(requestPath), out var real) ? real : null;
    }

    private static readonly System.Text.RegularExpressions.Regex CarPath = new(
        @"^/assets/npcs/([^/]+)/[^/]*?_?(NNE|NNW|SSE|SSW|NEE|NWW|SEE|SWW|NE|NW|SE|SW|N|S|E|W)\.png$",
        System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Compiled);

    // Allow Games: la ventana de fabricar carros pide assets/cars/ui_images/<carro>.png, que no tenemos;
    // se usa el icono del carro (o el de la tienda de carros) para que la ventana no salga vacia
    private string? CarUiFallback(string requestPath)
    {
        const string prefix = "/assets/cars/ui_images/";
        if (!requestPath.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)) return null;
        var name = Path.GetFileNameWithoutExtension(requestPath);
        try
        {
            var item = CityVilleDotnet.Common.Settings.GameSettingsManager.Instance.GetItem(name);
            var url = item?.Images.FirstOrDefault(i => i.Name == "icon")?.Url ?? item?.Images.FirstOrDefault()?.Url;
            if (!string.IsNullOrEmpty(url))
            {
                var f = FindIgnoringCase("/" + url.TrimStart('/'));
                if (f is not null) return f;
            }
        }
        catch { /* settings sin cargar */ }
        return FindIgnoringCase("/assets/cars/car_jack.png");
    }

    private string? CarFallback(string requestPath)
    {
        var m = CarPath.Match(requestPath);
        if (!m.Success) return null;
        var folder = m.Groups[1].Value.ToLowerInvariant();
        var dir = m.Groups[2].Value.ToUpperInvariant();
        string[] donors = folder switch
        {
            "car_yellow_taxi" => ["/assets/NPC/Car_taxi/car_taxi_{0}.png"],
            "car_cvbus" => ["/assets/NPC/Car_city_bus/cars_city_bus01_{0}.png"],
            "car_pinkbus" => ["/assets/NPC/Car_city_bus/cars_city_bus03_{0}.png"],
            "car_airportshuttle" => ["/assets/NPC/Car_tourismbus/bus_{0}.png"],
            "car_bigdeltruck" => ["/assets/NPC/Car_bigdeltruck/car_bigdeltruck_{0}.png"],
            "car_rustytruck" => ["/assets/NPC/Car_rustytruck/car_rustytruck_{0}.png"],
            "car_policemotorcycle" => ["/assets/NPC/Car_detectivemotorcycle/car_detectivemotorcycle_{0}.png"],
            "car_parkingenforcement" => ["/assets/NPC/Car_policecruiser/Car_policecruiser_{0}.png"],
            "car_banditgetaway" => ["/assets/NPC/Car_detective_armoredsuv/Car_detective_armoredsuv_{0}.png"],
            "car_limo" or "car_hummer_limo" => ["/assets/NPC/Car_yehaul_hearse/Car_hearse_{0}.png", "/assets/npcs/car_bluecar/car_bluecar_{0}.png"],
            "car_propel" => ["/assets/NPC/Car_deliveryvan/char_deliveryVan_Move_{0}.png"],
            _ => ["/assets/npcs/car_bluecar/car_bluecar_{0}.png", "/assets/NPC/Car_taxi/car_taxi_{0}.png"]
        };
        return donors.Select(d => FindIgnoringCase(string.Format(d, dir))).FirstOrDefault(x => x is not null);
    }

    private string? GetConfiguredFallback(string requestPath, string logPath)
    {
        return _fallbacks.TryGetValue(requestPath, out var fallbackPath) ? ResolveFallbackFile(logPath, fallbackPath) : null;
    }

    private string? ResolveFallbackFile(string logPath, string fallbackPath)
    {
        var fallbackFile = Path.GetFullPath(Path.Combine(env.WebRootPath, fallbackPath.TrimStart('/')));

        if (File.Exists(fallbackFile)) return fallbackFile;

        logger.LogError("Configured fallback for {RequestPath} doesn't exist: {FallbackFile}", logPath, fallbackFile);

        return null;
    }

    private static byte[] RenderPlaceholder(string file, int height)
    {
        using var source = SKBitmap.Decode(file);
        using var resized = new SKBitmap(source.Width, height);
        using var canvas = new SKCanvas(resized);

        canvas.Clear(SKColors.Transparent);
        canvas.DrawBitmap(source, SKRect.Create(0, height - source.Height, source.Width, source.Height), SKSamplingOptions.Default);

        using var image = SKImage.FromBitmap(resized);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);

        return data.ToArray();
    }

    private static byte[] RenderIcon(string iconFile, string frameFile, int height)
    {
        using var frame = SKBitmap.Decode(frameFile);
        using var icon = SKBitmap.Decode(iconFile);
        // el juego centra la imagen en la casilla; un arbol de 1x1 original mide ~100px de ancho
        var w = Math.Max(frame.Width, 96);
        var lift = frame.Width / 4f;

        // recorta lo transparente del icono
        int minX = icon.Width, minY = icon.Height, maxX = -1, maxY = -1;
        for (var y = 0; y < icon.Height; y++)
            for (var x = 0; x < icon.Width; x++)
                if (icon.GetPixel(x, y).Alpha > 16)
                {
                    minX = Math.Min(minX, x); maxX = Math.Max(maxX, x);
                    minY = Math.Min(minY, y); maxY = Math.Max(maxY, y);
                }
        if (maxX < 0) { minX = 0; minY = 0; maxX = icon.Width - 1; maxY = icon.Height - 1; }
        var src = new SKRect(minX, minY, maxX + 1, maxY + 1);

        // la base del objeto va cerca del centro del rombo de la casilla
        var scale = Math.Min(w * 0.95f / src.Width, 2.5f); // sin agrandar tanto que se vea borroso
        int h;
        if (height > 0)
        {
            scale = Math.Min(scale, Math.Max(height - lift, 8) / src.Height);
            h = height;
        }
        else
        {
            h = (int)Math.Ceiling(src.Height * scale + lift);
        }
        var dw = src.Width * scale;
        var dh = src.Height * scale;
        var dst = SKRect.Create((w - dw) / 2f, h - lift - dh, dw, dh);

        using var outBmp = new SKBitmap(w, h);
        using var canvas = new SKCanvas(outBmp);
        canvas.Clear(SKColors.Transparent);
        using var img = SKImage.FromBitmap(icon);
        canvas.DrawImage(img, src, dst, new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.Linear));

        using var image = SKImage.FromBitmap(outBmp);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);
        return data.ToArray();
    }

    private static async Task SendFallbackAsync(HttpContext context, string file, string contentType)
    {
        SetFallbackHeaders(context, contentType);
        await context.Response.SendFileAsync(file);
    }

    private static void SetFallbackHeaders(HttpContext context, string contentType)
    {
        context.Response.StatusCode = 200;
        context.Response.ContentType = contentType;
        context.Response.Headers.CacheControl = "public, max-age=86400"; // Allow Games: 1 dia, para que los arreglos de arte lleguen rapido
        context.Response.Headers.Expires = DateTime.UtcNow.AddDays(1).ToString("R");
    }
}