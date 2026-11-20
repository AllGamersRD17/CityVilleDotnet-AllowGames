using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: avisos en el celular como Facebook (mensajes, amistad, ayudas, regalos, franquicias,
// premio diario listo y "tu ciudad te extraña").
// - Navegador / app instalada desde Chrome: Web Push (VAPID + aes128gcm, sin librerias externas).
// - App de Android: la app pregunta cada 15 min a /api/ag/notify/pending y muestra los avisos.
// Solo se avisa cuando el jugador NO esta conectado (si esta jugando ya lo ve en el juego).
public static class PushService
{
    public sealed class Sub
    {
        public string Endpoint { get; set; } = "";
        public string P256dh { get; set; } = "";
        public string Auth { get; set; } = "";
        public DateTime At { get; set; }
    }

    public sealed class Notif
    {
        public long Id { get; set; }
        public string Kind { get; set; } = "";
        public string Title { get; set; } = "";
        public string Body { get; set; } = "";
        public string Url { get; set; } = "/Game";
        public DateTime At { get; set; }
    }

    public sealed class UserPush
    {
        public Guid? PlayerId { get; set; }
        public string Lang { get; set; } = "es";
        public int TzMin { get; set; } // minutos que hay que sumar a UTC para su hora local
        public List<Sub> Subs { get; set; } = [];
        public List<Notif> Queue { get; set; } = [];
        public DateTime? LastTouch { get; set; }
        public DateTime? AppSeen { get; set; }
        public DateTime? DailyPing { get; set; }
        public DateTime? MissPing { get; set; }
        public bool Off { get; set; }
    }

    private sealed class Store
    {
        public long NextId { get; set; } = 1;
        public Dictionary<string, UserPush> Users { get; set; } = new(StringComparer.OrdinalIgnoreCase);
    }

    private sealed class Vapid
    {
        public string D { get; set; } = "";
        public string X { get; set; } = "";
        public string Y { get; set; } = "";
    }

    private static readonly object Lock = new();
    private static Store _s = new();
    private static string _path = "push.json";
    private static volatile bool _dirty;
    private static Timer? _saver, _engage;
    private static ECDsa? _key;
    private static string _pub = "";
    private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(15) };
    private static readonly ConcurrentDictionary<string, DateTime> LastPushTo = new(StringComparer.OrdinalIgnoreCase);
    private static IServiceProvider? _sp;

    public static void Initialize(string contentRoot, IServiceProvider sp)
    {
        _sp = sp;
        _path = Path.Combine(contentRoot, "push.json");
        try { if (File.Exists(_path)) _s = JsonSerializer.Deserialize<Store>(File.ReadAllText(_path)) ?? new Store(); }
        catch { _s = new Store(); }
        _s.Users = new Dictionary<string, UserPush>(_s.Users, StringComparer.OrdinalIgnoreCase);

        var vp = Path.Combine(contentRoot, "vapid.json");
        Vapid? v = null;
        try { if (File.Exists(vp)) v = JsonSerializer.Deserialize<Vapid>(File.ReadAllText(vp)); } catch { v = null; }
        if (v is null || v.D == "")
        {
            using var k = ECDsa.Create(ECCurve.NamedCurves.nistP256);
            var p = k.ExportParameters(true);
            v = new Vapid { D = B64(p.D!), X = B64(p.Q.X!), Y = B64(p.Q.Y!) };
            File.WriteAllText(vp, JsonSerializer.Serialize(v));
        }
        _key = ECDsa.Create(new ECParameters
        {
            Curve = ECCurve.NamedCurves.nistP256, D = UnB64(v.D),
            Q = new ECPoint { X = UnB64(v.X), Y = UnB64(v.Y) }
        });
        _pub = B64([0x04, .. UnB64(v.X), .. UnB64(v.Y)]);

        _saver = new Timer(_ => Save(), null, TimeSpan.FromSeconds(15), TimeSpan.FromSeconds(15));
        _engage = new Timer(_ => { try { Engage(); } catch { } }, null, TimeSpan.FromMinutes(2), TimeSpan.FromMinutes(15));
    }

    private static void Save()
    {
        if (!_dirty) return;
        string json;
        lock (Lock) { json = JsonSerializer.Serialize(_s); _dirty = false; }
        try { File.WriteAllText(_path, json); } catch { _dirty = true; }
    }

    // ---------- textos ----------
    private static readonly Dictionary<string, Dictionary<string, (string T, string B)>> Txt = new()
    {
        ["es"] = new()
        {
            ["dm"] = ("💬 {0}", "{1}"), ["req"] = ("👋 Solicitud de amistad", "{0} quiere ser tu vecino en CityVille"),
            ["acc"] = ("🤝 ¡Nuevo vecino!", "{0} aceptó tu solicitud de amistad"), ["help"] = ("🙌 {0} te ayudó", "Entra a cobrar tu recompensa del muro"),
            ["crew"] = ("👷 {0} se unió a tu equipo", "Tu construcción está más cerca de terminar"), ["gift"] = ("🎁 {0} te mandó un regalo", "Entra a abrirlo en tu inventario"),
            ["fr"] = ("🏪 Solicitud de franquicia", "{0} quiere abrir un negocio en tu ciudad. ¡Apruébalo!"),
            ["daily"] = ("🎁 Tu premio diario te espera", "Entra hoy para no perder tu racha de días"), ["miss"] = ("🏙️ Tu ciudad te extraña", "Tus negocios y casas tienen monedas listas para cobrar"),
            ["test"] = ("🔔 ¡Avisos activados!", "Te avisaremos cuando pase algo en tu ciudad"), ["photo"] = ("", "📷 Foto"),
        },
        ["en"] = new()
        {
            ["dm"] = ("💬 {0}", "{1}"), ["req"] = ("👋 Friend request", "{0} wants to be your neighbor in CityVille"),
            ["acc"] = ("🤝 New neighbor!", "{0} accepted your friend request"), ["help"] = ("🙌 {0} helped you", "Come collect your wall reward"),
            ["crew"] = ("👷 {0} joined your crew", "Your building is closer to done"), ["gift"] = ("🎁 {0} sent you a gift", "Open it in your inventory"),
            ["fr"] = ("🏪 Franchise request", "{0} wants to open a business in your city. Approve it!"),
            ["daily"] = ("🎁 Your daily reward is waiting", "Play today to keep your streak"), ["miss"] = ("🏙️ Your city misses you", "Your businesses and homes have coins ready"),
            ["test"] = ("🔔 Notifications on!", "We'll let you know when something happens in your city"), ["photo"] = ("", "📷 Photo"),
        },
        ["pt"] = new()
        {
            ["dm"] = ("💬 {0}", "{1}"), ["req"] = ("👋 Pedido de amizade", "{0} quer ser seu vizinho no CityVille"),
            ["acc"] = ("🤝 Novo vizinho!", "{0} aceitou seu pedido de amizade"), ["help"] = ("🙌 {0} te ajudou", "Entre para pegar sua recompensa do mural"),
            ["crew"] = ("👷 {0} entrou na sua equipe", "Sua construção está mais perto de ficar pronta"), ["gift"] = ("🎁 {0} te mandou um presente", "Abra no seu inventário"),
            ["fr"] = ("🏪 Pedido de franquia", "{0} quer abrir um negócio na sua cidade. Aprove!"),
            ["daily"] = ("🎁 Seu prêmio diário te espera", "Jogue hoje para não perder sua sequência"), ["miss"] = ("🏙️ Sua cidade sente sua falta", "Seus negócios e casas têm moedas prontas"),
            ["test"] = ("🔔 Avisos ativados!", "Vamos te avisar quando algo acontecer na sua cidade"), ["photo"] = ("", "📷 Foto"),
        },
        ["fr"] = new()
        {
            ["dm"] = ("💬 {0}", "{1}"), ["req"] = ("👋 Demande d'ami", "{0} veut être ton voisin dans CityVille"),
            ["acc"] = ("🤝 Nouveau voisin !", "{0} a accepté ta demande d'ami"), ["help"] = ("🙌 {0} t'a aidé", "Viens récupérer ta récompense du mur"),
            ["crew"] = ("👷 {0} a rejoint ton équipe", "Ton bâtiment est presque fini"), ["gift"] = ("🎁 {0} t'a envoyé un cadeau", "Ouvre-le dans ton inventaire"),
            ["fr"] = ("🏪 Demande de franchise", "{0} veut ouvrir un commerce dans ta ville. Accepte-la !"),
            ["daily"] = ("🎁 Ton cadeau du jour t'attend", "Joue aujourd'hui pour garder ta série"), ["miss"] = ("🏙️ Ta ville s'ennuie de toi", "Tes commerces et maisons ont des pièces à récupérer"),
            ["test"] = ("🔔 Notifications activées !", "On te prévient quand il se passe quelque chose"), ["photo"] = ("", "📷 Photo"),
        },
        ["it"] = new()
        {
            ["dm"] = ("💬 {0}", "{1}"), ["req"] = ("👋 Richiesta di amicizia", "{0} vuole essere tuo vicino in CityVille"),
            ["acc"] = ("🤝 Nuovo vicino!", "{0} ha accettato la tua richiesta"), ["help"] = ("🙌 {0} ti ha aiutato", "Entra a prendere la ricompensa della bacheca"),
            ["crew"] = ("👷 {0} è entrato nella tua squadra", "Il tuo edificio è quasi finito"), ["gift"] = ("🎁 {0} ti ha mandato un regalo", "Aprilo nel tuo inventario"),
            ["fr"] = ("🏪 Richiesta di franchising", "{0} vuole aprire un negozio nella tua città. Approvalo!"),
            ["daily"] = ("🎁 Il tuo premio giornaliero ti aspetta", "Gioca oggi per non perdere la serie"), ["miss"] = ("🏙️ La tua città ti aspetta", "Negozi e case hanno monete da raccogliere"),
            ["test"] = ("🔔 Notifiche attive!", "Ti avviseremo quando succede qualcosa"), ["photo"] = ("", "📷 Foto"),
        },
        ["de"] = new()
        {
            ["dm"] = ("💬 {0}", "{1}"), ["req"] = ("👋 Freundschaftsanfrage", "{0} möchte dein Nachbar in CityVille sein"),
            ["acc"] = ("🤝 Neuer Nachbar!", "{0} hat deine Anfrage angenommen"), ["help"] = ("🙌 {0} hat dir geholfen", "Hol dir deine Belohnung von der Pinnwand"),
            ["crew"] = ("👷 {0} ist deiner Crew beigetreten", "Dein Gebäude ist fast fertig"), ["gift"] = ("🎁 {0} hat dir ein Geschenk geschickt", "Öffne es in deinem Inventar"),
            ["fr"] = ("🏪 Franchise-Anfrage", "{0} möchte ein Geschäft in deiner Stadt eröffnen!"),
            ["daily"] = ("🎁 Dein Tagesbonus wartet", "Spiel heute, damit deine Serie bleibt"), ["miss"] = ("🏙️ Deine Stadt vermisst dich", "Deine Geschäfte und Häuser haben Münzen bereit"),
            ["test"] = ("🔔 Benachrichtigungen an!", "Wir sagen dir Bescheid, wenn etwas passiert"), ["photo"] = ("", "📷 Foto"),
        },
    };

    private static (string, string) Text(string lang, string kind, string a, string b = "")
    {
        var d = Txt.GetValueOrDefault(lang) ?? Txt["es"];
        var (t, body) = d.TryGetValue(kind, out var x) ? x : Txt["es"][kind];
        return (string.Format(t, a, b), string.Format(body, a, b));
    }

    private static UserPush Rec(string user)
    {
        if (!_s.Users.TryGetValue(user, out var r)) _s.Users[user] = r = new UserPush();
        return r;
    }

    // ---------- avisos que vienen del juego ----------
    public static void OnNote(string to, string kind, string from, string? item = null)
    {
        var k = kind switch { "req" or "acc" or "help" or "crew" or "gift" => kind, _ => null };
        if (k is null) return;
        Notify(to, k, from, "", k is "req" or "acc" ? "/Game?open=friends" : "/Game");
    }

    public static void OnDm(string to, string from, string text, bool image)
    {
        UserPush? r;
        lock (Lock) _s.Users.TryGetValue(to, out r);
        if (r is null) return;
        var body = text.Length > 0 ? (text.Length > 120 ? text[..117] + "..." : text) : Text(r.Lang, "photo", "").Item2;
        Notify(to, "dm", from, body, "/Game?dm=" + Uri.EscapeDataString(from));
    }

    public static void OnFranchise(string to, string from) => Notify(to, "fr", from, "", "/Game");

    // los que ya estan jugando no reciben aviso: ya lo ven en pantalla
    private static bool Playing(string user) => CommunityService.Presence(user) != "offline";

    public static void Notify(string user, string kind, string a, string b, string url, bool force = false)
    {
        if (!force && Playing(user)) return;
        Notif n; List<Sub> subs; string lang;
        lock (Lock)
        {
            if (!_s.Users.TryGetValue(user, out var r) || r.Off) return;
            if (r.Subs.Count == 0 && (r.AppSeen is null || (DateTime.UtcNow - r.AppSeen.Value).TotalDays > 30)) return;
            lang = r.Lang;
            var (t, body) = Text(lang, kind, a, b);
            n = new Notif { Id = _s.NextId++, Kind = kind, Title = t, Body = body, Url = url, At = DateTime.UtcNow };
            // un solo aviso por chat de la misma persona (se reemplaza el anterior)
            if (kind == "dm") r.Queue.RemoveAll(q => q.Kind == "dm" && q.Title == t);
            r.Queue.Add(n);
            r.Queue.RemoveAll(q => (DateTime.UtcNow - q.At).TotalDays > 7);
            if (r.Queue.Count > 40) r.Queue.RemoveRange(0, r.Queue.Count - 40);
            subs = r.Subs.ToList();
            _dirty = true;
        }
        if (subs.Count == 0) return;
        var payload = JsonSerializer.Serialize(new { title = n.Title, body = n.Body, url = n.Url, tag = kind == "dm" ? "dm-" + a : kind, id = n.Id });
        _ = Task.Run(async () =>
        {
            foreach (var s in subs)
            {
                var code = await SendAsync(s, payload);
                if (code is 404 or 410)
                    lock (Lock) { if (_s.Users.TryGetValue(user, out var r)) { r.Subs.RemoveAll(x => x.Endpoint == s.Endpoint); _dirty = true; } }
            }
        });
    }

    // ---------- volver a enganchar (sin molestar) ----------
    private static void Engage()
    {
        var now = DateTime.UtcNow;
        List<(string User, UserPush R)> list;
        lock (Lock) list = _s.Users.Select(x => (x.Key, x.Value)).ToList();
        foreach (var (user, r) in list)
        {
            if (r.Off || (r.Subs.Count == 0 && (r.AppSeen is null || (now - r.AppSeen.Value).TotalDays > 30))) continue;
            if (Playing(user)) continue;
            var local = now.AddMinutes(r.TzMin);
            if (local.Hour < 10 || local.Hour >= 21) continue; // nada de avisos de madrugada
            var away = r.LastTouch is null ? TimeSpan.FromDays(99) : now - r.LastTouch.Value;

            if (r.PlayerId is Guid pid && away.TotalHours >= 3 && !DailyBonusService.ClaimedToday(pid)
                && (r.DailyPing is null || r.DailyPing.Value.AddMinutes(r.TzMin).Date != local.Date))
            {
                lock (Lock) { r.DailyPing = now; _dirty = true; }
                Notify(user, "daily", "", "", "/Game", true);
                continue;
            }
            if (away.TotalHours >= 48 && (r.MissPing is null || (now - r.MissPing.Value).TotalDays >= 3))
            {
                lock (Lock) { r.MissPing = now; _dirty = true; }
                Notify(user, "miss", "", "", "/Game", true);
            }
        }
    }

    // el jugador esta activo (lo llama la Comunidad cada vez que el juego le habla al servidor)
    public static void Touch(string user)
    {
        lock (Lock)
        {
            if (!_s.Users.TryGetValue(user, out var r)) return;
            if (r.LastTouch is null || (DateTime.UtcNow - r.LastTouch.Value).TotalMinutes > 2) { r.LastTouch = DateTime.UtcNow; _dirty = true; }
        }
    }

    // ---------- Web Push (RFC 8291 aes128gcm + VAPID RFC 8292) ----------
    private static async Task<int> SendAsync(Sub s, string payload)
    {
        try
        {
            var body = Encrypt(s, Encoding.UTF8.GetBytes(payload));
            var uri = new Uri(s.Endpoint);
            using var req = new HttpRequestMessage(HttpMethod.Post, uri) { Content = new ByteArrayContent(body) };
            req.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
            req.Content.Headers.ContentEncoding.Add("aes128gcm");
            req.Headers.TryAddWithoutValidation("TTL", "86400");
            req.Headers.TryAddWithoutValidation("Urgency", "normal");
            req.Headers.TryAddWithoutValidation("Authorization", "vapid t=" + Jwt(uri.Scheme + "://" + uri.Host) + ", k=" + _pub);
            using var res = await Http.SendAsync(req);
            return (int)res.StatusCode;
        }
        catch { return 0; }
    }

    private static string Jwt(string aud)
    {
        var h = B64(Encoding.UTF8.GetBytes("{\"typ\":\"JWT\",\"alg\":\"ES256\"}"));
        var exp = DateTimeOffset.UtcNow.AddHours(12).ToUnixTimeSeconds();
        var c = B64(Encoding.UTF8.GetBytes("{\"aud\":\"" + aud + "\",\"exp\":" + exp + ",\"sub\":\"mailto:soporte@cityvillerevived.com\"}"));
        var sig = _key!.SignData(Encoding.ASCII.GetBytes(h + "." + c), HashAlgorithmName.SHA256, DSASignatureFormat.IeeeP1363FixedFieldConcatenation);
        return h + "." + c + "." + B64(sig);
    }

    private static byte[] Encrypt(Sub s, byte[] data)
    {
        var uaPub = UnB64(s.P256dh);
        var auth = UnB64(s.Auth);
        using var me = ECDiffieHellman.Create(ECCurve.NamedCurves.nistP256);
        var mp = me.ExportParameters(false);
        byte[] asPub = [0x04, .. mp.Q.X!, .. mp.Q.Y!];
        using var other = ECDiffieHellman.Create(new ECParameters
        {
            Curve = ECCurve.NamedCurves.nistP256,
            Q = new ECPoint { X = uaPub[1..33], Y = uaPub[33..65] }
        });
        var shared = me.DeriveRawSecretAgreement(other.PublicKey);

        var prkKey = HMACSHA256.HashData(auth, shared);
        byte[] keyInfo = [.. Encoding.ASCII.GetBytes("WebPush: info"), 0, .. uaPub, .. asPub, 1];
        var ikm = HMACSHA256.HashData(prkKey, keyInfo);
        var salt = RandomNumberGenerator.GetBytes(16);
        var prk = HMACSHA256.HashData(salt, ikm);
        byte[] cekInfo = [.. Encoding.ASCII.GetBytes("Content-Encoding: aes128gcm"), 0, 1];
        var cek = HMACSHA256.HashData(prk, cekInfo)[..16];
        byte[] nonceInfo = [.. Encoding.ASCII.GetBytes("Content-Encoding: nonce"), 0, 1];
        var nonce = HMACSHA256.HashData(prk, nonceInfo)[..12];

        byte[] plain = [.. data, 2];
        var ct = new byte[plain.Length];
        var tag = new byte[16];
        using (var g = new AesGcm(cek, 16)) g.Encrypt(nonce, plain, ct, tag);

        var outp = new List<byte>(16 + 4 + 1 + 65 + ct.Length + 16);
        outp.AddRange(salt);
        outp.AddRange(new byte[] { 0, 0, 0x10, 0 }); // rs = 4096
        outp.Add((byte)asPub.Length);
        outp.AddRange(asPub);
        outp.AddRange(ct);
        outp.AddRange(tag);
        return outp.ToArray();
    }

    private static string B64(byte[] b) => Convert.ToBase64String(b).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    private static byte[] UnB64(string s)
    {
        s = s.Replace('-', '+').Replace('_', '/');
        return Convert.FromBase64String(s.PadRight(s.Length + (4 - s.Length % 4) % 4, '='));
    }

    // ---------- rutas ----------
    public sealed record SubBody(string Endpoint, string P256dh, string Auth, string? Lang, int? Tz);
    public sealed record EndBody(string Endpoint);

    private static async Task<Player?> Me(HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u)
    {
        var user = await u.GetUserAsync(h.User);
        if (user is null) return null;
        return await db.Set<Player>().AsNoTracking().FirstOrDefaultAsync(x => x.AppUser != null && x.AppUser.Id == user.Id && x.Snuid != -1);
    }

    private static string Lang(string? l)
    {
        var x = (l ?? "es").ToLowerInvariant();
        x = x.Length >= 2 ? x[..2] : "es";
        return Txt.ContainsKey(x) ? x : "en";
    }

    public static void MapPush(WebApplication app)
    {
        app.MapGet("/api/ag/push/key", () => Results.Json(new { key = _pub }));

        app.MapPost("/api/ag/push/sub", async (SubBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            if (string.IsNullOrWhiteSpace(b.Endpoint) || !b.Endpoint.StartsWith("https://") || b.P256dh.Length < 80 || b.Auth.Length < 16) return Results.BadRequest();
            lock (Lock)
            {
                // un mismo telefono solo puede estar a nombre de una cuenta
                foreach (var other in _s.Users.Values) other.Subs.RemoveAll(x => x.Endpoint == b.Endpoint);
                var r = Rec(me.Username);
                r.PlayerId = me.Id; r.Lang = Lang(b.Lang); r.TzMin = Math.Clamp(b.Tz ?? 0, -840, 840); r.Off = false;
                r.LastTouch = DateTime.UtcNow;
                r.Subs.Add(new Sub { Endpoint = b.Endpoint, P256dh = b.P256dh, Auth = b.Auth, At = DateTime.UtcNow });
                if (r.Subs.Count > 5) r.Subs.RemoveRange(0, r.Subs.Count - 5);
                _dirty = true;
            }
            return Results.Ok();
        });

        app.MapPost("/api/ag/push/unsub", (EndBody b) =>
        {
            lock (Lock) { foreach (var r in _s.Users.Values) r.Subs.RemoveAll(x => x.Endpoint == b.Endpoint); _dirty = true; }
            return Results.Ok();
        });

        app.MapPost("/api/ag/push/test", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            Notify(me.Username, "test", "", "", "/Game", true);
            return Results.Ok();
        });

        // la app de Android pregunta aqui (con la sesion del juego) si hay avisos nuevos
        app.MapGet("/api/ag/notify/pending", async (long? after, string? lang, int? tz, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            List<Notif> items;
            lock (Lock)
            {
                var r = Rec(me.Username);
                r.PlayerId = me.Id; r.AppSeen = DateTime.UtcNow;
                if (lang is not null) r.Lang = Lang(lang);
                if (tz is not null) r.TzMin = Math.Clamp(tz.Value, -840, 840);
                r.LastTouch ??= DateTime.UtcNow;
                items = r.Queue.Where(q => q.Id > (after ?? 0)).OrderBy(q => q.Id).Take(10).ToList();
                _dirty = true;
            }
            return Results.Json(new { last = items.Count > 0 ? items[^1].Id : after ?? 0, items = items.Select(i => new { id = i.Id, kind = i.Kind, title = i.Title, body = i.Body, url = i.Url }) });
        });
    }
}
