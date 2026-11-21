using System.Collections;
using System.Text.Json;
using CityVilleDotnet.Api.Common.Amf;
using CityVilleDotnet.Api.Common.GameWorlds;
using CityVilleDotnet.Api.Common.Identity;
using CityVilleDotnet.Api.Features.Gateway.Endpoint;
using CityVilleDotnet.Api.Services.QuestService;
using CityVilleDotnet.Common.Exceptions;
using CityVilleDotnet.Common.Settings;
using CityVilleDotnet.Persistence;
using FluentValidation;
using FluorineFx;
using Humanizer;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: puerta JSON para la app de celular (sin Flash). Usa exactamente los mismos
// servicios que el juego de PC, asi que la partida es la misma en los dos.
internal static class MobileGateway
{
    public static void MapMobileGateway(WebApplication app)
    {
        MapMobileMe(app);
        app.MapPost("/api/ag/m/gw", async (HttpContext h, IServiceProvider sp, CityVilleDbContext context, ILogger<MobileGatewayLog> logger, CancellationToken ct) =>
        {
            if (h.User.GetPlayerId() is not { } playerId) return Results.Unauthorized();

            JsonDocument doc;
            try { doc = await JsonDocument.ParseAsync(h.Request.Body, cancellationToken: ct); }
            catch { return Results.BadRequest(); }

            using (doc)
            {
                if (!doc.RootElement.TryGetProperty("calls", out var calls) || calls.ValueKind != JsonValueKind.Array)
                    return Results.BadRequest();

                h.Response.ContentType = "application/json";
                await using var w = new Utf8JsonWriter(h.Response.Body);
                w.WriteStartObject();
                w.WritePropertyName("r");
                w.WriteStartArray();

                foreach (var call in calls.EnumerateArray().Take(30))
                {
                    var fn = call.TryGetProperty("fn", out var f) ? f.GetString() ?? "" : "";
                    var parameters = call.TryGetProperty("params", out var pa) && pa.ValueKind == JsonValueKind.Array
                        ? (object[])FromJson(pa)! : [];
                    ASObject response;
                    try
                    {
                        response = await Invoke(sp, context, fn, parameters, playerId, ct)
                                   ?? GatewayService.CreateEmptyResponse();
                    }
                    catch (DomainException de)
                    {
                        context.ChangeTracker.Clear();
                        response = new CityVilleResponse().Error(de.Reason).ErrorMessage(de.ClientMessage).ToObject();
                    }
                    catch (ValidationException)
                    {
                        context.ChangeTracker.Clear();
                        response = new CityVilleResponse().Error(CityVilleDotnet.Common.Enums.GameErrorType.InvalidData).ToObject();
                    }
                    catch (Exception e)
                    {
                        logger.LogError(e, "Mobile call {Fn} failed", fn);
                        MissingHandlers.RecordError("m:" + fn, parameters, e);
                        context.ChangeTracker.Clear();
                        response = new CityVilleResponse().Error(CityVilleDotnet.Common.Enums.GameErrorType.InvalidData).ToObject();
                    }
                    Write(w, response, 0);
                }

                w.WriteEndArray();
                w.WriteNumber("t", DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
                w.WriteEndObject();
                await w.FlushAsync(ct);
            }
            return Results.Empty;
        });
    }

    internal sealed class MobileGatewayLog;

    public static void MapMobileMe(WebApplication app)
    {
        app.MapGet("/api/ag/m/me", async (HttpContext h, CityVilleDbContext db, CancellationToken ct) =>
        {
            if (h.User.GetPlayerId() is not { } playerId) return Results.Unauthorized();
            var p = await db.Set<CityVilleDotnet.Domain.Entities.Player>().AsNoTracking()
                .Where(x => x.Id == playerId)
                .Select(x => new { gold = x.Gold, cash = x.Cash, xp = x.Xp, level = x.Level, energy = x.Energy, energyMax = x.EnergyMax, goods = x.Goods, name = x.Username })
                .FirstOrDefaultAsync(ct);
            return p is null ? Results.NotFound() : Results.Json(p);
        });
    }

    private static async Task<ASObject?> Invoke(IServiceProvider sp, CityVilleDbContext context, string functionName, object[] parameters, Guid playerId, CancellationToken ct)
    {
        var parts = functionName.Split('.');
        if (parts.Length != 2) return null;
        var packageName = parts[0];
        var className = parts[1];
        var upper = className.Pascalize();

        if (!GatewayService.TryGetHandler($"CityVilleDotnet.Api.Services.{packageName}.{upper}", out _) && QuestSettingsManager.TaskActions.Contains(className))
        {
            parameters = new object[] { className }.Append(parameters).ToArray();
            packageName = "QuestService";
            upper = nameof(HandleQuestProgress);
        }
        if (packageName == "WorldService" && upper == "PerformAction" && parameters.Length > 0 && parameters[0] is string a)
            upper = a.Pascalize();
        if (packageName == "GameMechanicService" && upper == "PerformMechanicAction" && parameters.Length > 1 && parameters[1] is string m)
            upper = GatewayService.ResolveMechanicHandler(m);

        if (!GatewayService.TryGetHandler($"CityVilleDotnet.Api.Services.{packageName}.{upper}", out var type))
        {
            MissingHandlers.Record($"{packageName}.{upper}", "m:" + functionName, parameters);
            return null;
        }

        using var tracker = new WorldUpdateTracker(context);
        var instance = (AmfService)sp.GetRequiredService(type);
        instance.ServiceProvider = sp;
        var res = await instance.HandlePacket(parameters, playerId, ct);
        await tracker.AppendToAsync(res, ct);
        ChallengeService.Track(playerId, upper);
        return res;
    }

    // JSON -> los mismos tipos que entrega el lector AMF
    private static object? FromJson(JsonElement e) => e.ValueKind switch
    {
        JsonValueKind.Object => ToAs(e),
        JsonValueKind.Array => e.EnumerateArray().Select(FromJson).ToArray(),
        JsonValueKind.String => e.GetString(),
        JsonValueKind.Number => e.TryGetInt32(out var i) ? (object)i : e.GetDouble(),
        JsonValueKind.True => true,
        JsonValueKind.False => false,
        _ => null
    };

    private static ASObject ToAs(JsonElement e)
    {
        var o = new ASObject();
        foreach (var p in e.EnumerateObject()) o[p.Name] = FromJson(p.Value)!;
        return o;
    }

    private static void Write(Utf8JsonWriter w, object? v, int depth)
    {
        if (depth > 40) { w.WriteNullValue(); return; }
        switch (v)
        {
            case null: w.WriteNullValue(); return;
            case string s: w.WriteStringValue(s); return;
            case bool b: w.WriteBooleanValue(b); return;
            case int i: w.WriteNumberValue(i); return;
            case long l: w.WriteNumberValue(l); return;
            case uint ui: w.WriteNumberValue(ui); return;
            case short sh: w.WriteNumberValue((int)sh); return;
            case byte by: w.WriteNumberValue((int)by); return;
            case float fl: if (float.IsFinite(fl)) w.WriteNumberValue(fl); else w.WriteNullValue(); return;
            case double d: if (double.IsFinite(d)) w.WriteNumberValue(d); else w.WriteNullValue(); return;
            case decimal de: w.WriteNumberValue(de); return;
            case DateTime dt: w.WriteNumberValue(new DateTimeOffset(dt.ToUniversalTime()).ToUnixTimeMilliseconds()); return;
            case Enum en: w.WriteStringValue(en.ToString()); return;
            case Guid g: w.WriteStringValue(g.ToString()); return;
            case byte[] bytes: w.WriteBase64StringValue(bytes); return;
            case IDictionary dict:
                w.WriteStartObject();
                foreach (DictionaryEntry kv in dict)
                {
                    w.WritePropertyName(kv.Key?.ToString() ?? "");
                    Write(w, kv.Value, depth + 1);
                }
                w.WriteEndObject();
                return;
            case IEnumerable list:
                w.WriteStartArray();
                foreach (var x in list) Write(w, x, depth + 1);
                w.WriteEndArray();
                return;
        }
        w.WriteStartObject();
        foreach (var p in v.GetType().GetProperties())
        {
            if (p.GetIndexParameters().Length > 0 || !p.CanRead) continue;
            object? val;
            try { val = p.GetValue(v); } catch { continue; }
            w.WritePropertyName(p.Name);
            Write(w, val, depth + 1);
        }
        w.WriteEndObject();
    }
}
