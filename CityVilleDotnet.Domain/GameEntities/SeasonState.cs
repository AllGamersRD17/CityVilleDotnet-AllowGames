namespace CityVilleDotnet.Domain.GameEntities;

// Allow Games: temporadas globales (nieve, halloween, otoño...) que se suman a todas las ciudades.
public static class SeasonState
{
    private static volatile string[] _collections = [];

    public static string[] Collections
    {
        get => _collections;
        set => _collections = value ?? [];
    }
}
