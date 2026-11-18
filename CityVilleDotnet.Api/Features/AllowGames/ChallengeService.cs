using System.Collections.Concurrent;
using System.Text.Json;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: desafios diarios. Sustituyen al boton "Monedas y CV Cash": nada se compra, todo se gana jugando.
// El progreso se cuenta con las acciones reales del juego (gateway AMF).
public static class ChallengeService
{
    public sealed record Def(string Id, string[] Actions, int Goal, int Coins, int Cash, int Energy, string Icon,
        string Es, string En, string Pt, string Fr, string It, string De);

    // Acciones = nombre de la clase que atiende la peticion del juego (WorldService.Harvest -> "Harvest", etc.)
    public static readonly Def[] Pool =
    [
        new("cobrar", ["Harvest"], 10, 300, 1, 0, "💰",
            "Cobra 10 veces en tu ciudad (casas, negocios o cosechas)", "Collect 10 times in your city (homes, businesses or crops)",
            "Colete 10 vezes na sua cidade", "Récolte 10 fois dans ta ville", "Raccogli 10 volte nella tua città", "Sammle 10-mal in deiner Stadt"),
        new("cosechar", ["Harvest"], 25, 600, 3, 0, "🌾",
            "Cobra 25 veces en tu ciudad", "Collect 25 times in your city",
            "Colete 25 vezes na sua cidade", "Récolte 25 fois dans ta ville", "Raccogli 25 volte nella tua città", "Sammle 25-mal in deiner Stadt"),
        new("ayudar", ["Help"], 5, 200, 2, 0, "🤝",
            "Ayuda 5 veces en ciudades de tus vecinos", "Help 5 times in your neighbors' cities",
            "Ajude 5 vezes nas cidades dos vizinhos", "Aide 5 fois chez tes voisins", "Aiuta 5 volte nelle città dei vicini", "Hilf 5-mal bei deinen Nachbarn"),
        new("visitar", ["InitialVisit"], 2, 150, 1, 2, "🏘️",
            "Visita 2 ciudades de vecinos", "Visit 2 neighbor cities",
            "Visite 2 cidades vizinhas", "Visite 2 villes voisines", "Visita 2 città vicine", "Besuche 2 Nachbarstädte"),
        new("abastecer", ["OpenBusiness"], 3, 250, 1, 2, "📦",
            "Abastece 3 negocios con mercancía", "Supply 3 businesses with goods",
            "Abasteça 3 negócios", "Approvisionne 3 commerces", "Rifornisci 3 negozi", "Beliefere 3 Geschäfte"),
        new("construir", ["Place", "Build"], 2, 250, 1, 0, "🏗️",
            "Construye o coloca 2 cosas nuevas", "Build or place 2 new things",
            "Construa ou coloque 2 coisas", "Construis ou place 2 objets", "Costruisci o posiziona 2 oggetti", "Baue oder platziere 2 Dinge"),
        new("arar", ["Plow", "ClearWithered"], 4, 150, 1, 1, "🚜",
            "Ara 4 parcelas para sembrar", "Plow 4 plots",
            "Are 4 lotes", "Laboure 4 parcelles", "Ara 4 appezzamenti", "Pflüge 4 Felder"),
        new("contratos", ["StartContract"], 3, 200, 1, 0, "📜",
            "Empieza 3 cultivos o contratos", "Start 3 crops or contracts",
            "Comece 3 contratos", "Lance 3 contrats", "Avvia 3 contratti", "Starte 3 Verträge")
    ];

    public const int DailyCount = 4;
    public const int AllDoneCash = 5;   // premio extra por completar todos los del dia
    public const int AllDoneCoins = 500;
    public const int StreakDays = 7;     // cofre semanal: completar todos los desafios 7 dias seguidos
    public const int StreakCash = 25;
    public const int StreakCoins = 2000;

    public sealed class PlayerDay
    {
        public string Day { get; set; } = "";
        public Dictionary<string, int> Progress { get; set; } = new();
        public List<string> Claimed { get; set; } = [];
        public bool AllClaimed { get; set; }
        public int Streak { get; set; }          // dias seguidos completando todo (se conserva entre dias)
        public string LastFullDay { get; set; } = "";
        public Dictionary<string, string> Swaps { get; set; } = new(); // desafio cambiado hoy -> el nuevo
        public int SwapCount { get; set; }
    }

    public const int SwapsPerDay = 2;

    // Los desafios de hoy para este jugador (los del dia + los que cambio)
    private static Def[] DefsFor(PlayerDay d)
    {
        var defs = TodayDefs();
        return defs.Select(x => d.Swaps.TryGetValue(x.Id, out var n) ? Pool.FirstOrDefault(p => p.Id == n) ?? x : x).ToArray();
    }

    // Cambia un desafio que no te gusta por otro (2 veces al dia). Devuelve null si se pudo, o el motivo.
    public static string? Swap(Guid playerId, string id)
    {
        var d = Get(playerId);
        lock (d)
        {
            var defs = DefsFor(d);
            var idx = Array.FindIndex(defs, x => x.Id == id);
            if (idx < 0) return "notfound";
            if (d.Claimed.Contains(id)) return "claimed";
            if (d.SwapCount >= SwapsPerDay) return "limit";
            var used = defs.Select(x => x.Id).Concat(d.Swaps.Keys).Concat(d.Swaps.Values).ToHashSet();
            var options = Pool.Where(p => !used.Contains(p.Id)).ToList();
            if (options.Count == 0) return "none";
            var pick = options[Random.Shared.Next(options.Count)];
            var orig = TodayDefs()[idx].Id;
            d.Swaps[orig] = pick.Id;
            d.SwapCount++;
            _dirty = true;
            return null;
        }
    }

    private static readonly ConcurrentDictionary<Guid, PlayerDay> Data = new();
    private static string _path = "challenges.json";
    private static Timer? _saver;
    private static volatile bool _dirty;
    public static Timer? Saver => _saver;

    public static void Initialize(string contentRoot)
    {
        _path = Path.Combine(contentRoot, "challenges.json");
        try
        {
            if (File.Exists(_path))
                foreach (var (k, v) in JsonSerializer.Deserialize<Dictionary<Guid, PlayerDay>>(File.ReadAllText(_path)) ?? new())
                    Data[k] = v;
        }
        catch { /* archivo dañado: empezamos de cero */ }

        _saver = new Timer(_ => Save(), null, TimeSpan.FromSeconds(20), TimeSpan.FromSeconds(20));
    }

    private static void Save()
    {
        if (!_dirty) return;
        _dirty = false;
        try { File.WriteAllText(_path, JsonSerializer.Serialize(Data.ToDictionary(x => x.Key, x => x.Value))); }
        catch { _dirty = true; }
    }

    private static string Today => DateTime.Now.ToString("yyyy-MM-dd");

    // Los mismos desafios para todos ese dia (cambian cada dia)
    public static Def[] TodayDefs()
    {
        var seed = DateTime.Now.Year * 1000 + DateTime.Now.DayOfYear;
        var rnd = new Random(seed);
        return Pool.OrderBy(_ => rnd.Next()).Take(DailyCount).ToArray();
    }

    private static PlayerDay Get(Guid playerId)
    {
        var d = Data.GetOrAdd(playerId, _ => new PlayerDay { Day = Today });
        if (d.Day != Today)
        {
            var yesterday = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd");
            var keep = d.LastFullDay == yesterday || d.LastFullDay == Today;
            d = new PlayerDay { Day = Today, Streak = keep ? d.Streak : 0, LastFullDay = keep ? d.LastFullDay : "" };
            Data[playerId] = d;
            _dirty = true;
        }
        return d;
    }

    // Llamado por el gateway despues de cada accion valida del juego
    public static void Track(Guid playerId, string action)
    {
        if (Pool.All(p => !p.Actions.Contains(action))) return;
        var d = Get(playerId);
        lock (d)
        {
            d.Progress.TryGetValue(action, out var n);
            d.Progress[action] = n + 1;
        }
        _dirty = true;
    }

    public static object State(Guid playerId, string lang)
    {
        var d = Get(playerId);
        var defs = DefsFor(d);
        lock (d)
        {
            var list = defs.Select(x =>
            {
                var p = x.Actions.Sum(a => d.Progress.TryGetValue(a, out var n) ? n : 0);
                return new
                {
                    id = x.Id, icon = x.Icon, text = Text(x, lang), goal = x.Goal, progress = Math.Min(p, x.Goal),
                    coins = x.Coins, cash = x.Cash, energy = x.Energy, done = p >= x.Goal, claimed = d.Claimed.Contains(x.Id)
                };
            }).ToList();
            var allClaimed = list.All(x => x.claimed);
            var secs = (int)(DateTime.Today.AddDays(1) - DateTime.Now).TotalSeconds;
            return new
            {
                challenges = list,
                bonus = new { coins = AllDoneCoins, cash = AllDoneCash, ready = allClaimed && !d.AllClaimed, claimed = d.AllClaimed },
                streak = new { days = d.Streak, goal = StreakDays, coins = StreakCoins, cash = StreakCash },
                resetIn = secs,
                swapsLeft = Math.Max(0, SwapsPerDay - d.SwapCount)
            };
        }
    }

    // Devuelve la recompensa a entregar, o null si no se puede cobrar
    public static (int Coins, int Cash, int Energy)? Claim(Guid playerId, string id)
    {
        var d = Get(playerId);
        var defs = DefsFor(d);
        lock (d)
        {
            if (id == "bonus")
            {
                if (d.AllClaimed || !defs.All(x => d.Claimed.Contains(x.Id))) return null;
                d.AllClaimed = true; _dirty = true;
                var yesterday = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd");
                d.Streak = d.LastFullDay == yesterday ? d.Streak + 1 : 1;
                d.LastFullDay = Today;
                if (d.Streak >= StreakDays)
                {
                    d.Streak = 0; // cofre entregado: empieza otra semana
                    return (AllDoneCoins + StreakCoins, AllDoneCash + StreakCash, 0);
                }
                return (AllDoneCoins, AllDoneCash, 0);
            }

            var def = defs.FirstOrDefault(x => x.Id == id);
            if (def is null || d.Claimed.Contains(id)) return null;
            var p = def.Actions.Sum(a => d.Progress.TryGetValue(a, out var n) ? n : 0);
            if (p < def.Goal) return null;
            d.Claimed.Add(id); _dirty = true;
            return (def.Coins, def.Cash, def.Energy);
        }
    }

    private static string Text(Def d, string lang) => lang switch
    {
        "en" => d.En, "pt" => d.Pt, "fr" => d.Fr, "it" => d.It, "de" => d.De, _ => d.Es
    };
}
