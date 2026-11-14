using System.Collections.Concurrent;
using CityVilleDotnet.Common.Settings;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: lo que en 2012 se hacia por Facebook con amigos, ahora dentro del juego.
// - Contratar amigos (crew.php): tus amigos ocupan los puestos de un edificio comunitario.
// - Regalos (gifts.php): mandar regalos gratis a tus amigos; llegan a su inventario.
public static class CrewGiftService
{
    // regalos gratis (como la pagina de regalos de 2012); el nivel minimo sale del juego si existe
    private static readonly (string Name, int Level)[] FreeGifts =
    [
        ("energy_1", 1), ("deco_streetclock", 1), ("deco_bikerack", 1), ("deco_plazaflowers", 1), ("deco_fence01", 1),
        ("material_permit", 5), ("material_city_seal", 5), ("Animal_Rabbit1", 5), ("deco_clover_flowers", 5),
        ("material_marble", 10), ("material_ribbon", 10), ("tree_willow", 10), ("deco_kiddieride_horse", 10),
        ("Animal_cow1", 15), ("Animal_pig1", 15), ("Animal_horse1", 15), ("tree_poinciana", 20), ("deco_fountain01", 40),
    ];

    private static readonly ConcurrentDictionary<string, DateOnly> LastGift = new(StringComparer.OrdinalIgnoreCase);

    private static object Item(string name, int level, int myLevel)
    {
        string? icon = null;
        try
        {
            var it = GameSettingsManager.Instance.GetItem(name);
            var url = it?.Images.FirstOrDefault(i => i.Name == "icon")?.Url ?? it?.Images.FirstOrDefault()?.Url;
            if (!string.IsNullOrEmpty(url)) icon = url.StartsWith('/') ? url : "/" + url;
            if (it?.RequiredLevel is > 0) level = Math.Max(level, it.RequiredLevel.Value);
        }
        catch { }
        return new { name, icon, level, locked = level > myLevel };
    }

    private static bool Exists(string name)
    {
        try { return GameSettingsManager.Instance.GetItem(name) is not null; } catch { return false; }
    }

    public static void MapCrewGifts(this WebApplication app)
    {
        async Task<Player?> Me(HttpContext http, CityVilleDbContext db, UserManager<ApplicationUser> users)
        {
            var user = await users.GetUserAsync(http.User);
            if (user is null) return null;
            return await db.Set<Player>().AsNoTracking().FirstOrDefaultAsync(x => x.AppUser != null && x.AppUser.Id == user.Id && x.Snuid != -1);
        }

        async Task<List<Player>> Friends(CityVilleDbContext db, Guid me) =>
            await db.Set<Friend>().AsNoTracking().Where(f => f.Player!.Id == me && f.Status == FriendshipStatus.Accepted)
                .Select(f => f.FriendPlayer!).ToListAsync();

        // ---------- contratar amigos ----------
        async Task<(Player? p, WorldObject? b, int need)> Building(CityVilleDbContext db, Guid playerId, int mId)
        {
            var p = await db.Set<Player>().AsSplitQuery()
                .Include(x => x.Worlds.Where(w => w.Type == w.Player!.LastPlayedWorldType))
                .ThenInclude(x => x!.Objects.Where(o => o.WorldFlatId == mId || o.TempId == mId))
                .ThenInclude(x => x.CrewMembers).ThenInclude(x => x.Player)
                .FirstOrDefaultAsync(x => x.Id == playerId);
            var b = p?.Worlds.SelectMany(w => w.Objects).FirstOrDefault(o => o.TempId == mId) ?? p?.Worlds.SelectMany(w => w.Objects).FirstOrDefault(o => o.WorldFlatId == mId);
            var need = 0;
            try
            {
                var item = b is null ? null : GameSettingsManager.Instance.GetItem(b.GetItemName());
                need = item?.GetGates().SelectMany(g => g.Keys).FirstOrDefault(k => k?.Name == "required_crew")?.Amount ?? 0;
            }
            catch { }
            return (p, b, need);
        }

        app.MapGet("/api/ag/crew/{mId:int}", async (int mId, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            var (_, b, need) = await Building(db, me.Id, mId);
            if (b is null) return Results.NotFound();
            var hired = b.CrewMembers.Where(c => c.Player is not null).Select(c => c.Player!.Username).ToList();
            var friends = await Friends(db, me.Id);
            return Results.Json(new
            {
                building = b.GetItemName(), need, filled = b.CrewMembers.Count, hired,
                friends = friends.Select(f => new { name = f.Username, avatar = f.ProfilePictureUrl ?? "/blank.png", level = f.Level, hired = hired.Contains(f.Username) })
            });
        });

        app.MapPost("/api/ag/crew/{mId:int}/hire", async (int mId, NameBody body, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            var (p, b, need) = await Building(db, me.Id, mId);
            if (p is null || b is null) return Results.NotFound();
            if (need > 0 && b.CrewMembers.Count >= need) return Results.Json(new { error = "full" }, statusCode: 400);
            var friend = await db.Set<Friend>().Where(f => f.Player!.Id == me.Id && f.Status == FriendshipStatus.Accepted && f.FriendPlayer!.Username == body.Name)
                .Select(f => f.FriendPlayer!).FirstOrDefaultAsync();
            if (friend is null) return Results.Json(new { error = "notfriend" }, statusCode: 400);
            if (b.CrewMembers.Any(c => c.Player?.Id == friend.Id)) return Results.Json(new { error = "already" }, statusCode: 400);
            var tracked = await db.Set<Player>().FirstAsync(x => x.Id == friend.Id);
            b.AddCrewMember(tracked);
            await db.SaveChangesAsync();
            CommunityService.AddNote(friend.Username, "crew", me.Username);
            return Results.Json(new { filled = b.CrewMembers.Count, need });
        });

        // ---------- regalos ----------
        app.MapGet("/api/ag/gifts", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var friends = await db.Set<Friend>().AsNoTracking().Where(f => f.Player!.Id == me.Id && f.Status == FriendshipStatus.Accepted)
                .Select(f => new { f.FriendPlayer!.Username, f.FriendPlayer.ProfilePictureUrl, f.FriendPlayer.Level, Wish = f.FriendPlayer.Wishlist.Select(w => w.ItemName).ToList() }).ToListAsync();
            return Results.Json(new
            {
                gifts = FreeGifts.Where(g => Exists(g.Name)).Select(g => Item(g.Name, g.Level, me.Level)),
                friends = friends.Select(f => new
                {
                    name = f.Username, avatar = f.ProfilePictureUrl ?? "/blank.png", level = f.Level,
                    sentToday = LastGift.TryGetValue(me.Username + "|" + f.Username, out var d) && d == today,
                    wishlist = f.Wish.Take(5).Select(w => Item(w, 0, int.MaxValue))
                })
            });
        });

        app.MapPost("/api/ag/gifts/send", async (GiftBody body, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            var name = body.Item ?? "";
            var free = FreeGifts.FirstOrDefault(g => g.Name == name);
            var friendIds = await db.Set<Friend>().Where(f => f.Player!.Id == me.Id && f.Status == FriendshipStatus.Accepted && body.To != null && body.To.Contains(f.FriendPlayer!.Username))
                .Select(f => f.FriendPlayer!.Id).ToListAsync();
            if (friendIds.Count == 0) return Results.Json(new { error = "nofriends" }, statusCode: 400);
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var sent = new List<string>();
            foreach (var fid in friendIds)
            {
                var fr = await db.Set<Player>().Include(x => x.InventoryItems).Include(x => x.Wishlist).FirstAsync(x => x.Id == fid);
                var key = me.Username + "|" + fr.Username;
                if (LastGift.TryGetValue(key, out var d) && d == today) continue;
                // se puede regalar algo de la lista gratis (segun tu nivel) o algo que el amigo pidio en su lista de deseos
                var lvl = free.Name is null ? int.MaxValue : Math.Max(free.Level, GameSettingsManager.Instance.GetItem(name)?.RequiredLevel ?? 0);
                var ok = lvl <= me.Level || fr.Wishlist.Any(w => w.ItemName == name);
                if (!ok || !Exists(name)) continue;
                fr.AddItem(name);
                LastGift[key] = today;
                sent.Add(fr.Username);
            }
            await db.SaveChangesAsync();
            foreach (var s in sent) CommunityService.AddNote(s, "gift", me.Username, name);
            return Results.Json(new { sent });
        });
    }

    private sealed record NameBody(string? Name);
    private sealed record GiftBody(string? Item, List<string>? To);
}
