// CityVille Revived - Allow Games: modo celular/tablet estilo CityVille Hometown.
// No cambia el juego: agrega controles tactiles grandes, pellizcar para zoom, pantalla completa
// y acceso rapido a Desafios / Comunidad / Menu. Solo se activa en pantallas tactiles.
(function () {
  if (!window.matchMedia || !matchMedia('(pointer: coarse)').matches) return;
  var P = window.AG_PLAYER || {};
  var lang = (P.locale || navigator.language || 'es').slice(0, 2);
  var T = {
    es: { menu: 'Menú', ch: 'Desafíos', cm: 'Social', zin: 'Acercar', zout: 'Alejar', fs: 'Pantalla', hide: 'Ocultar', tip: 'Pellizca con dos dedos para acercar o alejar', inst: 'Instalar app', instIos: 'Toca Compartir y luego "Agregar a inicio"' },
    en: { menu: 'Menu', ch: 'Challenges', cm: 'Social', zin: 'Zoom in', zout: 'Zoom out', fs: 'Fullscreen', hide: 'Hide', tip: 'Pinch with two fingers to zoom', inst: 'Install app', instIos: 'Tap Share then "Add to Home Screen"' },
    pt: { menu: 'Menu', ch: 'Desafios', cm: 'Social', zin: 'Aproximar', zout: 'Afastar', fs: 'Tela cheia', hide: 'Ocultar', tip: 'Faça pinça com dois dedos para o zoom', inst: 'Instalar app', instIos: 'Toque em Compartilhar e "Adicionar à Tela de Início"' },
    fr: { menu: 'Menu', ch: 'Défis', cm: 'Social', zin: 'Zoom +', zout: 'Zoom −', fs: 'Plein écran', hide: 'Masquer', tip: 'Pince avec deux doigts pour zoomer', inst: "Installer l'app", instIos: 'Touche Partager puis « Sur l\'écran d\'accueil »' },
    it: { menu: 'Menu', ch: 'Sfide', cm: 'Social', zin: 'Zoom +', zout: 'Zoom −', fs: 'Schermo intero', hide: 'Nascondi', tip: 'Pizzica con due dita per lo zoom', inst: 'Installa app', instIos: 'Tocca Condividi e "Aggiungi a Home"' },
    de: { menu: 'Menü', ch: 'Aufgaben', cm: 'Social', zin: 'Zoom +', zout: 'Zoom −', fs: 'Vollbild', hide: 'Ausblenden', tip: 'Mit zwei Fingern zoomen', inst: 'App installieren', instIos: 'Tippe auf Teilen und „Zum Home-Bildschirm"' }
  };
  var t = T[lang] || T.es;
  var isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var inApp = /AllowGamesApp/.test(navigator.userAgent);
  var isAndroid = /Android/i.test(navigator.userAgent);
  var standalone = inApp || (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;

  var css =
    // el boton viejo de menu lo reemplaza el dock
    '#cvMenuToggle{display:none!important}' +
    '#agDock{position:fixed;right:calc(6px + env(safe-area-inset-right));top:50%;transform:translateY(-50%);z-index:1046;display:flex;flex-direction:column;gap:7px;align-items:center;transition:transform .25s ease,opacity .25s;font-family:CV,sans-serif;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}' +
    '#agDock.min{transform:translate(calc(100% + 4px),-50%)}' +
    '#agDock button{position:relative;width:54px;height:54px;border-radius:50%;border:3px solid #fff;padding:0;cursor:pointer;color:#fff;font-size:22px;line-height:1;' +
    'background:radial-gradient(circle at 35% 30%,#7fd0ff,#2f8fc4 60%,#1c6e9c);box-shadow:0 4px 0 #0d4f73,0 6px 12px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent}' +
    '#agDock button:active{transform:translateY(3px);box-shadow:0 1px 0 #0d4f73}' +
    '#agDock button small{font-size:8.5px;font-weight:700;margin-top:2px;text-shadow:0 1px 0 rgba(0,0,0,.4);letter-spacing:.2px;max-width:50px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}' +
    '#agDock .gold{background:radial-gradient(circle at 35% 30%,#ffe98a,#f5b81c 60%,#c98a00);box-shadow:0 4px 0 #8a5c00,0 6px 12px rgba(0,0,0,.35)}' +
    '#agDock .green{background:radial-gradient(circle at 35% 30%,#b6f07a,#4fae1f 60%,#2c7710);box-shadow:0 4px 0 #1f5a0b,0 6px 12px rgba(0,0,0,.35)}' +
    '#agDock .sm{width:42px;height:42px;font-size:18px}' +
    '#agDock .bd{position:absolute;top:-4px;right:-4px;background:#e8382f;color:#fff;border:2px solid #fff;border-radius:999px;font-size:11px;font-weight:700;min-width:20px;padding:0 4px;line-height:16px;display:none}' +
    '#agDockTab{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:1045;width:22px;height:64px;border:2px solid #fff;border-right:0;border-radius:12px 0 0 12px;background:#2f8fc4;color:#fff;font-size:16px;display:none;padding:0;box-shadow:-2px 3px 8px rgba(0,0,0,.3)}' +
    '#agDock.min + #agDockTab{display:block}' +
    '#agTip{position:fixed;left:50%;top:calc(10px + env(safe-area-inset-top));transform:translateX(-50%);z-index:1047;background:rgba(7,59,87,.9);color:#fff;border:2px solid #fff;border-radius:999px;padding:6px 14px;font:700 13px CV,sans-serif;box-shadow:0 4px 10px rgba(0,0,0,.3);transition:opacity .6s;pointer-events:none;white-space:nowrap}' +
    // paneles a pantalla completa en celular
    '@media (max-width:600px),(max-height:500px){#agCm{width:100vw!important}#agCh .c{max-width:100%!important}}' +
    '@media (max-height:420px){#agDock button{width:46px;height:46px;font-size:19px}#agDock .sm{width:38px;height:38px;font-size:16px}#agDock{gap:5px}#agDock button small{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function flash() { return document.getElementById('flashapp'); }
  function zoom(dir) { var f = flash(); try { if (dir > 0) f.zoomIn(); else f.zoomOut(); } catch (e) { } }

  function fullscreen() {
    var d = document.documentElement;
    var inFs = document.fullscreenElement || document.webkitFullscreenElement;
    try {
      if (inFs) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
      var p = (d.requestFullscreen || d.webkitRequestFullscreen).call(d, { navigationUI: 'hide' });
      if (p && p.then) p.then(function () { try { screen.orientation.lock('landscape').catch(function () { }); } catch (e) { } }).catch(function () { });
    } catch (e) { }
  }

  var deferredInstall = null;
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredInstall = e; var b = document.getElementById('agInstBtn'); if (b) b.style.display = ''; });

  function build() {
    var dock = document.createElement('div'); dock.id = 'agDock';
    var canFs = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen) && !standalone;
    dock.innerHTML =
      '<button data-a="menu"><i class="bi bi-list"></i><small>' + t.menu + '</small></button>' +
      '<button data-a="ch" class="gold"><img class="agi lg" src="/ag/ic/trophy.png" alt=""><small>' + t.ch + '</small></button>' +
      '<button data-a="cm" class="green"><img class="agi lg" src="/ag/ic/friends.png" alt=""><small>' + t.cm + '</small><span class="bd" id="agDockBadge"></span></button>' +
      '<button data-a="zin" class="sm" title="' + t.zin + '">＋</button>' +
      '<button data-a="zout" class="sm" title="' + t.zout + '">－</button>' +
      (canFs ? '<button data-a="fs" class="sm" title="' + t.fs + '"><i class="bi bi-arrows-fullscreen"></i></button>' : '') +
      (!standalone ? '<button data-a="inst" id="agInstBtn" class="sm" title="' + t.inst + '"' + (isIos || isAndroid ? '' : ' style="display:none"') + '><i class="bi bi-phone"></i></button>' : '') +
      '<button data-a="hide" class="sm" title="' + t.hide + '">›</button>';
    var tab = document.createElement('button'); tab.id = 'agDockTab'; tab.type = 'button'; tab.textContent = '‹';
    document.body.appendChild(dock); document.body.appendChild(tab);
    tab.onclick = function () { dock.classList.remove('min'); };
    dock.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'menu') { var m = document.getElementById('cvMenuToggle'); if (m) m.click(); }
      else if (a === 'ch') { if (window.agOpenChallenges) window.agOpenChallenges(); }
      else if (a === 'cm') { if (window.agOpenCommunity) window.agOpenCommunity(); }
      else if (a === 'zin') zoom(1);
      else if (a === 'zout') zoom(-1);
      else if (a === 'fs') fullscreen();
      else if (a === 'hide') dock.classList.add('min');
      else if (a === 'inst') {
        if (isAndroid) location.href = '/app/android';
        else if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; b.style.display = 'none'; }
        else tip(t.instIos, 6000);
      }
    });
    // copia el numero de mensajes sin leer de la Comunidad
    var src = document.getElementById('agCmBadge'), dst = document.getElementById('agDockBadge');
    if (src && window.MutationObserver) {
      var sync = function () { dst.textContent = src.textContent; dst.style.display = src.style.display === 'none' || !src.textContent || src.textContent === '0' ? 'none' : 'block'; };
      new MutationObserver(sync).observe(src, { childList: true, attributes: true, characterData: true, subtree: true }); sync();
    }
  }

  function tip(text, ms) {
    var old = document.getElementById('agTip'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'agTip'; d.textContent = text; document.body.appendChild(d);
    setTimeout(function () { d.style.opacity = '0'; setTimeout(function () { d.remove(); }, 700); }, ms || 3500);
  }

  // pellizcar con dos dedos = zoom del juego (como en Hometown)
  function pinch() {
    var game = document.getElementById('cvGame'); if (!game) return;
    var pts = {}, base = 0, pinching = false;
    function dist() { var k = Object.keys(pts); if (k.length < 2) return 0; var a = pts[k[0]], b = pts[k[1]]; return Math.hypot(a.x - b.x, a.y - b.y); }
    game.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (Object.keys(pts).length === 2) { pinching = true; base = dist(); e.stopPropagation(); e.preventDefault(); }
    }, true);
    game.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (!pinching) return;
      e.stopPropagation(); e.preventDefault();
      var d = dist(); if (!base || !d) return;
      if (d / base > 1.28) { zoom(1); base = d; }
      else if (d / base < 0.78) { zoom(-1); base = d; }
    }, true);
    function up(e) {
      if (!pts[e.pointerId]) return;
      delete pts[e.pointerId];
      if (pinching) { e.stopPropagation(); if (Object.keys(pts).length === 0) pinching = false; }
    }
    game.addEventListener('pointerup', up, true);
    game.addEventListener('pointercancel', up, true);
    // sin zoom del navegador, sin menu de pulsacion larga
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
    game.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }

  function init() {
    if (!document.getElementById('cvGame')) return;
    if (!document.documentElement.classList.contains('ag-ht')) build();
    pinch();
    var shown = false; try { shown = localStorage.getItem('agPinchTip') === '1'; localStorage.setItem('agPinchTip', '1'); } catch (e) { }
    if (!shown) addEventListener('ag:loaded', function () { tip(t.tip, 4500); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
