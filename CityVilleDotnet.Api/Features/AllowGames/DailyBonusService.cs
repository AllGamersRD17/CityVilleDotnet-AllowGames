using System.Text.Json;
using CityVilleDotnet.Domain.Entities;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: bono diario como en los tiempos de antes (5 dias seguidos, el dia 5 es sorpresa).
// Se cobra al abrir el juego, ANTES de que cargue Flash, para que el juego ya muestre las monedas nuevas.
public static class DailyBonusService
{
    public sealed record Reward(int Day, int Coins, int Energy, int Cash, int Xp, bool Surprise);

    public sealed class Entry
    {
        public DateOnly Last { get; set; }
        public int Streak { get; set; }
    }

    // Recompensas por dia (1..5)
    private static readonly (int Coins, int Energy)[] Days = [(25, 0), (50, 1), (100, 2), (200, 3)];

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

    public static int StreakOf(Guid playerId)
    {
        lock (Lock) return _data.TryGetValue(playerId, out var e) ? e.Streak : 0;
    }

    // Devuelve la recompensa si hoy todavia no la cobro; null si ya la cobro.
    public static Reward? TryClaim(Player player, DateTime now)
    {
        var today = DateOnly.FromDateTime(now);
        int day;

        lock (Lock)
        {
            _data.TryGetValue(player.Id, out var e);
            if (e is not null && e.Last == today) return null;

            day = e is not null && e.Last == today.AddDays(-1) ? e.Streak % 5 + 1 : 1;
            _data[player.Id] = new Entry { Last = today, Streak = day };
            File.WriteAllText(_path, JsonSerializer.Serialize(_data));
        }

        Reward reward;
        if (day < 5)
        {
            var (coins, energy) = Days[day - 1];
            reward = new Reward(day, coins, energy, 0, 0, false);
        }
        else
        {
            // Dia 5: regalo sorpresa
            reward = Random.Shared.Next(3) switch
            {
                0 => new Reward(5, 500, 0, 0, 0, true),
                1 => new Reward(5, 100, 0, 1, 0, true),
                _ => new Reward(5, 100, 10, 0, 0, true)
            };
        }

        if (reward.Coins > 0) player.AddCoins(reward.Coins);
        if (reward.Energy > 0) player.AddEnergy(reward.Energy);
        if (reward.Cash > 0) player.AddCash(reward.Cash);

        return reward;
    }
}
