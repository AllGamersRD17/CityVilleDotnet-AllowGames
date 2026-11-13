using System.Text.Json;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: soporte. Los jugadores reportan bugs, piden ayuda o sugieren cosas;
// los admins ven las solicitudes, cambian su estado y responden. Se guarda en support.json.
public static class SupportService
{
    public static readonly string[] Kinds = ["bug", "ayuda", "sugerencia", "cuenta", "otro"];
    public static readonly string[] States = ["abierto", "en_progreso", "resuelto", "cerrado"];

    public sealed class Reply
    {
        public string From { get; set; } = "";
        public bool Admin { get; set; }
        public string Text { get; set; } = "";
        public string? Image { get; set; }
        public DateTime At { get; set; }
    }

    public sealed class Ticket
    {
        public long Id { get; set; }
        public string User { get; set; } = "";
        public string Kind { get; set; } = "bug";
        public string Title { get; set; } = "";
        public string Status { get; set; } = "abierto";
        public string Info { get; set; } = "";
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public bool UnreadUser { get; set; }
        public bool UnreadAdmin { get; set; } = true;
        public List<Reply> Replies { get; set; } = [];
    }

    private sealed class Store
    {
        public long NextId { get; set; } = 1;
        public List<Ticket> Tickets { get; set; } = [];
    }

    private static Store _s = new();
    private static readonly object Lock = new();
    private static string _path = "support.json";
    private static Timer? _saver;
    private static volatile bool _dirty;
    public static Timer? Saver => _saver;

    public static void Initialize(string contentRoot)
    {
        _path = Path.Combine(contentRoot, "support.json");
        try { if (File.Exists(_path)) _s = JsonSerializer.Deserialize<Store>(File.ReadAllText(_path)) ?? new Store(); }
        catch { _s = new Store(); }
        _saver = new Timer(_ => Save(), null, TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(10));
    }

    private static void Save()
    {
        if (!_dirty) return;
        string json;
        lock (Lock) { json = JsonSerializer.Serialize(_s); _dirty = false; }
        try { File.WriteAllText(_path, json); } catch { _dirty = true; }
    }

    private static string Cut(string? s, int max)
    {
        var t = (s ?? "").Replace("\r", "").Trim();
        return t.Length > max ? t[..max] : t;
    }

    private static object Summary(Ticket t, bool admin) => new
    {
        id = t.Id, user = t.User, kind = t.Kind, title = t.Title, status = t.Status,
        created = t.Created, updated = t.Updated, replies = t.Replies.Count,
        unread = admin ? t.UnreadAdmin : t.UnreadUser,
        preview = t.Replies.Count > 0 ? t.Replies[^1].Text : ""
    };

    private static object Full(Ticket t, bool admin) => new
    {
        id = t.Id, user = t.User, kind = t.Kind, title = t.Title, status = t.Status,
        created = t.Created, updated = t.Updated, info = admin ? t.Info : "",
        replies = t.Replies.Select(r => new { from = r.From, admin = r.Admin, text = r.Text, image = r.Image, at = r.At }).ToList()
    };

    public static (int Mine, int AdminOpen) Counts(string me, bool admin)
    {
        lock (Lock)
        {
            var mine = _s.Tickets.Count(t => t.User.Equals(me, StringComparison.OrdinalIgnoreCase) && t.UnreadUser);
            var open = admin ? _s.Tickets.Count(t => t.UnreadAdmin || t.Status == "abierto") : 0;
            return (mine, open);
        }
    }

    private sealed record NewTicket(string? Kind, string? Title, string? Text, string? Image, string? Info);
    private sealed record ReplyBody(string? Text, string? Image);
    private sealed record StatusBody(string? Status);

    public static void MapSupport(this WebApplication app)
    {
        async Task<(Player? p, bool admin)> Me(HttpContext http, CityVilleDbContext db, UserManager<ApplicationUser> users)
        {
            var user = await users.GetUserAsync(http.User);
            if (user is null) return (null, false);
            var p = await db.Set<Player>().AsNoTracking().FirstOrDefaultAsync(x => x.AppUser != null && x.AppUser.Id == user.Id && x.Snuid != -1);
            return (p, user.IsAdmin);
        }

        bool CanSee(Ticket t, string me, bool admin) => admin || t.User.Equals(me, StringComparison.OrdinalIgnoreCase);

        // Mis solicitudes (o todas, si soy admin y pido all=1)
        app.MapGet("/api/ag/support", async (bool? all, string? status, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, admin) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var everyone = admin && all == true;
            lock (Lock)
            {
                var q = _s.Tickets.Where(t => everyone || t.User.Equals(p.Username, StringComparison.OrdinalIgnoreCase));
                if (everyone && !string.IsNullOrEmpty(status) && status != "todos") q = q.Where(t => t.Status == status);
                var list = q.OrderByDescending(t => everyone && t.UnreadAdmin).ThenByDescending(t => t.Updated).Take(100)
                    .Select(t => Summary(t, everyone)).ToList();
                return Results.Json(new { admin, tickets = list });
            }
        });

        app.MapPost("/api/ag/support", async (NewTicket b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u, IConfiguration config) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            if (CommunityService.TooFast(p.Username)) return Results.StatusCode(429);
            var text = Cut(b.Text, 2000);
            var title = Cut(b.Title, 90);
            if (text.Length < 5) return Results.BadRequest();
            Ticket t;
            lock (Lock)
            {
                if (_s.Tickets.Count(x => x.User.Equals(p.Username, StringComparison.OrdinalIgnoreCase) && x.Created > DateTime.UtcNow.AddDays(-1)) >= 10)
                    return Results.StatusCode(429);
                var now = DateTime.UtcNow;
                t = new Ticket
                {
                    Id = _s.NextId++, User = p.Username, Kind = b.Kind is not null && Kinds.Contains(b.Kind) ? b.Kind : "otro",
                    Title = title.Length > 0 ? title : text[..Math.Min(60, text.Length)],
                    Info = Cut(b.Info, 400), Created = now, Updated = now, UnreadAdmin = true
                };
                t.Replies.Add(new Reply { From = p.Username, Text = text, Image = CommunityService.ValidImage(b.Image), At = now });
                _s.Tickets.Add(t);
                _dirty = true;
            }
            AllowGamesEndpoints.NotifyDiscord(config, $"🛟 Nueva solicitud de soporte #{t.Id} ({t.Kind}) de {p.Username}: {t.Title}");
            return Results.Json(new { id = t.Id });
        });

        app.MapGet("/api/ag/support/{id:long}", async (long id, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, admin) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            lock (Lock)
            {
                var t = _s.Tickets.FirstOrDefault(x => x.Id == id);
                if (t is null || !CanSee(t, p.Username, admin)) return Results.NotFound();
                var owner = t.User.Equals(p.Username, StringComparison.OrdinalIgnoreCase);
                if (owner && t.UnreadUser) { t.UnreadUser = false; _dirty = true; }
                if (admin && !owner && t.UnreadAdmin) { t.UnreadAdmin = false; _dirty = true; }
                return Results.Json(new { admin = admin && !owner, ticket = Full(t, admin) });
            }
        });

        app.MapPost("/api/ag/support/{id:long}/reply", async (long id, ReplyBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u, IConfiguration config) =>
        {
            var (p, admin) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            if (CommunityService.TooFast(p.Username)) return Results.StatusCode(429);
            var text = Cut(b.Text, 2000);
            var img = CommunityService.ValidImage(b.Image);
            if (text.Length == 0 && img is null) return Results.BadRequest();
            string owner;
            bool asAdmin;
            lock (Lock)
            {
                var t = _s.Tickets.FirstOrDefault(x => x.Id == id);
                if (t is null || !CanSee(t, p.Username, admin)) return Results.NotFound();
                owner = t.User;
                asAdmin = admin && !t.User.Equals(p.Username, StringComparison.OrdinalIgnoreCase);
                t.Replies.Add(new Reply { From = p.Username, Admin = asAdmin, Text = text, Image = img, At = DateTime.UtcNow });
                t.Updated = DateTime.UtcNow;
                if (asAdmin) { t.UnreadUser = true; if (t.Status == "abierto") t.Status = "en_progreso"; }
                else { t.UnreadAdmin = true; if (t.Status is "resuelto" or "cerrado") t.Status = "abierto"; }
                _dirty = true;
            }
            if (!asAdmin) AllowGamesEndpoints.NotifyDiscord(config, $"🛟 {owner} respondió en la solicitud #{id}");
            return Results.Ok();
        });

        app.MapPost("/api/ag/support/{id:long}/status", async (long id, StatusBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, admin) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            lock (Lock)
            {
                var t = _s.Tickets.FirstOrDefault(x => x.Id == id);
                if (t is null || !CanSee(t, p.Username, admin)) return Results.NotFound();
                var owner = t.User.Equals(p.Username, StringComparison.OrdinalIgnoreCase);
                // el jugador solo puede cerrar la suya; el admin puede poner cualquier estado
                if (!admin && b.Status != "cerrado") return Results.Forbid();
                if (b.Status is null || !States.Contains(b.Status)) return Results.BadRequest();
                t.Status = b.Status;
                t.Updated = DateTime.UtcNow;
                if (admin && !owner) t.UnreadUser = true;
                _dirty = true;
                return Results.Json(new { status = t.Status });
            }
        });
    }
}
