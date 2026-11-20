using System.Collections.Concurrent;
using System.Text.Json;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: reportes tecnicos de los celulares donde el juego no termina de cargar (diag.js).
// Solo datos tecnicos: navegador, pantalla, errores y hasta donde llego la carga. Nada personal.
public static class DiagService
{
    private static readonly ConcurrentQueue<object> Last = new();

    public static void MapDiag(WebApplication app)
    {
        app.MapPost("/api/ag/diag", async (HttpContext h) =>
        {
            using var r = new StreamReader(h.Request.Body);
            var text = await r.ReadToEndAsync();
            if (text.Length > 20000) text = text[..20000];
            JsonElement body;
            try { body = JsonSerializer.Deserialize<JsonElement>(text); } catch { return Results.BadRequest(); }
            Last.Enqueue(new { at = DateTime.UtcNow, report = body });
            while (Last.Count > 20) Last.TryDequeue(out _);
            return Results.Ok();
        });

        app.MapGet("/api/ag/diag/latest", () => Results.Json(Last.Reverse().ToList()));
    }
}
