// CityVille Revived - Allow Games: chat en ventanitas abajo, como el chat de Facebook 2011 pero con la cara del juego.
// Visto / entregado, hora y dia, escribiendo..., emojis, stickers, fotos y estado (en linea, ausente, no molestar, desconectado).
(function () {
  if (window.agChat) return;
  var C = window.AGC;
  if (!C) return; // necesita community.js
  var lang = C.lang;
  var L = {
    es: { chat: 'Chat', online: 'En línea', idle: 'Ausente', busy: 'No molestar', offline: 'Desconectado', invisible: 'Invisible', seen: 'Visto', sent: 'Enviado', delivered: 'Entregado', failed: 'No se envió. Toca para reintentar', typing: 'está escribiendo', today: 'Hoy', yesterday: 'Ayer', ph: 'Escribe un mensaje…', search: 'Buscar jugadores…', friends: 'Amigos', nowOn: 'Conectados ahora', convs: 'Conversaciones', none: 'Nadie conectado ahora mismo.', noFriends: 'Todavía no tienes amigos. ¡Agrégalos desde Comunidad!', blocked: 'No puedes escribirle a este jugador.', min: 'Minimizar', close: 'Cerrar', lvl: 'Nv.', ago: 'hace', say: '¡Salúdalo! 👋', slow: 'Más despacio 🙂', photo: 'Foto', you: 'Tú: ', sticker: 'Sticker', status: 'Tu estado', lastSeen: 'Últ. vez', help: 'necesita ayuda', helpBtn: 'Ayudar', helpWish: 'quiere', helpEnergy: 'pide energía ⚡', helped: '¡Ayudaste! +50 monedas', helpSeen: 'Ver', helpErr: 'Ya no se puede ayudar' },
    en: { chat: 'Chat', online: 'Online', idle: 'Idle', busy: 'Do not disturb', offline: 'Offline', invisible: 'Invisible', seen: 'Seen', sent: 'Sent', delivered: 'Delivered', failed: 'Not sent. Tap to retry', typing: 'is typing', today: 'Today', yesterday: 'Yesterday', ph: 'Type a message…', search: 'Search players…', friends: 'Friends', nowOn: 'Online now', convs: 'Conversations', none: 'Nobody is online right now.', noFriends: 'No friends yet. Add some from Community!', blocked: "You can't message this player.", min: 'Minimize', close: 'Close', lvl: 'Lv.', ago: '', say: 'Say hi! 👋', slow: 'Slow down 🙂', photo: 'Photo', you: 'You: ', sticker: 'Sticker', status: 'Your status', lastSeen: 'Last seen', help: 'needs help', helpBtn: 'Help', helpWish: 'wants', helpEnergy: 'is asking for energy ⚡', helped: 'You helped! +50 coins', helpSeen: 'View', helpErr: "Can't help anymore" },
    pt: { chat: 'Chat', online: 'Online', idle: 'Ausente', busy: 'Não perturbe', offline: 'Offline', invisible: 'Invisível', seen: 'Visto', sent: 'Enviado', delivered: 'Entregue', failed: 'Não enviado. Toque para tentar de novo', typing: 'está digitando', today: 'Hoje', yesterday: 'Ontem', ph: 'Escreva uma mensagem…', search: 'Buscar jogadores…', friends: 'Amigos', nowOn: 'Online agora', convs: 'Conversas', none: 'Ninguém online agora.', noFriends: 'Você ainda não tem amigos. Adicione pela Comunidade!', blocked: 'Você não pode mandar mensagem para este jogador.', min: 'Minimizar', close: 'Fechar', lvl: 'Nv.', ago: 'há', say: 'Diga oi! 👋', slow: 'Mais devagar 🙂', photo: 'Foto', you: 'Você: ', sticker: 'Sticker', status: 'Seu status', lastSeen: 'Visto por último', help: 'precisa de ajuda', helpBtn: 'Ajudar', helpWish: 'quer', helpEnergy: 'pede energia ⚡', helped: 'Você ajudou! +50 moedas', helpSeen: 'Ver', helpErr: 'Não dá mais para ajudar' },
    fr: { chat: 'Chat', online: 'En ligne', idle: 'Absent', busy: 'Ne pas déranger', offline: 'Hors ligne', invisible: 'Invisible', seen: 'Vu', sent: 'Envoyé', delivered: 'Distribué', failed: 'Non envoyé. Touche pour réessayer', typing: 'écrit', today: "Aujourd'hui", yesterday: 'Hier', ph: 'Écris un message…', search: 'Chercher des joueurs…', friends: 'Amis', nowOn: 'En ligne', convs: 'Conversations', none: "Personne n'est en ligne.", noFriends: "Pas encore d'amis. Ajoute-en depuis la Communauté !", blocked: 'Tu ne peux pas écrire à ce joueur.', min: 'Réduire', close: 'Fermer', lvl: 'Niv.', ago: 'il y a', say: 'Dis bonjour ! 👋', slow: 'Doucement 🙂', photo: 'Photo', you: 'Toi : ', sticker: 'Sticker', status: 'Ton statut', lastSeen: 'Vu', help: "a besoin d'aide", helpBtn: 'Aider', helpWish: 'veut', helpEnergy: "demande de l'énergie ⚡", helped: 'Tu as aidé ! +50 pièces', helpSeen: 'Voir', helpErr: 'Impossible d\'aider' },
    it: { chat: 'Chat', online: 'Online', idle: 'Assente', busy: 'Non disturbare', offline: 'Offline', invisible: 'Invisibile', seen: 'Visto', sent: 'Inviato', delivered: 'Consegnato', failed: 'Non inviato. Tocca per riprovare', typing: 'sta scrivendo', today: 'Oggi', yesterday: 'Ieri', ph: 'Scrivi un messaggio…', search: 'Cerca giocatori…', friends: 'Amici', nowOn: 'Online ora', convs: 'Conversazioni', none: 'Nessuno è online adesso.', noFriends: 'Ancora nessun amico. Aggiungili dalla Comunità!', blocked: 'Non puoi scrivere a questo giocatore.', min: 'Riduci', close: 'Chiudi', lvl: 'Liv.', ago: '', say: 'Salutalo! 👋', slow: 'Più piano 🙂', photo: 'Foto', you: 'Tu: ', sticker: 'Sticker', status: 'Il tuo stato', lastSeen: 'Ultimo accesso', help: 'ha bisogno di aiuto', helpBtn: 'Aiuta', helpWish: 'vuole', helpEnergy: 'chiede energia ⚡', helped: 'Hai aiutato! +50 monete', helpSeen: 'Vedi', helpErr: 'Non si può più aiutare' },
    de: { chat: 'Chat', online: 'Online', idle: 'Abwesend', busy: 'Nicht stören', offline: 'Offline', invisible: 'Unsichtbar', seen: 'Gesehen', sent: 'Gesendet', delivered: 'Zugestellt', failed: 'Nicht gesendet. Tippen zum Wiederholen', typing: 'schreibt', today: 'Heute', yesterday: 'Gestern', ph: 'Nachricht schreiben…', search: 'Spieler suchen…', friends: 'Freunde', nowOn: 'Jetzt online', convs: 'Unterhaltungen', none: 'Gerade ist niemand online.', noFriends: 'Noch keine Freunde. Füge welche in der Community hinzu!', blocked: 'Du kannst diesem Spieler nicht schreiben.', min: 'Minimieren', close: 'Schließen', lvl: 'Lv.', ago: 'vor', say: 'Sag hallo! 👋', slow: 'Langsamer 🙂', photo: 'Foto', you: 'Du: ', sticker: 'Sticker', status: 'Dein Status', lastSeen: 'Zuletzt', help: 'braucht Hilfe', helpBtn: 'Helfen', helpWish: 'wünscht', helpEnergy: 'bittet um Energie ⚡', helped: 'Geholfen! +50 Münzen', helpSeen: 'Ansehen', helpErr: 'Hilfe nicht mehr möglich' }
  };
  var T = L[lang] || L.es;
  var esc = C.esc, api = C.api;

  var css = '' +
    '#agDock,#agDock *{box-sizing:border-box}#agDock{position:fixed;right:10px;bottom:0;z-index:99990;font-family:CV,sans-serif;color:#21445a;-webkit-user-select:none;user-select:none;pointer-events:none}' +
    '#agDock input{-webkit-user-select:text;user-select:text}#agDock>*{pointer-events:auto}' +
    // barra
    '#agDockBar{position:fixed;right:10px;bottom:0;width:220px;height:40px;display:flex;align-items:center;gap:8px;padding:0 12px;border:3px solid #1c6e9c;border-bottom:0;border-radius:14px 14px 0 0;background:linear-gradient(#5cc0f2,#2f8fc4);color:#fff;font:700 16px CV,sans-serif;cursor:pointer;box-shadow:0 -3px 0 rgba(0,0,0,.12);text-shadow:0 1px 0 rgba(0,0,0,.35)}' +
    '#agDockBar:hover{background:linear-gradient(#6fcaf6,#3a9cd2)}#agDockBar .ic{width:26px;height:26px;filter:drop-shadow(0 2px 0 rgba(0,0,0,.25))}#agDockBar .n{font-size:13px;opacity:.9}#agDockBar .sp{flex:1}' +
    '#agDockBar .bdg,.agdw .bdg,#agDockList .bdg{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#e8382f;color:#fff;font:700 12px/20px CV,sans-serif;text-align:center;border:2px solid #fff;text-shadow:none}' +
    // puntitos de estado (como Discord)
    '.agsd{display:inline-block;width:11px;height:11px;border-radius:50%;border:2px solid #fff;background:#b9c3c9;flex:0 0 11px}.agsd.online{background:#42b72a}.agsd.idle{background:#f5b81c;box-shadow:inset -3px -2px 0 #fff}.agsd.busy{background:#e8382f;box-shadow:inset 0 0 0 2px #e8382f,inset 0 -1px 0 4px #fff}' +
    '.agav{position:relative;flex:0 0 auto;display:inline-block}.agav img{display:block;border-radius:50%;object-fit:cover;background:#dff2ff;border:2px solid #2f8fc4}.agav .agsd{position:absolute;right:-2px;bottom:-1px}' +
    // lista
    '#agDockList{position:fixed;right:10px;bottom:40px;width:280px;max-height:min(70vh,520px);display:none;flex-direction:column;background:#fffdf4;border:3px solid #1c6e9c;border-radius:16px 16px 0 0;box-shadow:0 -6px 0 rgba(0,0,0,.1),0 10px 30px rgba(0,0,0,.25);overflow:hidden}' +
    '#agDockList.on{display:flex}#agDockList .lh{display:flex;align-items:center;gap:6px;padding:8px;background:#2f8fc4;color:#fff}#agDockList .lh select{flex:1;border:2px solid #1c6e9c;border-radius:999px;font:700 13px CV,sans-serif;padding:3px 8px;color:#0a5f8c;background:#fff}' +
    '#agDockList .q{margin:8px;border:2px solid #9fd0ec;border-radius:999px;padding:6px 12px;font:600 14px CV,sans-serif;outline:0;color:#21445a}#agDockList .q:focus{border-color:#2f8fc4}' +
    '#agDockList .ls{overflow:auto;flex:1;padding:0 6px 8px}#agDockList .sub{font:700 12px CV,sans-serif;color:#8a7a4f;text-transform:uppercase;letter-spacing:.04em;padding:8px 6px 4px}' +
    '#agDockList .row{display:flex;align-items:center;gap:9px;padding:6px;border-radius:12px;cursor:pointer}#agDockList .row:hover{background:#e9f6ff}#agDockList .row .tx2{flex:1;min-width:0}' +
    '#agDockList .row b{display:block;color:#0a5f8c;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#agDockList .row small{display:block;color:#7b8b95;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#agDockList .row.unr b,#agDockList .row.unr small{color:#21445a;font-weight:800}' +
    '#agDockList .empty{padding:14px 8px;text-align:center;color:#8a7a4f;font-weight:600;font-size:13px}' +
    // ventanitas
    '.agdw{position:fixed;bottom:0;width:280px;height:380px;display:flex;flex-direction:column;background:#fffdf4;border:3px solid #1c6e9c;border-bottom:0;border-radius:16px 16px 0 0;box-shadow:0 10px 30px rgba(0,0,0,.28);transition:right .2s,height .2s;overflow:hidden}' +
    '.agdw.min{height:40px}.agdw.flash .wh{animation:agDwFlash .9s ease-in-out 4}@keyframes agDwFlash{50%{background:linear-gradient(#ffe36b,#f5b81c)}}' +
    '.agdw .wh{display:flex;align-items:center;gap:8px;height:37px;flex:0 0 37px;padding:0 6px 0 8px;background:linear-gradient(#5cc0f2,#2f8fc4);color:#fff;cursor:pointer;text-shadow:0 1px 0 rgba(0,0,0,.35)}' +
    '.agdw .wh .nm{flex:1;min-width:0;line-height:1.05}.agdw .wh .nm b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.agdw .wh .nm small{display:block;font-size:11px;opacity:.95;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.agdw .wb{width:26px;height:26px;border:0;border-radius:50%;background:rgba(255,255,255,.2);color:#fff;font:700 16px/26px CV,sans-serif;cursor:pointer;padding:0;text-shadow:none}.agdw .wb:hover{background:rgba(255,255,255,.4)}' +
    '.agdw .ms{flex:1;overflow:auto;padding:8px 8px 4px;background:#fffdf4}' +
    '.agdw .day{text-align:center;margin:8px 0 6px}.agdw .day span{display:inline-block;background:#e9f6ff;color:#0a5f8c;border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700}' +
    '.agdw .g{display:flex;gap:6px;align-items:flex-end;margin:3px 0}.agdw .g.me{flex-direction:row-reverse}.agdw .g .agav{visibility:hidden}.agdw .g.first .agav{visibility:visible}' +
    '.agdw .g .col{display:flex;flex-direction:column;max-width:78%;align-items:flex-start}.agdw .g.me .col{align-items:flex-end}' +
    '.agdw .bu{background:#fff;border:2px solid #e6d7ad;border-radius:16px 16px 16px 4px;padding:6px 10px;font:600 14px/1.3 CV,sans-serif;color:#21445a;word-wrap:break-word;overflow-wrap:anywhere;white-space:pre-wrap;-webkit-user-select:text;user-select:text}' +
    '.agdw .g.me .bu{background:linear-gradient(#6fcaf6,#3a9cd2);border-color:#2f8fc4;color:#fff;border-radius:16px 16px 4px 16px;text-shadow:0 1px 0 rgba(0,0,0,.2)}' +
    '.agdw .bu.st{background:transparent!important;border-color:transparent!important;padding:0}.agdw .bu .tx{white-space:pre-wrap}' +
    '.agdw .stk{display:block;width:92px;height:92px;object-fit:contain;filter:drop-shadow(0 3px 0 rgba(0,0,0,.15));animation:agDwStk .45s cubic-bezier(.3,1.6,.5,1)}.agdw .stk.ic{width:56px;height:56px}@keyframes agDwStk{from{transform:scale(.3)}to{transform:none}}' +
    '.agdw .ph{display:block;max-width:180px;max-height:180px;border-radius:12px;margin-top:4px;cursor:zoom-in;border:2px solid #e6d7ad}' +
    '.agdw .tm{font-size:10.5px;color:#9aa6ad;margin:2px 4px 0;font-weight:600}.agdw .rc{font-size:11px;color:#2f8fc4;margin:2px 4px 0;font-weight:700;text-align:right}.agdw .rc.fail{color:#e8382f;cursor:pointer}' +
    '.agdw .pend{opacity:.6}.agdw .typ{font-size:12px;color:#7b8b95;padding:0 10px 4px;height:18px;font-weight:600}.agdw .typ i{display:inline-block;width:5px;height:5px;margin-left:2px;border-radius:50%;background:#2f8fc4;animation:agDwDot 1s infinite}.agdw .typ i:nth-child(2){animation-delay:.15s}.agdw .typ i:nth-child(3){animation-delay:.3s}@keyframes agDwDot{50%{transform:translateY(-4px);opacity:.4}}' +
    '.agdw .hi{text-align:center;color:#8a7a4f;font-weight:700;padding:30px 10px 10px}.agdw .hi img{width:70px;display:block;margin:0 auto 6px}' +
    '.agdw .bar{position:relative;display:flex;gap:4px;align-items:center;padding:6px;border-top:2px solid #e6d7ad;background:#fffdf6}' +
    '.agdw .bar .ti{flex:1;min-width:0;border:2px solid #9fd0ec;border-radius:999px;padding:6px 10px;font:600 14px CV,sans-serif;outline:0;color:#21445a}.agdw .bar .ti:focus{border-color:#2f8fc4}.agdw .bar .ti:disabled{background:#f1f1f1}' +
    '.agdw .go{width:34px;height:34px;flex:0 0 34px;border:0;border-radius:50%;background:linear-gradient(#8ee05a,#4caf27);color:#fff;font-size:16px;cursor:pointer;box-shadow:0 3px 0 #2f7d17}.agdw .go:active{transform:translateY(2px);box-shadow:0 1px 0 #2f7d17}' +
    '.agdw .tools{display:flex;gap:3px}.agdw .tb{width:30px;height:30px;flex:0 0 30px;border:2px solid #9fd0ec;border-radius:50%;background:#fff;color:#2f8fc4;font-size:15px;line-height:1;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center}.agdw .tb img.agi{width:20px;height:20px;margin:0}' +
    '.agdw .emo{position:absolute;bottom:100%;left:4px;right:4px;background:#fff;border:3px solid #1c6e9c;border-radius:14px;padding:6px;display:none;flex-direction:column;max-height:230px;z-index:3;box-shadow:0 6px 0 rgba(0,0,0,.15)}.agdw .emo.on{display:flex}' +
    '.agdw .et{display:flex;gap:6px;margin-bottom:6px}.agdw .et button{flex:1;display:flex;align-items:center;justify-content:center;gap:2px;border:2px solid #9fd0ec;border-radius:999px;background:#fff;color:#0a5f8c;font:700 12px CV,sans-serif;padding:3px 6px;cursor:pointer}.agdw .et button.on{background:#2f8fc4;border-color:#1c6e9c;color:#fff}.agdw .et img.agi{width:16px;height:16px;margin:0}' +
    '.agdw .ep{display:none;overflow:auto;gap:2px;grid-template-columns:repeat(7,1fr)}.agdw .ep.on{display:grid}.agdw .ep.s{grid-template-columns:repeat(4,1fr);gap:4px}' +
    '.agdw .em{border:0;background:none;font-size:20px;cursor:pointer;padding:2px;border-radius:8px}.agdw .em:hover{background:#e9f6ff}.agdw .sk{border:0;padding:3px;border-radius:10px;background:#f6fbff;cursor:pointer}.agdw .sk:hover{background:#d9efff}.agdw .sk img{display:block;width:100%;height:46px;object-fit:contain}' +
    '.agdw .note{padding:6px 10px;font-size:12px;color:#e8382f;font-weight:700;text-align:center;background:#fff3f2}' +
    '#agNt{bottom:56px!important}' +
    '#agHelp{position:fixed;left:10px;bottom:10px;z-index:99991;display:flex;flex-direction:column-reverse;gap:8px;width:min(330px,calc(100vw - 20px));pointer-events:none}' +
    '#agHelp .hc{pointer-events:auto;display:flex;gap:9px;align-items:center;background:#fffdf4;border:3px solid #1c6e9c;border-radius:16px;padding:8px 10px;box-shadow:0 6px 0 rgba(0,0,0,.15),0 10px 24px rgba(0,0,0,.25);animation:agHcIn .45s cubic-bezier(.3,1.6,.5,1)}' +
    '@keyframes agHcIn{from{transform:translateX(-120%)}}#agHelp .hc.out{transition:opacity .3s,transform .3s;opacity:0;transform:translateX(-40px)}' +
    '#agHelp .tx3{flex:1;min-width:0}#agHelp .tx3 b{display:block;color:#0a5f8c;font-size:14px}#agHelp .tx3 small{display:block;color:#5a6b74;font-size:12px;line-height:1.25;max-height:2.5em;overflow:hidden}' +
    '#agHelp .it{width:38px;height:38px;object-fit:contain;flex:0 0 38px}#agHelp .hb{display:flex;flex-direction:column;gap:4px}' +
    '#agHelp .hb button{border:0;border-radius:999px;padding:5px 12px;font:700 13px CV,sans-serif;cursor:pointer;white-space:nowrap}#agHelp .hb .y{background:linear-gradient(#8ee05a,#4caf27);color:#fff;box-shadow:0 3px 0 #2f7d17;text-shadow:0 1px 0 rgba(0,0,0,.25)}' +
    '#agHelp .hb .v{background:#e9f6ff;color:#0a5f8c}#agHelp .hb .y:disabled{filter:grayscale(1);opacity:.6}#agHelp .ok{color:#2c7710;font-weight:700;font-size:13px}' +
    '#agHelp ' +
    '@media (max-width:640px){#agHelp{bottom:50px}}' +
    '@media (max-width:640px){#agDockBar{width:auto;min-width:120px;right:6px}#agDockList{right:0;left:0;width:auto}.agdw{width:calc(100vw - 12px)!important;right:6px!important;height:min(70vh,440px)}.agdw.min{height:40px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------- estado guardado (que ventanas estaban abiertas) ----------
  var SAVE = 'agDock1';
  function load() { try { return JSON.parse(localStorage.getItem(SAVE)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(SAVE, JSON.stringify({ wins: wins.map(function (w) { return { name: w.name, min: w.min }; }) })); } catch (e) { } }

  var helpAfter = -1, helpBox = null;
  var root, bar, list, wins = [], meStatus = 'online', unread = 0, listData = null, lastAct = Date.now(), typingTo = null, ticking = false, lastTick = 0;
  var narrow = function () { return innerWidth <= 640; };
  function maxWins() { return narrow() ? 1 : Math.max(1, Math.min(3, Math.floor((innerWidth - 250) / 290))); }

  function stText(u) {
    if (!u) return '';
    if (u.status === 'online') return T.online; if (u.status === 'idle') return T.idle; if (u.status === 'busy') return T.busy;
    return u.seen ? T.lastSeen + ' ' + ago(u.seen) : T.offline;
  }
  function ago(iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000, v;
    if (s < 3600) v = Math.max(1, Math.floor(s / 60)) + ' min'; else if (s < 86400) v = Math.floor(s / 3600) + ' h'; else v = Math.floor(s / 86400) + ' d';
    return (T.ago ? T.ago + ' ' : '') + v;
  }
  function hm(d) { try { return d.toLocaleTimeString(lang, { hour: 'numeric', minute: '2-digit' }); } catch (e) { return d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); } }
  function dayLabel(d) {
    var a = new Date(); a.setHours(0, 0, 0, 0); var b = new Date(d); b.setHours(0, 0, 0, 0);
    var diff = Math.round((a - b) / 86400000);
    if (diff === 0) return T.today; if (diff === 1) return T.yesterday;
    try { return d.toLocaleDateString(lang, diff < 7 ? { weekday: 'long', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return d.toDateString(); }
  }
  function av(u, size) { return '<span class="agav"><img src="' + esc((u && u.avatar) || '/blank.png') + '" alt="" style="width:' + size + 'px;height:' + size + 'px" onerror="this.src=\'/blank.png\'"><i class="agsd ' + ((u && u.status) || 'offline') + '"></i></span>'; }
  function mine(m) { var me = C.me(); return me && m.from && m.from.name.toLowerCase() === me.name.toLowerCase(); }
  function stopKeys(el) { ['keydown', 'keyup', 'keypress'].forEach(function (ev) { el.addEventListener(ev, function (e) { e.stopPropagation(); }); }); }

  // ---------- barra de abajo ----------
  function build() {
    root = document.createElement('div'); root.id = 'agDock';
    root.innerHTML = '<div id="agDockList"><div class="lh"><span class="agsd online" id="agDockMeSd"></span><select title="' + T.status + '"><option value="online">' + T.online + '</option><option value="busy">' + T.busy + '</option><option value="invisible">' + T.invisible + '</option></select></div><input class="q" placeholder="' + T.search + '" maxlength="40"><div class="ls"></div></div>' +
      '<div id="agDockBar" role="button"><img class="ic" src="/ag/ic/friends.png" alt=""><span>' + T.chat + '</span><span class="n" id="agDockN"></span><span class="sp"></span><span class="bdg" id="agDockBdg" style="display:none"></span><span class="agsd online" id="agDockSd"></span></div>';
    document.body.appendChild(root);
    bar = root.querySelector('#agDockBar'); list = root.querySelector('#agDockList');
    stopKeys(root);
    bar.onclick = function () { toggleList(); };
    var sel = list.querySelector('select');
    sel.onchange = function () { api('POST', '/api/ag/status', { text: sel.value }).then(function (r) { meStatus = r.status; paintMe(); }).catch(function () { }); };
    var q = list.querySelector('.q'), qt = null;
    q.oninput = function () { clearTimeout(qt); qt = setTimeout(function () { paintList(q.value.trim()); }, 200); };
    list.querySelector('.ls').onclick = function (e) { var r = e.target.closest('.row'); if (r) { openWin(r.getAttribute('data-u'), false, true); if (narrow()) toggleList(false); } };
  }
  function paintMe() {
    ['agDockSd', 'agDockMeSd'].forEach(function (id) { var e = document.getElementById(id); if (e) e.className = 'agsd ' + (meStatus === 'invisible' ? 'offline' : meStatus); });
    var sel = list && list.querySelector('select'); if (sel && document.activeElement !== sel) sel.value = meStatus;
    var b = document.getElementById('agDockBdg'); if (b) { b.textContent = unread > 99 ? '99+' : unread; b.style.display = unread ? '' : 'none'; }
  }
  function toggleList(force) {
    var on = force === undefined ? !list.classList.contains('on') : force;
    list.classList.toggle('on', on);
    if (on) { loadList(); setTimeout(layout, 0); } else layout();
  }
  function loadList() {
    api('GET', '/api/ag/dock/list').then(function (d) { listData = d; paintList(list.querySelector('.q').value.trim()); paintCount(); }).catch(function () { });
  }
  function paintCount() {
    if (!listData) return;
    var n = listData.friends.filter(function (f) { return f.status !== 'offline'; }).length + listData.online.length;
    var e = document.getElementById('agDockN'); if (e) e.textContent = n ? '(' + n + ')' : '';
  }
  function row(u, sub, unr) {
    return '<div class="row' + (unr ? ' unr' : '') + '" data-u="' + esc(u.name) + '">' + av(u, 34) + '<div class="tx2"><b>' + esc(u.name) + '</b><small>' + sub + '</small></div>' + (unr ? '<span class="bdg">' + unr + '</span>' : '') + '</div>';
  }
  function lastTxt(c) { var s = c.last || ''; return C.stkName(s) ? T.sticker : s === '📷' ? '📷 ' + T.photo : s; }
  function paintList(q) {
    var ls = list.querySelector('.ls'), d = listData; if (!d) return;
    var f = function (u) { return !q || u.name.toLowerCase().indexOf(q.toLowerCase()) >= 0; };
    var h = '';
    var convs = (d.convs || []).filter(function (c) { return f(c.with); }).slice(0, 8);
    if (convs.length) h += '<div class="sub">' + T.convs + '</div>' + convs.map(function (c) { return row(c.with, esc(lastTxt(c)), c.unread); }).join('');
    var fr = d.friends.filter(f);
    h += '<div class="sub">' + T.friends + '</div>' + (fr.length ? fr.map(function (u) { return row(u, '<span class="agsd ' + u.status + '" style="width:8px;height:8px;flex-basis:8px;border:0;margin-right:4px"></span>' + stText(u) + ' · ' + T.lvl + ' ' + u.level); }).join('') : '<div class="empty">' + T.noFriends + '</div>');
    var on = d.online.filter(f);
    h += '<div class="sub">' + T.nowOn + '</div>' + (on.length ? on.map(function (u) { return row(u, stText(u) + ' · ' + T.lvl + ' ' + u.level); }).join('') : '<div class="empty">' + T.none + '</div>');
    if (q && q.length >= 2) {
      api('GET', '/api/ag/players?q=' + encodeURIComponent(q)).then(function (p) {
        var known = {}; fr.concat(on).concat(convs.map(function (c) { return c.with; })).forEach(function (u) { known[u.name.toLowerCase()] = 1; });
        var extra = p.filter(function (u) { return !known[u.name.toLowerCase()]; });
        if (extra.length && list.querySelector('.q').value.trim() === q) ls.insertAdjacentHTML('beforeend', extra.map(function (u) { return row(u, stText(u) + ' · ' + T.lvl + ' ' + u.level); }).join(''));
      }).catch(function () { });
    }
    ls.innerHTML = h;
  }

  // ---------- ventanitas ----------
  function find(name) { for (var i = 0; i < wins.length; i++) if (wins[i].name.toLowerCase() === name.toLowerCase()) return wins[i]; return null; }
  function openWin(name, min, focus, flash) {
    var me = C.me(); if (!name || (me && me.name.toLowerCase() === name.toLowerCase())) return;
    var w = find(name);
    if (!w) {
      w = { name: name, after: 0, msgs: [], pend: [], min: !!min, with: null, seen: 0, delivered: 0, typing: false, blocked: false, unseen: 0, loaded: false };
      wins.unshift(w); mkWin(w);
      while (wins.filter(function (x) { return !x.min; }).length > maxWins()) { var old = wins.filter(function (x) { return !x.min && x !== w; }).pop(); if (!old) break; closeWin(old); }
    } else if (!min) { w.min = false; w.el.classList.remove('min'); }
    if (flash) { w.el.classList.remove('flash'); void w.el.offsetWidth; w.el.classList.add('flash'); }
    if (focus) setTimeout(function () { var i = w.el.querySelector('.ti'); if (i && !w.min) i.focus(); }, 50);
    layout(); save(); tick(true);
  }
  function closeWin(w) { var i = wins.indexOf(w); if (i >= 0) wins.splice(i, 1); if (w.el) w.el.remove(); layout(); save(); }
  function mkWin(w) {
    var el = document.createElement('div'); el.className = 'agdw' + (w.min ? ' min' : '');
    el.innerHTML = '<div class="wh">' + av({ name: w.name }, 28) + '<div class="nm"><b>' + esc(w.name) + '</b><small>&nbsp;</small></div><span class="bdg" style="display:none"></span><button class="wb" data-a="min" title="' + T.min + '">–</button><button class="wb" data-a="x" title="' + T.close + '">×</button></div>' +
      '<div class="ms"></div><div class="typ"></div><div class="bar"><input class="ti" maxlength="300" placeholder="' + T.ph + '"><button class="go" title="Enviar">➤</button></div>';
    root.appendChild(el); w.el = el; stopKeys(el);
    el.querySelector('.wh').onclick = function (e) {
      var b = e.target.closest('.wb');
      if (b && b.getAttribute('data-a') === 'x') { closeWin(w); return; }
      w.min = !w.min; el.classList.toggle('min', w.min); el.classList.remove('flash');
      if (!w.min) { w.unseen = 0; paintBadge(w); scrollEnd(w, true); }
      layout(); save();
    };
    var inp = el.querySelector('.ti');
    C.tools(inp, function (url) { send(w, inp.value.trim(), url); inp.value = ''; }, function (n) { send(w, '[s:' + n + ']'); });
    function go() { var v = inp.value.trim(); if (!v) return; inp.value = ''; var e = el.querySelector('.emo'); if (e) e.classList.remove('on'); send(w, v); }
    el.querySelector('.go').onclick = go;
    inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } };
    inp.oninput = function () { if (inp.value) { typingTo = w.name; if (Date.now() - lastTick > 2500) tick(true); } };
    el.querySelector('.ms').onclick = function (e) {
      var im = e.target.closest('.ph'); if (im) { C.lightbox(im.src); return; }
      var f = e.target.closest('.rc.fail'); if (f) { var p = w.pend.filter(function (x) { return String(x.id) === f.getAttribute('data-p'); })[0]; if (p) { w.pend.splice(w.pend.indexOf(p), 1); send(w, p.text, p.image); } }
    };
    el.addEventListener('pointerdown', function () { if (!w.min && w.unseen) { w.unseen = 0; paintBadge(w); } });
  }
  function layout() {
    var right = 10 + (narrow() ? 0 : (bar ? bar.offsetWidth : 220) + 10);
    if (!narrow() && list && list.classList.contains('on')) right = 10 + 280 + 10;
    var shown = 0;
    wins.forEach(function (w) {
      if (narrow()) { w.el.style.display = shown === 0 ? '' : 'none'; w.el.style.bottom = '40px'; shown++; return; }
      w.el.style.display = ''; w.el.style.bottom = '0'; w.el.style.right = right + 'px'; right += 290;
    });
  }
  function paintBadge(w) { var b = w.el.querySelector('.wh .bdg'); b.textContent = w.unseen; b.style.display = w.unseen ? '' : 'none'; }
  var pid = 0;
  function send(w, text, image) {
    if (!text && !image) return;
    if (w.blocked) return;
    var me = C.me() || { name: '?', avatar: '/blank.png' };
    var p = { id: 'p' + (++pid), from: { name: me.name, avatar: me.avatar, status: 'online' }, text: text || '', image: image || null, at: new Date().toISOString(), pending: true };
    w.pend.push(p); paint(w); scrollEnd(w, true); typingTo = null;
    api('POST', '/api/ag/dm/' + encodeURIComponent(w.name), { text: text, image: image }).then(function () {
      C.snd('send', 'sndMsg'); p.ok = true; tick(true);
    }).catch(function (j) {
      p.failed = true; p.pending = false;
      if (j && j.error === 'blocked') { w.blocked = true; w.pend.splice(w.pend.indexOf(p), 1); }
      paint(w);
    });
  }
  function scrollEnd(w, force) { var ms = w.el.querySelector('.ms'); if (force || ms.scrollHeight - ms.scrollTop - ms.clientHeight < 80) ms.scrollTop = ms.scrollHeight; }
  function paint(w) {
    var ms = w.el.querySelector('.ms'), near = ms.scrollHeight - ms.scrollTop - ms.clientHeight < 80;
    var all = w.msgs.concat(w.pend.filter(function (p) { return !p.ok; }));
    if (w.with) {
      var h = w.el.querySelector('.wh');
      h.querySelector('.agsd').className = 'agsd ' + w.with.status;
      var im = h.querySelector('.agav img'); if (w.with.avatar && im.getAttribute('src') !== w.with.avatar) im.src = w.with.avatar;
      h.querySelector('small').textContent = w.typing ? T.typing + '…' : stText(w.with) + ' · ' + T.lvl + ' ' + w.with.level;
    }
    var out = '', lastDay = '', prev = null, lastMineIdx = -1;
    all.forEach(function (m, i) { if (mine(m)) lastMineIdx = i; });
    if (!all.length && w.loaded) out = '<div class="hi"><img src="/ag/chars/lowlitta.png" alt="">' + T.say + '</div>';
    all.forEach(function (m, i) {
      var d = new Date(m.at), dk = d.toDateString(), me2 = mine(m);
      if (dk !== lastDay) { out += '<div class="day"><span>' + esc(dayLabel(d)) + '</span></div>'; lastDay = dk; prev = null; }
      var next = all[i + 1];
      var first = !prev || mine(prev) !== me2 || (d - new Date(prev.at)) > 300000;
      var last = !next || mine(next) !== me2 || (new Date(next.at) - d) > 300000 || new Date(next.at).toDateString() !== dk;
      var st = C.stkName(m.text);
      out += '<div class="g' + (me2 ? ' me' : '') + (first ? ' first' : '') + (m.pending ? ' pend' : '') + '">' + (me2 ? '' : av(m.from, 26)) + '<div class="col">' +
        (m.text ? '<div class="bu' + (st ? ' st' : '') + '">' + C.txt(m.text) + '</div>' : '') +
        (m.image ? '<img class="ph" src="' + esc(m.image) + '" alt="" loading="lazy">' : '') +
        (last ? '<div class="tm" title="' + esc(d.toLocaleString(lang)) + '">' + esc(hm(d)) + '</div>' : '') +
        (me2 && i === lastMineIdx ? receipt(w, m) : (m.failed ? '<div class="rc fail" data-p="' + m.id + '">⚠ ' + T.failed + '</div>' : '')) +
        '</div></div>';
      prev = m;
    });
    if (w.blocked) out += '<div class="note">' + T.blocked + '</div>';
    ms.innerHTML = out;
    var inp = w.el.querySelector('.ti'); inp.disabled = !!w.blocked;
    w.el.querySelector('.typ').innerHTML = w.typing ? esc(w.name) + ' ' + T.typing + '<i></i><i></i><i></i>' : '';
    if (near) ms.scrollTop = ms.scrollHeight;
  }
  function receipt(w, m) {
    if (m.failed) return '<div class="rc fail" data-p="' + m.id + '">⚠ ' + T.failed + '</div>';
    if (m.pending) return '<div class="rc">🕓</div>';
    if (typeof m.id === 'number' && w.seen >= m.id) return '<div class="rc">✓✓ ' + T.seen + (w.seenAt ? ' ' + esc(hm(w.seenAt)) : '') + '</div>';
    if (typeof m.id === 'number' && w.delivered >= m.id) return '<div class="rc" style="color:#7b8b95">✓✓ ' + T.delivered + '</div>';
    return '<div class="rc" style="color:#7b8b95">✓ ' + T.sent + '</div>';
  }
  function update(w, d) {
    w.with = d.with; w.blocked = d.blocked; w.typing = d.typing && !w.blocked;
    if (d.seen > w.seen) { if (w.loaded) w.seenAt = new Date(); w.seen = d.seen; }
    w.delivered = d.delivered;
    var news = d.messages || [], incoming = 0;
    news.forEach(function (m) { if (!w.msgs.some(function (x) { return x.id === m.id; })) { w.msgs.push(m); if (!mine(m)) incoming++; } });
    if (w.msgs.length > 200) w.msgs = w.msgs.slice(-200);
    if (news.length) { w.after = news[news.length - 1].id; w.pend = w.pend.filter(function (p) { return !p.ok; }); }
    if (incoming && w.loaded) {
      C.snd('recv', 'sndMsg');
      if (w.min || document.hidden) { w.unseen += incoming; paintBadge(w); w.el.classList.remove('flash'); void w.el.offsetWidth; w.el.classList.add('flash'); }
    }
    var first = !w.loaded; w.loaded = true;
    paint(w); if (first) scrollEnd(w, true);
  }

  // ---------- ayuda rapida: aviso abajo a la izquierda cuando un amigo pide ayuda ----------
  var shownHelp = {};
  function helpNotes(h) {
    var first = helpAfter < 0;
    var list = h.list || [];
    if (first) list = list.filter(function (p) { return Date.now() - new Date(p.at).getTime() < 15 * 60000; }).slice(0, 1);
    helpAfter = Math.max(helpAfter, h.top || 0);
    if (meStatus === 'busy' || (C.pref && !C.pref('ntHelp'))) return;
    list.slice().reverse().forEach(function (p) { if (!shownHelp[p.id]) { shownHelp[p.id] = 1; helpCard(p); } });
  }
  function helpCard(p) {
    if (!helpBox) { helpBox = document.createElement('div'); helpBox.id = 'agHelp'; document.body.appendChild(helpBox); stopKeys(helpBox); }
    while (helpBox.children.length >= 3) helpBox.lastChild.remove();
    var el = document.createElement('div'); el.className = 'hc';
    var what = p.energy ? T.helpEnergy : p.kind === 'wishlist' && p.itemInfo ? T.helpWish + ' ' + esc(prettyName(p.itemInfo.name)) : T.help;
    var pic = p.itemInfo && p.itemInfo.icon ? p.itemInfo.icon : p.image;
    el.innerHTML = av(p.from, 40) + '<div class="tx3"><b>' + esc(p.from.name) + '</b><small>' + what + (p.text ? ' · ' + esc(p.text) : '') + '</small></div>' +
      (pic ? '<img class="it" src="' + esc(pic) + '" alt="" onerror="this.remove()">' : '') +
      '<div class="hb"><button class="y">' + T.helpBtn + '</button><button class="v">' + T.helpSeen + '</button></div>';
    helpBox.insertBefore(el, helpBox.firstChild);
    C.snd('notify', 'sndReq');
    var timer = setTimeout(gone, 15000);
    function gone() { el.classList.add('out'); setTimeout(function () { el.remove(); }, 300); }
    el.onmouseenter = function () { clearTimeout(timer); };
    el.onmouseleave = function () { timer = setTimeout(gone, 6000); };
    el.querySelector('.v').onclick = function () { gone(); if (window.agOpenWall) window.agOpenWall(); };
    var yb = el.querySelector('.y');
    yb.onclick = function () {
      yb.disabled = true;
      api('POST', '/api/ag/wall/' + p.id + '/help', { item: p.item || null }).then(function () {
        el.querySelector('.hb').outerHTML = '<div class="ok">✓ ' + T.helped + '</div>'; C.snd('send', 'sndReq'); clearTimeout(timer); timer = setTimeout(gone, 3500);
      }).catch(function () { el.querySelector('.hb').outerHTML = '<div class="ok" style="color:#e8382f">' + T.helpErr + '</div>'; clearTimeout(timer); timer = setTimeout(gone, 3500); });
    };
  }
  function prettyName(n) { return String(n).replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }

  // ---------- un solo pedido al servidor para todo (cada 3 s con ventanas abiertas) ----------
  function active() { return !document.hidden && Date.now() - lastAct < 120000; }
  ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) { addEventListener(ev, function () { lastAct = Date.now(); }, { passive: true, capture: true }); });
  function tick(now) {
    if (ticking) { if (now) tick.again = true; return; }
    ticking = true; lastTick = Date.now();
    var body = { active: active(), wins: wins.map(function (w) { return { name: w.name, after: w.after }; }), typing: typingTo, helpAfter: Math.max(0, helpAfter) };
    typingTo = null;
    api('POST', '/api/ag/dock', body).then(function (r) {
      meStatus = r.status; unread = r.unread; paintMe();
      (r.wins || []).forEach(function (d) { var w = find(d.name); if (w) update(w, d); });
      if (r.helps) helpNotes(r.helps);
      // si alguien te escribe, se abre su ventanita sola (como en Facebook)
      var me = C.me();
      if (meStatus !== 'busy') (r.from || []).forEach(function (n) { if (!find(n)) { openWin(n, false, false, true); C.snd('notify', 'sndMsg'); } });
    }).catch(function () { }).then(function () {
      ticking = false;
      if (tick.again) { tick.again = false; setTimeout(function () { tick(); }, 300); }
    });
  }
  function loop() {
    var every = wins.length ? 3000 : 10000;
    if (document.hidden) every = 15000;
    if (Date.now() - lastTick >= every) tick();
    if (list && list.classList.contains('on') && (!loop.l || Date.now() - loop.l > 15000)) { loop.l = Date.now(); loadList(); }
    if (!list.classList.contains('on') && (!loop.c || Date.now() - loop.c > 30000)) { loop.c = Date.now(); api('GET', '/api/ag/dock/list').then(function (d) { listData = d; paintCount(); }).catch(function () { }); }
  }

  function start() {
    if (!document.body) return setTimeout(start, 200);
    build(); paintMe();
    (load().wins || []).slice(0, 4).reverse().forEach(function (x) { openWin(x.name, x.min); });
    tick(); setInterval(loop, 1000);
    addEventListener('resize', function () { layout(); });
  }

  window.agChat = { open: function (name) { openWin(name, false, true); }, list: function () { toggleList(true); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
