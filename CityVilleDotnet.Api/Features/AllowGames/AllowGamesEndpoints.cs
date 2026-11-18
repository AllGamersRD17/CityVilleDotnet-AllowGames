using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: estadisticas publicas, ranking, invitaciones, banner y admins por config.
public static class AllowGamesEndpoints
{
    public const string RefCookie = "agRef";

    public static void MapAllowGames(this WebApplication app)
    {
        app.MapGet("/api/ag/stats", async (CityVilleDbContext db, CancellationToken ct) =>
        {
            var online = DateTimeOffset.Now - Player.OnlineThreshold - TimeSpan.FromMinutes(4);
            var players = await db.Set<Player>().CountAsync(x => x.Snuid != -1, ct);
            var onlineNow = await db.Set<Player>().CountAsync(x => x.Snuid != -1 && x.LastTrackingTimestamp >= online, ct);
            return Results.Json(new { players, online = onlineNow });
        });

        app.MapGet("/api/ag/ranking", async (CityVilleDbContext db, CancellationToken ct) =>
        {
            var top = await db.Set<Player>().AsNoTracking()
                .Where(x => x.Snuid != -1)
                .OrderByDescending(x => x.Level).ThenByDescending(x => x.Xp)
                .Take(50)
                .Select(x => new { name = x.Username, level = x.Level, xp = x.Xp })
                .ToListAsync(ct);
            return Results.Json(top);
        });

        app.MapGet("/api/ag/season", () =>
        {
            var c = SeasonService.Config;
            return Results.Json(new { themes = SeasonService.Active(), auto = c.Auto, banner = c.Banner });
        });

        // Desafios diarios (sustituyen a "Monedas y CV Cash")
        app.MapGet("/api/ag/challenges", async (HttpContext http, CityVilleDbContext db, UserManager<ApplicationUser> users, string? lang) =>
        {
            var player = await CurrentPlayerAsync(http, db, users);
            if (player is null) return Results.Unauthorized();
            return Results.Json(ChallengeService.State(player.Id, (lang ?? "es")[..Math.Min(2, (lang ?? "es").Length)]));
        });

        app.MapPost("/api/ag/challenges/swap/{id}", async (string id, HttpContext http, CityVilleDbContext db, UserManager<ApplicationUser> users) =>
        {
            var player = await CurrentPlayerAsync(http, db, users);
            if (player is null) return Results.Unauthorized();
            var err = ChallengeService.Swap(player.Id, id);
            return err is null ? Results.Ok() : Results.Json(new { error = err }, statusCode: 400);
        });

        app.MapPost("/api/ag/challenges/claim/{id}", async (string id, HttpContext http, CityVilleDbContext db, UserManager<ApplicationUser> users) =>
        {
            var player = await CurrentPlayerAsync(http, db, users);
            if (player is null) return Results.Unauthorized();
            var reward = ChallengeService.Claim(player.Id, id);
            if (reward is null) return Results.BadRequest();
            var (coins, cash, energy) = reward.Value;
            if (coins > 0) player.AddCoins(coins);
            if (cash > 0) player.AddCash(cash);
            if (energy > 0) player.AddEnergy(energy);
            await db.SaveChangesAsync();
            return Results.Json(new { coins, cash, energy });
        });

        // Enlace de invitacion: /invitar/NombreDelJugador -> registro, y al registrarse quedan como vecinos
        app.MapGet("/invitar/{name}", (string name, HttpContext http) =>
        {
            if (name.Length is > 0 and <= 64)
                http.Response.Cookies.Append(RefCookie, name, new CookieOptions { MaxAge = TimeSpan.FromDays(7), HttpOnly = true, SameSite = SameSiteMode.Lax, IsEssential = true });
            return Results.Redirect("/Account/Register");
        });
    }

    // Al registrarse con invitacion, ambos quedan como vecinos aceptados
    public static async Task ApplyReferralAsync(HttpContext http, CityVilleDbContext db, ApplicationUser newUser, CancellationToken ct)
    {
        var refName = http.Request.Cookies[RefCookie];
        if (string.IsNullOrWhiteSpace(refName)) return;
        http.Response.Cookies.Delete(RefCookie);

        try
        {
            var me = await db.Set<Player>().Include(x => x.Friends).FirstOrDefaultAsync(x => x.AppUser != null && x.AppUser.Id == newUser.Id, ct);
            var inviter = await db.Set<Player>().Include(x => x.Friends).FirstOrDefaultAsync(x => x.Username == refName && x.Snuid != -1, ct);
            if (me is null || inviter is null || me.Id == inviter.Id || me.HasFriend(inviter)) return;

            me.SendFriendRequest(inviter);
            foreach (var f in me.Friends.Concat(inviter.Friends))
            {
                if (ReferenceEquals(f.FriendPlayer, me) || ReferenceEquals(f.FriendPlayer, inviter))
                    f.Status = FriendshipStatus.Accepted;
            }

            await db.SaveChangesAsync(ct);
        }
        catch (Exception e)
        {
            _log?.LogWarning(e, "Invitacion fallida de {Ref}", refName);
        }
    }

    private static async Task<Player?> CurrentPlayerAsync(HttpContext http, CityVilleDbContext db, UserManager<ApplicationUser> users)
    {
        var user = await users.GetUserAsync(http.User);
        if (user is null) return null;
        return await db.Set<Player>().FirstOrDefaultAsync(x => x.AppUser != null && x.AppUser.Id == user.Id && x.Snuid != -1);
    }

    private static ILogger? _log;
    private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(10) };

    // Aviso a Discord (config AllowGames:DiscordWebhook). Si no hay webhook no hace nada.
    public static void NotifyDiscord(IConfiguration config, string text)
    {
        var url = config["AllowGames:DiscordWebhook"];
        if (string.IsNullOrWhiteSpace(url) || !url.StartsWith("https://", StringComparison.OrdinalIgnoreCase)) return;
        _ = Task.Run(async () =>
        {
            try
            {
                using var content = new StringContent(System.Text.Json.JsonSerializer.Serialize(new { username = "CityVille Revived", content = text, allowed_mentions = new { parse = Array.Empty<string>() } }), System.Text.Encoding.UTF8, "application/json");
                await Http.PostAsync(url, content);
            }
            catch (Exception e) { _log?.LogWarning(e, "No se pudo avisar a Discord"); }
        });
    }

    public static async Task AnnounceNewPlayerAsync(HttpContext http, CityVilleDbContext db, string name)
    {
        try
        {
            var total = await db.Set<Player>().CountAsync(x => x.Snuid != -1);
            var config = http.RequestServices.GetRequiredService<IConfiguration>();
            NotifyDiscord(config, $"🏙️ **{name}** acaba de fundar su ciudad en CityVille Revived. ¡Ya somos {total} alcaldes!");
        }
        catch (Exception e) { _log?.LogWarning(e, "Aviso de nuevo jugador fallido"); }
    }

    // Admins definidos en config: AllowGames__Admins__0=AllGamersRD
    public static async Task BootstrapAdminsAsync(IServiceProvider services, IConfiguration config, ILogger logger)
    {
        _log = logger;
        var names = config.GetSection("AllowGames:Admins").Get<string[]>() ?? [];
        if (names.Length == 0) return;

        using var scope = services.CreateScope();
        var users = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        foreach (var n in names.Where(n => !string.IsNullOrWhiteSpace(n)))
        {
            var u = await users.FindByNameAsync(n.Trim());
            if (u is null || u.IsAdmin) continue;
            u.SetAdmin(true);
            await users.UpdateAsync(u);
            logger.LogInformation("Allow Games: {User} ahora es admin", u.UserName);
        }
    }
}
