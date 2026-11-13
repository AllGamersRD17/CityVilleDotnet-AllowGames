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
                var fallbackFile = GetConfiguredFallback(requestPath, logPath);

                if (fallbackFile is not null)
                {
                    logger.LogWarning("Asset not found: {RequestPath}, serving configured fallback: {FallbackFile}", logPath, fallbackFile);

                    await SendFallbackAsync(context, fallbackFile, contentType);
                    return;
                }

                var placeholder = GameSettingsManager.Instance.GetAssetPlaceholder(requestPath);
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

    private static async Task SendFallbackAsync(HttpContext context, string file, string contentType)
    {
        SetFallbackHeaders(context, contentType);
        await context.Response.SendFileAsync(file);
    }

    private static void SetFallbackHeaders(HttpContext context, string contentType)
    {
        context.Response.StatusCode = 200;
        context.Response.ContentType = contentType;
        context.Response.Headers.CacheControl = "public, max-age=2592000"; // 1 month
        context.Response.Headers.Expires = DateTime.UtcNow.AddMonths(1).ToString("R");
    }
}