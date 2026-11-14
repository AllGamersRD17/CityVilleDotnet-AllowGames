using System.Globalization;

namespace CityVilleDotnet.Api.Pages.Account;

// Allow Games: textos de las páginas de contraseña en los idiomas del sitio.
public static class AgText
{
    private static readonly Dictionary<string, Dictionary<string, string>> T = new()
    {
        ["es"] = new()
        {
            ["SetTitle"] = "Ajustes", ["SetQuality"] = "Calidad del juego", ["SetQualityHelp"] = "Si tu computadora o celular es lento, usa Baja: el juego corre más fluido.", ["QLow"] = "Baja", ["QMed"] = "Media", ["QHigh"] = "Alta", ["SetSounds"] = "Sonidos de la Comunidad", ["SndMsg"] = "Mensajes privados", ["SndReq"] = "Solicitudes de amistad y ayudas", ["SndChat"] = "Chat general", ["SetNotes"] = "Avisos", ["NtMsg"] = "Mensajes privados nuevos", ["NtReq"] = "Solicitudes de amistad", ["NtHelp"] = "Cuando alguien me ayuda en el muro", ["NtDaily"] = "Ventana del bono diario (el bono se cobra igual)", ["SetWall"] = "¿Quién puede ayudarme en el muro?", ["WAll"] = "Todos", ["WFriends"] = "Solo mis amigos", ["WNone"] = "Nadie", ["SetBlocked"] = "Bloqueados", ["NoBlocked"] = "No has bloqueado a nadie.", ["Unblock"] = "Desbloquear", ["SetAccount"] = "Mi cuenta", ["Joined"] = "Juegas desde", ["Level"] = "Nivel", ["Friends"] = "Amigos", ["Delete"] = "Borrar mi cuenta", ["DeleteHelp"] = "Se borra tu ciudad, tus amigos y todo tu progreso. No se puede deshacer.", ["DeleteConfirm"] = "Escribe tu nombre de usuario para confirmar", ["DeleteBtn"] = "Borrar mi cuenta para siempre", ["DeleteBadName"] = "El nombre de usuario no coincide.", ["DeleteFail"] = "No se pudo borrar la cuenta. Escríbenos en Soporte y lo hacemos nosotros.", ["Deleted"] = "Tu cuenta fue borrada. ¡Gracias por jugar!",
            ["PrivTitle"] = "Privacidad", ["PrivMsg"] = "Nadie me puede escribir mensajes privados", ["PrivAdd"] = "Nadie me puede agregar como amigo", ["PrivSaved"] = "Guardado",
            ["ResetTitle"] = "Cambiar contraseña", ["ResetHelp"] = "Pídele un código a un administrador en el Discord de CityVille Revived. El código dura poco y sirve una sola vez.",
            ["User"] = "Usuario", ["Code"] = "Código", ["NewPass"] = "Contraseña nueva", ["Confirm"] = "Repite la contraseña", ["Save"] = "Guardar contraseña",
            ["BadCode"] = "El código no es válido o ya venció. Pide uno nuevo.", ["Mismatch"] = "Las contraseñas no son iguales.", ["Short"] = "La contraseña necesita 6 caracteres o más.",
            ["Forgot"] = "¿Olvidaste tu contraseña?", ["ChangeTitle"] = "Cambiar mi contraseña", ["Current"] = "Contraseña actual", ["Changed"] = "¡Listo! Tu contraseña se cambió.",
            ["WrongCurrent"] = "La contraseña actual no es correcta.", ["Back"] = "Volver al juego",
        },
        ["en"] = new()
        {
            ["SetTitle"] = "Settings", ["SetQuality"] = "Game quality", ["SetQualityHelp"] = "If your computer or phone is slow, choose Low: the game runs smoother.", ["QLow"] = "Low", ["QMed"] = "Medium", ["QHigh"] = "High", ["SetSounds"] = "Community sounds", ["SndMsg"] = "Private messages", ["SndReq"] = "Friend requests and help", ["SndChat"] = "General chat", ["SetNotes"] = "Notifications", ["NtMsg"] = "New private messages", ["NtReq"] = "Friend requests", ["NtHelp"] = "When someone helps me on the wall", ["NtDaily"] = "Daily bonus window (you still get the bonus)", ["SetWall"] = "Who can help me on the wall?", ["WAll"] = "Everyone", ["WFriends"] = "Only my friends", ["WNone"] = "Nobody", ["SetBlocked"] = "Blocked", ["NoBlocked"] = "You haven't blocked anyone.", ["Unblock"] = "Unblock", ["SetAccount"] = "My account", ["Joined"] = "Playing since", ["Level"] = "Level", ["Friends"] = "Friends", ["Delete"] = "Delete my account", ["DeleteHelp"] = "Your city, friends and all progress will be deleted. This can't be undone.", ["DeleteConfirm"] = "Type your username to confirm", ["DeleteBtn"] = "Delete my account forever", ["DeleteBadName"] = "The username doesn't match.", ["DeleteFail"] = "The account could not be deleted. Write to Support and we'll do it.", ["Deleted"] = "Your account was deleted. Thanks for playing!",
            ["PrivTitle"] = "Privacy", ["PrivMsg"] = "Nobody can send me private messages", ["PrivAdd"] = "Nobody can add me as a friend", ["PrivSaved"] = "Saved",
            ["ResetTitle"] = "Change password", ["ResetHelp"] = "Ask an admin for a code on the CityVille Revived Discord. The code expires soon and works only once.",
            ["User"] = "Username", ["Code"] = "Code", ["NewPass"] = "New password", ["Confirm"] = "Repeat password", ["Save"] = "Save password",
            ["BadCode"] = "The code is not valid or has expired. Ask for a new one.", ["Mismatch"] = "Passwords don't match.", ["Short"] = "Password needs 6 or more characters.",
            ["Forgot"] = "Forgot your password?", ["ChangeTitle"] = "Change my password", ["Current"] = "Current password", ["Changed"] = "Done! Your password was changed.",
            ["WrongCurrent"] = "Current password is not correct.", ["Back"] = "Back to the game",
        },
        ["fr"] = new()
        {
            ["SetTitle"] = "Paramètres", ["SetQuality"] = "Qualité du jeu", ["SetQualityHelp"] = "Si ton ordinateur ou téléphone est lent, choisis Basse : le jeu sera plus fluide.", ["QLow"] = "Basse", ["QMed"] = "Moyenne", ["QHigh"] = "Haute", ["SetSounds"] = "Sons de la Communauté", ["SndMsg"] = "Messages privés", ["SndReq"] = "Demandes d'ami et aides", ["SndChat"] = "Chat général", ["SetNotes"] = "Notifications", ["NtMsg"] = "Nouveaux messages privés", ["NtReq"] = "Demandes d'ami", ["NtHelp"] = "Quand quelqu'un m'aide sur le mur", ["NtDaily"] = "Fenêtre du bonus quotidien (le bonus est quand même reçu)", ["SetWall"] = "Qui peut m'aider sur le mur ?", ["WAll"] = "Tout le monde", ["WFriends"] = "Seulement mes amis", ["WNone"] = "Personne", ["SetBlocked"] = "Bloqués", ["NoBlocked"] = "Tu n'as bloqué personne.", ["Unblock"] = "Débloquer", ["SetAccount"] = "Mon compte", ["Joined"] = "Joue depuis", ["Level"] = "Niveau", ["Friends"] = "Amis", ["Delete"] = "Supprimer mon compte", ["DeleteHelp"] = "Ta ville, tes amis et toute ta progression seront supprimés. Impossible d'annuler.", ["DeleteConfirm"] = "Écris ton pseudo pour confirmer", ["DeleteBtn"] = "Supprimer mon compte pour toujours", ["DeleteBadName"] = "Le pseudo ne correspond pas.", ["DeleteFail"] = "Impossible de supprimer le compte. Écris au Support et on s'en occupe.", ["Deleted"] = "Ton compte a été supprimé. Merci d'avoir joué !",
            ["PrivTitle"] = "Confidentialité", ["PrivMsg"] = "Personne ne peut m'envoyer de messages privés", ["PrivAdd"] = "Personne ne peut m'ajouter en ami", ["PrivSaved"] = "Enregistré",
            ["ResetTitle"] = "Changer le mot de passe", ["ResetHelp"] = "Demande un code à un admin sur le Discord de CityVille Revived. Le code expire vite et ne sert qu'une fois.",
            ["User"] = "Pseudo", ["Code"] = "Code", ["NewPass"] = "Nouveau mot de passe", ["Confirm"] = "Répète le mot de passe", ["Save"] = "Enregistrer",
            ["BadCode"] = "Code invalide ou expiré. Demandes-en un nouveau.", ["Mismatch"] = "Les mots de passe ne sont pas identiques.", ["Short"] = "Il faut 6 caractères ou plus.",
            ["Forgot"] = "Mot de passe oublié ?", ["ChangeTitle"] = "Changer mon mot de passe", ["Current"] = "Mot de passe actuel", ["Changed"] = "C'est fait ! Mot de passe changé.",
            ["WrongCurrent"] = "Le mot de passe actuel est incorrect.", ["Back"] = "Retour au jeu",
        },
        ["pt"] = new()
        {
            ["SetTitle"] = "Configurações", ["SetQuality"] = "Qualidade do jogo", ["SetQualityHelp"] = "Se seu computador ou celular é lento, use Baixa: o jogo roda mais leve.", ["QLow"] = "Baixa", ["QMed"] = "Média", ["QHigh"] = "Alta", ["SetSounds"] = "Sons da Comunidade", ["SndMsg"] = "Mensagens privadas", ["SndReq"] = "Pedidos de amizade e ajudas", ["SndChat"] = "Chat geral", ["SetNotes"] = "Avisos", ["NtMsg"] = "Novas mensagens privadas", ["NtReq"] = "Pedidos de amizade", ["NtHelp"] = "Quando alguém me ajuda no mural", ["NtDaily"] = "Janela do bônus diário (o bônus é recebido igual)", ["SetWall"] = "Quem pode me ajudar no mural?", ["WAll"] = "Todos", ["WFriends"] = "Só meus amigos", ["WNone"] = "Ninguém", ["SetBlocked"] = "Bloqueados", ["NoBlocked"] = "Você não bloqueou ninguém.", ["Unblock"] = "Desbloquear", ["SetAccount"] = "Minha conta", ["Joined"] = "Joga desde", ["Level"] = "Nível", ["Friends"] = "Amigos", ["Delete"] = "Apagar minha conta", ["DeleteHelp"] = "Sua cidade, amigos e todo o progresso serão apagados. Não dá para desfazer.", ["DeleteConfirm"] = "Digite seu nome de usuário para confirmar", ["DeleteBtn"] = "Apagar minha conta para sempre", ["DeleteBadName"] = "O nome de usuário não confere.", ["DeleteFail"] = "Não foi possível apagar a conta. Escreva no Suporte e nós fazemos.", ["Deleted"] = "Sua conta foi apagada. Obrigado por jogar!",
            ["PrivTitle"] = "Privacidade", ["PrivMsg"] = "Ninguém pode me mandar mensagens privadas", ["PrivAdd"] = "Ninguém pode me adicionar como amigo", ["PrivSaved"] = "Salvo",
            ["ResetTitle"] = "Trocar senha", ["ResetHelp"] = "Peça um código a um admin no Discord do CityVille Revived. O código vence rápido e só serve uma vez.",
            ["User"] = "Usuário", ["Code"] = "Código", ["NewPass"] = "Senha nova", ["Confirm"] = "Repita a senha", ["Save"] = "Salvar senha",
            ["BadCode"] = "Código inválido ou vencido. Peça um novo.", ["Mismatch"] = "As senhas não são iguais.", ["Short"] = "A senha precisa de 6 caracteres ou mais.",
            ["Forgot"] = "Esqueceu a senha?", ["ChangeTitle"] = "Trocar minha senha", ["Current"] = "Senha atual", ["Changed"] = "Pronto! Sua senha foi trocada.",
            ["WrongCurrent"] = "A senha atual está errada.", ["Back"] = "Voltar ao jogo",
        },
        ["it"] = new()
        {
            ["SetTitle"] = "Impostazioni", ["SetQuality"] = "Qualità del gioco", ["SetQualityHelp"] = "Se il tuo computer o telefono è lento, scegli Bassa: il gioco sarà più fluido.", ["QLow"] = "Bassa", ["QMed"] = "Media", ["QHigh"] = "Alta", ["SetSounds"] = "Suoni della Comunità", ["SndMsg"] = "Messaggi privati", ["SndReq"] = "Richieste di amicizia e aiuti", ["SndChat"] = "Chat generale", ["SetNotes"] = "Avvisi", ["NtMsg"] = "Nuovi messaggi privati", ["NtReq"] = "Richieste di amicizia", ["NtHelp"] = "Quando qualcuno mi aiuta in bacheca", ["NtDaily"] = "Finestra del bonus giornaliero (il bonus si riceve comunque)", ["SetWall"] = "Chi può aiutarmi in bacheca?", ["WAll"] = "Tutti", ["WFriends"] = "Solo i miei amici", ["WNone"] = "Nessuno", ["SetBlocked"] = "Bloccati", ["NoBlocked"] = "Non hai bloccato nessuno.", ["Unblock"] = "Sblocca", ["SetAccount"] = "Il mio account", ["Joined"] = "Gioca dal", ["Level"] = "Livello", ["Friends"] = "Amici", ["Delete"] = "Elimina il mio account", ["DeleteHelp"] = "La tua città, gli amici e tutti i progressi verranno eliminati. Non si può annullare.", ["DeleteConfirm"] = "Scrivi il tuo nome utente per confermare", ["DeleteBtn"] = "Elimina il mio account per sempre", ["DeleteBadName"] = "Il nome utente non corrisponde.", ["DeleteFail"] = "Impossibile eliminare l'account. Scrivi al Supporto e lo facciamo noi.", ["Deleted"] = "Il tuo account è stato eliminato. Grazie per aver giocato!",
            ["PrivTitle"] = "Privacy", ["PrivMsg"] = "Nessuno può scrivermi messaggi privati", ["PrivAdd"] = "Nessuno può aggiungermi come amico", ["PrivSaved"] = "Salvato",
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
