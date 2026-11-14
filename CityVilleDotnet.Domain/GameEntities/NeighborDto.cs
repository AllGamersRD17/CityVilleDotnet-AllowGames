using System.Text.Json.Serialization;
using CityVilleDotnet.Common.Utils;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Domain.Enums;

namespace CityVilleDotnet.Domain.GameEntities;

public class NeighborDto
{
    [JsonPropertyName("uid")] public required string Uid { get; set; }
    [JsonPropertyName("fake")] public int? Fake { get; set; }
    [JsonPropertyName("empty")] public bool Empty { get; set; } = false;

    [JsonPropertyName("level")] public int Level { get; set; }
    [JsonPropertyName("gold")] public int Gold { get; set; }
    [JsonPropertyName("xp")] public int Xp { get; set; }
    [JsonPropertyName("cityname")] public required string CityName { get; set; }
    [JsonPropertyName("socialLevel")] public int SocialLevel { get; set; }

    [JsonPropertyName("firstTimeVisit")] public bool FirstTimeVisit { get; set; }
    [JsonPropertyName("rollCall")] public bool RollCall { get; set; }
    [JsonPropertyName("collect")] public bool Collect { get; set; }
    [JsonPropertyName("nonSNNeighbor")] public bool NonSNNeighbor { get; set; }
    [JsonPropertyName("isSubscriber")] public bool IsSubscriber { get; set; }

    [JsonPropertyName("energyLeft")] public int EnergyLeft { get; set; }
    [JsonPropertyName("badges")] public List<string> Badges { get; set; } = [];

    [JsonPropertyName("lastLoginTimestamp")]
    public int LastLoginTimestamp { get; set; }

    [JsonPropertyName("helpRequests")] public int HelpRequests { get; set; }

    [JsonPropertyName("playerClassType")] public int PlayerClassType { get; set; }

    [JsonPropertyName("zid")] public int Zid { get; set; }
    [JsonPropertyName("snuid")] public int Snuid { get; set; }
    [JsonPropertyName("snid")] public int Snid { get; set; }
}

public static class NeighborDtoMapper
{
    // Allow Games: espacios vacios ("Add friend") con nivel 0. Asi el juego ordena a los amigos
    // pegados a tu foto y deja los espacios vacios al final, en vez de mezclarlos.
    public const int MinFriendSlots = 6;
    public static List<NeighborDto> WithEmptySlots(this List<NeighborDto> neighbors)
    {
        var real = neighbors.Count(n => n.Fake is null);
        for (var i = real; i < MinFriendSlots; i++)
            neighbors.Add(new NeighborDto { Uid = (-2 - i).ToString(), Fake = 1, Empty = true, Level = 0, Xp = 0, CityName = string.Empty });
        return neighbors;
    }

    public static NeighborDto ToNeighborDto(this Friend model)
    {
        var friend = model.GetFriend();
        
        return new NeighborDto
        {
            Uid = friend.Snuid.ToString(),
            Zid = friend.Snuid,
            Snuid = friend.Snuid,
            Snid = friend.Snuid,
            Level = friend.Level,

            Gold = friend.Gold,
            Xp = friend.Xp,
            SocialLevel = friend.SocialLevel,
            CityName = friend.GetWorldByType(WorldType.Main)?.WorldName ?? "Unknown city",

            FirstTimeVisit = false,
            RollCall = false,
            Collect = false,
            NonSNNeighbor = false,
            IsSubscriber = false,

            EnergyLeft = model.GetAvailableEnergy(ServerUtils.GetCurrentTime()),
            LastLoginTimestamp = 0,
            HelpRequests = 0,
            PlayerClassType = -1
        };
    }
}