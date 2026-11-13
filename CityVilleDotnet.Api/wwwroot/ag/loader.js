// CityVille Revived - Allow Games: pantalla de carga propia encima del juego (tapa la de Zynga/Samantha)
(function () {
  var T = {
    es: ['Cargando tu ciudad…', 'Lowlitta está abriendo la alcaldía', 'Todo se gana jugando: nada se vende', 'Visita a tus vecinos para ganar monedas y energía', 'Invita a tus amigos con tu enlace de abajo'],
    en: ['Loading your city…', 'Lowlitta is opening City Hall', 'Everything is earned by playing: nothing is sold', 'Visit your neighbors to earn coins and energy', 'Invite your friends with your link below'],
    pt: ['Carregando sua cidade…', 'Lowlitta está abrindo a prefeitura', 'Tudo se ganha jogando: nada é vendido', 'Visite seus vizinhos para ganhar moedas e energia', 'Convide seus amigos com seu link abaixo'],
    fr: ['Chargement de ta ville…', 'Lowlitta ouvre la mairie', 'Tout se gagne en jouant : rien n\'est vendu', 'Rends visite à tes voisins pour gagner pièces et énergie', 'Invite tes amis avec ton lien ci-dessous'],
    it: ['Caricamento della tua città…', 'Lowlitta sta aprendo il municipio', 'Tutto si guadagna giocando: niente è in vendita', 'Visita i tuoi vicini per guadagnare monete ed energia', 'Invita i tuoi amici con il tuo link qui sotto'],
    de: ['Deine Stadt wird geladen…', 'Lowlitta öffnet das Rathaus', 'Alles wird erspielt: nichts wird verkauft', 'Besuche deine Nachbarn für Münzen und Energie', 'Lade Freunde mit deinem Link unten ein']
  };
  var P = window.AG_PLAYER || {};
  var t = T[(P.locale || navigator.language || 'es').slice(0, 2)] || T.es;
  var css = '#agLoader{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;box-sizing:border-box;overflow:hidden;' +
    'background:url(/ag/skyline.png) center 62%/600px 168px repeat-x,linear-gradient(180deg,#4fb6ec 0,#bfe9fb 62%,#7ba344 62%,#5f8f2e 100%);transition:opacity .8s}' +
    '#agLoader.hide{opacity:0;pointer-events:none}' +
    '#agLoader .lg{width:min(70%,420px);filter:drop-shadow(0 6px 0 rgba(0,0,0,.18))}' +
    '#agLoader .row{display:flex;align-items:flex-end;gap:14px;max-width:100%}' +
    '#agLoader .low{width:min(26vw,170px);flex:0 0 auto;filter:drop-shadow(0 4px 0 rgba(0,0,0,.2))}' +
    '#agLoader .box{background:#fbf6e6;border:4px solid #d9c79a;border-radius:18px;padding:12px 16px;min-width:0;max-width:340px;box-shadow:0 8px 0 rgba(0,0,0,.15)}' +
    '#agLoader .t1{font:700 clamp(16px,2.4vw,22px) CV,sans-serif;color:#0a5f8c;margin:0 0 6px;overflow-wrap:anywhere}' +
    '#agLoader .t2{font:600 clamp(13px,1.8vw,16px) CV,sans-serif;color:#5f6b4a;margin:0;min-height:2.6em;overflow-wrap:anywhere;transition:opacity .4s}' +
    '#agLoader .bar{width:min(80%,460px);height:18px;border-radius:999px;background:#fff;border:3px solid #1c6e9c;overflow:hidden;box-shadow:0 4px 0 rgba(0,0,0,.15)}' +
    '#agLoader .bar i{display:block;height:100%;width:30%;border-radius:999px;background:linear-gradient(90deg,#9be24f,#4fae1f);animation:agbar 1.4s ease-in-out infinite}' +
    '@keyframes agbar{0%{margin-left:-30%}100%{margin-left:100%}}' +
    '#agLoader .ag{height:34px;opacity:.95;margin-top:4px}' +
    '@media (max-height:520px){#agLoader{gap:6px;padding:8px}#agLoader .lg{width:auto;height:24vh;max-width:70%}#agLoader .low{width:auto;height:36vh}#agLoader .box{padding:6px 12px;border-width:3px}#agLoader .t2{min-height:0}#agLoader .bar{height:12px;border-width:2px}#agLoader .ag{height:20px;margin-top:0}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function mount() {
    var g = document.getElementById('cvGame'); if (!g) return;
    if (getComputedStyle(g).position === 'static') g.style.position = 'relative';
    var d = document.createElement('div'); d.id = 'agLoader';
    d.innerHTML = '<img class="lg" src="/ag/logo_revived.png" alt="CityVille Revived">' +
      '<div class="row"><img class="low" src="/ag/lowlitta.png" alt="Lowlitta"><div class="box"><p class="t1"></p><p class="t2"></p></div></div>' +
      '<div class="bar"><i></i></div><img class="ag" src="/ag/allowgames_nav.png" alt="Allow Games">';
    g.appendChild(d);
    d.querySelector('.t1').textContent = t[0];
    var k = 1, t2 = d.querySelector('.t2'); t2.textContent = t[k];
    var iv = setInterval(function () { t2.style.opacity = 0; setTimeout(function () { k = k % (t.length - 1) + 1; t2.textContent = t[k]; t2.style.opacity = 1; }, 400); }, 3500);
    function done() { clearInterval(iv); d.classList.add('hide'); setTimeout(function () { d.remove(); }, 900); }
    window.addEventListener('ag:loaded', function () { setTimeout(done, 600); });
    // El juego no siempre avisa: detectamos que la ciudad ya se dibujo (barra de vecinos cargada)
    var fired = false, count = 0, quietT = null;
    function ready() { if (fired) return; fired = true; window.agLoaded = true; window.dispatchEvent(new Event('ag:loaded')); }
    try {
      new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (e) {
          count++;
          if (/neighborBar_cityNameBarTab|questScroll\/scrollbar/.test(e.name)) setTimeout(ready, 1500);
        });
        if (count > 150) { clearTimeout(quietT); quietT = setTimeout(ready, 4000); }
      }).observe({ type: 'resource', buffered: true });
    } catch (x) {}
    setTimeout(done, 120000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
