using System.Collections.Concurrent;
using System.Text.Json;
using CityVilleDotnet.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: apunta las funciones del juego que el servidor todavia no sabe hacer
// y las que fallan con error, para ver (como admin) cuales arreglar. /api/ag/admin/missing
// Se guarda en missing.json para que no se borre la lista cada vez que se actualiza el servidor.
public static class MissingHandlers
{
    public sealed class Entry
    {
        public string Handler { get; set; } = "";
        public string Function { get; set; } = "";
        public string Kind { get; set; } = "falta"; // "falta" = no existe, "error" = existe pero fallo
        public int Count { get; set; }
        public DateTime Last { get; set; }
        public string Sample { get; set; } = "";
        public string Error { get; set; } = "";
    }

    private static readonly ConcurrentDictionary<string, Entry> Seen = new(StringComparer.OrdinalIgnoreCase);
    private static string _path = "missing.json";
    private static Timer? _saver;
    private static volatile bool _dirty;

    public static void Initialize(string contentRoot)
    {
        _path = Path.Combine(contentRoot, "missing.json");
        try
        {
            if (File.Exists(_path))
                foreach (var e in JsonSerializer.Deserialize<List<Entry>>(File.ReadAllText(_path)) ?? new())
                    Seen[e.Kind + ":" + e.Handler] = e;
        }
        catch { /* archivo dañado: empezamos de cero */ }

        _saver = new Timer(_ => Save(), null, TimeSpan.FromSeconds(60), TimeSpan.FromSeconds(60));
    }

    private static void Save()
    {
        if (!_dirty) return;
        _dirty = false;
        try
        {
            var tmp = _path + ".tmp";
            File.WriteAllText(tmp, JsonSerializer.Serialize(Seen.Values.ToList()));
            File.Move(tmp, _path, true);
        }
        catch { _dirty = true; }
    }

    private static string Short(object? parameters)
    {
        try
        {
            var text = JsonSerializer.Serialize(parameters);
            return text.Length > 1500 ? text[..1500] : text;
        }
        catch
        {
            return parameters?.ToString() ?? "";
        }
    }

    private static void Add(string kind, string handler, string function, object? parameters, string error)
    {
        if (Seen.Count > 300 && !Seen.ContainsKey(kind + ":" + handler)) return; // tope para que no crezca sin fin
        var e = Seen.GetOrAdd(kind + ":" + handler, _ => new Entry { Handler = handler, Function = function, Kind = kind });
        lock (e)
        {
            e.Count++;
            e.Last = DateTime.UtcNow;
            e.Sample = Short(parameters);
            if (error.Length > 0) e.Error = error.Length > 400 ? error[..400] : error;
        }
        _dirty = true;
    }

    public static void Record(string handler, string function, object? parameters) =>
        Add("falta", handler, function, parameters, "");

    public static void RecordError(string function, object? parameters, Exception ex) =>
        Add("error", function, function, parameters, ex.GetType().Name + ": " + ex.Message);

    public static void MapMissingHandlers(this WebApplication app)
    {
        app.MapGet("/api/ag/admin/missing", async (HttpContext http, UserManager<ApplicationUser> users) =>
        {
            var user = await users.GetUserAsync(http.User);
            if (user is null || !user.IsAdmin) return Results.StatusCode(403);
            return Results.Json(Seen.Values
                .OrderByDescending(x => x.Last)
                .Select(x => new { handler = x.Handler, function = x.Function, kind = x.Kind, count = x.Count, last = x.Last, sample = x.Sample, error = x.Error }));
        });

        // Borrar una (cuando ya se arreglo) o toda la lista
        app.MapPost("/api/ag/admin/missing/clear", async (HttpContext http, UserManager<ApplicationUser> users) =>
        {
            var user = await users.GetUserAsync(http.User);
            if (user is null || !user.IsAdmin) return Results.StatusCode(403);
            var key = http.Request.Query["key"].ToString();
            if (string.IsNullOrEmpty(key)) Seen.Clear();
            else Seen.TryRemove(key, out _);
            _dirty = true;
            Save();
            return Results.Ok();
        });
    }
}
