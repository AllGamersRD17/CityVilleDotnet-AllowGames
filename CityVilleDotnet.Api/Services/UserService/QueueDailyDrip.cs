using CityVilleDotnet.Api.Common.Amf;
using CityVilleDotnet.Api.Features.Gateway.Endpoint;
using FluorineFx;

namespace CityVilleDotnet.Api.Services.UserService;

// El juego avisa al entrar que quiere el regalo diario por goteo (ej. "mystery").
// En el original lo mandaba Zynga por Facebook; aqui los regalos diarios ya los da el
// bono diario de Allow Games, asi que solo respondemos que todo bien.
public class QueueDailyDrip : AmfService
{
    public override Task<ASObject> HandlePacket(object[] @params, Guid playerId, CancellationToken cancellationToken)
    {
        return Task.FromResult(GatewayService.CreateEmptyResponse());
    }
}
