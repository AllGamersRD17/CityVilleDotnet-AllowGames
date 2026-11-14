using System.Collections.Concurrent;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using CityVilleDotnet.Api.Common.Amf;
using CityVilleDotnet.Common.Settings;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Persistence;
using FluorineFx;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Services.UserService;

// Allow Games: en 2012 el servidor de Zynga armaba la publicacion de Facebook (titulo, texto y foto)
// y el juego solo la mostraba. Sin esto llegaba vacia al muro. Aqui la armamos con los textos
// del juego (paquete "Feeds") y la foto del objeto, igual que se veia en Facebook.
// Parametros: [tipo de publicacion, datos, destinatario, clickthrough, subtipo, autoPublicar, mensaje]
public class StreamPublish(CityVilleDbContext context, IHttpContextAccessor http, IWebHostEnvironment env) : AmfService
{
    public override async Task<ASObject> HandlePacket(object[] @params, Guid playerId, CancellationToken cancellationToken)
    {
        var player = await context.Set<Player>().AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == playerId, cancellationToken);

        var type = @params.Length > 0 ? @params[0]?.ToString() ?? "" : "";
        var data = @params.Length > 1 ? ToDict(@params[1]) : new Dictionary<string, string>();
        var target = @params.Length > 2 ? @params[2]?.ToString() ?? "" : "";

        var req = http.HttpContext?.Request;
        var lang = (req?.Cookies["gameLocale"] ?? "").StartsWith("es", StringComparison.OrdinalIgnoreCase) ? "es_ES" : "en_US";
        var baseUrl = req is null ? "" : $"{req.Scheme}://{req.Host}{req.PathBase}";

        var feed = FeedTexts.Build(env.WebRootPath, lang, type, data, player?.Username ?? "", out var itemName);
        var image = FindImage(type, data, itemName);
        var imageUrl = image is null ? $"{baseUrl}/ag/logo_revived.png" : $"{baseUrl}/{image}";
        var href = $"{baseUrl}/Game";

        var media = new ASObject { ["type"] = "image", ["src"] = imageUrl, ["href"] = href };
        var attachment = new ASObject
        {
            ["name"] = feed.Title,
            ["description"] = feed.Description,
            ["caption"] = feed.Caption,
            ["href"] = href,
            ["media"] = new object[] { media }
        };
        var link = new ASObject { ["text"] = feed.Action, ["href"] = href };

        return new CityVilleResponse().Data(new ASObject
        {
            ["attachment"] = attachment,
            ["action_link"] = new object[] { link },
            ["action_links"] = new object[] { link },
            ["target_id"] = target,
            ["user_message_prompt"] = "",
            ["auto_publish"] = false,
            ["message"] = "",
            ["viral"] = type,
            ["full"] = new ASObject
            {
                ["title"] = feed.Title,
                ["description"] = feed.Description,
                ["media"] = new object[] { new ASObject { ["src"] = imageUrl } },
                ["title_href"] = href
            }
        });
    }

    private static Dictionary<string, string> ToDict(object? o)
    {
        var d = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (o is IDictionary<string, object> map)
            foreach (var (k, v) in map)
                if (v is not null && v is not IDictionary<string, object>) d[k] = v.ToString() ?? "";
        return d;
    }

    // la foto: el objeto de la publicacion (por los datos o por el nombre de la publicacion)
    private string? FindImage(string type, Dictionary<string, string> data, string? hint)
    {
        var names = new List<string>();
        if (hint is not null) names.Add(hint);
        foreach (var k in new[] { "itemName", "item", "itemname", "building", "buildingName", "name", "item_name" })
            if (data.TryGetValue(k, out var v) && v.Length > 0) names.Add(v);
        // "completed_hotel_sailboat_low" -> prueba "completed_hotel_sailboat", "hotel_sailboat", ...
        var parts = type.Split('_', StringSplitOptions.RemoveEmptyEntries);
        for (var len = parts.Length; len >= 1; len--)
            for (var start = 0; start + len <= parts.Length; start++)
                names.Add(string.Join('_', parts.Skip(start).Take(len)));

        foreach (var n in names)
        {
            var item = GameSettingsManager.Instance.GetItem(n);
            if (item is null) continue;
            foreach (var kind in new[] { "large_icon", "icon" })
            {
                var url = item.Images.FirstOrDefault(x => x.Name == kind)?.Url;
                if (url is not null && File.Exists(Path.Combine(env.WebRootPath, url.Replace('/', Path.DirectorySeparatorChar)))) return url;
            }
        }
        return null;
    }
}

public class SuperStreamPublish(CityVilleDbContext context, IHttpContextAccessor http, IWebHostEnvironment env) : AmfService
{
    public override Task<ASObject> HandlePacket(object[] @params, Guid playerId, CancellationToken cancellationToken)
        => new StreamPublish(context, http, env).HandlePacket(@params, playerId, cancellationToken);
}

public sealed record FeedText(string Title, string Description, string Caption, string Action);

public static class FeedTexts
{
    private static readonly ConcurrentDictionary<string, Dictionary<string, string>> Packs = new();

    private static Dictionary<string, string> Load(string root, string lang)
    {
        return Packs.GetOrAdd(lang, l =>
        {
            var d = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            try
            {
                var file = Path.Combine(root, $"{l}.xml");
                if (!File.Exists(file)) file = Path.Combine(root, "en_US.xml");
                var doc = XDocument.Load(file);
                foreach (var pkg in doc.Root!.Elements("pkg"))
                {
                    if ((string?)pkg.Attribute("name") != "Feeds") continue;
                    foreach (var s in pkg.Elements("string"))
                    {
                        var key = (string?)s.Attribute("key");
                        var text = s.Element("original")?.Value;
                        if (key is not null && !string.IsNullOrWhiteSpace(text)) d[key.Replace("_", "")] = text;
                    }
                }
            }
            catch
            {
                // sin textos: se usan los genericos
            }
            return d;
        });
    }

    public static FeedText Build(string root, string lang, string type, Dictionary<string, string> data, string user, out string? itemName)
    {
        itemName = null;
        var pack = Load(root, lang);
        var en = lang == "en_US" ? pack : Load(root, "en_US");

        // "level_up_01" -> "levelup01", "levelup", ...
        var bases = new List<string>();
        var parts = type.Split('_', StringSplitOptions.RemoveEmptyEntries).ToList();
        while (parts.Count > 0) { bases.Add(string.Concat(parts)); parts.RemoveAt(parts.Count - 1); }

        string? Find(params string[] suffixes)
        {
            foreach (var b in bases)
                foreach (var s in suffixes)
                    if (pack.TryGetValue(b + s, out var v) || en.TryGetValue(b + s, out v)) return v;
            return null;
        }

        var title = Find("AttachmentName", "Name", "Title", "AttachmentTitle", "Headline");
        var desc = Find("AttachmentDesc", "Desc", "Description", "AttachmentDescription", "Body", "Message");
        var caption = Find("AttachmentCaption", "Caption") ?? "";
        var action = Find("Action", "ActionLink", "Button") ?? (lang == "es_ES" ? "¡Ayúdame!" : "Help me out!");

        if (title is null)
        {
            var nice = Regex.Replace(type, "[_]+", " ").Trim();
            title = lang == "es_ES" ? $"¡{user} tiene novedades en su ciudad!" : $"{user} has news from their city!";
            desc ??= lang == "es_ES" ? $"Entra a CityVille y ayuda a {user}. ({nice})" : $"Play CityVille and help {user} out! ({nice})";
        }

        foreach (var k in new[] { "itemName", "item", "building" })
            if (data.TryGetValue(k, out var v) && v.Length > 0) { itemName = v; break; }

        return new FeedText(Fill(title, data, user), Fill(desc ?? "", data, user), Fill(caption, data, user), Fill(action, data, user));
    }

    // {user,name} {user,fem} -> nombre del jugador; {franchiseName} -> datos de la publicacion
    private static string Fill(string text, Dictionary<string, string> data, string user)
    {
        var s = Regex.Replace(text, @"\{([A-Za-z0-9_]+)(?:,[^}]*)?\}", m =>
        {
            var key = m.Groups[1].Value;
            if (key.Equals("user", StringComparison.OrdinalIgnoreCase) || key.Equals("actor", StringComparison.OrdinalIgnoreCase) || key.Equals("player", StringComparison.OrdinalIgnoreCase)) return user;
            if (data.TryGetValue(key, out var v)) return v;
            if (key.Equals("item", StringComparison.OrdinalIgnoreCase) && data.TryGetValue("itemName", out var it)) return it;
            return "";
        });
        s = Regex.Replace(s, "<[^>]+>", "");
        return Regex.Replace(s, @"\s{2,}", " ").Trim();
    }
}
