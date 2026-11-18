using CityVilleDotnet.Api.Services.LotOrderService;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Domain.Enums;
using CityVilleDotnet.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: solicitudes de franquicia.
// Cuando un amigo pone su negocio en un terreno vacio de tu ciudad, el pedido se quedaba escondido
// y casi nadie lo veia para aprobarlo. Ahora te sale una ventanita al entrar (y mientras juegas)
// con Aprobar / Rechazar. Usa la misma logica del juego (AcceptOrder / DenyOrder).
public static class FranchiseRequestService
{
    public sealed record ActBody(string SenderId, int LotId);

    public static void MapFranchise(WebApplication app)
    {
        static async Task<Player?> Me(HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u)
        {
            var user = await u.GetUserAsync(h.User);
            if (user is null) return null;
            return await db.Set<Player>().AsNoTracking().FirstOrDefaultAsync(x => x.AppUser != null && x.AppUser.Id == user.Id && x.Snuid != -1);
        }

        app.MapGet("/api/ag/franchise/pending", async (HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            var orders = await db.Set<LotOrder>().AsNoTracking()
                .Where(o => EF.Property<Guid?>(o, "PlayerId") == me.Id
                            && o.OrderType == OrderType.Lot
                            && o.OrderState == OrderState.Pending
                            && o.TransmissionStatus == TransmissionStatus.Received)
                .OrderBy(o => o.Id).Take(10).ToListAsync();
            var snuids = orders.Select(o => int.TryParse(o.SenderId, out var s) ? s : -99).Distinct().ToList();
            var names = await db.Set<Player>().AsNoTracking().Where(p => snuids.Contains(p.Snuid))
                .Select(p => new { p.Snuid, p.Username }).ToListAsync();
            var list = orders.Select(o =>
            {
                var n = names.FirstOrDefault(x => x.Snuid.ToString() == o.SenderId)?.Username;
                return new
                {
                    senderId = o.SenderId,
                    lotId = o.LotId,
                    business = o.ResourceType,
                    franchise = o.OrderResourceName,
                    item = CommunityService.ItemInfo(o.ResourceType),
                    from = n is null ? null : CommunityService.Who(n)
                };
            }).Where(x => x.from is not null).ToList();
            return Results.Json(list);
        });

        app.MapPost("/api/ag/franchise/accept", async (ActBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u, CancellationToken ct) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            if (!int.TryParse(b.SenderId, out var sid)) return Results.BadRequest();
            try
            {
                await new AcceptOrder(db).HandlePacket(new AcceptOrderRequest { SenderId = sid, LotId = b.LotId }, me.Id, ct);
                return Results.Ok();
            }
            catch (InvalidOperationException ex) when (ex.Message == "nolot")
            {
                return Results.Json(new { error = "nolot" }, statusCode: 400);
            }
            catch (Exception ex)
            {
                MissingHandlers.RecordError("ag.franchise.accept", $"{b.SenderId}/{b.LotId}", ex);
                return Results.Json(new { error = "fail" }, statusCode: 400);
            }
        });

        app.MapPost("/api/ag/franchise/deny", async (ActBody b, HttpContext h, CityVilleDbContext db, UserManager<ApplicationUser> u, CancellationToken ct) =>
        {
            var me = await Me(h, db, u);
            if (me is null) return Results.Unauthorized();
            try
            {
                await new DenyOrder(db).HandlePacket(new DenyOrderRequest { Order = new PlaceOrderParams { SenderId = b.SenderId, LotId = b.LotId } }, me.Id, ct);
                return Results.Ok();
            }
            catch (Exception ex)
            {
                MissingHandlers.RecordError("ag.franchise.deny", $"{b.SenderId}/{b.LotId}", ex);
                return Results.Json(new { error = "fail" }, statusCode: 400);
            }
        });
    }
}
