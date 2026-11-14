// CityVille Revived - Allow Games: Comunidad dentro del juego (muro publico, chat general y mensajes privados)
(function () {
  var P = window.AG_PLAYER || {};
  var lang = (P.locale || document.documentElement.lang || navigator.language || 'es').slice(0, 2);
  var L = {
    es: { title: 'Comunidad', wall: 'Muro', chat: 'Chat', dm: 'Privados', post: 'Publicar', wallPh: '¿Qué está pasando en tu ciudad?', send: 'Enviar', chatPh: 'Escribe un mensaje…', comment: 'Comentar', commentPh: 'Escribe un comentario…', like: 'Me gusta', more: 'Ver más', empty: 'Todavía no hay nada aquí. ¡Sé el primero!', search: 'Buscar alcalde…', noDm: 'No tienes mensajes privados. Busca a un alcalde para escribirle.', back: 'Volver', block: 'Bloquear', unblock: 'Desbloquear', blocked: 'No puedes escribirle a este alcalde.', report: 'Reportar', reported: 'Gracias, lo revisaremos.', del: 'Borrar', confirmDel: '¿Borrar esto?', slow: 'Espera un momento antes de enviar otra vez.', login: 'Inicia sesión para usar la comunidad.', rules: 'Sé amable. No compartas datos personales.', lvl: 'Nv.', now: 'ahora', min: 'min', h: 'h', d: 'd', msg: 'Mensaje', close: 'Cerrar', online: 'En línea', busy: 'No molestar', invisible: 'Invisible', offline: 'Desconectado', seenAgo: 'Visto hace', contacts: 'Alcaldes', convs: 'Conversaciones', photo: 'Foto', photoErr: 'No se pudo subir la foto.', newMsg: 'Nuevo mensaje', status: 'Estado', sup: 'Soporte', newReq: 'Nueva solicitud', myReqs: 'Mis solicitudes', allReqs: 'Todas (admin)', noReqs: '¿Algo no funciona o tienes una idea? Crea una solicitud y el equipo te responde aquí.', kBug: 'Bug / error', kAyuda: 'Ayuda', kSug: 'Sugerencia', kCuenta: 'Mi cuenta', kOtro: 'Otro', reqTitle: 'Título corto (ej. No puedo cosechar)', reqText: 'Cuéntanos qué pasó, qué estabas haciendo y desde qué aparato juegas…', sendReq: 'Enviar solicitud', sent: '¡Enviado! Te responderemos aquí.', reply: 'Responder', team: 'Equipo Allow Games', closeReq: 'Cerrar solicitud', stAbierto: 'Abierta', stEn_progreso: 'En revisión', stResuelto: 'Resuelta', stCerrado: 'Cerrada', all: 'Todas', attach: 'Adjuntar captura', fromGame: 'Compartido desde el juego', helpBtn: '¡Ayudar!', helpedOk: '¡Gracias por ayudar! Ganaste', helpedAlready: 'Ya ayudaste aquí', full: 'Ya recibió toda la ayuda', helpers: 'ayudaron', sendItem: 'Enviar', wishTitle: 'Lista de deseos', shareTitle: 'Compartir en la Comunidad', shareBtn: 'Compartir', cancel: 'Cancelar', shareWait: 'Ya compartiste hace poco. Inténtalo más tarde.', wishEmpty: 'Tu lista de deseos está vacía.', shared: '¡Publicado en el muro!', coins: 'monedas', reloadNote: 'Se verá al recargar el juego.', old: 'Esta publicación ya expiró.', sharedFrom: 'compartió desde CityVille Revived', needs: 'necesita estos objetos', collection: 'Colección', viaGame: 'CityVille Revived · Allow Games' },
    en: { title: 'Community', wall: 'Wall', chat: 'Chat', dm: 'Private', post: 'Post', wallPh: "What's happening in your city?", send: 'Send', chatPh: 'Type a message…', comment: 'Comment', commentPh: 'Write a comment…', like: 'Like', more: 'Load more', empty: 'Nothing here yet. Be the first!', search: 'Search mayor…', noDm: 'No private messages yet. Search a mayor to write to.', back: 'Back', block: 'Block', unblock: 'Unblock', blocked: "You can't message this mayor.", report: 'Report', reported: "Thanks, we'll review it.", del: 'Delete', confirmDel: 'Delete this?', slow: 'Wait a moment before sending again.', login: 'Log in to use the community.', rules: "Be kind. Don't share personal info.", lvl: 'Lv.', now: 'now', min: 'min', h: 'h', d: 'd', msg: 'Message', close: 'Close', online: 'Online', busy: 'Do not disturb', invisible: 'Invisible', offline: 'Offline', seenAgo: 'Seen', contacts: 'Mayors', convs: 'Conversations', photo: 'Photo', photoErr: 'Could not upload the photo.', newMsg: 'New message', status: 'Status', sup: 'Support', newReq: 'New request', myReqs: 'My requests', allReqs: 'All (admin)', noReqs: 'Something broken or have an idea? Create a request and the team will reply here.', kBug: 'Bug / error', kAyuda: 'Help', kSug: 'Suggestion', kCuenta: 'My account', kOtro: 'Other', reqTitle: "Short title (e.g. I can't harvest)", reqText: 'Tell us what happened, what you were doing and which device you play on…', sendReq: 'Send request', sent: "Sent! We'll reply here.", reply: 'Reply', team: 'Allow Games Team', closeReq: 'Close request', stAbierto: 'Open', stEn_progreso: 'In review', stResuelto: 'Solved', stCerrado: 'Closed', all: 'All', attach: 'Attach screenshot', fromGame: 'Shared from the game', helpBtn: 'Help!', helpedOk: 'Thanks for helping! You earned', helpedAlready: 'You already helped here', full: 'Already got all the help', helpers: 'helped', sendItem: 'Send', wishTitle: 'Wishlist', shareTitle: 'Share to Community', shareBtn: 'Share', cancel: 'Cancel', shareWait: 'You shared recently. Try again later.', wishEmpty: 'Your wishlist is empty.', shared: 'Posted on the wall!', coins: 'coins', reloadNote: 'It will show when the game reloads.', old: 'This post has expired.', sharedFrom: 'shared from CityVille Revived', needs: 'needs these items', collection: 'Collection', viaGame: 'CityVille Revived · Allow Games' },
    pt: { title: 'Comunidade', wall: 'Mural', chat: 'Chat', dm: 'Privado', post: 'Publicar', wallPh: 'O que está acontecendo na sua cidade?', send: 'Enviar', chatPh: 'Escreva uma mensagem…', comment: 'Comentar', commentPh: 'Escreva um comentário…', like: 'Curtir', more: 'Ver mais', empty: 'Nada aqui ainda. Seja o primeiro!', search: 'Buscar prefeito…', noDm: 'Sem mensagens privadas. Busque um prefeito para escrever.', back: 'Voltar', block: 'Bloquear', unblock: 'Desbloquear', blocked: 'Você não pode escrever para este prefeito.', report: 'Denunciar', reported: 'Obrigado, vamos revisar.', del: 'Apagar', confirmDel: 'Apagar isto?', slow: 'Espere um momento antes de enviar de novo.', login: 'Entre para usar a comunidade.', rules: 'Seja gentil. Não compartilhe dados pessoais.', lvl: 'Nv.', now: 'agora', min: 'min', h: 'h', d: 'd', msg: 'Mensagem', close: 'Fechar', online: 'Online', busy: 'Não perturbe', invisible: 'Invisível', offline: 'Offline', seenAgo: 'Visto há', contacts: 'Prefeitos', convs: 'Conversas', photo: 'Foto', photoErr: 'Não foi possível enviar a foto.', newMsg: 'Nova mensagem', status: 'Status', sup: 'Suporte', newReq: 'Nova solicitação', myReqs: 'Minhas solicitações', allReqs: 'Todas (admin)', noReqs: 'Algo não funciona ou tem uma ideia? Crie uma solicitação e a equipe responde aqui.', kBug: 'Bug / erro', kAyuda: 'Ajuda', kSug: 'Sugestão', kCuenta: 'Minha conta', kOtro: 'Outro', reqTitle: 'Título curto (ex. Não consigo colher)', reqText: 'Conte o que aconteceu, o que você fazia e em qual aparelho joga…', sendReq: 'Enviar', sent: 'Enviado! Responderemos aqui.', reply: 'Responder', team: 'Equipe Allow Games', closeReq: 'Fechar solicitação', stAbierto: 'Aberta', stEn_progreso: 'Em análise', stResuelto: 'Resolvida', stCerrado: 'Fechada', all: 'Todas', attach: 'Anexar captura', fromGame: 'Compartilhado do jogo', helpBtn: 'Ajudar!', helpedOk: 'Obrigado por ajudar! Você ganhou', helpedAlready: 'Você já ajudou aqui', full: 'Já recebeu toda a ajuda', helpers: 'ajudaram', sendItem: 'Enviar', wishTitle: 'Lista de desejos', shareTitle: 'Compartilhar na Comunidade', shareBtn: 'Compartilhar', cancel: 'Cancelar', shareWait: 'Você compartilhou há pouco. Tente mais tarde.', wishEmpty: 'Sua lista de desejos está vazia.', shared: 'Publicado no mural!', coins: 'moedas', reloadNote: 'Aparecerá ao recarregar o jogo.', old: 'Esta publicação expirou.', sharedFrom: 'compartilhou do CityVille Revived', needs: 'precisa destes itens', collection: 'Coleção', viaGame: 'CityVille Revived · Allow Games' },
    fr: { title: 'Communauté', wall: 'Mur', chat: 'Chat', dm: 'Privé', post: 'Publier', wallPh: 'Quoi de neuf dans ta ville ?', send: 'Envoyer', chatPh: 'Écris un message…', comment: 'Commenter', commentPh: 'Écris un commentaire…', like: "J'aime", more: 'Voir plus', empty: 'Rien ici pour le moment. Sois le premier !', search: 'Chercher un maire…', noDm: 'Aucun message privé. Cherche un maire pour lui écrire.', back: 'Retour', block: 'Bloquer', unblock: 'Débloquer', blocked: 'Tu ne peux pas écrire à ce maire.', report: 'Signaler', reported: 'Merci, nous allons vérifier.', del: 'Supprimer', confirmDel: 'Supprimer ceci ?', slow: 'Attends un instant avant de renvoyer.', login: 'Connecte-toi pour utiliser la communauté.', rules: 'Sois gentil. Ne partage pas tes infos personnelles.', lvl: 'Nv.', now: 'maintenant', min: 'min', h: 'h', d: 'j', msg: 'Message', close: 'Fermer', online: 'En ligne', busy: 'Ne pas déranger', invisible: 'Invisible', offline: 'Hors ligne', seenAgo: 'Vu il y a', contacts: 'Maires', convs: 'Conversations', photo: 'Photo', photoErr: "Impossible d'envoyer la photo.", newMsg: 'Nouveau message', status: 'Statut', sup: 'Support', newReq: 'Nouvelle demande', myReqs: 'Mes demandes', allReqs: 'Toutes (admin)', noReqs: "Un problème ou une idée ? Crée une demande et l'équipe te répondra ici.", kBug: 'Bug / erreur', kAyuda: 'Aide', kSug: 'Suggestion', kCuenta: 'Mon compte', kOtro: 'Autre', reqTitle: 'Titre court (ex. Je ne peux pas récolter)', reqText: 'Explique ce qui s\'est passé, ce que tu faisais et sur quel appareil tu joues…', sendReq: 'Envoyer', sent: 'Envoyé ! Nous répondrons ici.', reply: 'Répondre', team: 'Équipe Allow Games', closeReq: 'Fermer la demande', stAbierto: 'Ouverte', stEn_progreso: 'En cours', stResuelto: 'Résolue', stCerrado: 'Fermée', all: 'Toutes', attach: 'Joindre une capture', fromGame: 'Partagé depuis le jeu', helpBtn: 'Aider !', helpedOk: 'Merci pour ton aide ! Tu gagnes', helpedAlready: 'Tu as déjà aidé ici', full: 'Toute l\'aide a été reçue', helpers: 'ont aidé', sendItem: 'Envoyer', wishTitle: 'Liste de souhaits', shareTitle: 'Partager dans la Communauté', shareBtn: 'Partager', cancel: 'Annuler', shareWait: 'Tu as partagé récemment. Réessaie plus tard.', wishEmpty: 'Ta liste de souhaits est vide.', shared: 'Publié sur le mur !', coins: 'pièces', reloadNote: 'Visible en rechargeant le jeu.', old: 'Cette publication a expiré.', sharedFrom: 'a partagé depuis CityVille Revived', needs: 'a besoin de ces objets', collection: 'Collection', viaGame: 'CityVille Revived · Allow Games' },
    it: { title: 'Comunità', wall: 'Bacheca', chat: 'Chat', dm: 'Privati', post: 'Pubblica', wallPh: 'Cosa succede nella tua città?', send: 'Invia', chatPh: 'Scrivi un messaggio…', comment: 'Commenta', commentPh: 'Scrivi un commento…', like: 'Mi piace', more: 'Altro', empty: 'Ancora niente qui. Sii il primo!', search: 'Cerca sindaco…', noDm: 'Nessun messaggio privato. Cerca un sindaco per scrivergli.', back: 'Indietro', block: 'Blocca', unblock: 'Sblocca', blocked: 'Non puoi scrivere a questo sindaco.', report: 'Segnala', reported: 'Grazie, lo controlleremo.', del: 'Elimina', confirmDel: 'Eliminare?', slow: 'Aspetta un attimo prima di inviare di nuovo.', login: 'Accedi per usare la comunità.', rules: 'Sii gentile. Non condividere dati personali.', lvl: 'Lv.', now: 'ora', min: 'min', h: 'h', d: 'g', msg: 'Messaggio', close: 'Chiudi', online: 'Online', busy: 'Non disturbare', invisible: 'Invisibile', offline: 'Offline', seenAgo: 'Visto', contacts: 'Sindaci', convs: 'Conversazioni', photo: 'Foto', photoErr: 'Impossibile caricare la foto.', newMsg: 'Nuovo messaggio', status: 'Stato', sup: 'Supporto', newReq: 'Nuova richiesta', myReqs: 'Le mie richieste', allReqs: 'Tutte (admin)', noReqs: 'Qualcosa non va o hai un\'idea? Crea una richiesta e il team risponderà qui.', kBug: 'Bug / errore', kAyuda: 'Aiuto', kSug: 'Suggerimento', kCuenta: 'Il mio account', kOtro: 'Altro', reqTitle: 'Titolo breve (es. Non riesco a raccogliere)', reqText: 'Raccontaci cosa è successo, cosa stavi facendo e da quale dispositivo giochi…', sendReq: 'Invia', sent: 'Inviato! Ti risponderemo qui.', reply: 'Rispondi', team: 'Team Allow Games', closeReq: 'Chiudi richiesta', stAbierto: 'Aperta', stEn_progreso: 'In revisione', stResuelto: 'Risolta', stCerrado: 'Chiusa', all: 'Tutte', attach: 'Allega screenshot', fromGame: 'Condiviso dal gioco', helpBtn: 'Aiuta!', helpedOk: 'Grazie dell\'aiuto! Hai guadagnato', helpedAlready: 'Hai già aiutato qui', full: 'Ha già ricevuto tutto l\'aiuto', helpers: 'hanno aiutato', sendItem: 'Invia', wishTitle: 'Lista dei desideri', shareTitle: 'Condividi nella Comunità', shareBtn: 'Condividi', cancel: 'Annulla', shareWait: 'Hai condiviso da poco. Riprova più tardi.', wishEmpty: 'La tua lista dei desideri è vuota.', shared: 'Pubblicato in bacheca!', coins: 'monete', reloadNote: 'Si vedrà ricaricando il gioco.', old: 'Questo post è scaduto.', sharedFrom: 'ha condiviso da CityVille Revived', needs: 'ha bisogno di questi oggetti', collection: 'Collezione', viaGame: 'CityVille Revived · Allow Games' },
    de: { title: 'Community', wall: 'Pinnwand', chat: 'Chat', dm: 'Privat', post: 'Posten', wallPh: 'Was passiert in deiner Stadt?', send: 'Senden', chatPh: 'Nachricht schreiben…', comment: 'Kommentieren', commentPh: 'Kommentar schreiben…', like: 'Gefällt mir', more: 'Mehr laden', empty: 'Noch nichts hier. Sei der Erste!', search: 'Bürgermeister suchen…', noDm: 'Keine privaten Nachrichten. Suche einen Bürgermeister.', back: 'Zurück', block: 'Blockieren', unblock: 'Entsperren', blocked: 'Du kannst diesem Bürgermeister nicht schreiben.', report: 'Melden', reported: 'Danke, wir prüfen das.', del: 'Löschen', confirmDel: 'Löschen?', slow: 'Warte kurz, bevor du erneut sendest.', login: 'Melde dich an, um die Community zu nutzen.', rules: 'Sei nett. Teile keine persönlichen Daten.', lvl: 'Lv.', now: 'jetzt', min: 'Min', h: 'Std', d: 'T', msg: 'Nachricht', close: 'Schließen', online: 'Online', busy: 'Nicht stören', invisible: 'Unsichtbar', offline: 'Offline', seenAgo: 'Gesehen vor', contacts: 'Bürgermeister', convs: 'Unterhaltungen', photo: 'Foto', photoErr: 'Foto konnte nicht hochgeladen werden.', newMsg: 'Neue Nachricht', status: 'Status', sup: 'Support', newReq: 'Neue Anfrage', myReqs: 'Meine Anfragen', allReqs: 'Alle (Admin)', noReqs: 'Etwas kaputt oder eine Idee? Erstelle eine Anfrage, das Team antwortet hier.', kBug: 'Bug / Fehler', kAyuda: 'Hilfe', kSug: 'Vorschlag', kCuenta: 'Mein Konto', kOtro: 'Sonstiges', reqTitle: 'Kurzer Titel (z. B. Ernten geht nicht)', reqText: 'Beschreibe, was passiert ist, was du gemacht hast und auf welchem Gerät du spielst…', sendReq: 'Senden', sent: 'Gesendet! Wir antworten hier.', reply: 'Antworten', team: 'Allow Games Team', closeReq: 'Anfrage schließen', stAbierto: 'Offen', stEn_progreso: 'In Prüfung', stResuelto: 'Gelöst', stCerrado: 'Geschlossen', all: 'Alle', attach: 'Screenshot anhängen', fromGame: 'Aus dem Spiel geteilt', helpBtn: 'Helfen!', helpedOk: 'Danke fürs Helfen! Du erhältst', helpedAlready: 'Du hast hier schon geholfen', full: 'Hat schon alle Hilfe bekommen', helpers: 'halfen', sendItem: 'Senden', wishTitle: 'Wunschliste', shareTitle: 'In der Community teilen', shareBtn: 'Teilen', cancel: 'Abbrechen', shareWait: 'Du hast gerade erst geteilt. Versuch es später.', wishEmpty: 'Deine Wunschliste ist leer.', shared: 'An der Pinnwand gepostet!', coins: 'Münzen', reloadNote: 'Wird nach dem Neuladen angezeigt.', old: 'Dieser Beitrag ist abgelaufen.', sharedFrom: 'hat aus CityVille Revived geteilt', needs: 'braucht diese Gegenstände', collection: 'Sammlung', viaGame: 'CityVille Revived · Allow Games' }
  };
  var t = L[lang] || L.es;
  // textos del panel de agregar amigos
  var FR = {
    es: { frGotHelp: 'te ayudó en el muro 🤝', helpClosed: 'Este alcalde no acepta ayuda en sus publicaciones.', helpFriends: 'Solo sus amigos pueden ayudar aquí.', fr: 'Amigos', frReqs: 'Solicitudes de amistad', frGotReq: 'te mandó una solicitud de amistad', frGotAcc: 'aceptó tu solicitud de amistad 🎉', frNewReq: 'Nueva solicitud', frNewFriend: '¡Nuevo amigo!', frAdd: 'Agregar', frTitle: 'Agregar amigos', frBy: 'Agregar por nombre de usuario', frPh: 'Escribe el usuario…', frAll: 'Agregar a todos los registrados', frAllQ: '¿Mandar solicitud de amistad a todos los alcaldes registrados?', frAllOk: 'Solicitudes enviadas', frAccepted: 'aceptadas', frSent: 'Enviada', frFriend: 'Amigos', frAccept: 'Aceptar', frPrivate: 'Privado', frNotFound: 'No existe ese usuario.', frNoAdd: 'Este alcalde no acepta solicitudes.', frSentOk: 'Solicitud enviada a', frNow: 'Ahora son amigos:', frList: 'Alcaldes registrados', frPending: 'por agregar', frReload: 'Tus vecinos nuevos salen en la barra al recargar el juego.' },
    en: { frGotHelp: 'helped you on the wall 🤝', helpClosed: "This mayor doesn't accept help on their posts.", helpFriends: 'Only their friends can help here.', fr: 'Friends', frReqs: 'Friend requests', frGotReq: 'sent you a friend request', frGotAcc: 'accepted your friend request 🎉', frNewReq: 'New request', frNewFriend: 'New friend!', frAdd: 'Add', frTitle: 'Add friends', frBy: 'Add by username', frPh: 'Type the username…', frAll: 'Add everyone registered', frAllQ: 'Send a friend request to every registered mayor?', frAllOk: 'Requests sent', frAccepted: 'accepted', frSent: 'Sent', frFriend: 'Friends', frAccept: 'Accept', frPrivate: 'Private', frNotFound: 'That user does not exist.', frNoAdd: 'This mayor does not accept requests.', frSentOk: 'Request sent to', frNow: 'You are now friends:', frList: 'Registered mayors', frPending: 'to add', frReload: 'New neighbors show in the bar when the game reloads.' },
    pt: { frGotHelp: 'te ajudou no mural 🤝', helpClosed: 'Este prefeito não aceita ajuda nas publicações.', helpFriends: 'Só os amigos podem ajudar aqui.', fr: 'Amigos', frReqs: 'Pedidos de amizade', frGotReq: 'te enviou um pedido de amizade', frGotAcc: 'aceitou seu pedido de amizade 🎉', frNewReq: 'Novo pedido', frNewFriend: 'Novo amigo!', frAdd: 'Adicionar', frTitle: 'Adicionar amigos', frBy: 'Adicionar por nome de usuário', frPh: 'Digite o usuário…', frAll: 'Adicionar todos os registrados', frAllQ: 'Enviar pedido de amizade para todos os prefeitos registrados?', frAllOk: 'Pedidos enviados', frAccepted: 'aceitos', frSent: 'Enviado', frFriend: 'Amigos', frAccept: 'Aceitar', frPrivate: 'Privado', frNotFound: 'Esse usuário não existe.', frNoAdd: 'Este prefeito não aceita pedidos.', frSentOk: 'Pedido enviado para', frNow: 'Agora são amigos:', frList: 'Prefeitos registrados', frPending: 'para adicionar', frReload: 'Os novos vizinhos aparecem na barra ao recarregar o jogo.' },
    fr: { frGotHelp: "t'a aidé sur le mur 🤝", helpClosed: "Ce maire n'accepte pas d'aide sur ses publications.", helpFriends: 'Seuls ses amis peuvent aider ici.', fr: 'Amis', frReqs: "Demandes d'ami", frGotReq: "t'a envoyé une demande d'ami", frGotAcc: "a accepté ta demande d'ami 🎉", frNewReq: 'Nouvelle demande', frNewFriend: 'Nouvel ami !', frAdd: 'Ajouter', frTitle: 'Ajouter des amis', frBy: 'Ajouter par pseudo', frPh: 'Écris le pseudo…', frAll: 'Ajouter tous les inscrits', frAllQ: 'Envoyer une demande d\'ami à tous les maires inscrits ?', frAllOk: 'Demandes envoyées', frAccepted: 'acceptées', frSent: 'Envoyée', frFriend: 'Amis', frAccept: 'Accepter', frPrivate: 'Privé', frNotFound: 'Ce pseudo n\'existe pas.', frNoAdd: 'Ce maire n\'accepte pas les demandes.', frSentOk: 'Demande envoyée à', frNow: 'Vous êtes amis :', frList: 'Maires inscrits', frPending: 'à ajouter', frReload: 'Les nouveaux voisins apparaissent dans la barre en rechargeant le jeu.' },
    it: { frGotHelp: 'ti ha aiutato in bacheca 🤝', helpClosed: 'Questo sindaco non accetta aiuto nei suoi post.', helpFriends: 'Solo i suoi amici possono aiutare qui.', fr: 'Amici', frReqs: 'Richieste di amicizia', frGotReq: 'ti ha inviato una richiesta di amicizia', frGotAcc: 'ha accettato la tua richiesta di amicizia 🎉', frNewReq: 'Nuova richiesta', frNewFriend: 'Nuovo amico!', frAdd: 'Aggiungi', frTitle: 'Aggiungi amici', frBy: 'Aggiungi per nome utente', frPh: 'Scrivi il nome utente…', frAll: 'Aggiungi tutti i registrati', frAllQ: 'Inviare una richiesta di amicizia a tutti i sindaci registrati?', frAllOk: 'Richieste inviate', frAccepted: 'accettate', frSent: 'Inviata', frFriend: 'Amici', frAccept: 'Accetta', frPrivate: 'Privato', frNotFound: 'Questo utente non esiste.', frNoAdd: 'Questo sindaco non accetta richieste.', frSentOk: 'Richiesta inviata a', frNow: 'Ora siete amici:', frList: 'Sindaci registrati', frPending: 'da aggiungere', frReload: 'I nuovi vicini appaiono nella barra ricaricando il gioco.' },
    de: { frGotHelp: 'hat dir an der Pinnwand geholfen 🤝', helpClosed: 'Dieser Bürgermeister nimmt keine Hilfe an.', helpFriends: 'Nur Freunde können hier helfen.', fr: 'Freunde', frReqs: 'Freundschaftsanfragen', frGotReq: 'hat dir eine Freundschaftsanfrage geschickt', frGotAcc: 'hat deine Freundschaftsanfrage angenommen 🎉', frNewReq: 'Neue Anfrage', frNewFriend: 'Neuer Freund!', frAdd: 'Hinzufügen', frTitle: 'Freunde hinzufügen', frBy: 'Per Benutzername hinzufügen', frPh: 'Benutzername eingeben…', frAll: 'Alle Registrierten hinzufügen', frAllQ: 'Allen registrierten Bürgermeistern eine Anfrage senden?', frAllOk: 'Anfragen gesendet', frAccepted: 'angenommen', frSent: 'Gesendet', frFriend: 'Freunde', frAccept: 'Annehmen', frPrivate: 'Privat', frNotFound: 'Diesen Benutzer gibt es nicht.', frNoAdd: 'Dieser Bürgermeister nimmt keine Anfragen an.', frSentOk: 'Anfrage gesendet an', frNow: 'Ihr seid jetzt Freunde:', frList: 'Registrierte Bürgermeister', frPending: 'hinzuzufügen', frReload: 'Neue Nachbarn erscheinen nach dem Neuladen in der Leiste.' }
  };
  var fx = FR[lang] || FR.es; for (var k in fx) t[k] = fx[k];

  var css = '#agCm{position:fixed;top:0;right:0;bottom:0;width:min(430px,100vw);z-index:99995;display:none;flex-direction:column;background:#2f8fc4;border-left:4px solid #1c6e9c;box-shadow:-8px 0 0 rgba(0,0,0,.18);font-family:CV,sans-serif;color:#21445a;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}' +
    '#agCm input,#agCm textarea{-webkit-user-select:text;user-select:text}#agNt,#agCmBtn,#agLb{-webkit-user-select:none;user-select:none}' +
    '#agCm.on{display:flex}#agCm *{box-sizing:border-box}' +
    '#agCm .hd{display:flex;align-items:center;gap:8px;padding:10px 10px 6px}' +
    '#agCm h2{flex:1;margin:0;color:#fff;font-size:24px;text-shadow:-2px -2px 0 #073b57,2px -2px 0 #073b57,-2px 2px 0 #073b57,2px 2px 0 #073b57}' +
    '#agCm .x{width:32px;height:32px;border:0;background:url(/ag/daily/x.png) center/contain no-repeat;cursor:pointer}' +
    '#agCm .tabs{display:flex;gap:6px;padding:0 10px 8px}' +
    '#agCm .tabs button{flex:1;border:3px solid #1c6e9c;border-radius:999px;background:#e9f6ff;color:#0a5f8c;font:700 15px CV,sans-serif;padding:5px 4px;cursor:pointer;position:relative;white-space:nowrap}' +
    '#agCm .tabs button.on{background:linear-gradient(#ffe36b,#f5b81c);border-color:#b07a06;color:#5a3a00}' +
    '#agCm .bd{flex:1;min-height:0;margin:0 10px 10px;background:#fbf6e6;border:3px solid #d9c79a;border-radius:16px;display:flex;flex-direction:column;overflow:hidden}' +
    '#agCm .sc{flex:1;overflow-y:auto;overflow-x:hidden;padding:8px;overscroll-behavior:contain}' +
    '#agCm .bar{display:flex;gap:6px;padding:8px;border-top:2px solid #e6d7ad;background:#fffdf4}' +
    '#agCm textarea,#agCm input{flex:1;min-width:0;border:3px solid #9fd0ec;border-radius:12px;padding:7px 9px;font:500 15px CV,sans-serif;color:#21445a;resize:none;background:#fff;outline:none}' +
    '#agCm textarea:focus,#agCm input:focus{border-color:#2f8fc4}' +
    '#agCm .go{border:3px solid #2e7d1d;border-radius:999px;background:linear-gradient(#7fd14a,#4aa62a);color:#fff;font:700 15px CV,sans-serif;text-shadow:0 2px 0 #2e7d1d;padding:6px 14px;cursor:pointer;white-space:nowrap}' +
    '#agCm .card{background:#fff;border:3px solid #d9c79a;border-radius:14px;padding:9px;margin-bottom:8px}' +
    '#agCm .who{display:flex;align-items:center;gap:8px;min-width:0}' +
    '#agCm .av{width:38px;height:38px;border-radius:50%;border:3px solid #2f8fc4;object-fit:cover;background:#e9f6ff;flex:0 0 38px}' +
    '#agCm .nm{font-weight:700;color:#0a5f8c;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#agCm .meta{font-size:12px;color:#8a7a4f}' +
    '#agCm .tx{margin:6px 0 4px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:15px;line-height:1.4}' +
    '#agCm .acts{display:flex;gap:10px;flex-wrap:wrap;font-size:13px}' +
    '#agCm .acts a{color:#1c6e9c;font-weight:700;cursor:pointer;text-decoration:none}#agCm .acts a.lk{color:#d0326b}#agCm .acts a.mut{color:#a99a72;font-weight:600}' +
    '#agCm .cms{margin-top:6px;border-top:2px dashed #eee3c4;padding-top:6px}' +
    '#agCm .cm{display:flex;gap:6px;margin-bottom:6px}#agCm .cm .av{width:28px;height:28px;flex-basis:28px;border-width:2px}' +
    '#agCm .cm .bb{background:#f3f8fb;border-radius:12px;padding:5px 9px;min-width:0;flex:1}' +
    '#agCm .cm .tx{margin:2px 0;font-size:14px}' +
    '#agCm .cmf{display:flex;gap:6px}#agCm .cmf input{font-size:14px;padding:5px 8px}#agCm .cmf .go{padding:4px 10px;font-size:13px}' +
    '#agCm .msg{display:flex;gap:7px;margin-bottom:7px;align-items:flex-end}#agCm .msg .av{width:30px;height:30px;flex-basis:30px;border-width:2px}' +
    '#agCm .msg .bb{background:#fff;border:2px solid #d9c79a;border-radius:14px 14px 14px 4px;padding:5px 9px;max-width:80%;min-width:0}' +
    '#agCm .msg.me{flex-direction:row-reverse}#agCm .msg.me .bb{background:#e4f8d6;border-color:#9ccf7c;border-radius:14px 14px 4px 14px}' +
    '#agCm .msg .tx{margin:1px 0 0;font-size:14px}' +
    '#agCm .row{display:flex;align-items:center;gap:8px;padding:8px;background:#fff;border:3px solid #d9c79a;border-radius:14px;margin-bottom:7px;cursor:pointer}' +
    '#agCm .row .bb{flex:1;min-width:0}#agCm .row .last{font-size:13px;color:#6b7d88;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#agCm .badge{background:#e8382f;color:#fff;border-radius:999px;font-size:12px;font-weight:700;padding:1px 7px;min-width:20px;text-align:center}' +
    '#agCm .tabs .badge{position:absolute;top:-8px;right:-4px}' +
    '#agCm .dmh{display:flex;align-items:center;gap:8px;padding:8px;border-bottom:2px solid #e6d7ad;background:#fffdf4}' +
    '#agCm .dmh .sp{flex:1;min-width:0}#agCm .sm{border:2px solid #1c6e9c;border-radius:999px;background:#fff;color:#0a5f8c;font:700 13px CV,sans-serif;padding:3px 10px;cursor:pointer;white-space:nowrap}' +
    '#agCm .empty{text-align:center;color:#8a7a4f;padding:24px 10px;font-weight:600}' +
    '#agCm .rules{font-size:12px;color:#e9f6ff;text-align:center;padding:0 10px 8px}' +
    '#agCm .toast{position:absolute;left:50%;bottom:80px;transform:translateX(-50%);background:#073b57;color:#fff;border-radius:999px;padding:6px 14px;font-size:14px;display:none;max-width:90%;text-align:center}' +
    '#agCmBtn{display:inline-flex;align-items:center;gap:5px;margin:0 12px 0 0;border:2px solid #1c6e9c;border-radius:999px;background:linear-gradient(#6cc6f5,#2f8fc4);color:#fff;font:700 13px CV,sans-serif;padding:5px 14px;cursor:pointer;white-space:nowrap;text-shadow:0 1px 0 #1c6e9c;position:relative;vertical-align:middle;box-shadow:0 3px 0 #1c6e9c;flex:0 0 auto}#agCmBtn:active{transform:translateY(2px);box-shadow:0 1px 0 #1c6e9c}' +
    '#agCmBtn .badge{background:#e8382f;color:#fff;border-radius:999px;font-size:11px;padding:0 6px;text-shadow:none}' +
    '#agCmBtn .badge.pop{animation:agPop .5s ease}@keyframes agPop{0%{transform:scale(1)}40%{transform:scale(1.6)}100%{transform:scale(1)}}' +
    '#agCm .avw{position:relative;display:inline-block;flex:0 0 auto;line-height:0}' +
    '#agCm .avw .dot{position:absolute;right:-2px;bottom:-2px;width:13px;height:13px;border-radius:50%;border:2px solid #fff}' +
    '#agCm .dot.online,#agCm .sd.online{background:#42b72a}#agCm .dot.busy,#agCm .sd.busy{background:#e8382f}#agCm .dot.offline{display:none}#agCm .sd.offline,#agCm .sd.invisible{background:#b9c3c9}' +
    '#agCm .sd{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px;vertical-align:0}' +
    '#agCm .stsel{border:2px solid #1c6e9c;border-radius:999px;background:#fff;color:#0a5f8c;font:700 13px CV,sans-serif;padding:3px 6px;max-width:150px}' +
    '#agCm .tools{display:flex;gap:4px;align-items:flex-end}#agCm .tb{width:34px;height:34px;border:2px solid #9fd0ec;border-radius:50%;background:#fff;font-size:18px;line-height:1;cursor:pointer;padding:0;flex:0 0 34px}' +
    '#agCm .emo{position:absolute;bottom:58px;left:8px;right:8px;background:#fff;border:3px solid #1c6e9c;border-radius:14px;padding:6px;display:none;grid-template-columns:repeat(8,1fr);gap:2px;max-height:180px;overflow:auto;z-index:3;box-shadow:0 6px 0 rgba(0,0,0,.15)}' +
    '#agCm .emo.on{display:grid}#agCm .emo button{border:0;background:none;font-size:22px;cursor:pointer;padding:3px;border-radius:8px}#agCm .emo button:hover{background:#e9f6ff}' +
    '#agCm .bar{position:relative}' +
    '#agCm .ph{display:block;max-width:100%;max-height:260px;border-radius:12px;margin-top:6px;cursor:zoom-in;border:2px solid #e6d7ad;object-fit:cover}' +
    '#agCm .msg .ph{max-height:200px}' +
    '#agCm .prev{position:relative;display:inline-block;margin:0 8px 6px}#agCm .prev img{max-height:90px;border-radius:10px;border:2px solid #9fd0ec}#agCm .prev b{position:absolute;top:-8px;right:-8px;background:#e8382f;color:#fff;border-radius:50%;width:22px;height:22px;text-align:center;line-height:22px;cursor:pointer;font-size:13px}' +
    '#agCm .sub{font-size:13px;font-weight:700;color:#8a7a4f;margin:6px 2px 6px;text-transform:uppercase}' +
    '#agLb{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;cursor:zoom-out}#agLb img{max-width:94vw;max-height:94vh;border-radius:10px}' +
    '#agNt{position:fixed;right:14px;bottom:14px;z-index:99994;width:min(300px,calc(100vw - 28px));background:#fff;border:3px solid #1c6e9c;border-radius:14px;box-shadow:0 8px 0 rgba(0,0,0,.18);font-family:CV,sans-serif;color:#21445a;display:flex;gap:8px;align-items:center;padding:8px 10px;cursor:pointer;animation:agNtIn .35s ease-out}' +
    '#agNt img{width:42px;height:42px;border-radius:50%;border:3px solid #2f8fc4;object-fit:cover}#agNt .bb{flex:1;min-width:0}#agNt b{display:block;color:#0a5f8c;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#agNt span{display:block;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#agNt .t{font-size:11px;color:#8a7a4f;text-transform:uppercase;font-weight:700}' +
    '@keyframes agNtIn{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}' +
    '#agCmBtn .sd{display:inline-block;width:9px;height:9px;border-radius:50%;border:1px solid #fff}#agCmBtn .sd.online{background:#42b72a}#agCmBtn .sd.busy{background:#e8382f}#agCmBtn .sd.invisible{background:#b9c3c9}' +
    '#agCm .chip{display:inline-block;border-radius:999px;padding:1px 8px;font-size:12px;font-weight:700;white-space:nowrap}' +
    '#agCm .chip.abierto{background:#ffe3c2;color:#9a4b00}#agCm .chip.en_progreso{background:#d6ecff;color:#0a5f8c}#agCm .chip.resuelto{background:#dcf5cc;color:#2c7710}#agCm .chip.cerrado{background:#e8e8e8;color:#666}' +
    '#agCm .kinds{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}#agCm .kinds button{border:2px solid #9fd0ec;border-radius:999px;background:#fff;color:#0a5f8c;font:700 13px CV,sans-serif;padding:4px 10px;cursor:pointer}#agCm .kinds button.on{background:#2f8fc4;border-color:#1c6e9c;color:#fff}' +
    '#agCm .form input,#agCm .form textarea{width:100%;display:block;margin-bottom:8px}' +
    '#agCm .tool{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px;border-bottom:2px solid #e6d7ad;background:#fffdf4}#agCm .tool select{border:2px solid #1c6e9c;border-radius:999px;font:700 13px CV,sans-serif;padding:3px 6px;color:#0a5f8c}' +
    '#agCm .msg.team .bb{background:#fff6c9;border-color:#e0b33a}#agCm .tm{background:#f5b81c;color:#5a3a00;border-radius:999px;padding:0 6px;font-size:11px;font-weight:700;margin-left:4px}' +
    '#agCm .tabs button{font-size:13px;padding:5px 2px}' +
    '#agCm .card.share{border-color:#7fc4ea;background:linear-gradient(#f2faff,#fff)}#agCm .fg{font-size:12px;font-weight:700;color:#1c6e9c;margin-bottom:4px}' +
    '#agCm .gimg{display:block;max-width:120px;max-height:120px;margin:6px auto;filter:drop-shadow(0 3px 0 rgba(0,0,0,.12))}' +
    '#agCm .help{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:6px 0 2px}#agCm .help .go{padding:6px 18px}#agCm .help .go[disabled]{filter:grayscale(1);opacity:.6;cursor:default}' +
    '#agCm .hn{font-size:12px;color:#6b7d88}' +
    '#agCm .wl{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px;margin:6px 0}#agCm .wl div{background:#fff;border:2px solid #d9c79a;border-radius:12px;padding:6px;text-align:center;font-size:13px;font-weight:700;color:#21445a;overflow-wrap:anywhere}#agCm .wl .go{display:block;width:100%;margin-top:4px;padding:3px 6px;font-size:12px}' +
    '#agCm .att{display:flex;gap:10px;border:1px solid #d3dbe3;border-left:4px solid #3b5998;background:#f6f7f9;border-radius:6px;padding:8px;margin:6px 0}' +
    '#agCm .att .th{width:90px;height:90px;flex:0 0 90px;background:#fff;border:1px solid #dfe3e8;border-radius:4px;display:flex;align-items:center;justify-content:center;overflow:hidden}#agCm .att .th img{max-width:86px;max-height:86px}' +
    '#agCm .att .ti{color:#3b5998;font-weight:700;font-size:15px;overflow-wrap:anywhere}#agCm .att .cp{color:#90949c;font-size:12px;margin:2px 0}#agCm .att .ds{font-size:13px;color:#4b4f56;overflow-wrap:anywhere;white-space:pre-wrap}' +
    '#agCm .fbl{display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:13px;margin-top:4px}#agCm .fbl a{color:#3b5998;font-weight:700;cursor:pointer;text-decoration:none}#agCm .fbl a:hover{text-decoration:underline}#agCm .fbl a.off{color:#90949c;cursor:default;text-decoration:none}' +
    '#agCm .wl{grid-template-columns:repeat(auto-fill,minmax(96px,1fr))}#agCm .wl div{border:1px solid #dfe3e8;border-radius:6px;font-size:12px}#agCm .wl img{display:block;width:56px;height:56px;object-fit:contain;margin:0 auto 4px}#agCm .wl small{display:block;color:#90949c;font-weight:600;font-size:11px}' +
    '#agSh{position:fixed;inset:0;z-index:99997;background:rgba(5,20,30,.55);display:flex;align-items:center;justify-content:center;padding:14px;font-family:CV,sans-serif;-webkit-user-select:none;user-select:none}' +
    '#agSh .c{width:100%;max-width:440px;background:#2f8fc4;border:4px solid #1c6e9c;border-radius:20px;padding:12px;box-shadow:0 10px 0 rgba(0,0,0,.2)}#agSh h3{margin:0 0 8px;color:#fff;text-align:center;font-size:22px;text-shadow:-2px -2px 0 #073b57,2px -2px 0 #073b57,-2px 2px 0 #073b57,2px 2px 0 #073b57}' +
    '#agSh .in{background:#fbf6e6;border:3px solid #d9c79a;border-radius:14px;padding:10px;display:flex;gap:10px;align-items:center;color:#21445a}#agSh .in img{width:84px;height:84px;object-fit:contain;flex:0 0 84px}#agSh .in b{display:block;color:#0a5f8c}#agSh .in p{margin:4px 0 0;font-size:14px;overflow-wrap:anywhere}' +
    '#agSh .bt{display:flex;gap:10px;justify-content:center;margin-top:10px}#agSh button{border-radius:999px;font:700 16px CV,sans-serif;padding:7px 20px;cursor:pointer;border:3px solid #2e7d1d;background:linear-gradient(#7fd14a,#4aa62a);color:#fff;text-shadow:0 2px 0 #2e7d1d}#agSh button.no{border-color:#1c6e9c;background:#fff;color:#0a5f8c;text-shadow:none}' +
    '@media (max-width:480px){#agCmBtn .lb{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ago(iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return t.now; if (s < 3600) return Math.floor(s / 60) + ' ' + t.min;
    if (s < 86400) return Math.floor(s / 3600) + ' ' + t.h; return Math.floor(s / 86400) + ' ' + t.d;
  }
  function api(method, url, body) {
    return fetch(url, { method: method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) {
        if (r.status === 429) { toast(t.slow); throw 0; }
        if (r.status === 401) { showLogin(); throw 0; }
        var ct = r.headers.get('content-type') || '';
        if (!r.ok) return ct.indexOf('json') >= 0 ? r.json().then(function (j) { throw j; }) : Promise.reject(r.status);
        return ct.indexOf('json') >= 0 ? r.json() : null;
      });
  }
  function av(u) { return '<span class="avw"><img class="av" src="' + esc(u.avatar || '/blank.png') + '" alt="" onerror="this.src=\'/blank.png\'">' + (u.status ? '<i class="dot ' + u.status + '"></i>' : '') + '</span>'; }
  function stText(u) { return u.status === 'online' ? t.online : u.status === 'busy' ? t.busy : (u.seen ? t.seenAgo + ' ' + ago(u.seen) : t.offline); }
  function imgHtml(url) { return url ? '<img class="ph" src="' + esc(url) + '" alt="" loading="lazy">' : ''; }
  var EMOJI = '😀 😂 🤣 😊 😍 😘 😎 🤩 🥳 😜 🤗 🤔 😅 😢 😭 😡 👍 👎 👏 🙌 🙏 💪 👋 🤝 ❤️ 💙 💚 💛 🔥 ⭐ 🎉 🎁 🏙️ 🏠 🏡 🏢 🏬 🏗️ 🚜 🌾 🌻 🌳 🚂 🚗 🚢 ✈️ 💰 💵 🪙 ⚡ 🎄 🎃 ☀️ ❄️ 🌧️ 🍕 🍔 🍰 ☕ 🇩🇴 🇸🇻 🇺🇸 🇲🇽 🇪🇸 🇧🇷'.split(' ');
  // barra de emojis + foto. onPhoto(url) recibe la foto ya subida.
  function tools(inp, onPhoto) {
    var bar = inp.closest('.bar');
    var pop = document.createElement('div'); pop.className = 'emo';
    pop.innerHTML = EMOJI.map(function (e) { return '<button type="button">' + e + '</button>'; }).join('');
    bar.appendChild(pop);
    if (!bar.previousElementSibling) { pop.style.top = '100%'; pop.style.bottom = 'auto'; }
    var wrap = document.createElement('div'); wrap.className = 'tools';
    wrap.innerHTML = '<button type="button" class="tb" title="Emoji">😊</button><button type="button" class="tb" title="' + t.photo + '">📷</button><input type="file" accept="image/*" style="display:none">';
    bar.insertBefore(wrap, inp);
    var bs = wrap.querySelectorAll('.tb'), file = wrap.querySelector('input');
    bs[0].onclick = function () { pop.classList.toggle('on'); };
    pop.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var p = inp.selectionStart != null ? inp.selectionStart : inp.value.length;
      inp.value = inp.value.slice(0, p) + b.textContent + inp.value.slice(p); inp.focus();
      try { inp.selectionStart = inp.selectionEnd = p + b.textContent.length; } catch (x) { }
    };
    bs[1].onclick = function () { file.click(); };
    file.onchange = function () {
      var f = file.files && file.files[0]; file.value = ''; if (!f) return;
      shrink(f).then(function (data) { return api('POST', '/api/ag/upload', { image: data }); })
        .then(function (r) { onPhoto(r.url); })
        .catch(function (x) { if (x !== 0) toast(t.photoErr); });
    };
  }
  // reduce la foto en el navegador (max 1024px, JPEG) y quita los datos de ubicacion
  function shrink(f) {
    return new Promise(function (ok, bad) {
      var url = URL.createObjectURL(f), im = new Image();
      im.onload = function () {
        var k = Math.min(1, 1024 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); ok(c.toDataURL('image/jpeg', 0.82));
      };
      im.onerror = function () { URL.revokeObjectURL(url); bad(1); };
      im.src = url;
    });
  }
  function lightbox(src) { var d = document.createElement('div'); d.id = 'agLb'; d.innerHTML = '<img src="' + esc(src) + '" alt="">'; d.onclick = function () { d.remove(); }; document.body.appendChild(d); }

  var me = null, root, body, tab = 'wall', dmWith = null, lastChat = 0, lastDm = 0, poll = null, wallOldest = 0;

  function build() {
    root = document.createElement('div'); root.id = 'agCm'; root.setAttribute('role', 'dialog');
    root.innerHTML = '<div class="hd"><h2>💬 ' + t.title + '</h2><select class="stsel" title="' + t.status + '"><option value="online">🟢 ' + t.online + '</option><option value="busy">🔴 ' + t.busy + '</option><option value="invisible">⚪ ' + t.invisible + '</option></select><button class="x" aria-label="' + t.close + '"></button></div>' +
      '<div class="tabs"><button data-t="wall">📰 ' + t.wall + '</button><button data-t="chat">💬 ' + t.chat + '</button><button data-t="dm">✉️ ' + t.dm + '<span class="badge" id="agCmTabBadge" style="display:none"></span></button><button data-t="add">👥 ' + t.fr + '<span class="badge" id="agCmFrBadge" style="display:none"></span></button><button data-t="sup">🆘 ' + t.sup + '<span class="badge" id="agCmSupBadge" style="display:none"></span></button></div>' +
      '<div class="rules">🛡️ ' + t.rules + '</div><div class="bd"></div><div class="toast"></div>';
    document.body.appendChild(root);
    body = root.querySelector('.bd');
    var sel = root.querySelector('.stsel'); if (me) sel.value = me.status || 'online';
    sel.onchange = function () { api('POST', '/api/ag/status', { text: sel.value }).then(function (r) { if (me) me.status = r.status; paintBtn(); }).catch(function () { }); };
    root.addEventListener('click', function (e) { var im = e.target.closest('.ph'); if (im) lightbox(im.src); });
    root.querySelector('.x').onclick = close;
    root.querySelectorAll('.tabs button').forEach(function (b) { b.onclick = function () { open(b.getAttribute('data-t')); }; });
    // las teclas no deben llegar al juego mientras escribes
    ['keydown', 'keyup', 'keypress'].forEach(function (ev) { root.addEventListener(ev, function (e) { e.stopPropagation(); }); });
  }

  function toast(s) { var el = root && root.querySelector('.toast'); if (!el) return; el.textContent = s; el.style.display = 'block'; clearTimeout(el._t); el._t = setTimeout(function () { el.style.display = 'none'; }, 2500); }
  function showLogin() { if (body) body.innerHTML = '<div class="empty">' + t.login + '<br><br><a class="go" href="/Account/Login" style="text-decoration:none">Login</a></div>'; }

  function open(which) {
    if (!root) build();
    root.classList.add('on');
    tab = which || tab; dmWith = which === 'dm' ? dmWith : null;
    root.querySelectorAll('.tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-t') === tab); });
    clearInterval(poll); poll = null;
    if (tab === 'wall') showWall(); else if (tab === 'chat') showChat(); else if (tab === 'add') showAdd(); else if (tab === 'sup') showSupport(); else if (dmWith) showDm(dmWith); else showDms();
  }
  function close() { if (root) root.classList.remove('on'); clearInterval(poll); poll = null; }

  // ---------- muro ----------
  var NAMES = null, namesP = null;
  function loadNames() { if (!namesP) namesP = fetch('/ag/collect_names.json').then(function (r) { return r.json(); }).then(function (j) { NAMES = j; }).catch(function () { NAMES = {}; }); return namesP; }
  function nm(key) { if (!key) return ''; var L2 = NAMES && (NAMES[lang] || NAMES.en) || {}; return L2[key] || (NAMES && NAMES.en && NAMES.en[key]) || prettyItem(key); }
  function prettyItem(n) { return String(n).replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  // historia estilo Facebook de 2012: miniatura, titulo azul, pie, descripcion y enlaces de accion
  function shareHtml(p, mine) {
    var full = p.helps >= p.maxHelps, h = '', lines = (p.text || '').split('\n');
    var title = lines.shift() || t.fromGame, desc = lines.join('\n');
    if (p.kind === 'wishlist') {
      h += '<div class="att" style="display:block"><div class="ti">🎁 ' + t.wishTitle + ' · ' + esc(p.author.name) + '</div><div class="cp">' + esc(p.author.name) + ' ' + t.needs + ' · ' + t.viaGame + '</div>' +
        '<div class="wl">' + p.items.map(function (it) {
          return '<div>' + (it.icon ? '<img src="' + esc(it.icon) + '" alt="" onerror="this.style.visibility=\'hidden\'">' : '<div style="font-size:34px">🎁</div>') + esc(nm(it.name)) +
            (it.collection ? '<small>' + esc(nm(it.collection)) + '</small>' : '') +
            (mine ? '' : '<button class="go" data-a="help" data-item="' + esc(it.name) + '"' + (p.helped || full ? ' disabled' : '') + '>' + t.sendItem + '</button>') + '</div>';
        }).join('') + '</div></div>';
    } else {
      h += '<div class="att">' + (p.image ? '<div class="th"><img src="' + esc(p.image) + '" alt="" onerror="this.parentNode.remove()"></div>' : '') +
        '<div style="min-width:0"><div class="ti">' + esc(title) + '</div><div class="cp">' + t.viaGame + '</div>' + (desc ? '<div class="ds">' + esc(desc) + '</div>' : '') + '</div></div>';
      if (!mine) h += '<div class="help"><button class="go" data-a="help"' + (p.helped || full ? ' disabled' : '') + '>🤝 ' + esc(p.action || t.helpBtn) + '</button></div>';
    }
    h += '<div class="hn">' + (p.helped ? '✔ ' + t.helpedAlready + ' · ' : '') + '🤝 ' + p.helps + '/' + p.maxHelps + ' ' + t.helpers + (p.helpers && p.helpers.length ? ': ' + p.helpers.map(esc).join(', ') : '') + '</div>';
    return h;
  }
  function postHtml(p) {
    var mine = me && p.author.name.toLowerCase() === me.name.toLowerCase();
    var isShare = p.kind && p.kind !== 'text';
    var h = '<div class="card' + (isShare ? ' share' : '') + '" data-id="' + p.id + '">' + '<div class="who">' + av(p.author) + '<div style="min-width:0"><div class="nm" data-u="' + esc(p.author.name) + '">' + esc(p.author.name) + '</div><div class="meta">' + (isShare ? '🎮 ' + t.sharedFrom + ' · ' : '') + t.lvl + ' ' + p.author.level + ' · ' + ago(p.at) + '</div></div></div>' +
      (isShare ? shareHtml(p, mine) : (p.text ? '<div class="tx">' + esc(p.text) + '</div>' : '') + imgHtml(p.image)) + '<div style="height:6px"></div><div class="acts"><a class="' + (p.liked ? 'lk' : '') + '" data-a="like">' + (p.liked ? '❤️' : '🤍') + ' ' + t.like + (p.likes ? ' · ' + p.likes : '') + '</a>' +
      '<a data-a="cm">💬 ' + t.comment + (p.comments.length ? ' · ' + p.comments.length : '') + '</a>' +
      (mine || (me && me.admin) ? '<a class="mut" data-a="del" data-x="' + p.id + '">' + t.del + '</a>' : '<a class="mut" data-a="rep" data-x="' + p.id + '">' + t.report + '</a>') + '</div>';
    h += '<div class="cms"' + (p.comments.length ? '' : ' style="display:none"') + '>';
    p.comments.forEach(function (c) {
      var cmine = me && (c.author.name.toLowerCase() === me.name.toLowerCase() || mine || me.admin);
      h += '<div class="cm">' + av(c.author) + '<div class="bb"><span class="nm" data-u="' + esc(c.author.name) + '">' + esc(c.author.name) + '</span> <span class="meta">' + ago(c.at) + '</span><div class="tx">' + esc(c.text) + '</div>' +
        '<div class="acts">' + (cmine ? '<a class="mut" data-a="del" data-x="' + c.id + '">' + t.del + '</a>' : '<a class="mut" data-a="rep" data-x="' + c.id + '">' + t.report + '</a>') + '</div></div></div>';
    });
    h += '<div class="cmf"><input maxlength="300" placeholder="' + t.commentPh + '"><button class="go" data-a="send">' + t.send + '</button></div></div></div>';
    return h;
  }
  function showWall() {
    body.innerHTML = '<div style="border-bottom:2px solid #e6d7ad;background:#fffdf4"><div class="bar" style="border-top:0"><textarea rows="2" maxlength="600" placeholder="' + t.wallPh + '"></textarea><button class="go">' + t.post + '</button></div><div class="pv"></div></div><div class="sc"></div>';
    var ta = body.querySelector('textarea'), sc = body.querySelector('.sc'), pv = body.querySelector('.pv'), photo = null;
    tools(ta, function (url) { photo = url; pv.innerHTML = '<span class="prev"><img src="' + esc(url) + '" alt=""><b>✕</b></span>'; pv.querySelector('b').onclick = function () { photo = null; pv.innerHTML = ''; }; });
    body.querySelector('.go').onclick = function () {
      var v = ta.value.trim(); if (!v && !photo) return;
      api('POST', '/api/ag/wall', { text: v, image: photo }).then(function () { ta.value = ''; photo = null; pv.innerHTML = ''; loadWall(true); }).catch(function () { });
    };
    sc.onclick = wallClick;
    loadNames().then(function () { loadWall(true); });
  }
  function loadWall(reset) {
    var sc = body.querySelector('.sc'); if (!sc) return;
    api('GET', '/api/ag/wall' + (reset ? '' : '?before=' + wallOldest)).then(function (list) {
      if (reset) sc.innerHTML = '';
      var old = sc.querySelector('.more'); if (old) old.remove();
      if (reset && !list.length) { sc.innerHTML = '<div class="empty">' + t.empty + '</div>'; return; }
      list.forEach(function (p) { sc.insertAdjacentHTML('beforeend', postHtml(p)); wallOldest = p.id; });
      if (list.length >= 20) sc.insertAdjacentHTML('beforeend', '<div style="text-align:center"><button class="sm more">' + t.more + '</button></div>');
    }).catch(function () { });
  }
  function refreshPost(id) {
    api('GET', '/api/ag/wall?before=' + (id + 1)).then(function (list) {
      var p = list.filter(function (x) { return x.id === id; })[0]; var el = body.querySelector('.card[data-id="' + id + '"]');
      if (p && el) { var open = el.querySelector('.cms').style.display !== 'none'; el.outerHTML = postHtml(p); if (open) body.querySelector('.card[data-id="' + id + '"] .cms').style.display = ''; }
    }).catch(function () { });
  }
  function wallClick(e) {
    var a = e.target.closest('[data-a],.nm,.more'); if (!a) return;
    if (a.classList.contains('more')) return loadWall(false);
    if (a.classList.contains('nm')) return openDmWith(a.getAttribute('data-u'));
    var card = a.closest('.card'), id = card && +card.getAttribute('data-id'), act = a.getAttribute('data-a');
    if (act === 'like') api('POST', '/api/ag/wall/' + id + '/like').then(function () { refreshPost(id); }).catch(function () { });
    else if (act === 'help') {
      a.disabled = true;
      api('POST', '/api/ag/wall/' + id + '/help', { item: a.getAttribute('data-item') }).then(function (rw) {
        toast(t.helpedOk + ' ' + rw.coins + ' ' + t.coins + ' 🪙 · ' + t.reloadNote); refreshPost(id);
      }).catch(function (j) { a.disabled = false; if (j && j.error) toast(j.error === 'done' ? t.helpedAlready : j.error === 'full' ? t.full : j.error === 'old' ? t.old : j.error === 'closed' ? t.helpClosed : j.error === 'friendsOnly' ? t.helpFriends : '⚠️'); refreshPost(id); });
    }
    else if (act === 'cm') { var c = card.querySelector('.cms'); c.style.display = ''; c.querySelector('input').focus(); }
    else if (act === 'send') {
      var inp = card.querySelector('.cmf input'), v = inp.value.trim(); if (!v) return;
      api('POST', '/api/ag/wall/' + id + '/comment', { text: v }).then(function () { refreshPost(id); }).catch(function () { });
    }
    else if (act === 'del') { if (confirm(t.confirmDel)) api('POST', '/api/ag/delete/' + a.getAttribute('data-x')).then(function () { loadWall(true); }).catch(function () { }); }
    else if (act === 'rep') report(a.getAttribute('data-x'));
  }
  function report(id) { api('POST', '/api/ag/report/' + id, { text: '' }).then(function () { toast(t.reported); }).catch(function () { }); }

  // ---------- chat general y privados ----------
  function msgHtml(m, showDel) {
    var mine = me && m.from.name.toLowerCase() === me.name.toLowerCase();
    return '<div class="msg' + (mine ? ' me' : '') + '" data-id="' + m.id + '">' + av(m.from) + '<div class="bb"><span class="nm" data-u="' + esc(m.from.name) + '">' + esc(mine ? me.name : m.from.name) + '</span> <span class="meta">' + t.lvl + ' ' + m.from.level + ' · ' + ago(m.at) + '</span>' +
      (m.text ? '<div class="tx">' + esc(m.text) + '</div>' : '') + imgHtml(m.image) + (showDel ? '<div class="acts">' + ((mine || (me && me.admin)) ? '<a class="mut" data-a="del" data-x="' + m.id + '">' + t.del + '</a>' : '<a class="mut" data-a="rep" data-x="' + m.id + '">' + t.report + '</a>') + '</div>' : '') + '</div></div>';
  }
  function chatBox(onSend) {
    body.innerHTML = '<div class="sc"></div><div class="bar"><input maxlength="300" placeholder="' + t.chatPh + '"><button class="go">' + t.send + '</button></div>';
    var inp = body.querySelector('.bar input');
    tools(inp, function (url) { onSend(inp.value.trim(), url); inp.value = ''; });
    function go() { var v = inp.value.trim(); if (!v) return; inp.value = ''; var e = body.querySelector('.emo'); if (e) e.classList.remove('on'); onSend(v); }
    body.querySelector('.go').onclick = go;
    inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } };
    return body.querySelector('.sc');
  }
  // ---------- sonidos (hechos aqui mismo, sin archivos) ----------
  var actx = null;
  function pref(k) { return !(me && me.prefs && me.prefs[k] === 'off'); }
  function snd(kind, cat) {
    if (me && me.status === 'busy') return;
    if (cat && !pref(cat)) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      var now = actx.currentTime;
      var notes = kind === 'send' ? [[880, 0, .07], [1320, .05, .09]]
        : kind === 'recv' ? [[660, 0, .09], [990, .07, .12]]
        : [[784, 0, .12], [1047, .13, .12], [1319, .26, .22]]; // aviso de mensaje nuevo
      notes.forEach(function (n) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = kind === 'notify' ? 'triangle' : 'sine'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, now + n[1]);
        g.gain.exponentialRampToValueAtTime(kind === 'send' ? 0.12 : 0.18, now + n[1] + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, now + n[1] + n[2]);
        o.connect(g); g.connect(actx.destination); o.start(now + n[1]); o.stop(now + n[1] + n[2] + 0.02);
      });
    } catch (e) { }
  }
  // el navegador solo deja sonar despues de que el jugador toca algo
  ['pointerdown', 'keydown'].forEach(function (ev) { addEventListener(ev, function () { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { } }, { once: true, capture: true }); });
  function incoming(list) { return me && list.some(function (m) { return m.from && m.from.name && m.from.name.toLowerCase() !== me.name.toLowerCase(); }); }

  function append(sc, list, showDel) {
    var atBottom = sc.scrollHeight - sc.scrollTop - sc.clientHeight < 60;
    var em = sc.querySelector('.empty'); if (list.length && em) em.remove();
    list.forEach(function (m) { if (!sc.querySelector('.msg[data-id="' + m.id + '"]')) sc.insertAdjacentHTML('beforeend', msgHtml(m, showDel)); });
    if (atBottom || list.length) sc.scrollTop = sc.scrollHeight;
  }
  function showChat() {
    lastChat = 0;
    var sc = chatBox(function (v, img) { api('POST', '/api/ag/chat', { text: v, image: img }).then(function () { snd('send', 'sndChat'); pull(); }).catch(function () { }); });
    sc.innerHTML = '<div class="empty">' + t.empty + '</div>';
    sc.onclick = function (e) {
      var a = e.target.closest('[data-a],.nm'); if (!a) return;
      if (a.classList.contains('nm')) return openDmWith(a.getAttribute('data-u'));
      if (a.getAttribute('data-a') === 'del') { if (confirm(t.confirmDel)) api('POST', '/api/ag/delete/' + a.getAttribute('data-x')).then(function () { var el = sc.querySelector('.msg[data-id="' + a.getAttribute('data-x') + '"]'); if (el) el.remove(); }).catch(function () { }); }
      else report(a.getAttribute('data-x'));
    };
    function pull() {
      api('GET', '/api/ag/chat?after=' + lastChat).then(function (list) {
        if (lastChat && incoming(list)) snd('recv', 'sndChat');
        if (list.length) lastChat = list[list.length - 1].id; append(sc, list, true);
      }).catch(function () { });
    }
    pull(); poll = setInterval(pull, 3000);
  }
  // ---------- agregar amigos ----------
  function showAdd() {
    body.innerHTML = '<div style="padding:10px 10px 0"><div class="card"><div class="nm" style="margin-bottom:6px">🔎 ' + t.frBy + '</div>' +
      '<div style="display:flex;gap:6px"><input class="frq" maxlength="40" placeholder="' + t.frPh + '" style="flex:1;min-width:0;border:2px solid #d9c79a;border-radius:999px;padding:6px 12px;font:600 15px CV,sans-serif"><button class="go fradd">' + t.frAdd + '</button></div></div>' +
      '<div class="card" style="text-align:center"><button class="go frall" style="width:100%">👥 ' + t.frAll + '</button><div class="meta frcount" style="margin-top:6px"></div></div></div>' +
      '<div class="sub" style="padding:0 14px">' + t.frList + '</div><div class="sc"></div>';
    var inp = body.querySelector('.frq'), sc = body.querySelector('.sc'), timer;
    function badge(p) {
      if (p.rel === 'friend') return '<span class="meta">✔ ' + t.frFriend + '</span>';
      if (p.rel === 'sent') return '<span class="meta">⏳ ' + t.frSent + '</span>';
      if (p.rel === 'private') return '<span class="meta">🔒 ' + t.frPrivate + '</span>';
      return '<button class="sm" data-add="' + esc(p.name) + '">' + (p.rel === 'received' ? t.frAccept : '+ ' + t.frAdd) + '</button>';
    }
    function load() {
      api('GET', '/api/ag/friends/find?q=' + encodeURIComponent(inp.value.trim())).then(function (r) {
        body.querySelector('.frcount').textContent = r.pending + ' ' + t.frPending;
        var inc = (r.incoming || []).map(function (p) {
          return '<div class="row" data-u="' + esc(p.name) + '">' + av(p) + '<div class="bb"><div class="nm">' + esc(p.name) + '</div><div class="last">' + t.lvl + ' ' + p.level + '</div></div><div>' + badge(p) + '</div></div>';
        }).join('');
        var head = inc && !inp.value.trim() ? '<div class="sub" style="padding:0 4px">📩 ' + t.frReqs + ' (' + r.incoming.length + ')</div>' + inc + '<div class="sub" style="padding:0 4px">' + t.frList + '</div>' : '';
        sc.innerHTML = head + (r.players.length ? r.players.map(function (p) {
          return '<div class="row" data-u="' + esc(p.name) + '">' + av(p) + '<div class="bb"><div class="nm">' + esc(p.name) + '</div><div class="last">' + t.lvl + ' ' + p.level + '</div></div><div>' + badge(p) + '</div></div>';
        }).join('') : '<div class="empty">' + t.empty + '</div>');
      }).catch(function () { });
    }
    function add(name) {
      return api('POST', '/api/ag/friends/add', { text: name }).then(function (r) {
        toast(r.rel === 'friend' ? t.frNow + ' ' + r.name + ' 🎉' : t.frSentOk + ' ' + r.name + ' ✉️'); load();
      }).catch(function (j) { if (j && j.error) toast(j.error === 'notfound' ? t.frNotFound : j.error === 'private' ? t.frNoAdd : '⚠️'); });
    }
    body.querySelector('.fradd').onclick = function () { var v = inp.value.trim(); if (v) add(v); };
    inp.onkeydown = function (e) { if (e.key === 'Enter') { var v = inp.value.trim(); if (v) add(v); } };
    inp.oninput = function () { clearTimeout(timer); timer = setTimeout(load, 300); };
    body.querySelector('.frall').onclick = function () {
      if (!confirm(t.frAllQ)) return;
      var b = this; b.disabled = true;
      api('POST', '/api/ag/friends/addall').then(function (r) {
        toast(t.frAllOk + ': ' + r.sent + (r.accepted ? ' · ' + r.accepted + ' ' + t.frAccepted : '') + ' · ' + t.frReload); b.disabled = false; load();
      }).catch(function () { b.disabled = false; });
    };
    sc.onclick = function (e) { var b = e.target.closest('[data-add]'); if (b) { b.disabled = true; add(b.getAttribute('data-add')); } };
    load();
  }
  window.agOpenFriends = function () { open('add'); };

  function showDms() {
    body.innerHTML = '<div class="bar" style="border-top:0;border-bottom:2px solid #e6d7ad"><input placeholder="🔎 ' + t.search + '"></div><div class="sc"></div>';
    var inp = body.querySelector('input'), sc = body.querySelector('.sc'), timer;
    function row(u, right) {
      return '<div class="row" data-u="' + esc(u.name) + '">' + av(u) + '<div class="bb"><div class="nm">' + esc(u.name) + '</div>' + right + '</div></div>';
    }
    function playerRow(p) { return row(p, '<div class="last"><span class="sd ' + p.status + '"></span>' + stText(p) + ' · ' + t.lvl + ' ' + p.level + '</div>'); }
    function convs() {
      if (inp.value.trim()) return;
      Promise.all([api('GET', '/api/ag/dm'), api('GET', '/api/ag/players')]).then(function (r) {
        if (inp.value.trim()) return;
        var list = r[0], players = r[1], h = '';
        if (list.length) {
          h += '<div class="sub">' + t.convs + '</div>' + list.map(function (c) {
            return '<div class="row" data-u="' + esc(c.with.name) + '">' + av(c.with) + '<div class="bb"><div class="nm">' + esc(c.with.name) + '</div><div class="last">' + esc(c.last) + '</div></div>' +
              '<div style="text-align:right"><div class="meta">' + ago(c.at) + '</div>' + (c.unread ? '<span class="badge">' + c.unread + '</span>' : '') + '</div></div>';
          }).join('');
        }
        var on = players.filter(function (p) { return p.status !== 'offline'; });
        h += '<div class="sub">🟢 ' + t.online + ' (' + on.length + ')</div>' + (on.length ? on.map(playerRow).join('') : '<div class="meta" style="padding:0 4px 8px">—</div>');
        var off = players.filter(function (p) { return p.status === 'offline'; }).slice(0, 15);
        if (off.length) h += '<div class="sub">' + t.contacts + '</div>' + off.map(playerRow).join('');
        if (!list.length && !players.length) h = '<div class="empty">' + t.noDm + '</div>';
        sc.innerHTML = h;
      }).catch(function () { });
    }
    inp.oninput = function () {
      clearTimeout(timer); var q = inp.value.trim();
      if (!q) return convs();
      timer = setTimeout(function () {
        api('GET', '/api/ag/players?q=' + encodeURIComponent(q)).then(function (list) {
          sc.innerHTML = list.length ? list.map(playerRow).join('') : '<div class="empty">—</div>';
        }).catch(function () { });
      }, 300);
    };
    sc.onclick = function (e) { var r = e.target.closest('.row'); if (r) openDmWith(r.getAttribute('data-u')); };
    convs(); poll = setInterval(convs, 8000);
  }
  // ---------- soporte ----------
  var KINDS = [['bug', '🐞', 'kBug'], ['ayuda', '🙋', 'kAyuda'], ['sugerencia', '💡', 'kSug'], ['cuenta', '👤', 'kCuenta'], ['otro', '📝', 'kOtro']];
  var supAll = false, supFilter = 'todos';
  function kindIcon(k) { var x = KINDS.filter(function (q) { return q[0] === k; })[0]; return x ? x[1] : '📝'; }
  function stLabel(st) { return t['st' + st.charAt(0).toUpperCase() + st.slice(1)] || st; }
  function showSupport() {
    var isAdmin = me && me.admin;
    body.innerHTML = '<div class="tool"><button class="go" data-a="new">➕ ' + t.newReq + '</button>' +
      (isAdmin ? '<select data-a="scope"><option value="0">' + t.myReqs + '</option><option value="1">' + t.allReqs + '</option></select>' +
        '<select data-a="filter"' + (supAll ? '' : ' style="display:none"') + '><option value="todos">' + t.all + '</option><option value="abierto">' + t.stAbierto + '</option><option value="en_progreso">' + t.stEn_progreso + '</option><option value="resuelto">' + t.stResuelto + '</option><option value="cerrado">' + t.stCerrado + '</option></select>' : '') +
      '</div><div class="sc"></div>';
    var sc = body.querySelector('.sc');
    body.querySelector('[data-a=new]').onclick = newTicket;
    var scope = body.querySelector('[data-a=scope]'), filt = body.querySelector('[data-a=filter]');
    if (scope) { scope.value = supAll ? '1' : '0'; filt.value = supFilter; scope.onchange = function () { supAll = scope.value === '1'; filt.style.display = supAll ? '' : 'none'; load(); }; filt.onchange = function () { supFilter = filt.value; load(); }; }
    function load() {
      api('GET', '/api/ag/support' + (supAll ? '?all=true&status=' + supFilter : '')).then(function (d) {
        if (!d.tickets.length) { sc.innerHTML = '<div class="empty">🆘<br>' + t.noReqs + '</div>'; return; }
        sc.innerHTML = d.tickets.map(function (x) {
          return '<div class="row" data-id="' + x.id + '"><div style="font-size:24px">' + kindIcon(x.kind) + '</div><div class="bb"><div class="nm">#' + x.id + ' · ' + esc(x.title) + '</div>' +
            '<div class="last">' + (supAll ? esc(x.user) + ' · ' : '') + '<span class="chip ' + x.status + '">' + stLabel(x.status) + '</span> · ' + ago(x.updated) + ' · 💬 ' + x.replies + '</div></div>' +
            (x.unread ? '<span class="badge">!</span>' : '') + '</div>';
        }).join('');
      }).catch(function () { });
    }
    sc.onclick = function (e) { var rw = e.target.closest('.row'); if (rw) showTicket(+rw.getAttribute('data-id')); };
    load(); poll = setInterval(load, 15000);
  }
  function newTicket() {
    clearInterval(poll); poll = null;
    var kind = 'bug', photo = null;
    body.innerHTML = '<div class="dmh"><button class="sm" data-a="back">‹ ' + t.back + '</button><div class="sp"><div class="nm">🆘 ' + t.newReq + '</div></div></div>' +
      '<div class="sc form"><div class="kinds">' + KINDS.map(function (k) { return '<button type="button" data-k="' + k[0] + '"' + (k[0] === kind ? ' class="on"' : '') + '>' + k[1] + ' ' + t[k[2]] + '</button>'; }).join('') + '</div>' +
      '<input maxlength="90" placeholder="' + t.reqTitle + '"><textarea rows="6" maxlength="2000" placeholder="' + t.reqText + '"></textarea>' +
      '<div class="pv"></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button type="button" class="sm" data-a="ph">📷 ' + t.attach + '</button><input type="file" accept="image/*" style="display:none"><span style="flex:1"></span><button class="go" data-a="send">' + t.sendReq + '</button></div></div>';
    body.querySelector('[data-a=back]').onclick = showSupport;
    body.querySelectorAll('.kinds button').forEach(function (b) { b.onclick = function () { kind = b.getAttribute('data-k'); body.querySelectorAll('.kinds button').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    var file = body.querySelector('input[type=file]'), pv = body.querySelector('.pv');
    body.querySelector('[data-a=ph]').onclick = function () { file.click(); };
    file.onchange = function () {
      var f = file.files && file.files[0]; file.value = ''; if (!f) return;
      shrink(f).then(function (data) { return api('POST', '/api/ag/upload', { image: data }); }).then(function (r) {
        photo = r.url; pv.innerHTML = '<span class="prev" style="margin:0 0 8px"><img src="' + esc(r.url) + '" alt=""><b>✕</b></span>';
        pv.querySelector('b').onclick = function () { photo = null; pv.innerHTML = ''; };
      }).catch(function (x) { if (x !== 0) toast(t.photoErr); });
    };
    body.querySelector('[data-a=send]').onclick = function () {
      var title = body.querySelector('.form input:not([type=file])').value.trim(), text = body.querySelector('.form textarea').value.trim();
      if (text.length < 5) { body.querySelector('.form textarea').focus(); return; }
      var info = navigator.userAgent + ' · ' + screen.width + 'x' + screen.height + ' · ' + innerWidth + 'x' + innerHeight + ' · ' + (P.locale || lang) + ' · ' + location.pathname;
      api('POST', '/api/ag/support', { kind: kind, title: title, text: text, image: photo, info: info }).then(function (r) { toast(t.sent); showTicket(r.id); }).catch(function () { });
    };
  }
  function showTicket(id) {
    clearInterval(poll); poll = null;
    var sc = chatBox(function (v, img) { api('POST', '/api/ag/support/' + id + '/reply', { text: v, image: img }).then(pull).catch(function () { }); });
    sc.insertAdjacentHTML('beforebegin', '<div class="dmh"><button class="sm" data-a="back">‹ ' + t.back + '</button><div class="sp"></div><span data-a="st"></span></div>');
    var hd = body.querySelector('.dmh');
    hd.querySelector('[data-a=back]').onclick = showSupport;
    var shown = 0;
    function pull() {
      api('GET', '/api/ag/support/' + id).then(function (d) {
        var tk = d.ticket;
        hd.querySelector('.sp').innerHTML = '<div class="nm">' + kindIcon(tk.kind) + ' #' + tk.id + ' · ' + esc(tk.title) + '</div><div class="meta">' + esc(tk.user) + ' · ' + ago(tk.created) + '</div>';
        var st = hd.querySelector('[data-a=st]');
        if (d.admin) {
          if (!st.querySelector('select')) {
            st.innerHTML = '<select class="stsel">' + ['abierto', 'en_progreso', 'resuelto', 'cerrado'].map(function (x) { return '<option value="' + x + '">' + stLabel(x) + '</option>'; }).join('') + '</select>';
            st.querySelector('select').onchange = function () { api('POST', '/api/ag/support/' + id + '/status', { status: this.value }).catch(function () { }); };
          }
          if (document.activeElement !== st.querySelector('select')) st.querySelector('select').value = tk.status;
        } else {
          st.innerHTML = '<span class="chip ' + tk.status + '">' + stLabel(tk.status) + '</span>' + (tk.status !== 'cerrado' ? ' <button class="sm" data-a="close" style="margin-left:4px">✓</button>' : '');
          var cb = st.querySelector('[data-a=close]'); if (cb) { cb.title = t.closeReq; cb.onclick = function () { api('POST', '/api/ag/support/' + id + '/status', { status: 'cerrado' }).then(pull).catch(function () { }); }; }
        }
        var msgs = tk.replies;
        for (var i = shown; i < msgs.length; i++) {
          var m = msgs[i], mine = me && m.from.toLowerCase() === me.name.toLowerCase();
          var who = m.admin ? { name: t.team, avatar: '/ag/allowgames_nav.png' } : { name: m.from, avatar: mine && me ? me.avatar : '/blank.png' };
          sc.insertAdjacentHTML('beforeend', '<div class="msg' + (mine ? ' me' : '') + (m.admin ? ' team' : '') + '">' + av(who) + '<div class="bb"><span class="nm">' + esc(m.admin ? m.from : m.from) + '</span>' + (m.admin ? '<span class="tm">' + t.team + '</span>' : '') + ' <span class="meta">' + ago(m.at) + '</span>' +
            (m.text ? '<div class="tx">' + esc(m.text) + '</div>' : '') + imgHtml(m.image) + '</div></div>');
        }
        if (msgs.length > shown) sc.scrollTop = sc.scrollHeight;
        shown = msgs.length;
        if (tk.info && !sc.querySelector('.info')) sc.insertAdjacentHTML('afterbegin', '<div class="meta info" style="padding:4px 6px 8px;word-break:break-all">🖥️ ' + esc(tk.info) + '</div>');
      }).catch(function () { });
    }
    pull(); poll = setInterval(pull, 5000);
  }

  function openDmWith(name) {
    if (!name || (me && name.toLowerCase() === me.name.toLowerCase())) return;
    dmWith = name; open('dm');
  }
  function showDm(name) {
    lastDm = 0;
    var sc = chatBox(function (v, img) {
      api('POST', '/api/ag/dm/' + encodeURIComponent(name), { text: v, image: img }).then(function () { snd('send', 'sndMsg'); pull(); }).catch(function (j) { if (j && j.error === 'blocked') toast(t.blocked); });
    });
    sc.insertAdjacentHTML('beforebegin', '<div class="dmh"><button class="sm" data-a="back">‹ ' + t.back + '</button><div class="sp"><div class="nm"></div></div><button class="sm" data-a="block"></button></div>');
    var hd = body.querySelector('.dmh');
    hd.querySelector('[data-a=back]').onclick = function () { dmWith = null; open('dm'); };
    hd.querySelector('[data-a=block]').onclick = function () {
      api('POST', '/api/ag/block/' + encodeURIComponent(name)).then(function (r) { hd.querySelector('[data-a=block]').textContent = r.blocked ? t.unblock : t.block; if (r.blocked) toast(t.blocked); }).catch(function () { });
    };
    function pull() {
      api('GET', '/api/ag/dm/' + encodeURIComponent(name) + '?after=' + lastDm).then(function (d) {
        hd.querySelector('.sp').innerHTML = '<div class="nm">' + esc(d.with.name) + '</div><div class="meta"><span class="sd ' + d.with.status + '"></span>' + stText(d.with) + ' · ' + t.lvl + ' ' + d.with.level + '</div>';
        hd.querySelector('[data-a=block]').textContent = d.blocked ? t.unblock : t.block;
        if (lastDm && incoming(d.messages)) snd('recv', 'sndMsg');
        if (d.messages.length) lastDm = d.messages[d.messages.length - 1].id;
        append(sc, d.messages, false);
        if (!lastDm && !sc.children.length) sc.innerHTML = '<div class="empty">✉️</div>';
      }).catch(function () { });
    }
    pull(); poll = setInterval(pull, 3000);
  }

  // ---------- boton al lado del BETA + aviso de mensajes nuevos ----------
  function setBadge(n) {
    var b = document.getElementById('agCmBadge'), tb = document.getElementById('agCmTabBadge');
    if (b) { b.textContent = n > 99 ? '99+' : n; b.style.display = n ? '' : 'none'; if (n && n > (setBadge.last || 0)) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } }
    setBadge.last = n;
    if (!setBadge.title) setBadge.title = document.title.replace(/^\(\d+\+?\) /, '');
    document.title = (n ? '(' + (n > 99 ? '99+' : n) + ') ' : '') + setBadge.title;
    var dmN = me ? me.unread : n; if (tb) { tb.textContent = dmN; tb.style.display = dmN ? '' : 'none'; }
  }
  var lastNotified = null;
  function paintBtn() {
    var d = document.getElementById('agCmSd'); if (d && me) d.className = 'sd ' + (me.status || 'online');
  }
  function notify(m) {
    if (!m || (me && me.status === 'busy')) return;
    if (root && root.classList.contains('on') && tab === 'dm' && dmWith && dmWith.toLowerCase() === m.from.name.toLowerCase()) return;
    var old = document.getElementById('agNt'); if (old) old.remove();
    if (!pref('ntMsg')) return;
    snd('notify', 'sndMsg');
    var n = document.createElement('div'); n.id = 'agNt';
    n.innerHTML = '<img src="' + esc(m.from.avatar || '/blank.png') + '" alt="" onerror="this.src=\'/blank.png\'"><div class="bb"><div class="t">✉️ ' + t.newMsg + '</div><b>' + esc(m.from.name) + '</b><span>' + esc(m.text) + '</span></div>';
    n.onclick = function () { n.remove(); openDmWith(m.from.name); };
    document.body.appendChild(n);
    setTimeout(function () { if (n.parentNode) n.remove(); }, 7000);
  }
  var lastNote = null;
  function noteFriend(n) {
    if (me && me.status === 'busy') return;
    if (!pref(n.kind === 'help' ? 'ntHelp' : 'ntReq')) return;
    snd('notify', 'sndReq');
    var old = document.getElementById('agNt'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'agNt';
    el.innerHTML = '<img src="' + esc(n.from.avatar || '/blank.png') + '" alt="" onerror="this.src=\'/blank.png\'"><div class="bb"><div class="t">' + (n.kind === 'help' ? '🤝 ' + t.wall : '👥 ' + (n.kind === 'acc' ? t.frNewFriend : t.frNewReq)) + '</div><b>' + esc(n.from.name) + '</b><span>' + (n.kind === 'help' ? t.frGotHelp : n.kind === 'acc' ? t.frGotAcc : t.frGotReq) + '</span></div>';
    el.onclick = function () { el.remove(); open(n.kind === 'help' ? 'wall' : 'add'); };
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 8000);
    if (root && root.classList.contains('on') && tab === 'add') open('add');
  }
  function refreshMe() {
    fetch('/api/ag/me', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d) return;
      me = d; setBadge(d.unread + (d.support || 0) + (d.supportAdmin || 0) + (d.requests || 0)); paintBtn();
      var fb = document.getElementById('agCmFrBadge'); if (fb) { fb.textContent = d.requests || 0; fb.style.display = d.requests ? '' : 'none'; }
      var ln = d.lastNote;
      if (ln && lastNote !== null && ln.id > lastNote) noteFriend(ln);
      lastNote = ln ? Math.max(ln.id, lastNote || 0) : (lastNote || 0);
      var sb = document.getElementById('agCmSupBadge'), sn = (d.support || 0) + (d.supportAdmin || 0); if (sb) { sb.textContent = sn; sb.style.display = sn ? '' : 'none'; }
      var sel = root && root.querySelector('.stsel'); if (sel && document.activeElement !== sel) sel.value = d.status || 'online';
      var lu = d.lastUnread;
      if (lu && lastNotified !== null && lu.id > lastNotified) notify(lu);
      lastNotified = lu ? Math.max(lu.id, lastNotified || 0) : (lastNotified || 0);
    }).catch(function () { });
  }
  function addButton() {
    var beta = document.querySelector('.ag-beta'); if (!beta || document.getElementById('agCmBtn')) return;
    var btn = document.createElement('button');
    btn.id = 'agCmBtn'; btn.type = 'button'; btn.title = t.title;
    btn.innerHTML = '💬 <span class="lb">' + t.title + '</span> <span class="sd online" id="agCmSd"></span> <span class="badge" id="agCmBadge" style="display:none"></span>';
    btn.onclick = function (e) { e.preventDefault(); e.stopPropagation(); if (root && root.classList.contains('on')) close(); else open(tab); };
    var brand = beta.closest('a');
    (brand && brand.parentNode ? brand.parentNode.insertBefore(btn, brand.nextSibling) : beta.parentNode.appendChild(btn));
  }
  // ---------- lo que el juego compartia en Facebook ahora va al muro ----------
  function gameFlash() { return document.getElementById('flashapp'); }
  function afterShare(result) {
    var f = gameFlash();
    try { if (f && f.logCloseFeedDialog) f.logCloseFeedDialog(result); } catch (e) { }
    try { if (f && f.thawGame) f.thawGame(); } catch (e) { }
    try { if (f && f.enableAllInput) f.enableAllInput(); } catch (e) { }
  }
  function shareDialog(data) {
    var old = document.getElementById('agSh'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'agSh';
    d.innerHTML = '<div class="c"><h3>📣 ' + t.shareTitle + '</h3><div class="in">' + (data.image ? '<img src="' + esc(data.image) + '" alt="" onerror="this.remove()">' : '<div style="font-size:48px">🏙️</div>') +
      '<div style="min-width:0"><b>' + esc(data.wishlist ? '🎁 ' + t.wishTitle : data.title) + '</b><p>' + esc(data.wishlist ? (data.title || '') : data.text) + '</p></div></div>' +
      '<div class="bt"><button class="no">' + t.cancel + '</button><button class="yes">' + t.shareBtn + '</button></div></div>';
    document.body.appendChild(d);
    ['keydown', 'keyup', 'keypress'].forEach(function (ev) { d.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    d.querySelector('.no').onclick = function () { d.remove(); afterShare('null'); };
    d.querySelector('.yes').onclick = function () {
      this.disabled = true;
      api('POST', '/api/ag/share', data).then(function () { d.remove(); afterShare('published'); toast2(t.shared); })
        .catch(function (j) { d.remove(); afterShare('null'); toast2(j && j.error === 'wait' ? t.shareWait : j && j.error === 'empty' ? t.wishEmpty : '⚠️'); });
    };
  }
  function toast2(msg) { if (root && root.classList.contains('on')) return toast(msg); var n = document.createElement('div'); n.id = 'agNt'; n.innerHTML = '<div class="bb"><b>💬 ' + t.title + '</b><span>' + esc(msg) + '</span></div>'; n.onclick = function () { n.remove(); open('wall'); }; var o = document.getElementById('agNt'); if (o) o.remove(); document.body.appendChild(n); setTimeout(function () { if (n.parentNode) n.remove(); }, 5000); }
  function fromGame(att, links) {
    att = att || {}; links = links || [];
    if (typeof att === 'string') { try { att = JSON.parse(att); } catch (e) { att = { name: att }; } }
    if (typeof links === 'string') { try { links = JSON.parse(links); } catch (e) { links = []; } }
    var media = (att.media && att.media[0]) || {};
    var raw = ''; try { raw = JSON.stringify([att, links]); } catch (e) { }
    var data = {
      title: String(att.name || att.title || t.fromGame).slice(0, 120),
      text: String(att.description || att.caption || att.message || '').slice(0, 400),
      image: media.src || att.image || att.picture || null,
      action: (links[0] && (links[0].text || links[0].name)) || null,
      wishlist: /wishlist/i.test(raw)
    };
    console.log('[AG] compartir desde el juego', data);
    shareDialog(data);
    return true;
  }
  window.streamPublish = function (attachment, actionLinks) { fromGame(attachment, actionLinks); };
  window.snapiStreamPublish = function (payload) { var p = payload || {}; fromGame(p.attachment || p, p.action_links || p.actionLinks); };
  window.showFeedDialog = function (tpl, data) { var d = data || {}; fromGame({ name: d.title || d.name, description: d.body || d.description, media: d.images ? [{ src: (d.images[0] || {}).src }] : null }, d.action_links || []); };

  // pedidos a vecinos (pedir piezas, energia, ayuda): tambien al muro
  window.sendRequest = function (a, b, c, d) {
    console.log('[AG] sendRequest', a, b, c, d);
    var o = [a, b, c, d].filter(function (x) { return x && typeof x === 'object'; })[0] || {};
    var txt = [a, b, c, d].filter(function (x) { return typeof x === 'string' && x.length > 3 && x.length < 300 && !/^https?:/.test(x); });
    fromGame({ name: o.title || o.name || txt[0] || t.fromGame, description: o.message || o.body || txt[1] || '', media: o.image ? [{ src: o.image }] : (o.img ? [{ src: o.img }] : null) }, o.action_links || []);
  };
  // El juego de 2012 pedia permisos de Facebook antes de publicar y se quedaba "publicando" esperando
  // respuesta. Aqui contestamos como lo hacia Facebook: permiso concedido y la historia va al muro.
  function flashCall(name) {
    var f = gameFlash(), args = [].slice.call(arguments, 1);
    try { if (f && typeof f[name] === 'function') { f[name].apply(f, args); return true; } } catch (e) { console.warn('[AG] ' + name, e); }
    return false;
  }
  var lastPerm = 0;
  window.showStreamPermissions = function () {
    console.log('[AG] showStreamPermissions');
    var now = Date.now(); if (now - lastPerm < 4000) { afterShare('null'); return; }
    lastPerm = now;
    // el juego espera permissionDialogClosed(permiso, concedido) y entonces publica de verdad
    setTimeout(function () {
      if (!flashCall('permissionDialogClosed', 'publish_stream', true)) flashCall('extendedPermissionsDialogClosed');
    }, 50);
  };
  window.showPostTOSPermissions = function () { setTimeout(function () { flashCall('onShowPostTOSPermissionsClose', true); flashCall('thawGame'); flashCall('enableAllInput'); }, 50); };
  window.showBookmarkDialog = window.showEmailPermission = function () { setTimeout(function () { flashCall('thawGame'); flashCall('enableAllInput'); }, 50); };
  // "compartir por enlace" (sin permisos): tambien al muro
  window.fbFeedShareViaLink = function (url) {
    console.log('[AG] fbFeedShareViaLink', url);
    var q = {}; try { String(url).split('?')[1].split('&').forEach(function (kv) { var i = kv.indexOf('='); if (i > 0) q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' ')); }); } catch (e) { }
    fromGame({ name: q.title, description: q.description, media: q.imageUrl ? [{ src: q.imageUrl }] : null }, []);
  };
  // pedidos nuevos (version 2.0): piezas, energia, ayuda de vecinos
  window.sendRequest2_0 = function (req) {
    console.log('[AG] sendRequest2_0', req);
    var o = req; if (typeof o === 'string') { try { o = JSON.parse(o); } catch (e) { o = { message: o }; } } o = o || {};
    var d = o.requestData || o.data || {}; if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { d = {}; } }
    fromGame({ name: o.title || d.title || o.message || t.fromGame, description: o.message && o.title ? o.message : (d.message || ''), media: (o.image || d.image || d.img) ? [{ src: o.image || d.image || d.img }] : null }, o.action_links || []);
    setTimeout(function () { flashCall('onRequestSent', { request: 'ag', to: [] }); }, 100);
    return true;
  };
  // por si el juego usa el puente viejo de Facebook (FB.Facebook.apiClient)
  if (!window.FB) window.FB = {};
  if (!window.FB.Facebook) window.FB.Facebook = { apiClient: { callMethod: function (method, args, cb) {
    var m = String(method || '').toLowerCase(), r = null;
    if (m.indexOf('hasapppermission') >= 0) r = 1;
    else if (m.indexOf('getappusers') >= 0 || m.indexOf('friends.get') >= 0) r = [];
    else if (m.indexOf('users.getinfo') >= 0) { try { r = [getUserInfo()]; } catch (e) { r = []; } }
    setTimeout(function () { try { if (cb) cb(r, null); } catch (e) { } }, 0);
  } } };
  window.agOpenCommunity = function (which) { open(which); };
  window.agOpenSupport = function () { open('sup'); };
  function init() { addButton(); refreshMe(); setInterval(refreshMe, 5000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
