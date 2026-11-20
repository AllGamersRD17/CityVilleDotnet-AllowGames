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
    es: { build: 'Construir', inv: 'Inventario', tools: 'Editar', friends: 'Vecinos', quests: 'Misiones', ch: 'Desafíos', daily: 'Premio', coll: 'Colecciones', move: 'Mover', rotate: 'Girar', store: 'Guardar', sell: 'Vender', done: 'Listo', home: 'Volver a mi ciudad', visiting: 'Visitando', lvl: 'Nivel', set: 'Ajustes', classic: 'Usar interfaz clásica', full: 'Pantalla completa', menu: 'Más opciones', close: 'Cerrar', hintMove: 'Toca un edificio y luego donde lo quieres', hintRotate: 'Toca un edificio para girarlo', hintStore: 'Toca un edificio para guardarlo', hintSell: 'Toca un edificio para venderlo', goods: 'Mercancía', energy: 'Energía', full2: 'Llena' },
    en: { build: 'Build', inv: 'Inventory', tools: 'Edit', friends: 'Neighbors', quests: 'Quests', ch: 'Challenges', daily: 'Reward', coll: 'Collections', move: 'Move', rotate: 'Rotate', store: 'Store', sell: 'Sell', done: 'Done', home: 'Back to my city', visiting: 'Visiting', lvl: 'Level', set: 'Settings', classic: 'Use classic interface', full: 'Fullscreen', menu: 'More options', close: 'Close', hintMove: 'Tap a building, then where you want it', hintRotate: 'Tap a building to rotate it', hintStore: 'Tap a building to store it', hintSell: 'Tap a building to sell it', goods: 'Goods', energy: 'Energy', full2: 'Full' },
    pt: { build: 'Construir', inv: 'Inventário', tools: 'Editar', friends: 'Vizinhos', quests: 'Missões', ch: 'Desafios', daily: 'Prêmio', coll: 'Coleções', move: 'Mover', rotate: 'Girar', store: 'Guardar', sell: 'Vender', done: 'Pronto', home: 'Voltar para minha cidade', visiting: 'Visitando', lvl: 'Nível', set: 'Ajustes', classic: 'Usar interface clássica', full: 'Tela cheia', menu: 'Mais opções', close: 'Fechar', hintMove: 'Toque num prédio e depois onde quer', hintRotate: 'Toque num prédio para girar', hintStore: 'Toque num prédio para guardar', hintSell: 'Toque num prédio para vender', goods: 'Mercadorias', energy: 'Energia', full2: 'Cheia' },
    fr: { build: 'Construire', inv: 'Inventaire', tools: 'Modifier', friends: 'Voisins', quests: 'Quêtes', ch: 'Défis', daily: 'Cadeau', coll: 'Collections', move: 'Déplacer', rotate: 'Tourner', store: 'Ranger', sell: 'Vendre', done: 'OK', home: 'Retour à ma ville', visiting: 'En visite', lvl: 'Niveau', set: 'Réglages', classic: 'Interface classique', full: 'Plein écran', menu: "Plus d'options", close: 'Fermer', hintMove: 'Touche un bâtiment puis sa nouvelle place', hintRotate: 'Touche un bâtiment pour le tourner', hintStore: 'Touche un bâtiment pour le ranger', hintSell: 'Touche un bâtiment pour le vendre', goods: 'Marchandises', energy: 'Énergie', full2: 'Pleine' },
    it: { build: 'Costruisci', inv: 'Inventario', tools: 'Modifica', friends: 'Vicini', quests: 'Missioni', ch: 'Sfide', daily: 'Premio', coll: 'Collezioni', move: 'Sposta', rotate: 'Ruota', store: 'Riponi', sell: 'Vendi', done: 'Fatto', home: 'Torna alla mia città', visiting: 'In visita', lvl: 'Livello', set: 'Impostazioni', classic: 'Interfaccia classica', full: 'Schermo intero', menu: 'Altre opzioni', close: 'Chiudi', hintMove: 'Tocca un edificio e poi dove vuoi', hintRotate: 'Tocca un edificio per ruotarlo', hintStore: 'Tocca un edificio per riporlo', hintSell: 'Tocca un edificio per venderlo', goods: 'Merci', energy: 'Energia', full2: 'Piena' },
    de: { build: 'Bauen', inv: 'Inventar', tools: 'Bearbeiten', friends: 'Nachbarn', quests: 'Aufgaben', ch: 'Challenges', daily: 'Bonus', coll: 'Sammlungen', move: 'Bewegen', rotate: 'Drehen', store: 'Lagern', sell: 'Verkaufen', done: 'Fertig', home: 'Zurück in meine Stadt', visiting: 'Zu Besuch', lvl: 'Level', set: 'Einstellungen', classic: 'Klassische Oberfläche', full: 'Vollbild', menu: 'Mehr', close: 'Schließen', hintMove: 'Tippe ein Gebäude an, dann den neuen Platz', hintRotate: 'Tippe ein Gebäude zum Drehen an', hintStore: 'Tippe ein Gebäude zum Lagern an', hintSell: 'Tippe ein Gebäude zum Verkaufen an', goods: 'Waren', energy: 'Energie', full2: 'Voll' }
  };
  var t = T[lang] || T.es;
  var IC = '/ag/ic/';

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
    '#agHT.visiting .visit{display:flex}#agHT.visiting .act,#agHT.visiting .fan{display:none}' +
    '#agHT .vtag{display:none;pointer-events:auto;height:34px;align-items:center;padding:0 14px;border-radius:999px;background:rgba(7,59,87,.88);border:3px solid #fff;color:#fff;font-size:14px;font-weight:900}' +
    '#agHT.visiting .vtag{display:flex}#agHT.visiting .pill.c,#agHT.visiting .pill.m,#agHT.visiting .pill.g{display:none}' +
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
      '<div class="mode" id="htMode"><span id="htModeT"></span><button data-a="done">\u2713 ' + t.done + '</button></div>' +
      '<button class="visit" data-a="home"><img src="' + IC + 'home.png" alt="">' + t.home + '</button>';
    document.body.appendChild(hud);
    fan = hud.querySelector('#htFan'); modeBar = hud.querySelector('#htMode');
    ['htLv', 'htXpI', 'htXp', 'htGold', 'htCash', 'htEn', 'htEnM', 'htGoods', 'htGoodsM', 'htBadge', 'htModeT'].forEach(function (id) { els[id] = document.getElementById(id); });
    hud.addEventListener('click', onClick);
    // que los toques en la interfaz no lleguen al mapa
    ['pointerdown', 'touchstart', 'mousedown'].forEach(function (ev) { hud.addEventListener(ev, function (e) { if (e.target.closest('button,.pill,.lv')) e.stopPropagation(); }, true); });

    sheet = document.createElement('div'); sheet.id = 'agHTs';
    sheet.innerHTML = '<div class="bx"><h3>' + t.set + '</h3>' +
      '<button data-a="coll"><img src="' + IC + 'library.png" width="28" alt="">' + t.coll + '</button>' +
      '<button data-a="menu"><span style="font-size:24px;width:28px;text-align:center">\u2630</span>' + t.menu + '</button>' +
      ((document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen) && !/AllowGamesApp/.test(navigator.userAgent) ? '<button data-a="fs"><img src="' + IC + 'expand.png" width="28" alt="">' + t.full + '</button>' : '') +
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
      var sync = function () { var n = src.textContent; els.htBadge.textContent = n; els.htBadge.style.display = src.style.display === 'none' || !n || n === '0' ? 'none' : 'block'; };
      new MutationObserver(sync).observe(src, { childList: true, attributes: true, characterData: true, subtree: true }); sync();
    }
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
      case 'friends': if (window.agOpenCommunity) window.agOpenCommunity(); break;
      case 'ch': if (window.agOpenChallenges) window.agOpenChallenges(); break;
      case 'daily': if (window.agOpenDaily) window.agOpenDaily(); break;
      case 'zin': try { fl().zoomIn(); } catch (x) { } break;
      case 'zout': try { fl().zoomOut(); } catch (x) { } break;
      case 'set': sheet.classList.add('show'); break;
      case 'done': defaultTool(); break;
      case 'home': var uid = call('', 'player.uid'); if (uid) call(UI, 'visitNeighbor', String(uid)); break;
      case 'menu': var m = document.getElementById('cvMenuToggle'); if (m) m.click(); break;
      case 'fs': fullscreen(); break;
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
  var ready = false;
  function tick() {
    var lv = call('', 'player.level');
    if (typeof lv !== 'number') return;
    if (!ready) { ready = true; hud.style.display = ''; }
    // el HUD viejo de Flash fuera
    if (call('', 'hud.visible') !== false) call('', 'hud.visible', false);
    if (call('', 'ui.bottomUI.visible') !== false) call('', 'ui.bottomUI.visible', false);

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

  function init() {
    if (!document.getElementById('cvGame')) { document.documentElement.classList.remove('ag-ht'); return; }
    build(); hud.style.display = 'none';
    setInterval(tick, 800);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
