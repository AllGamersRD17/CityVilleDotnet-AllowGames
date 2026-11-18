using System.Collections.Concurrent;
using System.Text.Json;
using System.Text.RegularExpressions;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: comunidad. Muro publico, chat general y mensajes privados.
// Se guarda en community.json (sin tocar la base de datos del juego).
public static class CommunityService
{
    public const int WallMax = 500, WallTextMax = 600, CommentMax = 300, ChatMax = 300, ChatKeep = 300, DmKeep = 300;

    public sealed class Comment
    {
        public long Id { get; set; }
        public string Author { get; set; } = "";
        public string Text { get; set; } = "";
        public DateTime At { get; set; }
    }

    public sealed class Post
    {
        public long Id { get; set; }
        public string Author { get; set; } = "";
        public string Text { get; set; } = "";
        public DateTime At { get; set; }
        public string? Image { get; set; }
        public string Kind { get; set; } = "text";           // text | share | wishlist (publicado desde el juego)
        public string? Action { get; set; }                  // texto del boton original del juego (ej. "Enviar corona")
        public List<string> Items { get; set; } = [];        // lista de deseos al momento de compartir
        public Dictionary<string, string> Helps { get; set; } = new(StringComparer.OrdinalIgnoreCase); // ayudante -> objeto enviado
        public HashSet<string> Likes { get; set; } = new(StringComparer.OrdinalIgnoreCase);
        public List<Comment> Comments { get; set; } = [];
    }

    public sealed class Note
    {
        public long Id { get; set; }
        public string Kind { get; set; } = "";   // req = te mandaron solicitud, acc = aceptaron la tuya
        public string From { get; set; } = "";
        public string? Item { get; set; }        // regalo recibido
        public DateTime At { get; set; }
    }

    public sealed class Msg
    {
        public long Id { get; set; }
        public string From { get; set; } = "";
        public string To { get; set; } = "";   // vacio = chat general
        public string Text { get; set; } = "";
        public string? Image { get; set; }
        public DateTime At { get; set; }
    }

    public sealed class Store
    {
        public long NextId { get; set; } = 1;
        public List<Post> Wall { get; set; } = [];
        public List<Msg> Global { get; set; } = [];
        public Dictionary<string, List<Msg>> Dms { get; set; } = new();          // clave: "a|b" en minusculas y ordenado
        public Dictionary<string, Dictionary<string, long>> Read { get; set; } = new(); // usuario -> conversacion -> ultimo id leido
        public Dictionary<string, HashSet<string>> Blocks { get; set; } = new();  // usuario -> bloqueados
        public Dictionary<string, string> Avatars { get; set; } = new();
        public Dictionary<string, int> Levels { get; set; } = new();
        public List<string> Reports { get; set; } = [];
        public Dictionary<string, string> Status { get; set; } = new();          // usuario -> online | busy | invisible
        public Dictionary<string, HashSet<string>> Privacy { get; set; } = new(); // usuario -> nomsg | noadd
        public Dictionary<string, List<Note>> Notes { get; set; } = new();        // usuario -> avisos de amistad
        public Dictionary<string, Dictionary<string, string>> Prefs { get; set; } = new(); // usuario -> ajustes
        public Dictionary<string, long> Delivered { get; set; } = new();                 // usuario -> ultimo id que ya le llego a su pantalla
    }

    private static Store _s = new();
    private static readonly object Lock = new();
    private static string _path = "community.json";
    private static Timer? _saver;
    private static volatile bool _dirty;
    private static readonly ConcurrentDictionary<string, DateTime> LastPost = new(StringComparer.OrdinalIgnoreCase);
    private static readonly ConcurrentDictionary<string, DateTime> LastSeen = new(StringComparer.OrdinalIgnoreCase);
    private static readonly ConcurrentDictionary<string, DateTime> LastActive = new(StringComparer.OrdinalIgnoreCase); // ultima vez que movio el mouse o escribio
    private static readonly ConcurrentDictionary<string, (string To, DateTime At)> Typing = new(StringComparer.OrdinalIgnoreCase);
    private static readonly ConcurrentDictionary<string, (string Day, int Count)> Uploads = new(StringComparer.OrdinalIgnoreCase);
    private static string _media = "community_media";
    private static readonly Regex MediaUrl = new(@"^/api/ag/media/[0-9a-f]{32}\.jpg$", RegexOptions.Compiled);
    public static Timer? Saver => _saver;

    public static void Initialize(string contentRoot)
    {
        _path = Path.Combine(contentRoot, "community.json");
        _media = Path.Combine(contentRoot, "community_media");
        Directory.CreateDirectory(_media);
        try
        {
            if (File.Exists(_path)) _s = JsonSerializer.Deserialize<Store>(File.ReadAllText(_path)) ?? new Store();
        }
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

    // ---------- utilidades ----------
    private static readonly Regex Bad = new(
        @"\b(mierda|puta|puto|pendej\w*|cabr[oó]n\w*|maric[oó]n\w*|co[nñ]o|verga|culero|hijueputa|malparid\w*|singa\w*|mamaguevo\w*|carajo|fuck\w*|shit\w*|bitch\w*|asshole|cunt|nigg\w*|fag\w*|porra|caralho|merde|putain|cazzo|stronz\w*|scheiße|scheisse|hure)\b",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static readonly Regex Links = new(@"(https?://|www\.)\S+", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private static string Clean(string? text, int max)
    {
        var t = (text ?? "").Replace("\r", "").Trim();
        if (t.Length > max) t = t[..max];
        t = Regex.Replace(t, @"\n{3,}", "\n\n");
        t = Bad.Replace(t, m => new string('*', m.Length));
        t = Links.Replace(t, "[enlace]");
        return t;
    }

    private static string Key(string a, string b)
    {
        var x = a.ToLowerInvariant(); var y = b.ToLowerInvariant();
        return string.CompareOrdinal(x, y) < 0 ? x + "|" + y : y + "|" + x;
    }

    // ---------- ajustes del jugador ----------
    public static readonly Dictionary<string, string[]> PrefValues = new()
    {
        ["sndMsg"] = ["on", "off"], ["sndReq"] = ["on", "off"], ["sndChat"] = ["on", "off"],
        ["ntMsg"] = ["on", "off"], ["ntReq"] = ["on", "off"], ["ntHelp"] = ["on", "off"], ["ntDaily"] = ["on", "off"],
        ["wallHelp"] = ["all", "friends", "none"],
    };
    public static string Pref(string user, string key)
    {
        lock (Lock)
            return _s.Prefs.TryGetValue(user.ToLowerInvariant(), out var d) && d.TryGetValue(key, out var v) ? v : PrefValues[key][0];
    }
    public static Dictionary<string, string> PrefsOf(string user) => PrefValues.Keys.ToDictionary(k => k, k => Pref(user, k));
    public static bool SetPref(string user, string key, string? value)
    {
        if (!PrefValues.TryGetValue(key, out var ok) || value is null || !ok.Contains(value)) return false;
        lock (Lock)
        {
            var k = user.ToLowerInvariant();
            if (!_s.Prefs.TryGetValue(k, out var d)) _s.Prefs[k] = d = new();
            d[key] = value; _dirty = true;
        }
        return true;
    }
    public static List<string> BlockedBy(string user)
    {
        lock (Lock) return _s.Blocks.TryGetValue(user.ToLowerInvariant(), out var b) ? b.OrderBy(x => x).ToList() : [];
    }

    // avisos de amistad (como Facebook): solicitud recibida y solicitud aceptada
    public static void AddNote(string to, string kind, string from, string? item = null)
    {
        lock (Lock)
        {
            var k = to.ToLowerInvariant();
            if (!_s.Notes.TryGetValue(k, out var l)) _s.Notes[k] = l = [];
            l.RemoveAll(n => n.Kind == kind && n.From.Equals(from, StringComparison.OrdinalIgnoreCase));
            l.Add(new Note { Id = _s.NextId++, Kind = kind, From = from, Item = item, At = DateTime.UtcNow });
            if (l.Count > 30) l.RemoveRange(0, l.Count - 30);
            _dirty = true;
        }
    }
    public static string? AuthorOf(long id)
    {
        lock (Lock) return _s.Wall.FirstOrDefault(p => p.Id == id)?.Author;
    }
    public static object LastNote(string me)
    {
        lock (Lock)
        {
            if (!_s.Notes.TryGetValue(me.ToLowerInvariant(), out var l) || l.Count == 0) return null!;
            var n = l[^1];
            return new { id = n.Id, kind = n.Kind, from = Who(n.From), item = n.Item is null ? null : ItemInfo(n.Item), at = n.At };
        }
    }

    // privacidad del perfil: "nomsg" = nadie le puede escribir, "noadd" = nadie lo puede agregar
    public static bool Private(string user, string flag)
    {
        lock (Lock) return _s.Privacy.TryGetValue(user.ToLowerInvariant(), out var f) && f.Contains(flag);
    }
    public static object PrivacyOf(string user) => new { noMsg = Private(user, "nomsg"), noAdd = Private(user, "noadd") };
    public static void SetPrivacy(string user, bool noMsg, bool noAdd)
    {
        lock (Lock)
        {
            var f = new HashSet<string>();
            if (noMsg) f.Add("nomsg");
            if (noAdd) f.Add("noadd");
            if (f.Count == 0) _s.Privacy.Remove(user.ToLowerInvariant()); else _s.Privacy[user.ToLowerInvariant()] = f;
            _dirty = true;
        }
    }

    private static bool Blocked(string by, string who) =>
        _s.Blocks.TryGetValue(by.ToLowerInvariant(), out var b) && b.Contains(who.ToLowerInvariant());

    public static bool TooFast(string user)
    {
        var now = DateTime.UtcNow;
        if (LastPost.TryGetValue(user, out var last) && (now - last).TotalSeconds < 2) return true;
        LastPost[user] = now;
        return false;
    }

    // online | idle (ausente, como Discord) | busy (no molestar) | offline. "invisible" se muestra como offline.
    public static string Presence(string name)
    {
        var st = _s.Status.GetValueOrDefault(name.ToLowerInvariant(), "online");
        if (st == "invisible") return "offline";
        if (!LastSeen.TryGetValue(name, out var seen) || (DateTime.UtcNow - seen).TotalSeconds > 75) return "offline";
        if (st == "busy") return "busy";
        if (LastActive.TryGetValue(name, out var act) && (DateTime.UtcNow - act).TotalMinutes > 5) return "idle";
        return "online";
    }

    public static void Activity(string me, bool active)
    {
        if (active || !LastActive.ContainsKey(me)) LastActive[me] = DateTime.UtcNow;
    }

    public static void SetTyping(string me, string to) => Typing[me] = (to, DateTime.UtcNow);

    // todo lo que ya existe le llego a la pantalla de este jugador (para el "Entregado")
    public static void MarkDelivered(string me)
    {
        var u = me.ToLowerInvariant();
        lock (Lock)
        {
            var top = _s.NextId - 1;
            if (_s.Delivered.GetValueOrDefault(u) < top) { _s.Delivered[u] = top; _dirty = true; }
        }
    }

    // Una ventanita de chat: mensajes nuevos + si el otro ya lo vio, si le llego y si esta escribiendo
    public static object DockWin(string me, string other, long after)
    {
        var k = Key(me, other);
        var o = other.ToLowerInvariant();
        lock (Lock)
        {
            _s.Dms.TryGetValue(k, out var all);
            var list = all is null ? new List<object>() : all.Where(m => m.Id > after).TakeLast(after == 0 ? 60 : 100).Select(Out).ToList();
            if (all is { Count: > 0 }) MarkRead(me, k, all[^1].Id);
            var seen = _s.Read.TryGetValue(o, out var r) ? r.GetValueOrDefault(k) : 0;
            var delivered = Math.Max(_s.Delivered.GetValueOrDefault(o), seen);
            var typing = Typing.TryGetValue(other, out var ty) && ty.To.Equals(me, StringComparison.OrdinalIgnoreCase) && (DateTime.UtcNow - ty.At).TotalSeconds < 6;
            var blocked = Blocked(me, other) || Blocked(other, me) || (_s.Privacy.TryGetValue(o, out var pv) && pv.Contains("nomsg"));
            return new { name = other, with = Who(other), blocked, messages = list, seen, delivered, typing };
        }
    }

    // Conversaciones con mensajes sin leer (para abrir la ventanita sola cuando te escriben)
    public static List<string> UnreadFrom(string me)
    {
        var u = me.ToLowerInvariant();
        lock (Lock)
        {
            var read = _s.Read.GetValueOrDefault(u) ?? new();
            return _s.Dms.Where(x => x.Key.Split('|').Contains(u))
                .SelectMany(x => x.Value.Where(v => v.Id > read.GetValueOrDefault(x.Key) && !v.From.Equals(me, StringComparison.OrdinalIgnoreCase) && !Blocked(me, v.From)))
                .OrderByDescending(v => v.Id).Select(v => v.From).Distinct(StringComparer.OrdinalIgnoreCase).Take(3).ToList();
        }
    }

    private static DateTime? Seen(string name)
    {
        if (Presence(name) != "offline" || _s.Status.GetValueOrDefault(name.ToLowerInvariant()) == "invisible") return null;
        return LastSeen.TryGetValue(name, out var d) ? d : null;
    }

    private static object Who(string name) => new
    {
        name,
        avatar = _s.Avatars.GetValueOrDefault(name.ToLowerInvariant(), "/blank.png"),
        level = _s.Levels.GetValueOrDefault(name.ToLowerInvariant(), 1),
        status = Presence(name),
        seen = Seen(name)
    };

    public static void SetStatus(string me, string? status)
    {
        var st = status is "busy" or "invisible" ? status : "online";
        lock (Lock) { _s.Status[me.ToLowerInvariant()] = st; _dirty = true; }
    }

    public static string MyStatus(string me) => _s.Status.GetValueOrDefault(me.ToLowerInvariant(), "online");

    public static string? ValidImage(string? url) => Img(url);

    private static string? Img(string? url) => url is not null && MediaUrl.IsMatch(url) && File.Exists(Path.Combine(_media, url[(url.LastIndexOf('/') + 1)..])) ? url : null;

    // Guarda una foto (JPEG ya reducida en el navegador). Devuelve la url o el motivo del rechazo.
    public static (string? Url, string? Error) SaveImage(string me, string? dataUrl)
    {
        if (string.IsNullOrEmpty(dataUrl)) return (null, "empty");
        var comma = dataUrl.IndexOf(',');
        var b64 = comma >= 0 ? dataUrl[(comma + 1)..] : dataUrl;
        byte[] bytes;
        try { bytes = Convert.FromBase64String(b64); } catch { return (null, "bad"); }
        if (bytes.Length < 100 || bytes.Length > 1_200_000) return (null, "size");
        if (bytes[0] != 0xFF || bytes[1] != 0xD8) return (null, "type"); // solo JPEG
        var day = DateTime.UtcNow.ToString("yyyy-MM-dd");
        var u = Uploads.GetOrAdd(me, _ => (day, 0));
        if (u.Day != day) u = (day, 0);
        if (u.Count >= 40) return (null, "limit");
        Uploads[me] = (day, u.Count + 1);
        var name = Guid.NewGuid().ToString("N") + ".jpg";
        File.WriteAllBytes(Path.Combine(_media, name), bytes);
        return ("/api/ag/media/" + name, null);
    }

    public static string? MediaPath(string file) =>
        Regex.IsMatch(file, @"^[0-9a-f]{32}\.jpg$") && File.Exists(Path.Combine(_media, file)) ? Path.Combine(_media, file) : null;

    public static void Touch(Player p)
    {
        var k = p.Username.ToLowerInvariant();
        LastSeen[p.Username] = DateTime.UtcNow;
        lock (Lock)
        {
            var av = string.IsNullOrEmpty(p.ProfilePictureUrl) ? "/blank.png" : p.ProfilePictureUrl;
            if (_s.Avatars.GetValueOrDefault(k) != av || _s.Levels.GetValueOrDefault(k) != p.Level)
            {
                _s.Avatars[k] = av; _s.Levels[k] = p.Level; _dirty = true;
            }
        }
    }

    // ---------- muro ----------
    public static object Wall(string me, long before)
    {
        lock (Lock)
        {
            var list = _s.Wall.Where(p => (before <= 0 || p.Id < before) && !Blocked(me, p.Author))
                .OrderByDescending(p => p.Id).Take(20)
                .Select(p => new
                {
                    id = p.Id, author = Who(p.Author), text = p.Text, image = p.Image, at = p.At,
                    kind = p.Kind, action = p.Action, items = p.Items.Select(ItemInfo).ToList(), helps = p.Helps.Count, maxHelps = MaxHelps,
                    helped = p.Helps.ContainsKey(me), helpers = p.Helps.Keys.TakeLast(8).ToList(),
                    likes = p.Likes.Count, liked = p.Likes.Contains(me),
                    comments = p.Comments.Where(c => !Blocked(me, c.Author))
                        .Select(c => new { id = c.Id, author = Who(c.Author), text = c.Text, at = c.At }).ToList()
                }).ToList();
            return list;
        }
    }

    public static bool AddPost(string me, string? text, string? image = null)
    {
        var t = Clean(text, WallTextMax);
        var img = Img(image);
        if (t.Length == 0 && img is null) return false;
        lock (Lock)
        {
            _s.Wall.Add(new Post { Id = _s.NextId++, Author = me, Text = t, Image = img, At = DateTime.UtcNow });
            if (_s.Wall.Count > WallMax) _s.Wall.RemoveRange(0, _s.Wall.Count - WallMax);
            _dirty = true;
        }
        return true;
    }

    public static bool Like(string me, long id)
    {
        lock (Lock)
        {
            var p = _s.Wall.FirstOrDefault(x => x.Id == id);
            if (p is null) return false;
            if (!p.Likes.Remove(me)) p.Likes.Add(me);
            _dirty = true;
            return true;
        }
    }

    public static bool AddComment(string me, long id, string? text)
    {
        var t = Clean(text, CommentMax);
        if (t.Length == 0) return false;
        lock (Lock)
        {
            var p = _s.Wall.FirstOrDefault(x => x.Id == id);
            if (p is null || p.Comments.Count >= 200) return false;
            p.Comments.Add(new Comment { Id = _s.NextId++, Author = me, Text = t, At = DateTime.UtcNow });
            _dirty = true;
            return true;
        }
    }

    // Borra una publicacion, comentario o mensaje del chat general (autor o admin)
    public static bool Delete(string me, bool admin, long id)
    {
        lock (Lock)
        {
            var p = _s.Wall.FirstOrDefault(x => x.Id == id);
            if (p is not null)
            {
                if (!admin && !p.Author.Equals(me, StringComparison.OrdinalIgnoreCase)) return false;
                _s.Wall.Remove(p); _dirty = true; return true;
            }
            foreach (var post in _s.Wall)
            {
                var c = post.Comments.FirstOrDefault(x => x.Id == id);
                if (c is null) continue;
                if (!admin && !c.Author.Equals(me, StringComparison.OrdinalIgnoreCase) && !post.Author.Equals(me, StringComparison.OrdinalIgnoreCase)) return false;
                post.Comments.Remove(c); _dirty = true; return true;
            }
            var m = _s.Global.FirstOrDefault(x => x.Id == id);
            if (m is not null && (admin || m.From.Equals(me, StringComparison.OrdinalIgnoreCase)))
            {
                _s.Global.Remove(m); _dirty = true; return true;
            }
            return false;
        }
    }

    // ---------- chat ----------
    private static object Out(Msg m) => new { id = m.Id, from = Who(m.From), text = m.Text, image = m.Image, at = m.At };

    public static object Global(string me, long after)
    {
        lock (Lock)
        {
            return _s.Global.Where(m => m.Id > after && !Blocked(me, m.From)).TakeLast(80).Select(Out).ToList();
        }
    }

    public static bool SayGlobal(string me, string? text, string? image = null)
    {
        var t = Clean(text, ChatMax);
        var img = Img(image);
        if (t.Length == 0 && img is null) return false;
        lock (Lock)
        {
            _s.Global.Add(new Msg { Id = _s.NextId++, From = me, Text = t, Image = img, At = DateTime.UtcNow });
            if (_s.Global.Count > ChatKeep) _s.Global.RemoveRange(0, _s.Global.Count - ChatKeep);
            _dirty = true;
        }
        return true;
    }

    public static object Dm(string me, string other, long after)
    {
        var k = Key(me, other);
        lock (Lock)
        {
            List<object> list = _s.Dms.TryGetValue(k, out var l) ? l.Where(m => m.Id > after).TakeLast(100).Select(Out).ToList() : new List<object>();
            if (_s.Dms.TryGetValue(k, out var all) && all.Count > 0) MarkRead(me, k, all[^1].Id);
            return new { with = Who(other), blocked = Blocked(me, other) || (_s.Privacy.TryGetValue(other.ToLowerInvariant(), out var pv) && pv.Contains("nomsg")), messages = list };
        }
    }

    // null = ok; texto = motivo del rechazo
    public static string? SayDm(string me, string other, string? text, string? image = null)
    {
        if (me.Equals(other, StringComparison.OrdinalIgnoreCase)) return "self";
        var t = Clean(text, ChatMax);
        var img = Img(image);
        if (t.Length == 0 && img is null) return "empty";
        lock (Lock)
        {
            if (Blocked(other, me) || Blocked(me, other)) return "blocked";
            if (_s.Privacy.TryGetValue(other.ToLowerInvariant(), out var pv) && pv.Contains("nomsg")) return "blocked";
            var k = Key(me, other);
            if (!_s.Dms.TryGetValue(k, out var l)) _s.Dms[k] = l = [];
            var m = new Msg { Id = _s.NextId++, From = me, To = other, Text = t, Image = img, At = DateTime.UtcNow };
            l.Add(m);
            if (l.Count > DmKeep) l.RemoveRange(0, l.Count - DmKeep);
            MarkRead(me, k, m.Id);
            _dirty = true;
        }
        return null;
    }

    private static void MarkRead(string me, string key, long id)
    {
        var u = me.ToLowerInvariant();
        if (!_s.Read.TryGetValue(u, out var r)) _s.Read[u] = r = new();
        if (r.GetValueOrDefault(key) < id) { r[key] = id; _dirty = true; }
    }

    public static object Conversations(string me)
    {
        var u = me.ToLowerInvariant();
        lock (Lock)
        {
            var read = _s.Read.GetValueOrDefault(u) ?? new();
            return _s.Dms.Where(x => x.Key.Split('|').Contains(u) && x.Value.Count > 0)
                .Select(x =>
                {
                    var last = x.Value[^1];
                    var other = last.From.Equals(me, StringComparison.OrdinalIgnoreCase) ? last.To : last.From;
                    return (x, last, other);
                })
                .Where(t => !Blocked(me, t.other))
                .Select(t =>
                {
                    var seen = read.GetValueOrDefault(t.x.Key);
                    var unread = t.x.Value.Count(m => m.Id > seen && !m.From.Equals(me, StringComparison.OrdinalIgnoreCase));
                    return new { with = Who(t.other), last = t.last.Text.Length > 0 ? t.last.Text : "📷", at = t.last.At, unread, id = t.last.Id };
                })
                .OrderByDescending(x => x.id).Take(50).ToList();
        }
    }

    public static int Unread(string me)
    {
        var u = me.ToLowerInvariant();
        lock (Lock)
        {
            var read = _s.Read.GetValueOrDefault(u) ?? new();
            return _s.Dms.Where(x => x.Key.Split('|').Contains(u))
                .Sum(x => x.Value.Count(m => m.Id > read.GetValueOrDefault(x.Key) && !m.From.Equals(me, StringComparison.OrdinalIgnoreCase) && !Blocked(me, m.From)));
        }
    }

    // Ultimo mensaje privado sin leer (para el aviso tipo Facebook)
    public static object? LastUnread(string me)
    {
        var u = me.ToLowerInvariant();
        lock (Lock)
        {
            var read = _s.Read.GetValueOrDefault(u) ?? new();
            var m = _s.Dms.Where(x => x.Key.Split('|').Contains(u))
                .SelectMany(x => x.Value.Where(v => v.Id > read.GetValueOrDefault(x.Key)))
                .Where(v => !v.From.Equals(me, StringComparison.OrdinalIgnoreCase) && !Blocked(me, v.From))
                .OrderByDescending(v => v.Id).FirstOrDefault();
            return m is null ? null : new { id = m.Id, from = Who(m.From), text = m.Text.Length > 0 ? m.Text : "📷" };
        }
    }

    public static bool ToggleBlock(string me, string other)
    {
        var u = me.ToLowerInvariant();
        lock (Lock)
        {
            if (!_s.Blocks.TryGetValue(u, out var b)) _s.Blocks[u] = b = new(StringComparer.OrdinalIgnoreCase);
            var now = !b.Remove(other.ToLowerInvariant());
            if (now) b.Add(other.ToLowerInvariant());
            _dirty = true;
            return now;
        }
    }

    public static string Report(string me, long id, string? reason)
    {
        lock (Lock)
        {
            string? text = null, author = null;
            var p = _s.Wall.FirstOrDefault(x => x.Id == id);
            if (p is not null) { text = p.Text; author = p.Author; }
            var c = _s.Wall.SelectMany(x => x.Comments).FirstOrDefault(x => x.Id == id);
            if (c is not null) { text = c.Text; author = c.Author; }
            var m = _s.Global.FirstOrDefault(x => x.Id == id) ?? _s.Dms.Values.SelectMany(x => x).FirstOrDefault(x => x.Id == id);
            if (m is not null) { text = m.Text; author = m.From; }
            var line = $"{DateTime.UtcNow:u} · {me} reportó a {author ?? "?"} (#{id}): {text ?? "?"} · motivo: {Clean(reason, 120)}";
            _s.Reports.Add(line);
            if (_s.Reports.Count > 500) _s.Reports.RemoveAt(0);
            _dirty = true;
            return line;
        }
    }

    // Icono y coleccion de un objeto, desde gameSettings.xml
    private static object ItemInfo(string name)
    {
        string? icon = null, col = null;
        try
        {
            var gs = CityVilleDotnet.Common.Settings.GameSettingsManager.Instance;
            var item = gs.GetItem(name);
            var url = item?.Images.FirstOrDefault(i => i.Name == "icon")?.Url ?? item?.Images.FirstOrDefault()?.Url;
            if (!string.IsNullOrEmpty(url)) icon = url.StartsWith('/') ? url : "/" + url;
            col = gs.GetCollectionByItemName(name);
        }
        catch { /* settings sin cargar */ }
        return new { name, icon, collection = col };
    }

    // ---------- compartir desde el juego (lo que antes iba al muro de Facebook) ----------
    public const int MaxHelps = 15;
    private static readonly ConcurrentDictionary<string, DateTime> LastShare = new(StringComparer.OrdinalIgnoreCase);

    // Imagen que manda el juego: solo assets propios del servidor
    private static string? GameImage(string? src)
    {
        if (string.IsNullOrWhiteSpace(src)) return null;
        var i = src.IndexOf("/assets/", StringComparison.OrdinalIgnoreCase);
        if (i < 0 && src.EndsWith("/ag/logo_revived.png", StringComparison.OrdinalIgnoreCase)) return "/ag/logo_revived.png";
        if (i < 0) return Img(src);
        var path = src[i..];
        return Regex.IsMatch(path, @"^/assets/[A-Za-z0-9_\-/\.]+\.(png|jpg|gif)$", RegexOptions.IgnoreCase) && !path.Contains("..") ? path : null;
    }

    // null = ok. Devuelve el motivo si no se puede publicar.
    public static string? AddShare(string me, string? title, string? text, string? image, string? action, List<string>? wishlist)
    {
        var isWish = wishlist is not null;
        var key = me + (isWish ? "|w" : "|s");
        var wait = isWish ? TimeSpan.FromHours(4) : TimeSpan.FromMinutes(10);
        if (LastShare.TryGetValue(key, out var last) && DateTime.UtcNow - last < wait) return "wait";
        if (isWish && wishlist!.Count == 0) return "empty";
        var t = Clean(((title ?? "").Trim() + "\n" + (text ?? "").Trim()).Trim(), WallTextMax);
        lock (Lock)
        {
            _s.Wall.Add(new Post
            {
                Id = _s.NextId++, Author = me, Text = t, Image = GameImage(image), At = DateTime.UtcNow,
                Kind = isWish ? "wishlist" : "share", Action = Clean(action, 40),
                Items = isWish ? wishlist!.Take(10).ToList() : []
            });
            if (_s.Wall.Count > WallMax) _s.Wall.RemoveRange(0, _s.Wall.Count - WallMax);
            _dirty = true;
        }
        LastShare[key] = DateTime.UtcNow;
        return null;
    }

    // Registra la ayuda; devuelve (autor, tipo) o el motivo del rechazo
    public static (string? Author, string? Kind, string? Error) Help(string me, long id, string? item)
    {
        lock (Lock)
        {
            var p = _s.Wall.FirstOrDefault(x => x.Id == id);
            if (p is null || p.Kind == "text") return (null, null, "notfound");
            if (p.Author.Equals(me, StringComparison.OrdinalIgnoreCase)) return (null, null, "self");
            if (p.Helps.ContainsKey(me)) return (null, null, "done");
            if (p.Helps.Count >= MaxHelps) return (null, null, "full");
            if ((DateTime.UtcNow - p.At).TotalDays > 3) return (null, null, "old");
            if (p.Kind == "wishlist" && (item is null || !p.Items.Contains(item))) return (null, null, "item");
            p.Helps[me] = item ?? "";
            _dirty = true;
            return (p.Author, p.Kind, null);
        }
    }

    public static void UndoHelp(string me, long id)
    {
        lock (Lock)
        {
            var p = _s.Wall.FirstOrDefault(x => x.Id == id);
            if (p is not null && p.Helps.Remove(me)) _dirty = true;
        }
    }

    // ---------- endpoints ----------
    private sealed record TextBody(string? Text, string? Image = null);
    private sealed record PrivacyBody(bool NoMsg, bool NoAdd);
    private sealed record PrefBody(string? Key, string? Value);
    private sealed record ShareBody(string? Title, string? Text, string? Image, string? Action, bool? Wishlist);
    private sealed record HelpBody(string? Item);
    private sealed record DockWinReq(string? Name, long After);
    private sealed record DockBody(bool Active, List<DockWinReq>? Wins, string? Typing);

    public static void MapCommunity(this WebApplication app)
    {
        async Task<(Player? p, bool admin)> Me(HttpContext http, CityVilleDbContext db, UserManager<ApplicationUser> users)
        {
            var user = await users.GetUserAsync(http.User);
            if (user is null) return (null, false);
            var p = await db.Set<Player>().AsNoTracking().FirstOrDefaultAsync(x => x.AppUser != null && x.AppUser.Id == user.Id && x.Snuid != -1);
            if (p is not null) Touch(p);
            return (p, user.IsAdmin);
        }

        app.MapGet("/api/ag/me", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, admin) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var reqs = await db.Set<Friend>().CountAsync(f => f.Player!.Id == p.Id && f.Status == FriendshipStatus.Pending && f.Requested);
            return Results.Json(new { name = p.Username, avatar = p.ProfilePictureUrl ?? "/blank.png", level = p.Level, admin, unread = Unread(p.Username), requests = reqs, lastNote = LastNote(p.Username), prefs = PrefsOf(p.Username), status = MyStatus(p.Username), lastUnread = LastUnread(p.Username), support = SupportService.Counts(p.Username, admin).Mine, supportAdmin = SupportService.Counts(p.Username, admin).AdminOpen });
        });

        app.MapGet("/api/ag/wall", async (long? before, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            return p is null ? Results.Unauthorized() : Results.Json(Wall(p.Username, before ?? 0));
        });

        app.MapPost("/api/ag/wall", async (TextBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            if (TooFast(p.Username)) return Results.StatusCode(429);
            return AddPost(p.Username, b.Text, b.Image) ? Results.Ok() : Results.BadRequest();
        });

        // El juego llama a streamPublish (antes Facebook); lo publicamos en el muro
        app.MapPost("/api/ag/share", async (ShareBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            List<string>? wish = null;
            if (b.Wishlist == true)
            {
                var full = await db.Set<Player>().AsNoTracking().Include(x => x.Wishlist).FirstAsync(x => x.Id == p.Id);
                wish = full.Wishlist.OrderBy(x => x.Id).Select(x => x.ItemName).ToList();
            }
            var err = AddShare(p.Username, b.Title, b.Text, b.Image, b.Action, wish);
            return err is null ? Results.Ok() : Results.Json(new { error = err }, statusCode: 400);
        });

        // Ayudar en una publicacion compartida: el ayudante gana un bonus y el autor recibe su regalo
        app.MapPost("/api/ag/wall/{id:long}/help", async (long id, HelpBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (me, _) = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            // ajuste del autor: quien le puede ayudar
            var postAuthor = AuthorOf(id);
            if (postAuthor is not null && !postAuthor.Equals(me.Username, StringComparison.OrdinalIgnoreCase))
            {
                var who = Pref(postAuthor, "wallHelp");
                if (who == "none") return Results.Json(new { error = "closed" }, statusCode: 400);
                if (who == "friends" && !await db.Set<Friend>().AnyAsync(f => f.Player!.Id == me.Id && f.FriendPlayer!.Username == postAuthor && f.Status == FriendshipStatus.Accepted))
                    return Results.Json(new { error = "friendsOnly" }, statusCode: 400);
            }
            var (author, kind, error) = Help(me.Username, id, b.Item);
            if (error is not null) return Results.Json(new { error }, statusCode: 400);
            try
            {
                var helper = await db.Set<Player>().FirstAsync(x => x.Id == me.Id);
                var owner = await db.Set<Player>().Include(x => x.Collections).ThenInclude(x => x.Items)
                    .FirstOrDefaultAsync(x => x.Username == author && x.Snuid != -1);
                if (owner is null) { UndoHelp(me.Username, id); return Results.NotFound(); }
                object reward;
                if (kind == "wishlist")
                {
                    var col = CityVilleDotnet.Common.Settings.GameSettingsManager.Instance.GetCollectionByItemName(b.Item!);
                    if (col is not null) owner.AddItemToCollection(col, b.Item!);
                    else owner.AddCoins(25); // no es un coleccionable: el autor recibe monedas
                    helper.AddCoins(25);
                    reward = new { coins = 25, sent = b.Item };
                }
                else
                {
                    helper.AddCoins(50);
                    owner.AddCoins(10);
                    reward = new { coins = 50 };
                }
                await db.SaveChangesAsync();
                if (author is not null) AddNote(author, "help", me.Username);
                return Results.Json(reward);
            }
            catch
            {
                UndoHelp(me.Username, id);
                return Results.StatusCode(500);
            }
        });

        app.MapPost("/api/ag/wall/{id:long}/like", async (long id, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            return Like(p.Username, id) ? Results.Ok() : Results.NotFound();
        });

        app.MapPost("/api/ag/wall/{id:long}/comment", async (long id, TextBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            if (TooFast(p.Username)) return Results.StatusCode(429);
            return AddComment(p.Username, id, b.Text) ? Results.Ok() : Results.BadRequest();
        });

        app.MapPost("/api/ag/delete/{id:long}", async (long id, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, admin) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            return Delete(p.Username, admin, id) ? Results.Ok() : Results.Forbid();
        });

        app.MapGet("/api/ag/chat", async (long? after, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            return p is null ? Results.Unauthorized() : Results.Json(Global(p.Username, after ?? 0));
        });

        app.MapPost("/api/ag/chat", async (TextBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            if (TooFast(p.Username)) return Results.StatusCode(429);
            return SayGlobal(p.Username, b.Text, b.Image) ? Results.Ok() : Results.BadRequest();
        });

        app.MapGet("/api/ag/dm", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            return p is null ? Results.Unauthorized() : Results.Json(Conversations(p.Username));
        });

        app.MapGet("/api/ag/dm/{name}", async (string name, long? after, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var other = await db.Set<Player>().AsNoTracking().Where(x => x.Snuid != -1 && x.Username == name).Select(x => x.Username).FirstOrDefaultAsync();
            return other is null ? Results.NotFound() : Results.Json(Dm(p.Username, other, after ?? 0));
        });

        app.MapPost("/api/ag/dm/{name}", async (string name, TextBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            if (TooFast(p.Username)) return Results.StatusCode(429);
            var other = await db.Set<Player>().AsNoTracking().Where(x => x.Snuid != -1 && x.Username == name).Select(x => x.Username).FirstOrDefaultAsync();
            if (other is null) return Results.NotFound();
            var err = SayDm(p.Username, other, b.Text, b.Image);
            return err is null ? Results.Ok() : Results.Json(new { error = err }, statusCode: 400);
        });

        app.MapGet("/api/ag/players", async (string? q, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var s = (q ?? "").Trim();
            var list = await db.Set<Player>().AsNoTracking()
                .Where(x => x.Snuid != -1 && x.Username != p.Username && (s == "" || x.Username.Contains(s)))
                .OrderByDescending(x => x.LastTrackingTimestamp).Take(40)
                .Select(x => new { name = x.Username, avatar = x.ProfilePictureUrl ?? "/blank.png", level = x.Level })
                .ToListAsync();
            var outList = list.Where(x => !Blocked(p.Username, x.name))
                .Select(x => new { x.name, x.avatar, x.level, status = Presence(x.name), seen = Seen(x.name) })
                .OrderBy(x => x.status == "online" ? 0 : x.status == "idle" ? 1 : x.status == "busy" ? 2 : 3).ToList();
            return Results.Json(outList);
        });

        // ---------- agregar amigos (boton "Add Friends" del juego) ----------
        async Task<Dictionary<string, string>> Relations(CityVilleDbContext db, Guid me) =>
            (await db.Set<Friend>().AsNoTracking().Where(f => f.Player!.Id == me)
                .Select(f => new { n = f.FriendPlayer!.Username, f.Status, f.Requested }).ToListAsync())
            .GroupBy(x => x.n, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => { var x = g.First(); return x.Status == FriendshipStatus.Accepted ? "friend" : x.Requested ? "received" : "sent"; }, StringComparer.OrdinalIgnoreCase);

        // ---------- chat en ventanitas abajo (estilo Facebook 2011) ----------
        app.MapPost("/api/ag/dock", async (DockBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            Activity(p.Username, b.Active);
            MarkDelivered(p.Username);
            var want = (b.Wins ?? []).Where(w => !string.IsNullOrWhiteSpace(w.Name) && w.Name!.Length <= 40).Take(4).ToList();
            var names = want.Select(w => w.Name!).ToList();
            var found = names.Count == 0 ? new List<string>() : await db.Set<Player>().AsNoTracking()
                .Where(x => x.Snuid != -1 && names.Contains(x.Username)).Select(x => x.Username).ToListAsync();
            if (!string.IsNullOrWhiteSpace(b.Typing))
            {
                var to = found.FirstOrDefault(f => f.Equals(b.Typing, StringComparison.OrdinalIgnoreCase));
                if (to is not null) SetTyping(p.Username, to);
            }
            var wins = want.Select(w => found.FirstOrDefault(f => f.Equals(w.Name, StringComparison.OrdinalIgnoreCase)) is { } o ? DockWin(p.Username, o, w.After) : null)
                .Where(x => x is not null).ToList();
            return Results.Json(new { status = MyStatus(p.Username), unread = Unread(p.Username), from = UnreadFrom(p.Username), wins });
        });

        // lista de la barra de chat: amigos primero, luego los que estan conectados
        app.MapGet("/api/ag/dock/list", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var rel = await Relations(db, p.Id);
            var friends = rel.Where(x => x.Value == "friend").Select(x => x.Key).ToList();
            var recent = await db.Set<Player>().AsNoTracking()
                .Where(x => x.Snuid != -1 && x.Username != p.Username)
                .OrderByDescending(x => x.LastTrackingTimestamp).Take(60)
                .Select(x => new { name = x.Username, avatar = x.ProfilePictureUrl ?? "/blank.png", level = x.Level })
                .ToListAsync();
            var fr = await db.Set<Player>().AsNoTracking()
                .Where(x => x.Snuid != -1 && friends.Contains(x.Username))
                .Select(x => new { name = x.Username, avatar = x.ProfilePictureUrl ?? "/blank.png", level = x.Level })
                .ToListAsync();
            int Rank(string st) => st == "online" ? 0 : st == "idle" ? 1 : st == "busy" ? 2 : 3;
            object Row(string name, string avatar, int level, bool friend) => new { name, avatar, level, friend, status = Presence(name), seen = Seen(name) };
            var outFr = fr.Where(x => !Blocked(p.Username, x.name)).OrderBy(x => Rank(Presence(x.name))).ThenBy(x => x.name).Select(x => Row(x.name, x.avatar, x.level, true)).ToList();
            var outOn = recent.Where(x => !friends.Contains(x.name, StringComparer.OrdinalIgnoreCase) && !Blocked(p.Username, x.name) && Presence(x.name) != "offline")
                .OrderBy(x => Rank(Presence(x.name))).Select(x => Row(x.name, x.avatar, x.level, false)).ToList();
            return Results.Json(new { friends = outFr, online = outOn, convs = Conversations(p.Username) });
        });

        app.MapGet("/api/ag/friends/find", async (string? q, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var s = (q ?? "").Trim();
            var rel = await Relations(db, p.Id);
            var list = await db.Set<Player>().AsNoTracking()
                .Where(x => x.Snuid != -1 && x.Id != p.Id && (s == "" || x.Username.Contains(s)))
                .OrderByDescending(x => x.LastTrackingTimestamp).Take(60)
                .Select(x => new { name = x.Username, avatar = x.ProfilePictureUrl ?? "/blank.png", level = x.Level })
                .ToListAsync();
            var total = await db.Set<Player>().CountAsync(x => x.Snuid != -1 && x.Id != p.Id);
            var pending = total - rel.Count(r => r.Value is "friend" or "sent");
            var inNames = rel.Where(r => r.Value == "received").Select(r => r.Key).ToList();
            var incoming = await db.Set<Player>().AsNoTracking().Where(x => inNames.Contains(x.Username))
                .Select(x => new { name = x.Username, avatar = x.ProfilePictureUrl ?? "/blank.png", level = x.Level, rel = "received" }).ToListAsync();
            return Results.Json(new
            {
                total, pending, incoming,
                players = list.Select(x => new { x.name, x.avatar, x.level, rel = rel.TryGetValue(x.name, out var r) ? r : Private(x.name, "noadd") ? "private" : "none" })
            });
        });

        app.MapPost("/api/ag/friends/add", async (TextBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var name = (b.Text ?? "").Trim();
            if (name == "") return Results.Json(new { error = "empty" }, statusCode: 400);
            var me = await db.Set<Player>().Include(x => x.Friends).ThenInclude(x => x.FriendPlayer).FirstAsync(x => x.Id == p.Id);
            var target = await db.Set<Player>().FirstOrDefaultAsync(x => x.Username == name && x.Snuid != -1);
            if (target is null) return Results.Json(new { error = "notfound" }, statusCode: 404);
            if (target.Id == me.Id) return Results.Json(new { error = "self" }, statusCode: 400);
            var mine = me.Friends.FirstOrDefault(f => f.FriendPlayer!.Id == target.Id);
            if (mine is not null)
            {
                if (mine.Status == FriendshipStatus.Pending && mine.Requested)
                {
                    var theirs = await db.Set<Friend>().FirstOrDefaultAsync(f => f.Player!.Id == target.Id && f.FriendPlayer!.Id == me.Id);
                    mine.Status = FriendshipStatus.Accepted;
                    if (theirs is not null) theirs.Status = FriendshipStatus.Accepted;
                    await db.SaveChangesAsync();
                    AddNote(target.Username, "acc", me.Username);
                    return Results.Json(new { rel = "friend", name = target.Username });
                }
                return Results.Json(new { rel = mine.Status == FriendshipStatus.Accepted ? "friend" : "sent", name = target.Username });
            }
            if (Private(target.Username, "noadd")) return Results.Json(new { error = "private" }, statusCode: 403);
            me.SendFriendRequest(target);
            await db.SaveChangesAsync();
            AddNote(target.Username, "req", me.Username);
            return Results.Json(new { rel = "sent", name = target.Username });
        });

        app.MapPost("/api/ag/friends/addall", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            if (TooFast(p.Username)) return Results.StatusCode(429);
            var me = await db.Set<Player>().Include(x => x.Friends).ThenInclude(x => x.FriendPlayer).FirstAsync(x => x.Id == p.Id);
            var known = me.Friends.Select(f => f.FriendPlayer!.Id).ToHashSet();
            int sent = 0, accepted = 0;
            // primero aceptar las solicitudes que ya me mandaron
            foreach (var mine in me.Friends.Where(f => f.Status == FriendshipStatus.Pending && f.Requested))
            {
                var theirs = await db.Set<Friend>().FirstOrDefaultAsync(f => f.Player!.Id == mine.FriendPlayer!.Id && f.FriendPlayer!.Id == me.Id);
                mine.Status = FriendshipStatus.Accepted;
                if (theirs is not null) theirs.Status = FriendshipStatus.Accepted;
                AddNote(mine.FriendPlayer!.Username, "acc", me.Username);
                accepted++;
            }
            var others = await db.Set<Player>().Where(x => x.Snuid != -1 && x.Id != me.Id && !known.Contains(x.Id)).Take(500).ToListAsync();
            foreach (var t in others) { if (Private(t.Username, "noadd")) continue; me.SendFriendRequest(t); AddNote(t.Username, "req", me.Username); sent++; }
            await db.SaveChangesAsync();
            return Results.Json(new { sent, accepted });
        });

        // foto de perfil siempre al dia para el juego: la direccion no cambia, la imagen si
        app.MapGet("/api/ag/pic/{snuid:int}", async (int snuid, HttpContext h, CityVilleDbContext db, IWebHostEnvironment env) =>
        {
            var url = await db.Set<Player>().AsNoTracking().Where(x => x.Snuid == snuid).Select(x => x.ProfilePictureUrl).FirstOrDefaultAsync();
            var rel = CityVilleDotnet.Domain.GameEntities.GamePicture.For(url).Split('?')[0].TrimStart('/');
            var file = Path.GetFullPath(Path.Combine(env.WebRootPath, rel));
            if (!file.StartsWith(Path.GetFullPath(env.WebRootPath)) || !File.Exists(file)) file = Path.Combine(env.WebRootPath, "blank.png");
            h.Response.Headers.CacheControl = "no-cache, no-store, must-revalidate";
            var type = file.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) || file.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ? "image/jpeg" : "image/png";
            return Results.File(file, type);
        });

        app.MapGet("/api/ag/settings", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var blocked = BlockedBy(p.Username);
            var info = await db.Set<Player>().AsNoTracking().Where(x => blocked.Contains(x.Username.ToLower()))
                .Select(x => new { name = x.Username, avatar = x.ProfilePictureUrl ?? "/blank.png", level = x.Level }).ToListAsync();
            return Results.Json(new { prefs = PrefsOf(p.Username), privacy = PrivacyOf(p.Username), blocked = info });
        });
        app.MapPost("/api/ag/settings", async (PrefBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            return SetPref(p.Username, b.Key ?? "", b.Value) ? Results.Json(PrefsOf(p.Username)) : Results.BadRequest();
        });

        app.MapGet("/api/ag/privacy", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            return p is null ? Results.Unauthorized() : Results.Json(PrivacyOf(p.Username));
        });
        app.MapPost("/api/ag/privacy", async (PrivacyBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            SetPrivacy(p.Username, b.NoMsg, b.NoAdd);
            return Results.Json(PrivacyOf(p.Username));
        });

        app.MapPost("/api/ag/status", async (TextBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            SetStatus(p.Username, b.Text);
            return Results.Json(new { status = MyStatus(p.Username) });
        });

        app.MapPost("/api/ag/upload", async (TextBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var (url, error) = SaveImage(p.Username, b.Image);
            return url is null ? Results.Json(new { error }, statusCode: 400) : Results.Json(new { url });
        });

        app.MapGet("/api/ag/media/{file}", (string file, HttpContext h) =>
        {
            var path = MediaPath(file);
            if (path is null) return Results.NotFound();
            h.Response.Headers.CacheControl = "public, max-age=604800";
            return Results.File(path, "image/jpeg");
        });

        app.MapPost("/api/ag/block/{name}", async (string name, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            return Results.Json(new { blocked = ToggleBlock(p.Username, name) });
        });

        app.MapPost("/api/ag/report/{id:long}", async (long id, TextBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u, IConfiguration config) =>
        {
            var (p, _) = await Me(h, db, u);
            if (p is null) return Results.Unauthorized();
            var line = Report(p.Username, id, b.Text);
            AllowGamesEndpoints.NotifyDiscord(config, "🚩 Reporte en CityVille Revived: " + line);
            return Results.Ok();
        });

        app.MapGet("/api/ag/reports", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var (p, admin) = await Me(h, db, u);
            if (p is null || !admin) return Results.Forbid();
            lock (Lock) return Results.Json(_s.Reports.AsEnumerable().Reverse().Take(100).ToList());
        });
    }
}
