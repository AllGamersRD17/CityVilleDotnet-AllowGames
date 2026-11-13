using System.Globalization;

namespace CityVilleDotnet.Api.Pages.Account;

// Allow Games: textos de las páginas de contraseña en los idiomas del sitio.
public static class AgText
{
    private static readonly Dictionary<string, Dictionary<string, string>> T = new()
    {
        ["es"] = new()
        {
            ["ResetTitle"] = "Cambiar contraseña", ["ResetHelp"] = "Pídele un código a un administrador en el Discord de CityVille Revived. El código dura poco y sirve una sola vez.",
            ["User"] = "Usuario", ["Code"] = "Código", ["NewPass"] = "Contraseña nueva", ["Confirm"] = "Repite la contraseña", ["Save"] = "Guardar contraseña",
            ["BadCode"] = "El código no es válido o ya venció. Pide uno nuevo.", ["Mismatch"] = "Las contraseñas no son iguales.", ["Short"] = "La contraseña necesita 6 caracteres o más.",
            ["Forgot"] = "¿Olvidaste tu contraseña?", ["ChangeTitle"] = "Cambiar mi contraseña", ["Current"] = "Contraseña actual", ["Changed"] = "¡Listo! Tu contraseña se cambió.",
            ["WrongCurrent"] = "La contraseña actual no es correcta.", ["Back"] = "Volver al juego",
        },
        ["en"] = new()
        {
            ["ResetTitle"] = "Change password", ["ResetHelp"] = "Ask an admin for a code on the CityVille Revived Discord. The code expires soon and works only once.",
            ["User"] = "Username", ["Code"] = "Code", ["NewPass"] = "New password", ["Confirm"] = "Repeat password", ["Save"] = "Save password",
            ["BadCode"] = "The code is not valid or has expired. Ask for a new one.", ["Mismatch"] = "Passwords don't match.", ["Short"] = "Password needs 6 or more characters.",
            ["Forgot"] = "Forgot your password?", ["ChangeTitle"] = "Change my password", ["Current"] = "Current password", ["Changed"] = "Done! Your password was changed.",
            ["WrongCurrent"] = "Current password is not correct.", ["Back"] = "Back to the game",
        },
        ["fr"] = new()
        {
            ["ResetTitle"] = "Changer le mot de passe", ["ResetHelp"] = "Demande un code à un admin sur le Discord de CityVille Revived. Le code expire vite et ne sert qu'une fois.",
            ["User"] = "Pseudo", ["Code"] = "Code", ["NewPass"] = "Nouveau mot de passe", ["Confirm"] = "Répète le mot de passe", ["Save"] = "Enregistrer",
            ["BadCode"] = "Code invalide ou expiré. Demandes-en un nouveau.", ["Mismatch"] = "Les mots de passe ne sont pas identiques.", ["Short"] = "Il faut 6 caractères ou plus.",
            ["Forgot"] = "Mot de passe oublié ?", ["ChangeTitle"] = "Changer mon mot de passe", ["Current"] = "Mot de passe actuel", ["Changed"] = "C'est fait ! Mot de passe changé.",
            ["WrongCurrent"] = "Le mot de passe actuel est incorrect.", ["Back"] = "Retour au jeu",
        },
        ["pt"] = new()
        {
            ["ResetTitle"] = "Trocar senha", ["ResetHelp"] = "Peça um código a um admin no Discord do CityVille Revived. O código vence rápido e só serve uma vez.",
            ["User"] = "Usuário", ["Code"] = "Código", ["NewPass"] = "Senha nova", ["Confirm"] = "Repita a senha", ["Save"] = "Salvar senha",
            ["BadCode"] = "Código inválido ou vencido. Peça um novo.", ["Mismatch"] = "As senhas não são iguais.", ["Short"] = "A senha precisa de 6 caracteres ou mais.",
            ["Forgot"] = "Esqueceu a senha?", ["ChangeTitle"] = "Trocar minha senha", ["Current"] = "Senha atual", ["Changed"] = "Pronto! Sua senha foi trocada.",
            ["WrongCurrent"] = "A senha atual está errada.", ["Back"] = "Voltar ao jogo",
        },
        ["it"] = new()
        {
            ["ResetTitle"] = "Cambia password", ["ResetHelp"] = "Chiedi un codice a un admin sul Discord di CityVille Revived. Il codice scade presto e vale una volta sola.",
            ["User"] = "Utente", ["Code"] = "Codice", ["NewPass"] = "Nuova password", ["Confirm"] = "Ripeti la password", ["Save"] = "Salva password",
            ["BadCode"] = "Codice non valido o scaduto. Chiedine uno nuovo.", ["Mismatch"] = "Le password non coincidono.", ["Short"] = "Servono almeno 6 caratteri.",
            ["Forgot"] = "Password dimenticata?", ["ChangeTitle"] = "Cambia la mia password", ["Current"] = "Password attuale", ["Changed"] = "Fatto! Password cambiata.",
            ["WrongCurrent"] = "La password attuale non è corretta.", ["Back"] = "Torna al gioco",
        },
    };

    public static string Get(string key)
    {
        var lang = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
        return (T.TryGetValue(lang, out var d) && d.TryGetValue(key, out var v)) ? v : T["es"].GetValueOrDefault(key, key);
    }
}
