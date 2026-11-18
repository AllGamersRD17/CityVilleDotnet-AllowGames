// CityVille Revived - Allow Games: premio diario estilo Roblox (7 dias seguidos, cada dia cambia).
// El servidor ya sumo el premio antes de que cargue el juego; aqui solo se muestra bonito.
(function () {
  var P = window.AG_PLAYER || {};
  var lang = (P.locale || navigator.language || 'es').slice(0, 2);
  var L = {
    es: { title: '¡Premio diario!', day: 'Día', claim: '¡Reclamar!', got: '¡Lo tienes!', back: 'Vuelve mañana para el día', in: 'Se renueva en', streak: 'Entra 7 días seguidos para el premio gordo. Si faltas un día, empiezas otra vez.', coins: 'monedas', energy: 'energía', cash: 'billetes', xp: 'XP', goods: 'mercancía', item: 'Objeto raro', inv: 'Está en tu inventario', mystery: 'Sorpresa', jackpot: '¡Premio gordo!', already: 'Ya reclamaste el premio de hoy', btn: 'Premio diario', total: 'premios cobrados' },
    en: { title: 'Daily reward!', day: 'Day', claim: 'Claim!', got: 'Got it!', back: 'Come back tomorrow for day', in: 'Resets in', streak: 'Log in 7 days in a row for the jackpot. Miss a day and you start over.', coins: 'coins', energy: 'energy', cash: 'cash', xp: 'XP', goods: 'goods', item: 'Rare item', inv: "It's in your inventory", mystery: 'Surprise', jackpot: 'Jackpot!', already: "You already claimed today's reward", btn: 'Daily reward', total: 'rewards claimed' },
    pt: { title: 'Prêmio diário!', day: 'Dia', claim: 'Pegar!', got: 'É seu!', back: 'Volte amanhã para o dia', in: 'Renova em', streak: 'Entre 7 dias seguidos para o prêmio máximo. Se faltar um dia, começa de novo.', coins: 'moedas', energy: 'energia', cash: 'dinheiro', xp: 'XP', goods: 'mercadorias', item: 'Item raro', inv: 'Está no seu inventário', mystery: 'Surpresa', jackpot: 'Prêmio máximo!', already: 'Você já pegou o prêmio de hoje', btn: 'Prêmio diário', total: 'prêmios pegos' },
    fr: { title: 'Récompense du jour !', day: 'Jour', claim: 'Récupérer !', got: 'À toi !', back: 'Reviens demain pour le jour', in: 'Renouvelé dans', streak: "Connecte-toi 7 jours de suite pour le gros lot. Si tu rates un jour, tu recommences.", coins: 'pièces', energy: 'énergie', cash: 'billets', xp: 'XP', goods: 'marchandises', item: 'Objet rare', inv: "C'est dans ton inventaire", mystery: 'Surprise', jackpot: 'Gros lot !', already: "Tu as déjà récupéré la récompense du jour", btn: 'Récompense', total: 'récompenses' },
    it: { title: 'Premio giornaliero!', day: 'Giorno', claim: 'Riscatta!', got: 'È tuo!', back: 'Torna domani per il giorno', in: 'Si rinnova tra', streak: 'Entra 7 giorni di fila per il premio grosso. Se salti un giorno, ricominci.', coins: 'monete', energy: 'energia', cash: 'contanti', xp: 'XP', goods: 'merci', item: 'Oggetto raro', inv: "È nel tuo inventario", mystery: 'Sorpresa', jackpot: 'Premio grosso!', already: 'Hai già riscattato il premio di oggi', btn: 'Premio giornaliero', total: 'premi riscattati' },
    de: { title: 'Tagesbelohnung!', day: 'Tag', claim: 'Abholen!', got: 'Gehört dir!', back: 'Komm morgen wieder für Tag', in: 'Neu in', streak: 'Logge dich 7 Tage am Stück ein für den Jackpot. Verpasst du einen Tag, fängst du neu an.', coins: 'Münzen', energy: 'Energie', cash: 'Geld', xp: 'EP', goods: 'Waren', item: 'Seltener Gegenstand', inv: 'Liegt in deinem Inventar', mystery: 'Überraschung', jackpot: 'Jackpot!', already: 'Du hast die heutige Belohnung schon abgeholt', btn: 'Tagesbelohnung', total: 'Belohnungen' }
  };
  var t = L[lang] || L.es;
  var KIND_IC = { coins: 'coin', energy: 'energy', goods: 'goods', item: 'gift', cash: 'cash', mystery: 'mystery', jackpot: 'trophy' };

  var css = '#agDaily{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(8,40,60,.55);font-family:CV,sans-serif;-webkit-user-select:none;user-select:none;animation:agDyFade .25s}' +
    '@keyframes agDyFade{from{opacity:0}}#agDaily *{box-sizing:border-box}' +
    '#agDaily .bx{position:relative;width:min(640px,94vw);max-height:94vh;overflow:auto;background:linear-gradient(#fffdf4,#fff3cf);border:5px solid #1c6e9c;border-radius:24px;box-shadow:0 10px 0 rgba(0,0,0,.2),0 24px 60px rgba(0,0,0,.4);padding:16px 16px 18px;text-align:center;color:#5a3a00;animation:agDyPop .5s cubic-bezier(.3,1.6,.5,1)}' +
    '@keyframes agDyPop{from{transform:scale(.5) translateY(40px);opacity:0}}' +
    '#agDaily .rb{position:relative;margin:0 auto 4px;width:max-content;max-width:92%;padding:8px 34px;background:linear-gradient(#ffe36b,#f5b81c);border:4px solid #b07a06;border-radius:999px;color:#fff;font-size:30px;text-shadow:-2px -2px 0 #8a5a00,2px -2px 0 #8a5a00,-2px 2px 0 #8a5a00,2px 2px 0 #8a5a00;box-shadow:0 5px 0 rgba(0,0,0,.18)}' +
    '#agDaily .x{position:absolute;top:8px;right:8px;width:34px;height:34px;border:0;border-radius:50%;background:#e8382f;color:#fff;font:700 20px/34px CV,sans-serif;cursor:pointer;box-shadow:0 3px 0 #9c1d16}' +
    '#agDaily .dys{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:14px 0 10px}' +
    '#agDaily .dy{position:relative;border:3px solid #9fd0ec;border-radius:14px;background:#fff;padding:6px 2px 4px;min-width:0}' +
    '#agDaily .dy b{display:block;font-size:12px;color:#0a5f8c}#agDaily .dy img{display:block;width:100%;max-width:44px;height:44px;object-fit:contain;margin:4px auto}#agDaily .dy small{display:block;font-size:10px;color:#8a7a4f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#agDaily .dy.done{background:#e8f8df;border-color:#76c442}#agDaily .dy.done:after{content:"✓";position:absolute;top:-8px;right:-6px;width:22px;height:22px;border-radius:50%;background:#42b72a;color:#fff;font:700 14px/22px CV,sans-serif;box-shadow:0 2px 0 rgba(0,0,0,.2)}' +
    '#agDaily .dy.now{background:linear-gradient(#fff7c9,#ffe36b);border-color:#f5b81c;transform:translateY(-4px) scale(1.06);box-shadow:0 6px 0 rgba(0,0,0,.15);animation:agDyGlow 1.4s ease-in-out infinite}' +
    '@keyframes agDyGlow{50%{box-shadow:0 6px 0 rgba(0,0,0,.15),0 0 0 6px rgba(255,214,64,.45)}}#agDaily .dy.big{border-color:#b07a06}' +
    '#agDaily .prz{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:12px 0}' +
    '#agDaily .pz{display:flex;flex-direction:column;align-items:center;min-width:92px;padding:10px 10px 8px;background:#fff;border:3px solid #f5b81c;border-radius:18px;box-shadow:0 4px 0 rgba(0,0,0,.12);animation:agDyPz .6s cubic-bezier(.3,1.6,.5,1) both}' +
    '#agDaily .pz img{width:58px;height:58px;object-fit:contain}#agDaily .pz b{font-size:22px;color:#0a5f8c}#agDaily .pz small{font-size:12px;color:#8a7a4f;max-width:130px}' +
    '@keyframes agDyPz{from{transform:scale(0) rotate(-20deg)}}' +
    '#agDaily .go{display:inline-flex;align-items:center;gap:6px;border:0;border-radius:999px;padding:10px 34px;background:linear-gradient(#8ee05a,#4caf27);color:#fff;font:700 22px CV,sans-serif;text-shadow:0 2px 0 rgba(0,0,0,.25);cursor:pointer;box-shadow:0 5px 0 #2f7d17}' +
    '#agDaily .go:active{transform:translateY(3px);box-shadow:0 2px 0 #2f7d17}#agDaily .go.off{background:linear-gradient(#bfe0f2,#7fb8d8);box-shadow:0 5px 0 #4f8db0;cursor:default}' +
    '#agDaily .msg{font-size:15px;font-weight:700;color:#0a5f8c;margin:6px 0}#agDaily .tip{font-size:12.5px;color:#8a7a4f;margin-top:10px}' +
    '#agDaily .chest{width:110px;height:110px;margin:4px auto 0;background:url(/ag/ic/gift.png) center/contain no-repeat;animation:agDyShake 1s ease-in-out infinite;cursor:pointer;filter:drop-shadow(0 6px 0 rgba(0,0,0,.15))}' +
    '@keyframes agDyShake{0%,60%,100%{transform:none}70%{transform:rotate(-8deg) scale(1.05)}80%{transform:rotate(8deg) scale(1.05)}90%{transform:rotate(-4deg)}}' +
    '.agDyCoin{position:fixed;z-index:100001;width:34px;height:34px;background:url(/ag/ic/coin.png) center/contain no-repeat;pointer-events:none}' +
    '@media (max-width:520px){#agDaily .dys{grid-template-columns:repeat(4,1fr)}#agDaily .rb{font-size:22px}}';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { try { return Number(n).toLocaleString(lang); } catch (e) { return n; } }
  function hms(s) { var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return h + ':' + ('0' + m).slice(-2) + ':' + ('0' + x).slice(-2); }
  function kindName(k) { return k === 'mystery' ? t.mystery : k === 'jackpot' ? t.jackpot : k === 'item' ? t.item : t[k] || k; }

  function prizes(r) {
    var out = [];
    if (r.item) out.push([r.itemIcon || '/ag/ic/gift.png', t.item, t.inv]);
    if (r.cash) out.push(['/ag/ic/cash.png', '+' + fmt(r.cash), t.cash]);
    if (r.coins) out.push(['/ag/ic/coin.png', '+' + fmt(r.coins), t.coins]);
    if (r.energy) out.push(['/ag/ic/energy.png', '+' + fmt(r.energy), t.energy]);
    if (r.goods) out.push(['/ag/ic/goods.png', '+' + fmt(r.goods), t.goods]);
    if (r.xp) out.push(['/ag/ic/xp.png', '+' + fmt(r.xp), t.xp]);
    return out.map(function (p, i) { return '<div class="pz" style="animation-delay:' + (0.12 * i) + 's"><img src="' + esc(p[0]) + '" alt="" onerror="this.src=\'/ag/ic/gift.png\'"><b>' + esc(p[1]) + '</b><small>' + esc(p[2]) + '</small></div>'; }).join('');
  }
  function days(kinds, cur, claimed) {
    return '<div class="dys">' + kinds.map(function (k, i) {
      var d = i + 1, cls = d < cur || (d === cur && claimed) ? 'done' : d === cur ? 'now' : '';
      if (k === 'jackpot') cls += ' big';
      return '<div class="dy ' + cls + '"><b>' + t.day + ' ' + d + '</b><img src="/ag/ic/' + KIND_IC[k] + '.png" alt=""><small>' + esc(kindName(k)) + '</small></div>';
    }).join('') + '</div>';
  }
  function burst(fromEl) {
    var r = fromEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var i = 0; i < 16; i++) (function (i) {
      var c = document.createElement('div'); c.className = 'agDyCoin'; c.style.left = cx + 'px'; c.style.top = cy + 'px'; document.body.appendChild(c);
      var a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 140;
      c.animate([{ transform: 'translate(-50%,-50%) scale(.6)', opacity: 1 }, { transform: 'translate(' + (Math.cos(a) * d - 17) + 'px,' + (Math.sin(a) * d - 60) + 'px) scale(1)', opacity: 1, offset: .55 }, { transform: 'translate(' + (Math.cos(a) * d - 17) + 'px,' + (innerHeight) + 'px) scale(.8)', opacity: 0 }], { duration: 1100 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = function () { c.remove(); };
    })(i);
  }
  function close(d) { d.style.transition = 'opacity .2s'; d.style.opacity = '0'; setTimeout(function () { d.remove(); }, 200); }
  function mount(html) {
    if (!document.getElementById('agDailyCss')) { var s = document.createElement('style'); s.id = 'agDailyCss'; s.textContent = css; document.head.appendChild(s); }
    var old = document.getElementById('agDaily'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'agDaily'; d.innerHTML = '<div class="bx"><button class="x" aria-label="x">×</button>' + html + '</div>';
    d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('.x')) close(d); });
    ['keydown', 'keyup', 'keypress'].forEach(function (ev) { d.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    document.body.appendChild(d);
    return d;
  }

  // Al entrar: el cofre se sacude, lo tocas y salen los premios
  function showClaim(r) {
    var kinds = r.kinds || ['coins', 'energy', 'goods', 'item', 'cash', 'mystery', 'jackpot'];
    var d = mount('<div class="rb">' + t.title + '</div>' + days(kinds, r.day, false) +
      '<div class="msg">' + t.day + ' ' + r.day + ' · ' + esc(kindName(kinds[r.day - 1])) + '</div><div class="chest" title="' + t.claim + '"></div><div class="prz" style="display:none"></div>' +
      '<button class="go">' + t.claim + '</button><div class="tip">' + t.streak + '</div>');
    var go = d.querySelector('.go'), opened = false;
    function open() {
      if (opened) { close(d); return; }
      opened = true;
      var ch = d.querySelector('.chest'); burst(ch); ch.remove();
      var pz = d.querySelector('.prz'); pz.innerHTML = prizes(r); pz.style.display = '';
      var now = d.querySelector('.dy.now'); if (now) { now.classList.remove('now'); now.classList.add('done'); }
      go.textContent = t.got;
    }
    go.onclick = open; d.querySelector('.chest').onclick = open;
  }

  // Desde el boton: ver los 7 dias y cuanto falta para el proximo
  function showStatus() {
    fetch('/api/ag/daily', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (s) {
      if (!s) return;
      if (!s.claimed) { location.reload(); return; } // el premio se cobra al abrir el juego
      var left = s.secondsLeft;
      var d = mount('<div class="rb">' + t.title + '</div>' + days(s.kinds, s.day, true) +
        '<div class="msg">' + t.already + '</div>' + (s.today ? '<div class="prz">' + prizes(s.today) + '</div>' : '') +
        '<button class="go off">' + t.back + ' ' + (s.day % 7 + 1) + '</button><div class="msg" style="margin-top:12px">' + t.in + ' <span class="cd">' + hms(left) + '</span></div>' +
        '<div class="tip">' + t.streak + (s.total ? ' · ' + s.total + ' ' + t.total : '') + '</div>');
      var cd = d.querySelector('.cd'), iv = setInterval(function () { if (!d.isConnected) return clearInterval(iv); left = Math.max(0, left - 1); cd.textContent = hms(left); if (!left) { clearInterval(iv); location.reload(); } }, 1000);
    }).catch(function () { });
  }
  window.agOpenDaily = showStatus;
  window.agDailyLabel = t.btn;

  function start() { if (P.daily) setTimeout(function () { showClaim(P.daily); }, 600); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
