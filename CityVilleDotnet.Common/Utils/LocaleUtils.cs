namespace CityVilleDotnet.Common.Utils;

public static class LocaleUtils
{
    public static readonly List<string> SupportedLocales = ["en-US", "es-ES", "fr-FR"];
    // Allow Games: solo los idiomas que tienen su archivo de textos del juego (lang/locale_xx_XX.swf)
    public static readonly List<string> GameLocales = ["en_US", "es_ES", "fr_FR", "it_IT"];

    // Idioma del juego segun el navegador/PC del jugador (Accept-Language). Portugues usa espanol (el mas cercano).
    public static string FromAcceptLanguage(string? header)
    {
        foreach (var part in (header ?? "").Split(','))
        {
            var lang = part.Split(';')[0].Trim().ToLowerInvariant();
            if (lang.Length < 2) continue;
            switch (lang[..2])
            {
                case "es": case "pt": return "es_ES";
                case "en": return "en_US";
                case "fr": return "fr_FR";
                case "it": return "it_IT";
            }
        }
        return "en_US";
    }
}
