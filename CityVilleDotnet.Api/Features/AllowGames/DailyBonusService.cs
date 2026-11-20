using System.Text.Json;
using CityVilleDotnet.Common.Settings;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: premio diario estilo Roblox. 7 dias seguidos; cada dia trae otra cosa y las cantidades cambian
// todos los dias (no es siempre lo mismo). Si faltas un dia, vuelves al dia 1.
// Se cobra al abrir el juego, ANTES de que cargue Flash, para que el juego ya muestre lo nuevo.
public static class DailyBonusService
{
    public sealed record Reward(int Day, int Coins, int Energy, int Cash, int Xp, int Goods, string? Item, string? ItemIcon, bool Surprise);

    public sealed class Entry
    {
        public DateOnly Last { get; set; }
        public int Streak { get; set; }
        public int Total { get; set; }       // cuantos premios ha cobrado en total
    }

    // Que trae cada dia (el dia 6 es sorpresa y el 7 es el premio gordo)
    public static readonly string[] Kinds = ["coins", "energy", "goods", "item", "cash", "mystery", "jackpot"];
    public const int Days = 7;

    // Decoraciones dificiles (normalmente costaban dinero real). Nivel minimo para que te toquen.
    private static readonly (string Name, int Level)[] Rare =
    [
        ("deco_boyflyingkite", 1), ("deco_soccer", 1), ("animal_natlpark_fox", 1), ("deco_nightlamp_d", 1),
        ("animal_natlpark_boar", 3), ("deco_english_bulldog", 3), ("rest_deco_artist_square", 5), ("deco_usa_wave_surfer", 5),
        ("deco_mexico_quinceanera", 8), ("deco_royalwedding", 8), ("deco_duckpond", 10), ("deco_gazebo", 10),
        ("deco_heartshapedfountain", 12), ("deco_abstract_art", 12), ("deco_chinesetheater", 15), ("deco_japan_torigate", 15),
        ("doff_deco_redwoodtunnel", 18), ("deco_fountain01", 20),
    ];

    private static readonly object Lock = new();
    private static string _path = "dailybonus.json";
    private static Dictionary<Guid, Entry> _data = new();

    public static void Initialize(string contentRoot)
    {
        _path = Path.Combine(contentRoot, "dailybonus.json");
        try
        {
            if (File.Exists(_path))
                _data = JsonSerializer.Deserialize<Dictionary<Guid, Entry>>(File.ReadAllText(_path)) ?? new();
        }
        catch { _data = new(); }
    }

    // para el aviso "tu premio diario te espera"
    public static bool ClaimedToday(Guid playerId)
    {
        lock (Lock) return _data.TryGetValue(playerId, out var e) && e.Last == DateOnly.FromDateTime(DateTime.Now);
    }

    public static int StreakOf(Guid playerId)
    {
        lock (Lock) return _data.TryGetValue(playerId, out var e) ? e.Streak : 0;
    }

    private static bool Exists(string name)
    {
        try { return GameSettingsManager.Instance.GetItem(name) is not null; } catch { return false; }
    }

    public static string? IconOf(string name)
    {
        try
        {
            var it = GameSettingsManager.Instance.GetItem(name);
            var url = it?.Images.FirstOrDefault(i => i.Name == "icon")?.Url ?? it?.Images.FirstOrDefault()?.Url;
            return string.IsNullOrEmpty(url) ? null : url.StartsWith('/') ? url : "/" + url;
        }
        catch { return null; }
    }

    // La suerte de hoy para este jugador: siempre la misma si recarga, distinta cada dia.
    private static Random Luck(Guid id, DateOnly day) => new(BitConverter.ToInt32(id.ToByteArray(), 0) ^ BitConverter.ToInt32(id.ToByteArray(), 12) ^ (day.DayNumber * 7919));

    private static string PickItem(Random r, int level)
    {
        var pool = Rare.Where(x => x.Level <= Math.Max(1, level) && Exists(x.Name)).Select(x => x.Name).ToList();
        if (pool.Count == 0) pool = Rare.Where(x => Exists(x.Name)).Select(x => x.Name).ToList();
        return pool.Count == 0 ? "" : pool[r.Next(pool.Count)];
    }

    public static Reward Build(Guid id, int level, int day, DateOnly date)
    {
        var r = Luck(id, date);
        var lv = Math.Clamp(level, 1, 100);
        var scale = 1 + lv / 8.0;
        int Round(double v) => (int)(Math.Round(v / 10) * 10);
        string? item = null;
        var kind = Kinds[day - 1];
        int coins = 0, energy = 0, cash = 0, xp = 0, goods = 0;
        switch (kind)
        {
            case "coins": coins = Round(r.Next(150, 401) * scale); break;
            case "energy": energy = r.Next(3, 7); coins = Round(r.Next(50, 151) * scale); break;
            case "goods": goods = Round(r.Next(60, 161) * scale); xp = r.Next(40, 121); break;
            case "item": item = PickItem(r, lv); coins = Round(r.Next(100, 201) * scale); break;
            case "cash": cash = r.Next(2, 5); break;
            case "mystery":
                switch (r.Next(4))
                {
                    case 0: coins = Round(r.Next(600, 1201) * scale); break;
                    case 1: energy = r.Next(8, 13); break;
                    case 2: item = PickItem(r, lv); cash = 1; break;
                    default: cash = r.Next(3, 6); break;
                }
                break;
            default: cash = r.Next(5, 11); item = PickItem(r, lv); coins = Round(r.Next(300, 601) * scale); break;
        }
        if (item == "") item = null;
        return new Reward(day, coins, energy, cash, xp, goods, item, item is null ? null : IconOf(item), kind is "mystery" or "jackpot");
    }

    // Devuelve el premio si hoy todavia no lo cobro; null si ya lo cobro.
    // OJO: el jugador tiene que venir con InventoryItems cargado para poder darle objetos.
    public static Reward? TryClaim(Player player, DateTime now)
    {
        var today = DateOnly.FromDateTime(now);
        int day;

        lock (Lock)
        {
            _data.TryGetValue(player.Id, out var e);
            if (e is not null && e.Last == today) return null;

            day = e is not null && e.Last == today.AddDays(-1) ? e.Streak % Days + 1 : 1;
            _data[player.Id] = new Entry { Last = today, Streak = day, Total = (e?.Total ?? 0) + 1 };
            File.WriteAllText(_path, JsonSerializer.Serialize(_data));
        }

        var reward = Build(player.Id, player.Level, day, today);

        if (reward.Coins > 0) player.AddCoins(reward.Coins);
        if (reward.Energy > 0) player.AddEnergy(reward.Energy);
        if (reward.Cash > 0) player.AddCash(reward.Cash);
        if (reward.Goods > 0) player.AddGoods(reward.Goods);
        if (reward.Xp > 0) player.AddXp(reward.Xp);
        if (reward.Item is not null) player.AddItem(reward.Item);

        return reward;
    }

    // Para la ventana: los 7 dias, cual toca hoy y si ya lo cobro
    public static object Status(Player p, DateTime now)
    {
        var today = DateOnly.FromDateTime(now);
        Entry? e;
        lock (Lock) _data.TryGetValue(p.Id, out e);
        var claimed = e is not null && e.Last == today;
        var current = claimed ? e!.Streak : (e is not null && e.Last == today.AddDays(-1) ? e.Streak % Days + 1 : 1);
        var todayReward = claimed ? Build(p.Id, p.Level, current, today) : null;
        var secs = (int)(now.Date.AddDays(1) - now).TotalSeconds;
        return new
        {
            day = current, claimed, secondsLeft = secs, total = e?.Total ?? 0,
            kinds = Kinds,
            today = todayReward is null ? null : Json(todayReward)
        };
    }

    public static object Json(Reward r) => new
    {
        day = r.Day, coins = r.Coins, energy = r.Energy, cash = r.Cash, xp = r.Xp, goods = r.Goods,
        item = r.Item, itemIcon = r.ItemIcon, surprise = r.Surprise, kinds = Kinds
    };

    public static void MapDaily(this WebApplication app)
    {
        app.MapGet("/api/ag/daily", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var user = await u.GetUserAsync(h.User);
            if (user is null) return Results.Unauthorized();
            var p = await db.Set<Player>().AsNoTracking().FirstOrDefaultAsync(x => x.AppUser != null && x.AppUser.Id == user.Id && x.Snuid != -1);
            return p is null ? Results.NotFound() : Results.Json(Status(p, DateTime.Now));
        });
    }
}
