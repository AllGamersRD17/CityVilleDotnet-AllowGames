using System.Text.RegularExpressions;
using CityVilleDotnet.Common.Utils;
using SkiaSharp;

namespace CityVilleDotnet.Api.Common.Identity;

public class ProfilePictureStorage(IWebHostEnvironment webHost)
{
    private const int MaxDimension = 50;

    public async Task<string?> SaveAsync(Stream stream, string userName, string ext)
    {
        using var original = SKBitmap.Decode(stream);

        if (original is null) return null;

        var picturesDir = Path.Combine(webHost.WebRootPath, "pictures");
        Directory.CreateDirectory(picturesDir);

        var baseName = Regex.Replace(userName, @"[^a-zA-Z0-9_-]", "_");
        foreach (var oldFile in Directory.EnumerateFiles(picturesDir, $"{baseName}.*"))
        {
            File.Delete(oldFile);
        }

        // Allow Games: recorte cuadrado del centro y en circulo con el fondo transparente (sin recuadro blanco)
        var side = Math.Min(original.Width, original.Height);
        var src = new SKRect((original.Width - side) / 2f, (original.Height - side) / 2f, (original.Width + side) / 2f, (original.Height + side) / 2f);

        var info = new SKImageInfo(MaxDimension, MaxDimension, SKColorType.Rgba8888, SKAlphaType.Premul);
        using var resized = new SKBitmap(info);
        using (var canvas = new SKCanvas(resized))
        {
            using var clip = new SKRoundRect(new SKRect(0, 0, MaxDimension, MaxDimension), MaxDimension / 2f, MaxDimension / 2f);
            canvas.ClipRoundRect(clip, SKClipOperation.Intersect, true);
            using var img = SKImage.FromBitmap(original);
            canvas.DrawImage(img, src, new SKRect(0, 0, MaxDimension, MaxDimension), new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.Linear));
        }

        ext = ".png";
        using var image = SKImage.FromBitmap(resized);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);

        await using var fs = new FileStream(Path.Combine(picturesDir, $"{baseName}{ext}"), FileMode.Create);

        data.SaveTo(fs);

        return $"/pictures/{baseName}{ext}?version={ServerUtils.GetCurrentTime()}";
    }
}
