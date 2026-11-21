// CityVille Revived - Allow Games: interfaz de celular estilo CityVille Hometown.
// Esconde el HUD viejo de Flash y pone una interfaz tactil propia (monedas, billetes, energia, XP,
// construir, inventario, herramientas, vecinos...). Habla con el juego por el puente "quickNav"
// del Game.2012.hud.swf. Se activa en pantallas tactiles (o con ?hud=1). ?hud=0 = interfaz clasica.
(function () {
  var qs = new URLSearchParams(location.search);
  var force = qs.get('hud');
  var classic = false; try { classic = localStorage.getItem('agHud') === 'classic'; } catch (e) { }
  var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  var on = force === '1' || (force !== '0' && touch && !classic);
  window.agHometownWanted = touch; // para el boton de volver a esta interfaz
  if (!on) return;
  document.documentElement.classList.add('ag-ht');

  var P = window.AG_PLAYER || {};
  var lang = (P.locale || navigator.language || 'es').slice(0, 2);
  var T = {
    es: { lite: 'Modo rápido (sin Flash)', nb: 'Mis vecinos', visit: 'Visitar', msg: 'Mensaje', addf: 'Agregar', none: 'Todavía no tienes vecinos. ¡Agrega amigos para visitarlos y ayudarlos!', fps: 'Modo ahorro (más fluido)', on: 'Sí', off: 'No', build: 'Construir', inv: 'Inventario', tools: 'Editar', friends: 'Vecinos', quests: 'Misiones', ch: 'Desafíos', daily: 'Premio', coll: 'Colecciones', move: 'Mover', rotate: 'Girar', store: 'Guardar', sell: 'Vender', done: 'Listo', home: 'Volver a mi ciudad', visiting: 'Visitando', lvl: 'Nivel', set: 'Ajustes', classic: 'Usar interfaz clásica', full: 'Pantalla completa', menu: 'Más opciones', close: 'Cerrar', hintMove: 'Toca un edificio y luego donde lo quieres', hintRotate: 'Toca un edificio para girarlo', hintStore: 'Toca un edificio para guardarlo', hintSell: 'Toca un edificio para venderlo', goods: 'Mercancía', energy: 'Energía', full2: 'Llena' },
    en: { lite: 'Fast mode (no Flash)', nb: 'My neighbors', visit: 'Visit', msg: 'Message', addf: 'Add', none: 'No neighbors yet. Add friends to visit and help them!', fps: 'Battery saver (smoother)', on: 'On', off: 'Off', build: 'Build', inv: 'Inventory', tools: 'Edit', friends: 'Neighbors', quests: 'Quests', ch: 'Challenges', daily: 'Reward', coll: 'Collections', move: 'Move', rotate: 'Rotate', store: 'Store', sell: 'Sell', done: 'Done', home: 'Back to my city', visiting: 'Visiting', lvl: 'Level', set: 'Settings', classic: 'Use classic interface', full: 'Fullscreen', menu: 'More options', close: 'Close', hintMove: 'Tap a building, then where you want it', hintRotate: 'Tap a building to rotate it', hintStore: 'Tap a building to store it', hintSell: 'Tap a building to sell it', goods: 'Goods', energy: 'Energy', full2: 'Full' },
    pt: { lite: 'Modo rápido (sem Flash)', nb: 'Meus vizinhos', visit: 'Visitar', msg: 'Mensagem', addf: 'Adicionar', none: 'Você ainda não tem vizinhos. Adicione amigos para visitar e ajudar!', fps: 'Modo economia (mais fluido)', on: 'Sim', off: 'Não', build: 'Construir', inv: 'Inventário', tools: 'Editar', friends: 'Vizinhos', quests: 'Missões', ch: 'Desafios', daily: 'Prêmio', coll: 'Coleções', move: 'Mover', rotate: 'Girar', store: 'Guardar', sell: 'Vender', done: 'Pronto', home: 'Voltar para minha cidade', visiting: 'Visitando', lvl: 'Nível', set: 'Ajustes', classic: 'Usar interface clássica', full: 'Tela cheia', menu: 'Mais opções', close: 'Fechar', hintMove: 'Toque num prédio e depois onde quer', hintRotate: 'Toque num prédio para girar', hintStore: 'Toque num prédio para guardar', hintSell: 'Toque num prédio para vender', goods: 'Mercadorias', energy: 'Energia', full2: 'Cheia' },
    fr: { lite: 'Mode rapide (sans Flash)', nb: 'Mes voisins', visit: 'Visiter', msg: 'Message', addf: 'Ajouter', none: 'Pas encore de voisins. Ajoute des amis pour les visiter et les aider !', fps: 'Mode éco (plus fluide)', on: 'Oui', off: 'Non', build: 'Construire', inv: 'Inventaire', tools: 'Modifier', friends: 'Voisins', quests: 'Quêtes', ch: 'Défis', daily: 'Cadeau', coll: 'Collections', move: 'Déplacer', rotate: 'Tourner', store: 'Ranger', sell: 'Vendre', done: 'OK', home: 'Retour à ma ville', visiting: 'En visite', lvl: 'Niveau', set: 'Réglages', classic: 'Interface classique', full: 'Plein écran', menu: "Plus d'options", close: 'Fermer', hintMove: 'Touche un bâtiment puis sa nouvelle place', hintRotate: 'Touche un bâtiment pour le tourner', hintStore: 'Touche un bâtiment pour le ranger', hintSell: 'Touche un bâtiment pour le vendre', goods: 'Marchandises', energy: 'Énergie', full2: 'Pleine' },
    it: { lite: 'Modalità veloce (senza Flash)', nb: 'I miei vicini', visit: 'Visita', msg: 'Messaggio', addf: 'Aggiungi', none: 'Ancora nessun vicino. Aggiungi amici per visitarli e aiutarli!', fps: 'Modalità risparmio (più fluida)', on: 'Sì', off: 'No', build: 'Costruisci', inv: 'Inventario', tools: 'Modifica', friends: 'Vicini', quests: 'Missioni', ch: 'Sfide', daily: 'Premio', coll: 'Collezioni', move: 'Sposta', rotate: 'Ruota', store: 'Riponi', sell: 'Vendi', done: 'Fatto', home: 'Torna alla mia città', visiting: 'In visita', lvl: 'Livello', set: 'Impostazioni', classic: 'Interfaccia classica', full: 'Schermo intero', menu: 'Altre opzioni', close: 'Chiudi', hintMove: 'Tocca un edificio e poi dove vuoi', hintRotate: 'Tocca un edificio per ruotarlo', hintStore: 'Tocca un edificio per riporlo', hintSell: 'Tocca un edificio per venderlo', goods: 'Merci', energy: 'Energia', full2: 'Piena' },
    de: { lite: 'Schnellmodus (ohne Flash)', nb: 'Meine Nachbarn', visit: 'Besuchen', msg: 'Nachricht', addf: 'Hinzufügen', none: 'Noch keine Nachbarn. Füge Freunde hinzu, um sie zu besuchen und ihnen zu helfen!', fps: 'Sparmodus (flüssiger)', on: 'An', off: 'Aus', build: 'Bauen', inv: 'Inventar', tools: 'Bearbeiten', friends: 'Nachbarn', quests: 'Aufgaben', ch: 'Challenges', daily: 'Bonus', coll: 'Sammlungen', move: 'Bewegen', rotate: 'Drehen', store: 'Lagern', sell: 'Verkaufen', done: 'Fertig', home: 'Zurück in meine Stadt', visiting: 'Zu Besuch', lvl: 'Level', set: 'Einstellungen', classic: 'Klassische Oberfläche', full: 'Vollbild', menu: 'Mehr', close: 'Schließen', hintMove: 'Tippe ein Gebäude an, dann den neuen Platz', hintRotate: 'Tippe ein Gebäude zum Drehen an', hintStore: 'Tippe ein Gebäude zum Lagern an', hintSell: 'Tippe ein Gebäude zum Verkaufen an', goods: 'Waren', energy: 'Energie', full2: 'Voll' }
  };
  var t = T[lang] || T.es;
  var IC = '/ag/ic/', HT = '/assets/hometown/';
  // tablets/celulares sencillos: menos cuadros por segundo y sin musica de fondo (lo que mas los traba)
  var weak = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory && navigator.deviceMemory <= 3);
  window.agWeak = weak;

  var css =
    'html.ag-ht,html.ag-ht body{overflow:hidden!important;overscroll-behavior:none;position:fixed;inset:0}' +
    'html.ag-ht #cvMenuToggle,html.ag-ht #agDockBar{display:none!important}' +
    'html.ag-ht #agHelp{left:calc(84px + env(safe-area-inset-left))!important;bottom:calc(12px + env(safe-area-inset-bottom))!important;width:min(300px,calc(100vw - 240px))!important}' +
    'html.ag-ht #agDockList{bottom:10px!important;max-height:80vh!important}' +
    '#agHT{position:fixed;inset:0;z-index:1040;pointer-events:none;font-family:CV,"Arial Rounded MT Bold",sans-serif;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}' +
    '#agHT *{box-sizing:border-box}' +
    '#agHT button{font-family:inherit;-webkit-tap-highlight-color:transparent;touch-action:manipulation}' +
    // barra de arriba
    '#agHT .top{position:absolute;top:calc(6px + env(safe-area-inset-top));left:calc(8px + env(safe-area-inset-left));right:calc(8px + env(safe-area-inset-right));display:flex;align-items:center;gap:8px;pointer-events:none}' +
    '#agHT .lv{pointer-events:auto;position:relative;display:flex;align-items:center;height:40px;padding:0 12px 0 40px;border-radius:999px;background:linear-gradient(#5fc1f5,#1f84c2);border:3px solid #fff;box-shadow:0 3px 0 #0d4f73,0 5px 10px rgba(0,0,0,.3);color:#fff;min-width:118px}' +
    '#agHT .lv .st{position:absolute;left:-8px;top:50%;transform:translateY(-50%);width:50px;height:50px;display:flex;align-items:center;justify-content:center;background:url(' + IC + 'xp.png) center/contain no-repeat;font-size:17px;font-weight:900;color:#fff;text-shadow:0 2px 0 #8a5a00,0 0 3px #8a5a00}' +
    '#agHT .lv .bar{position:relative;flex:1;height:14px;border-radius:999px;background:rgba(0,0,0,.28);overflow:hidden;min-width:64px}' +
    '#agHT .lv .bar i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:999px;background:linear-gradient(#ffe36b,#f5b81c);transition:width .6s}' +
    '#agHT .lv .bar b{position:absolute;inset:0;font-size:10px;line-height:14px;text-align:center;text-shadow:0 1px 0 rgba(0,0,0,.6)}' +
    '#agHT .pills{display:flex;gap:7px;flex:1;justify-content:center;min-width:0}' +
    '#agHT .pill{pointer-events:auto;position:relative;display:flex;align-items:center;height:34px;padding:0 12px 0 34px;border-radius:999px;background:rgba(255,255,255,.95);border:3px solid #fff;box-shadow:0 3px 0 rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.25);font-size:16px;font-weight:900;color:#5a3a00;white-space:nowrap;transition:transform .15s}' +
    '#agHT .pill img{position:absolute;left:-6px;top:50%;transform:translateY(-50%);width:38px;height:38px;object-fit:contain;filter:drop-shadow(0 2px 0 rgba(0,0,0,.2))}' +
    '#agHT .pill.c{color:#8a5a00}#agHT .pill.m{color:#1f7a12}#agHT .pill.e{color:#b86a00}#agHT .pill.g{color:#6b3fa0}' +
    '#agHT .pill small{font-size:11px;color:#9a8a6a;margin-left:2px}' +
    '#agHT .pill.bump{transform:scale(1.18)}' +
    '#agHT .rt{display:flex;gap:6px}' +
    // botones redondos
    '#agHT .rb{pointer-events:auto;position:relative;width:46px;height:46px;border-radius:50%;border:3px solid #fff;padding:0;color:#fff;font-size:20px;background:radial-gradient(circle at 35% 30%,#7fd0ff,#2f8fc4 60%,#1c6e9c);box-shadow:0 4px 0 #0d4f73,0 6px 12px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;flex-direction:column;cursor:pointer}' +
    '#agHT .rb:active,#agHT .big:active,#agHT .side button:active{transform:translateY(3px);box-shadow:0 1px 0 #0d4f73}' +
    '#agHT .rb img{width:78%;height:78%;object-fit:contain}#agHT .gear{font-size:26px;line-height:1}' +
    // lateral izquierdo
    '#agHT .side{position:absolute;left:calc(8px + env(safe-area-inset-left));bottom:calc(10px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:8px;pointer-events:none}' +
    '#agHT .side button{pointer-events:auto;position:relative;width:62px;height:62px;border-radius:18px;border:3px solid #fff;padding:4px 0 0;color:#fff;background:linear-gradient(#7fd0ff,#2f8fc4);box-shadow:0 4px 0 #0d4f73,0 6px 12px rgba(0,0,0,.3);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer}' +
    '#agHT .side button img{width:36px;height:36px;object-fit:contain;filter:drop-shadow(0 2px 0 rgba(0,0,0,.2))}' +
    '#agHT .side button span{font-size:10px;font-weight:900;text-shadow:0 1px 0 rgba(0,0,0,.45);margin-top:1px;max-width:58px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}' +
    '#agHT .side .gold{background:linear-gradient(#ffe36b,#f5b81c);box-shadow:0 4px 0 #8a5c00,0 6px 12px rgba(0,0,0,.3)}' +
    '#agHT .side .green{background:linear-gradient(#b6f07a,#4fae1f);box-shadow:0 4px 0 #1f5a0b,0 6px 12px rgba(0,0,0,.3)}' +
    '#agHT .bd{position:absolute;top:-6px;right:-6px;background:#e8382f;color:#fff;border:2px solid #fff;border-radius:999px;font-size:11px;font-weight:900;min-width:20px;padding:0 4px;line-height:16px;display:none}' +
    // derecha abajo: construir grande
    '#agHT .act{position:absolute;right:calc(10px + env(safe-area-inset-right));bottom:calc(10px + env(safe-area-inset-bottom));display:flex;align-items:flex-end;gap:10px;pointer-events:none}' +
    '#agHT .act .col{display:flex;flex-direction:column;gap:8px;align-items:center}' +
    '#agHT .big{pointer-events:auto;width:96px;height:96px;border-radius:50%;border:4px solid #fff;padding:0;color:#fff;cursor:pointer;background:radial-gradient(circle at 35% 30%,#ffe98a,#f5b81c 55%,#c98a00);box-shadow:0 5px 0 #8a5c00,0 8px 16px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;animation:agHTpulse 2.6s ease-in-out infinite}' +
    '#agHT .big img{width:54px;height:54px;object-fit:contain;filter:drop-shadow(0 3px 0 rgba(0,0,0,.25))}' +
    '#agHT .big span{font-size:14px;font-weight:900;text-shadow:0 2px 0 #8a5a00;margin-top:-2px}' +
    '@keyframes agHTpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}' +
    '#agHT .mid{width:62px;height:62px}' +
    '#agHT .mid span{font-size:9px;font-weight:900;text-shadow:0 1px 0 rgba(0,0,0,.45);margin-top:-3px;max-width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 3px}' +
    '#agHT .mid img{width:64%;height:64%}' +
    // zoom
    '#agHT .zm{position:absolute;right:calc(12px + env(safe-area-inset-right));top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:8px}' +
    '#agHT .zm .rb{width:40px;height:40px;font-size:22px;font-weight:900;opacity:.92}' +
    // herramientas (abanico)
    '#agHT .fan{position:absolute;right:calc(186px + env(safe-area-inset-right));bottom:calc(12px + env(safe-area-inset-bottom));display:flex;gap:8px;pointer-events:none;opacity:0;transform:translateX(30px) scale(.8);transition:all .22s cubic-bezier(.3,1.5,.5,1)}' +
    '#agHT .fan.open{opacity:1;transform:none}#agHT .fan.open button{pointer-events:auto}' +
    '#agHT .fan button{width:62px;height:62px;border-radius:50%;border:3px solid #fff;color:#fff;font-size:24px;background:radial-gradient(circle at 35% 30%,#c79bff,#7b45c9 60%,#5a2a9e);box-shadow:0 4px 0 #3b176e,0 6px 12px rgba(0,0,0,.3);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0}' +
    '#agHT .fan button span{font-size:9.5px;font-weight:900;margin-top:1px}' +
    '#agHT .fan .sell{background:radial-gradient(circle at 35% 30%,#ff9d8a,#e8382f 60%,#a8221b);box-shadow:0 4px 0 #7a140f,0 6px 12px rgba(0,0,0,.3)}' +
    // aviso de modo
    '#agHT .mode{position:absolute;left:50%;top:calc(56px + env(safe-area-inset-top));transform:translateX(-50%);display:none;align-items:center;gap:10px;padding:6px 6px 6px 16px;border-radius:999px;background:rgba(43,16,90,.92);border:3px solid #fff;color:#fff;font-size:14px;font-weight:700;box-shadow:0 6px 16px rgba(0,0,0,.35);pointer-events:auto;white-space:nowrap;max-width:94vw}' +
    '#agHT .mode.show{display:flex}' +
    '#agHT .mode button{border:0;border-radius:999px;padding:7px 16px;color:#fff;font-size:15px;font-weight:900;background:linear-gradient(#8ee05a,#4caf27);box-shadow:0 3px 0 #2f7d17}' +
    // visitando
    '#agHT .visit{position:absolute;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);display:none;pointer-events:auto;align-items:center;gap:8px;border:4px solid #fff;border-radius:999px;padding:10px 24px 10px 14px;color:#fff;font-size:18px;font-weight:900;background:linear-gradient(#8ee05a,#4caf27);box-shadow:0 5px 0 #2f7d17,0 8px 16px rgba(0,0,0,.35);text-shadow:0 2px 0 #2c7710}' +
    '#agHT .visit img{width:38px;height:38px;object-fit:contain}' +
    '#agHT.visiting .visit{display:flex}#agHT.visiting .act,#agHT.visiting .fan,#agHT.visiting .tab{display:none!important}#agHT.nbopen .side,#agHT.nbopen .act,#agHT.nbopen .tab,#agHT.nbopen .fan,#agHT.nbopen .visit{display:none!important}' +
    '#agHT .vtag{display:none;pointer-events:auto;height:34px;align-items:center;padding:0 14px;border-radius:999px;background:rgba(7,59,87,.88);border:3px solid #fff;color:#fff;font-size:14px;font-weight:900}' +
    '#agHT.visiting .vtag{display:flex}#agHT.visiting .pill.c,#agHT.visiting .pill.m,#agHT.visiting .pill.g{display:none}' +
    // barra de vecinos (como Hometown)
    '#htNb{position:fixed;left:0;right:0;bottom:0;z-index:1050;transform:translateY(110%);transition:transform .28s cubic-bezier(.2,1,.3,1);padding:8px calc(10px + env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) calc(10px + env(safe-area-inset-left));background:linear-gradient(#fffdf4,#f3e7c3);border-top:4px solid #1c6e9c;border-radius:22px 22px 0 0;box-shadow:0 -8px 24px rgba(0,0,0,.3);font-family:CV,sans-serif;-webkit-user-select:none;user-select:none}' +
    '#htNb.open{transform:none}' +
    '#htNb .hd{display:flex;align-items:center;gap:8px;margin:0 2px 6px}#htNb .hd b{flex:1;color:#0a5f8c;font-size:16px}' +
    '#htNb .hd button{border:0;border-radius:999px;padding:6px 12px;font:700 13px CV,sans-serif;color:#fff;background:linear-gradient(#7fd0ff,#2f8fc4);box-shadow:0 3px 0 #1c6e9c}' +
    '#htNb .hd .x{background:linear-gradient(#ff8a80,#e8382f);box-shadow:0 3px 0 #9c1d16;width:34px;padding:6px 0}' +
    '#htNb .row{display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity;padding:2px 2px 6px;touch-action:pan-x;scrollbar-width:none}#htNb .row::-webkit-scrollbar{display:none}' +
    '#htNb .nb{flex:0 0 auto;width:78px;scroll-snap-align:start;text-align:center;position:relative;cursor:pointer}' +
    '#htNb .av{position:relative;width:64px;height:64px;margin:0 auto;border-radius:16px;border:3px solid #fff;background:#cfe9f7 center/cover;box-shadow:0 3px 0 #9fbfd0,0 4px 8px rgba(0,0,0,.2)}' +
    '#htNb .av i{position:absolute;right:-6px;bottom:-6px;min-width:24px;height:24px;border-radius:12px;background:url(' + IC + 'xp.png) center/contain no-repeat;color:#fff;font:900 11px/24px CV,sans-serif;font-style:normal;text-shadow:0 1px 0 #8a5a00,0 0 2px #8a5a00}' +
    '#htNb .av s{position:absolute;left:-4px;top:-4px;width:14px;height:14px;border-radius:50%;border:2px solid #fff;background:#9aa7ad}' +
    '#htNb .av s.online{background:#43c463}#htNb .av s.idle{background:#f5b81c}#htNb .av s.busy{background:#e8382f}' +
    '#htNb .nm{display:block;margin-top:6px;font-size:12px;font-weight:700;color:#21445a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#htNb .add .av{background:linear-gradient(#b6f07a,#4fae1f);display:flex;align-items:center;justify-content:center;font-size:34px;color:#fff;font-weight:900}' +
    '#htNb .none{padding:14px 6px;color:#5d7480;font-size:14px}' +
    '#htNb .pop{position:absolute;left:-2px;right:-2px;top:-2px;bottom:-2px;display:flex;flex-direction:column;justify-content:center;gap:5px;z-index:2;background:rgba(255,253,244,.94);border-radius:14px;border:2px solid #1c6e9c}' +
    '#htNb .pop button{border:0;border-radius:999px;padding:6px 4px;margin:0 3px;font:700 12px CV,sans-serif;color:#fff;white-space:nowrap;box-shadow:0 3px 0 rgba(0,0,0,.25)}' +
    '#htNb .pop .v{background:linear-gradient(#8ee05a,#4caf27)}#htNb .pop .m{background:linear-gradient(#7fd0ff,#2f8fc4)}' +
    // flecha del tutorial apuntando al boton Construir de verdad
    '#agHT .garr{position:absolute;display:none;right:calc(30px + env(safe-area-inset-right));bottom:calc(118px + env(safe-area-inset-bottom));width:46px;height:56px;pointer-events:none;animation:agArr .7s ease-in-out infinite alternate;filter:drop-shadow(0 3px 2px rgba(0,0,0,.35))}' +
    '#agHT.guide .garr{display:block}#agHT.guide .big{box-shadow:0 5px 0 #8a5c00,0 0 0 6px rgba(255,236,120,.9),0 0 30px 10px rgba(255,220,60,.8)}' +
    '@keyframes agArr{to{transform:translateY(12px)}}' +
    '@media (max-height:430px){#agHT .garr{bottom:calc(98px + env(safe-area-inset-bottom));right:calc(24px + env(safe-area-inset-right))}}' +
    // ===== skin CityVille Hometown (dibujos originales del juego de iPhone) =====
    '#agHT .tab{display:none}' +
    '#agHT.sk .pill{background:transparent no-repeat center/100% 100%;border:0;box-shadow:none;border-radius:0;height:40px;padding:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))}' +
    '#agHT.sk .pill img{display:none}' +
    '#agHT.sk .pill span,#agHT.sk .pill small{position:relative;color:#fff;font-weight:900;text-shadow:-1px -1px 0 #3a2a10,1px -1px 0 #3a2a10,-1px 1px 0 #3a2a10,1px 1px 0 #3a2a10,0 2px 2px rgba(0,0,0,.5)}' +
    '#agHT.sk .pill small{color:#ffe9a8;font-size:12px;margin-left:1px}' +
    '#agHT.sk .pill.c{width:150px;background-image:url(' + HT + 'img_meter_coins_plusbtn.png);padding:0 33px 0 48px;justify-content:center}' +
    '#agHT.sk .pill.m{width:110px;background-image:url(' + HT + 'img_meter_cash_plusbtn.png);padding:0 20px 0 40px;justify-content:center}' +
    '#agHT.sk .pill.e{width:107px;background-image:url(' + HT + 'hud_meter_frame_energy_plusbtn.png);padding:0 27px 0 33px;justify-content:center}' +
    '#agHT.sk .pill.g{width:100px;background-image:url(' + HT + 'hud_meter_frame_produce_plusbtn.png);padding:0 22px 0 40px;justify-content:center}' +
    '#agHT.sk .pill.bump{transform:scale(1.12)}' +
    '#agHT.sk .lv{background:linear-gradient(#fff6dc,#e8c88a);border:3px solid #fff;box-shadow:0 3px 0 #9a7a3e,0 5px 10px rgba(0,0,0,.3);border-radius:999px;height:36px;min-width:150px;padding:0 6px 0 46px}' +
    '#agHT.sk .lv .st{left:-4px;width:52px;height:52px;background:url(' + HT + 'hud_meter_fill_xp_plusbtn.png) center/contain no-repeat;font-size:18px;color:#fff;text-shadow:-1px -1px 0 #0d4f73,1px -1px 0 #0d4f73,-1px 1px 0 #0d4f73,1px 1px 0 #0d4f73}' +
    '#agHT.sk .lv .bar{height:20px;background:#22364a;border-radius:6px;margin-left:2px;box-shadow:inset 0 2px 3px rgba(0,0,0,.5)}' +
    '#agHT.sk .lv .bar i{background:url(' + HT + 'hud_dashboard_filler_experience.png) 0 0/100% 100%;border-radius:6px}' +
    '#agHT.sk .lv .bar b{line-height:20px;font-size:11px;font-weight:900}' +
    '#agHT.sk .gear{background:url(' + HT + 'hud_settings_icon_plusbtn.png) center/70% no-repeat,radial-gradient(circle at 35% 30%,#fff7df,#e9c98d);border-color:#fff;color:transparent;box-shadow:0 3px 0 #9a7a3e,0 5px 10px rgba(0,0,0,.3)}' +
    '#agHT.sk .act{display:none}' +
    '#agHT.sk .tab{position:absolute;right:calc(6px + env(safe-area-inset-right));bottom:calc(8px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:2px;width:84px;padding:12px 4px 10px;background:url(' + HT + 'img_menu_tab.png) center/100% 100% no-repeat;pointer-events:auto;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))}' +
    '#agHT.sk .tab button{position:relative;width:76px;border:0;background:none;padding:2px 0;display:flex;flex-direction:column;align-items:center;cursor:pointer}' +
    '#agHT.sk .tab button:active{transform:scale(.92)}' +
    '#agHT.sk .tab img{width:58px;height:46px;object-fit:contain;filter:drop-shadow(0 2px 1px rgba(0,0,0,.3))}' +
    '#agHT.sk .tab span{color:#fff;font-size:11px;font-weight:900;text-shadow:0 1px 0 #0b3d63,0 0 3px #0b3d63;margin-top:-2px;max-width:80px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#agHT.sk .tab .bd{top:0;right:6px}' +
    '#agHT.sk .side button[data-a=friends]{display:none}' +
    '#agHT.sk .zm{right:calc(98px + env(safe-area-inset-right))}' +
    '#agHT.sk .fan{right:calc(98px + env(safe-area-inset-right));bottom:calc(14px + env(safe-area-inset-bottom))}' +
    '#agHT.sk .fan button{background:radial-gradient(circle at 35% 30%,#fff9e6,#f0d9a6);box-shadow:0 4px 0 #a8823c,0 6px 12px rgba(0,0,0,.3);color:#5a3a00;font-size:0}' +
    '#agHT.sk .fan button span{font-size:9.5px;color:#5a3a00}' +
    '#agHT.sk .fan button::before{content:"";width:38px;height:38px;background:center/contain no-repeat}' +
    '#agHT.sk .fan [data-a="t:move"]::before{background-image:url(' + HT + 'img_menu_design.png)}' +
    '#agHT.sk .fan [data-a="t:rotate"]::before{background-image:url(' + HT + 'cit_editorbutton_rotate.png)}' +
    '#agHT.sk .fan [data-a="t:store"]::before{background-image:url(' + HT + 'cit_editorbutton_inventory.png)}' +
    '#agHT.sk .fan [data-a="t:remove"]::before{background-image:url(' + HT + 'cit_editorbutton_sell.png)}' +
    '#agHT.sk .mode button{font-size:0;width:52px;height:40px;background:url(' + HT + 'cit_editorbutton_validate.png) center/contain no-repeat;box-shadow:none}' +
    '#agHT.sk .visit{background:url(' + HT + 'hud_visit_home.png) left center/auto 100% no-repeat,linear-gradient(#fff3d2,#e9c98d);color:#5a3a00;text-shadow:none;padding-left:70px;border-color:#fff;box-shadow:0 5px 0 #9a7a3e,0 8px 16px rgba(0,0,0,.35)}' +
    '#agHT.sk .visit img{display:none}' +
    '#agHT.sk .garr{background:url(' + HT + 'gen_icon_orangearrow1.png) center/contain no-repeat;right:calc(22px + env(safe-area-inset-right));bottom:calc(330px + env(safe-area-inset-bottom))}' +
    '#agHT.sk .garr path{display:none}' +
    '#agHT.sk.guide .tab button[data-a=build] img{animation:agGlow 1s ease-in-out infinite alternate}' +
    '@keyframes agGlow{to{filter:drop-shadow(0 0 10px #ffe23d) drop-shadow(0 0 4px #fff)}}' +
    '@media (max-height:430px){#agHT.sk .tab{width:70px;padding:8px 3px 8px}#agHT.sk .tab img{width:46px;height:36px}#agHT.sk .tab span{font-size:10px}#agHT.sk .pill{height:34px}#agHT.sk .pill.c{width:128px}#agHT.sk .pill.m{width:94px}#agHT.sk .pill.e{width:92px}#agHT.sk .pill.g{width:86px}#agHT.sk .zm,#agHT.sk .fan{right:calc(82px + env(safe-area-inset-right))}#agHT.sk .garr{bottom:calc(262px + env(safe-area-inset-bottom))}}' +
    // vecinos con el tablero de madera
    '#htNb.sk{background:linear-gradient(#e9f6ff,#bfe3f7);border-top-color:#8a5a2b}' +
    '#htNb.sk .hd b{background:url(' + HT + 'nei_visit_board.png) center/100% 100% no-repeat;color:#fff;padding:6px 18px;text-shadow:0 1px 0 #3a2410,0 0 3px #3a2410;flex:0 0 auto}' +
    '#htNb.sk .hd{justify-content:space-between}#htNb.sk .hd b+button{margin-left:auto}' +
    '#htNb.sk .add .av{background:url(' + HT + 'nei_addfriends_image.png) center/86% no-repeat,#fff;font-size:0}' +
    // hoja de ajustes
    '#agHTs{position:fixed;inset:0;z-index:1060;display:none;align-items:center;justify-content:center;background:rgba(8,40,60,.45)}#agHTs.show{display:flex}' +
    '#agHTs .bx{width:min(360px,92vw);background:linear-gradient(#fffdf4,#fff3cf);border:4px solid #1c6e9c;border-radius:20px;padding:12px;display:flex;flex-direction:column;gap:8px;font-family:CV,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4)}' +
    '#agHTs h3{margin:0 0 4px;text-align:center;color:#0a5f8c;font-size:20px}' +
    '#agHTs button{border:0;border-radius:14px;padding:12px;font:700 16px CV,sans-serif;color:#fff;background:linear-gradient(#7fd0ff,#2f8fc4);box-shadow:0 4px 0 #1c6e9c;text-align:left;display:flex;align-items:center;gap:10px}' +
    '#agHTs button.x{background:linear-gradient(#ff8a80,#e8382f);box-shadow:0 4px 0 #9c1d16;justify-content:center}' +
    // pantallas bajitas (celular horizontal)
    '@media (max-height:430px){#agHT .big{width:80px;height:80px}#agHT .big img{width:44px;height:44px}#agHT .big span{font-size:12px}' +
    '#agHT .side button{width:52px;height:52px;border-radius:15px}#agHT .side button img{width:30px;height:30px}#agHT .side button span{font-size:9px}#agHT .side{gap:6px}' +
    '#agHT .rb{width:40px;height:40px}#agHT .rb.mid{width:56px;height:56px}#agHT .fan button{width:54px;height:54px}#agHT .fan{right:calc(158px + env(safe-area-inset-right))}' +
    '#agHT .pill{height:30px;font-size:14px;padding:0 10px 0 30px}#agHT .pill img{width:34px;height:34px}#agHT .lv{height:34px}}' +
    '@media (max-width:640px){#agHT .pill.g{display:none}#agHT .lv{min-width:96px}#agHT .pill small{display:none}}' +
    '@media (max-height:340px){#agHT .side button:nth-child(n+4){display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------- puente con el juego ----------
  function fl() { return document.getElementById('flashapp'); }
  function call(root, path) {
    var f = fl(); if (!f || typeof f.quickNav !== 'function') return undefined;
    try { return f.quickNav([root, path].concat([].slice.call(arguments, 2))); } catch (e) { return undefined; }
  }
  var UI = 'Display.UI';

  // ---------- interfaz ----------
  var hud, sheet, fan, modeBar, els = {};
  function fmt(n) { n = +n || 0; if (n >= 1e7) return (n / 1e6).toFixed(n >= 1e8 ? 0 : 1).replace('.0', '') + 'M'; if (n >= 1e5) return Math.round(n / 1e3) + 'K'; return n.toLocaleString(); }

  function build() {
    hud = document.createElement('div'); hud.id = 'agHT';
    hud.innerHTML =
      '<div class="top">' +
      '<div class="lv" data-a="xp"><div class="st" id="htLv">1</div><div class="bar"><i id="htXpI"></i><b id="htXp"></b></div></div>' +
      '<div class="vtag" id="htVis">' + t.visiting + '</div>' +
      '<div class="pills">' +
      '<div class="pill c"><img src="' + IC + 'coin.png" alt=""><span id="htGold">0</span></div>' +
      '<div class="pill m"><img src="' + IC + 'cash.png" alt=""><span id="htCash">0</span></div>' +
      '<div class="pill e"><img src="' + IC + 'energy.png" alt=""><span id="htEn">0</span><small id="htEnM"></small></div>' +
      '<div class="pill g"><img src="' + IC + 'goods.png" alt=""><span id="htGoods">0</span><small id="htGoodsM"></small></div>' +
      '</div>' +
      '<div class="rt"><button class="rb gear" data-a="set" title="' + t.set + '">\u2699</button></div>' +
      '</div>' +
      '<div class="side">' +
      '<button class="green" data-a="friends"><img src="' + IC + 'friends.png" alt=""><span>' + t.friends + '</span><i class="bd" id="htBadge"></i></button>' +
      '<button data-a="quests"><img src="' + IC + 'quest.png" alt=""><span>' + t.quests + '</span></button>' +
      '<button class="gold" data-a="ch"><img src="' + IC + 'trophy.png" alt=""><span>' + t.ch + '</span></button>' +
      '<button data-a="daily"><img src="' + IC + 'gift.png" alt=""><span>' + t.daily + '</span></button>' +
      '</div>' +
      '<div class="zm"><button class="rb" data-a="zin">+</button><button class="rb" data-a="zout">\u2212</button></div>' +
      '<div class="fan" id="htFan">' +
      '<button data-a="t:move">\u270B<span>' + t.move + '</span></button>' +
      '<button data-a="t:rotate">\u21BB<span>' + t.rotate + '</span></button>' +
      '<button data-a="t:store">\uD83D\uDCE6<span>' + t.store + '</span></button>' +
      '<button class="sell" data-a="t:remove">\uD83D\uDCB0<span>' + t.sell + '</span></button>' +
      '</div>' +
      '<div class="act"><div class="col">' +
      '<button class="rb mid" data-a="tools"><img src="' + IC + 'tools.png" alt=""><span>' + t.tools + '</span></button>' +
      '<button class="rb mid" data-a="inv"><img src="' + IC + 'store.png" alt=""><span>' + t.inv + '</span></button>' +
      '</div><button class="big" data-a="build"><img src="' + IC + 'city.png" alt=""><span>' + t.build + '</span></button></div>' +
      '<div class="tab"><button data-a="build"><img src="' + HT + 'img_menu_store.png" alt=""><span>' + t.build + '</span></button>' +
      '<button data-a="tools"><img src="' + HT + 'img_menu_design.png" alt=""><span>' + t.tools + '</span></button>' +
      '<button data-a="inv"><img src="' + HT + 'cit_editorbutton_inventory.png" alt=""><span>' + t.inv + '</span></button>' +
      '<button data-a="friends"><img src="' + HT + 'img_menu_friends.png" alt=""><span>' + t.friends + '</span><i class="bd" id="htBadge2"></i></button></div>' +
      '<div class="mode" id="htMode"><span id="htModeT"></span><button data-a="done">\u2713 ' + t.done + '</button></div>' +
      '<svg class="garr" viewBox="0 0 46 56"><path d="M15 0h16v30h13L23 56 2 30h13z" fill="#ffe23d" stroke="#8a5c00" stroke-width="3" stroke-linejoin="round"/></svg>' +
      '<button class="visit" data-a="home"><img src="' + IC + 'home.png" alt="">' + t.home + '</button>';
    document.body.appendChild(hud);
    fan = hud.querySelector('#htFan'); modeBar = hud.querySelector('#htMode');
    ['htLv', 'htXpI', 'htXp', 'htGold', 'htCash', 'htEn', 'htEnM', 'htGoods', 'htGoodsM', 'htBadge', 'htBadge2', 'htModeT'].forEach(function (id) { els[id] = document.getElementById(id); });
    hud.addEventListener('click', onClick);
    // que los toques en la interfaz no lleguen al mapa
    ['pointerdown', 'touchstart', 'mousedown'].forEach(function (ev) { hud.addEventListener(ev, function (e) { if (e.target.closest('button,.pill,.lv')) e.stopPropagation(); }, true); });

    sheet = document.createElement('div'); sheet.id = 'agHTs';
    sheet.innerHTML = '<div class="bx"><h3>' + t.set + '</h3>' +
      '<button data-a="coll"><img src="' + IC + 'library.png" width="28" alt="">' + t.coll + '</button>' +
      '<button data-a="menu"><span style="font-size:24px;width:28px;text-align:center">\u2630</span>' + t.menu + '</button>' +
      ((document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen) && !/AllowGamesApp/.test(navigator.userAgent) ? '<button data-a="fs"><img src="' + IC + 'expand.png" width="28" alt="">' + t.full + '</button>' : '') +
      '<button data-a="saver"><img src="' + IC + 'energy.png" width="28" alt=""><span id="htSaver"></span></button>' +
      '<button data-a="lite"><img src="' + IC + 'energy.png" width="28" alt="">' + t.lite + '</button>' +
      '<button data-a="classic"><img src="' + IC + 'home.png" width="28" alt="">' + t.classic + '</button>' +
      '<button class="x" data-a="close">' + t.close + '</button></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) { sheet.classList.remove('show'); return; }
      var b = e.target.closest('button'); if (!b) return;
      sheet.classList.remove('show');
      act(b.getAttribute('data-a'));
    });

    // insignia de mensajes de la Comunidad
    var src = document.getElementById('agCmBadge');
    if (src && window.MutationObserver) {
      var sync = function () { var n = src.textContent; var show = src.style.display === 'none' || !n || n === '0' ? 'none' : 'block'; els.htBadge.textContent = n; els.htBadge.style.display = show; els.htBadge2.textContent = n; els.htBadge2.style.display = show; };
      new MutationObserver(sync).observe(src, { childList: true, attributes: true, characterData: true, subtree: true }); sync();
    }
  }

  // ---------- vecinos (barra de abajo como Hometown) ----------
  var nbEl = null, nbData = null;
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function toggleNb(force) {
    if (!nbEl) {
      nbEl = document.createElement('div'); nbEl.id = 'htNb';
      nbEl.innerHTML = '<div class="hd"><b>' + t.nb + '</b><button data-n="chat">\uD83D\uDCAC Chat</button><button class="x" data-n="close">\u2715</button></div><div class="row" id="htNbRow"></div>';
      document.body.appendChild(nbEl); fit(); if (window.agHtSkin) nbEl.classList.add('sk');
      ['pointerdown', 'touchstart', 'mousedown'].forEach(function (ev) { nbEl.addEventListener(ev, function (e) { e.stopPropagation(); }, true); });
      nbEl.addEventListener('click', function (e) {
        var b = e.target.closest('[data-n]');
        if (b) {
          var a = b.getAttribute('data-n'), card = b.closest('.nb');
          if (a === 'close') toggleNb(false);
          else if (a === 'chat') { toggleNb(false); if (window.agOpenCommunity) window.agOpenCommunity(); }
          else if (a === 'add') { toggleNb(false); if (window.agOpenCommunity) window.agOpenCommunity(); }
          else if (a === 'visit') { toggleNb(false); defaultTool(); call(UI, 'visitNeighbor', card.getAttribute('data-uid')); }
          else if (a === 'msg') { toggleNb(false); if (window.agChat) window.agChat.open(card.getAttribute('data-name')); }
          return;
        }
        var c = e.target.closest('.nb[data-uid]'); if (!c) return;
        var had = c.querySelector('.pop');
        nbEl.querySelectorAll('.pop').forEach(function (x) { x.remove(); });
        if (!had) {
          var pop = document.createElement('div'); pop.className = 'pop';
          pop.innerHTML = '<button class="v" data-n="visit">\uD83C\uDFE0 ' + t.visit + '</button><button class="m" data-n="msg">\uD83D\uDCAC ' + t.msg + '</button>';
          c.appendChild(pop);
        }
      });
    }
    var open = force === undefined ? !nbEl.classList.contains('open') : force;
    nbEl.classList.toggle('open', open);
    hud.classList.toggle('nbopen', open);
    if (open) loadNb();
  }
  function loadNb() {
    var row = document.getElementById('htNbRow');
    if (!nbData) row.innerHTML = '<div class="none">...</div>';
    fetch('/api/ag/neighbors', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d) return; nbData = d;
      var h = '<div class="nb add" data-n="add"><div class="av">+</div><span class="nm">' + t.addf + '</span></div>';
      if (!d.list.length) h += '<div class="none">' + t.none + '</div>';
      d.list.forEach(function (n) {
        h += '<div class="nb" data-uid="' + esc(n.uid) + '" data-name="' + esc(n.name) + '"><div class="av" style="background-image:url(\'' + esc(n.avatar) + '\')"><s class="' + esc(n.status) + '"></s><i>' + (+n.level || 1) + '</i></div><span class="nm">' + esc(n.name) + '</span></div>';
      });
      row.innerHTML = h;
    }).catch(function () { });
  }

  var toolOn = null;
  function setMode(tool) {
    toolOn = tool;
    if (!tool) { modeBar.classList.remove('show'); return; }
    var h = { move: t.hintMove, rotate: t.hintRotate, store: t.hintStore, remove: t.hintSell }[tool];
    els.htModeT.textContent = h; modeBar.classList.add('show');
  }
  function defaultTool() { call('', 'ui.onDefaultModeClick', null); setMode(null); }

  function onClick(e) {
    var b = e.target.closest('[data-a]'); if (!b) return;
    act(b.getAttribute('data-a'));
  }
  function act(a) {
    if (a !== 'tools' && a.indexOf('t:') !== 0) fan.classList.remove('open');
    switch (a) {
      case 'build': defaultTool(); call(UI, 'displayMarketDialog'); break;
      case 'inv': defaultTool(); call(UI, 'displayInventory'); break;
      case 'tools': fan.classList.toggle('open'); break;
      case 'quests': call(UI, 'displayQuestManager'); break;
      case 'coll': call(UI, 'displayCollections'); break;
      case 'friends': toggleNb(); break;
      case 'ch': if (window.agOpenChallenges) window.agOpenChallenges(); break;
      case 'daily': if (window.agOpenDaily) window.agOpenDaily(); break;
      case 'zin': try { fl().zoomIn(); } catch (x) { } break;
      case 'zout': try { fl().zoomOut(); } catch (x) { } break;
      case 'set': document.getElementById('htSaver').textContent = t.fps + ': ' + (saver() ? t.on : t.off); sheet.classList.add('show'); break;
      case 'saver': try { localStorage.setItem('agSaver', saver() ? '0' : '1'); } catch (x) { } ticks = 0; break;
      case 'done': defaultTool(); break;
      case 'home': var uid = call('', 'player.uid'); if (uid) call(UI, 'visitNeighbor', String(uid)); break;
      case 'menu': var m = document.getElementById('cvMenuToggle'); if (m) m.click(); break;
      case 'fs': fullscreen(); break;
      case 'lite':
        try { localStorage.setItem('agMode', 'lite'); } catch (x) { }
        location.href = '/m'; break;
      case 'classic':
        try { localStorage.setItem('agHud', 'classic'); } catch (x) { }
        call('', 'hud.visible', true); call('', 'ui.bottomUI.visible', true);
        location.reload(); break;
      case 'xp': break;
      default:
        if (a.indexOf('t:') === 0) { var tool = a.slice(2); fan.classList.remove('open'); call('', 'ui.setTool', tool); setMode(tool); }
    }
  }
  function fullscreen() {
    var d = document.documentElement;
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
      var p = (d.requestFullscreen || d.webkitRequestFullscreen).call(d, { navigationUI: 'hide' });
      if (p && p.then) p.then(function () { try { screen.orientation.lock('landscape').catch(function () { }); } catch (e) { } }).catch(function () { });
    } catch (e) { }
  }

  // ---------- datos ----------
  var levels = null;
  fetch('/api/ag/levels', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (l) { levels = l; }).catch(function () { });
  var last = {};
  function bump(id, v) {
    if (last[id] !== undefined && v > last[id]) { var p = els[id].closest('.pill'); if (p) { p.classList.add('bump'); setTimeout(function () { p.classList.remove('bump'); }, 180); } }
    last[id] = v;
  }
  var ready = false, ticks = 0, musicOff = false;
  function saver() { try { return localStorage.getItem('agSaver') !== '0'; } catch (e) { return true; } }
  function tick() {
    var lv = call('', 'player.level');
    if (typeof lv !== 'number') return;
    if (!ready) { ready = true; hud.style.display = ''; }
    // el HUD viejo de Flash fuera
    if (ticks++ % 3 === 0) {
      if (call('', 'hud.visible') !== false) call('', 'hud.visible', false);
      if (call('', 'ui.bottomUI.visible') !== false) call('', 'ui.bottomUI.visible', false);
      var want = saver() ? (weak ? 15 : 20) : 30;
      if (call('', 'stage.frameRate') !== want) call('', 'stage.frameRate', want);
      var noMusic = saver() && weak;
      if (noMusic !== musicOff) { musicOff = noMusic; call('Classes.util.Sounds', noMusic ? 'pauseMusic' : 'unpauseMusic'); }
      hud.classList.toggle('guide', call('', 'guide.isActive') === true);
    }

    var gold = call('', 'player.gold'), cash = call('', 'player.cash'), en = call('', 'player.energy'), enMax = call('', 'player.energyMax'), xp = call('', 'player.xp');
    var goods = call('', 'player.commodities.getCount', 'goods'), goodsMax = call('', 'player.commodities.getCapacity', 'goods');
    els.htLv.textContent = lv;
    els.htGold.textContent = fmt(gold); bump('htGold', +gold);
    els.htCash.textContent = fmt(cash); bump('htCash', +cash);
    els.htEn.textContent = Math.floor(+en || 0); els.htEnM.textContent = enMax ? '/' + Math.floor(enMax) : '';
    if (typeof goods === 'number') { els.htGoods.textContent = fmt(goods); els.htGoodsM.textContent = goodsMax ? '/' + fmt(goodsMax) : ''; }
    if (levels && levels.length) {
      var cur = levels[lv - 1] || 0, nxt = levels[lv];
      if (nxt === undefined) { els.htXpI.style.width = '100%'; els.htXp.textContent = fmt(xp); }
      else { var pc = Math.max(0, Math.min(100, (xp - cur) / Math.max(1, nxt - cur) * 100)); els.htXpI.style.width = pc + '%'; els.htXp.textContent = fmt(xp) + ' / ' + fmt(nxt); }
    } else els.htXp.textContent = fmt(xp);
    var vis = call('', 'isVisiting') === true;
    hud.classList.toggle('visiting', vis);
    if (vis && toolOn) setMode(null);
  }

  // se adapta a cada pantalla: en tablet todo mas grande, en celular chico un poco mas pequeno
  function fit() {
    var z = Math.max(0.82, Math.min(1.45, Math.min(innerWidth / 860, innerHeight / 400)));
    [hud, sheet, nbEl].forEach(function (el) { if (el) el.style.zoom = z; });
  }
  function init() {
    if (!document.getElementById('cvGame')) { document.documentElement.classList.remove('ag-ht'); return; }
    build(); hud.style.display = 'none'; fit();
    var probe = new Image();
    probe.onload = function () { hud.classList.add('sk'); if (nbEl) nbEl.classList.add('sk'); window.agHtSkin = true; };
    probe.src = HT + 'img_menu_tab.png';
    addEventListener('resize', fit); addEventListener('orientationchange', function () { setTimeout(fit, 300); });
    setInterval(function () { if (!document.hidden) tick(); }, 2000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
