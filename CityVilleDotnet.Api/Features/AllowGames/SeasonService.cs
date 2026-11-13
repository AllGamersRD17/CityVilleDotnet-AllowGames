using System.Text.Json;
using CityVilleDotnet.Domain.GameEntities;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: guarda la temporada elegida en el panel de admin (season.json) y la aplica a todas las ciudades.
public static class SeasonService
{
    public sealed record ThemeOption(string Name, string Es, string En);

    // Colecciones de temas que trae gameSettings.xml (type="theme_collection")
    // Solo temas cuyos graficos existen en los assets (otoño, halloween y noche tienen archivos faltantes -> cuadros morados)
    public static readonly ThemeOption[] Options =
    [
        new("snow_day", "Nieve completa (suelo, edificios y gente abrigada)", "Snow day"),
        new("snow_cover", "Solo suelo nevado", "Snow ground only"),
        new("snow_buildings", "Solo techos nevados", "Snowy roofs only"),
        new("npcs_warm", "Gente con ropa de verano", "Summer clothes"),
        new("npcs_green", "Gente de verde (San Patricio)", "Green citizens (St. Patrick's)"),
        new("npcs_brazil", "Gente de Brasil (Carnaval)", "Brazil citizens (Carnival)"),
        new("npcs_greek", "Gente griega", "Greek citizens"),
        new("npcs_circus", "Gente de circo", "Circus citizens"),
        new("npcs_russian", "Gente rusa (invierno)", "Russian citizens")
    ];

    public static readonly Dictionary<string, string[]> Presets = new()
    {
        ["normal"] = [],
        ["invierno"] = ["snow_day"],
        ["nieve_suave"] = ["snow_cover"],
        ["verano"] = ["npcs_warm"],
        ["sanpatricio"] = ["npcs_green"],
        ["carnaval"] = ["npcs_brazil"],
        ["circo"] = ["npcs_circus"],
        ["grecia"] = ["npcs_greek"]
    };

    public sealed class SeasonConfig
    {
        public bool Auto { get; set; } = true;
        public List<string> Collections { get; set; } = [];
        public string? Banner { get; set; }
        public DateTimeOffset Updated { get; set; } = DateTimeOffset.Now;
    }

    private static readonly object Lock = new();
    private static string _path = "season.json";
    private static SeasonConfig _config = new();
    public static Timer? Ticker { get; private set; }

    public static SeasonConfig Config { get { lock (Lock) return _config; } }

    public static void Initialize(string contentRoot)
    {
        _path = Path.Combine(contentRoot, "season.json");
        try
        {
            if (File.Exists(_path))
                _config = JsonSerializer.Deserialize<SeasonConfig>(File.ReadAllText(_path)) ?? new SeasonConfig();
        }
        catch { _config = new SeasonConfig(); }

        Apply();
        // Re-evaluar el modo automático cada hora (cambia solo de temporada según la fecha)
        Ticker = new Timer(_ => Apply(), null, TimeSpan.FromHours(1), TimeSpan.FromHours(1));
    }

    public static void Save(bool auto, IEnumerable<string> collections, string? banner)
    {
        var valid = Options.Select(o => o.Name).ToHashSet();
        lock (Lock)
        {
            _config = new SeasonConfig
            {
                Auto = auto,
                Collections = collections.Where(valid.Contains).Distinct().ToList(),
                Banner = string.IsNullOrWhiteSpace(banner) ? null : banner.Trim()[..Math.Min(banner.Trim().Length, 200)],
                Updated = DateTimeOffset.Now
            };
            File.WriteAllText(_path, JsonSerializer.Serialize(_config, new JsonSerializerOptions { WriteIndented = true }));
        }

        Apply();
    }

    public static string[] AutoCollections(DateTime d)
    {
        var md = d.Month * 100 + d.Day;
        if (md >= 1201 || md <= 131) return ["snow_day"];          // invierno / navidad
        if (md >= 201 && md <= 228) return ["snow_cover"];         // final del invierno
        if (md >= 310 && md <= 317) return ["npcs_green"];         // San Patricio
        if (md >= 621 && md <= 831) return ["npcs_warm"];          // verano
        return [];
    }

    public static string[] Active()
    {
        var c = Config;
        return c.Auto ? AutoCollections(DateTime.Now) : c.Collections.Where(x => Options.Any(o => o.Name == x)).ToArray();
    }

    private static void Apply() => SeasonState.Collections = Active();
}
