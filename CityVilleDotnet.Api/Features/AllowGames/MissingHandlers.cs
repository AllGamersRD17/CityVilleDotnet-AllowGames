using System.Collections.Concurrent;
using System.Text.Json;
using CityVilleDotnet.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: apunta las funciones del juego que el servidor todavia no sabe hacer,
// para ver (como admin) cuales faltan y arreglarlas. /api/ag/admin/missing
public static class MissingHandlers
{
    private sealed class Entry
    {
        public string Handler = "";
        public string Function = "";
        public int Count;
        public DateTime Last;
        public string Sample = "";
    }

    private static readonly ConcurrentDictionary<string, Entry> Seen = new(StringComparer.OrdinalIgnoreCase);

    public static void Record(string handler, string function, object? parameters)
    {
        var e = Seen.GetOrAdd(handler, h => new Entry { Handler = h, Function = function });
        Interlocked.Increment(ref e.Count);
        e.Last = DateTime.UtcNow;
        try
        {
            var text = JsonSerializer.Serialize(parameters);
            e.Sample = text.Length > 1500 ? text[..1500] : text;
        }
        catch
        {
            e.Sample = parameters?.ToString() ?? "";
        }
    }

    public static void MapMissingHandlers(this WebApplication app)
    {
        app.MapGet("/api/ag/admin/missing", async (HttpContext http, UserManager<ApplicationUser> users) =>
        {
            var user = await users.GetUserAsync(http.User);
            if (user is null || !user.IsAdmin) return Results.StatusCode(403);
            return Results.Json(Seen.Values
                .OrderByDescending(x => x.Count)
                .Select(x => new { handler = x.Handler, function = x.Function, count = x.Count, last = x.Last, sample = x.Sample }));
        });
    }
}
