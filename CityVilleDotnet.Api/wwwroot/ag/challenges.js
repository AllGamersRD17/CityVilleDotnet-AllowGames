// CityVille Revived - Allow Games: panel de Desafios diarios (sustituye "Monedas y CV Cash")
(function () {
  var P = window.AG_PLAYER || {};
  var lang = (P.locale || navigator.language || 'es').slice(0, 2);
  var L = {
    es: ['Desafíos', 'Juega y gana monedas y CV Cash. Nada se compra: todo se gana jugando.', 'Cobrar', '¡Cobrado!', 'Nuevos desafíos en', 'Premio por completar todos', 'Completa los 4 desafíos de hoy', 'monedas', 'CV Cash', 'energía', 'Tu saldo se actualizará al recargar el juego.', 'Recargar ahora', 'Cerrar', 'Cofre semanal', 'Completa todos los desafíos 7 días seguidos', 'días'],
    en: ['Challenges', 'Play and earn coins and CV Cash. Nothing is sold: everything is earned by playing.', 'Claim', 'Claimed!', 'New challenges in', 'Bonus for completing all', 'Complete all 4 challenges today', 'coins', 'CV Cash', 'energy', 'Your balance updates when the game reloads.', 'Reload now', 'Close', 'Weekly chest', 'Complete all challenges 7 days in a row', 'days'],
    pt: ['Desafios', 'Jogue e ganhe moedas e CV Cash. Nada é vendido: tudo se ganha jogando.', 'Resgatar', 'Resgatado!', 'Novos desafios em', 'Prêmio por completar todos', 'Complete os 4 desafios de hoje', 'moedas', 'CV Cash', 'energia', 'Seu saldo atualiza ao recarregar o jogo.', 'Recarregar', 'Fechar', 'Baú semanal', 'Complete todos os desafios 7 dias seguidos', 'dias'],
    fr: ['Défis', 'Joue et gagne des pièces et du CV Cash. Rien n\'est vendu : tout se gagne en jouant.', 'Récupérer', 'Récupéré !', 'Nouveaux défis dans', 'Prime pour tout terminer', 'Termine les 4 défis du jour', 'pièces', 'CV Cash', 'énergie', 'Ton solde se met à jour en rechargeant le jeu.', 'Recharger', 'Fermer', 'Coffre de la semaine', 'Termine tous les défis 7 jours d\'affilée', 'jours'],
    it: ['Sfide', 'Gioca e guadagna monete e CV Cash. Niente è in vendita: tutto si guadagna giocando.', 'Riscuoti', 'Riscosso!', 'Nuove sfide tra', 'Premio per completarle tutte', 'Completa le 4 sfide di oggi', 'monete', 'CV Cash', 'energia', 'Il saldo si aggiorna ricaricando il gioco.', 'Ricarica', 'Chiudi', 'Forziere settimanale', 'Completa tutte le sfide 7 giorni di fila', 'giorni'],
    de: ['Herausforderungen', 'Spiele und verdiene Münzen und CV Cash. Nichts wird verkauft: alles wird erspielt.', 'Abholen', 'Abgeholt!', 'Neue Herausforderungen in', 'Bonus für alle', 'Schaffe alle 4 heute', 'Münzen', 'CV Cash', 'Energie', 'Dein Guthaben aktualisiert sich beim Neuladen.', 'Neu laden', 'Schließen', 'Wochentruhe', 'Schaffe alle Herausforderungen 7 Tage in Folge', 'Tage']
  };
  var t = L[lang] || L.es;
  var css = '#agCh{position:fixed;inset:0;z-index:99996;display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box;background:rgba(5,20,30,.55);font-family:CV,sans-serif}' +
    '#agCh *{box-sizing:border-box}' +
    '#agCh .c{position:relative;width:100%;max-width:560px;max-height:calc(100vh - 28px);overflow:auto;background:#2f8fc4;border:4px solid #1c6e9c;border-radius:22px;padding:12px;box-shadow:0 10px 0 rgba(0,0,0,.2)}' +
    '#agCh .x{position:absolute;right:10px;top:10px;width:34px;height:34px;border:0;background:url(/ag/daily/x.png) center/contain no-repeat;cursor:pointer}' +
    '#agCh h2{margin:2px 40px 4px;text-align:center;color:#fff;font-size:clamp(22px,5vw,30px);text-shadow:-2px -2px 0 #073b57,2px -2px 0 #073b57,-2px 2px 0 #073b57,2px 2px 0 #073b57}' +
    '#agCh .sub{color:#e9f6ff;text-align:center;font-size:14px;margin:0 6px 10px;overflow-wrap:anywhere}' +
    '#agCh .in{background:#fbf6e6;border:3px solid #d9c79a;border-radius:16px;padding:10px}' +
    '#agCh .ch{display:flex;align-items:center;gap:10px;background:#fff;border:3px solid #d9c79a;border-radius:14px;padding:8px 10px;margin-bottom:8px}' +
    '#agCh .ch.done{border-color:#4fae1f;background:#f1ffe6}#agCh .ch.cl{opacity:.6}' +
    '#agCh .ic{font-size:28px;flex:0 0 36px;text-align:center}' +
    '#agCh .bd{flex:1;min-width:0}' +
    '#agCh .tx{font-weight:600;color:#21445a;font-size:15px;overflow-wrap:anywhere}' +
    '#agCh .bar{height:12px;border-radius:999px;background:#e3e9ee;border:2px solid #1c6e9c;overflow:hidden;margin:5px 0 3px}' +
    '#agCh .bar i{display:block;height:100%;background:linear-gradient(90deg,#9be24f,#4fae1f)}' +
    '#agCh .rw{font-size:13px;color:#2c7710;font-weight:700;overflow-wrap:anywhere}' +
    '#agCh .rw img{height:16px;vertical-align:-3px;margin-right:2px}' +
    '#agCh button.cl{flex:0 0 auto;border:3px solid #2e7d1d;border-radius:999px;background:linear-gradient(#7fd14a,#4aa62a);color:#fff;font:700 15px CV,sans-serif;text-shadow:0 2px 0 #2e7d1d;padding:6px 14px;cursor:pointer;white-space:nowrap}' +
    '#agCh button.cl[disabled]{filter:grayscale(1);opacity:.55;cursor:default}' +
    '#agCh .bonus{background:linear-gradient(#fff6c9,#ffe58a);border-color:#e0b33a}' +
    '#agCh .week{background:linear-gradient(#efe4ff,#d9c4ff);border-color:#8e63d6}' +
    '#agCh .dots{display:flex;gap:4px;margin:5px 0 3px;flex-wrap:wrap}#agCh .dots b{width:22px;height:22px;border-radius:50%;border:2px solid #8e63d6;background:#fff;color:#8e63d6;font-size:12px;display:flex;align-items:center;justify-content:center}#agCh .dots b.on{background:#8e63d6;color:#fff}' +
    '#agCh .ft{text-align:center;color:#e9f6ff;font-size:13px;margin-top:8px}' +
    '#agCh .note{display:none;text-align:center;margin-top:8px}#agCh .note.on{display:block}' +
    '#agCh .note p{color:#fff;margin:0 0 6px;font-size:14px}#agCh .note button{border:3px solid #1c6e9c;border-radius:999px;background:#fff;color:#0a5f8c;font:700 14px CV,sans-serif;padding:5px 16px;cursor:pointer}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function rw(c) {
    var s = [];
    if (c.coins) s.push('<img src="/ag/daily/doober_coin.png" alt="">' + c.coins + ' ' + t[7]);
    if (c.cash) s.push('💵 ' + c.cash + ' ' + t[8]);
    if (c.energy) s.push('<img src="/ag/daily/doober_bolt.png" alt="">' + c.energy + ' ' + t[9]);
    return s.join(' · ');
  }
  function fmt(s) { var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h + 'h ' + m + 'm'; }

  var root = null, claimedSomething = false;
  function render(d) {
    var h = '<div class="c" role="dialog"><button class="x" aria-label="' + t[12] + '"></button><h2>' + t[0] + '</h2><p class="sub">' + t[1] + '</p><div class="in">';
    d.challenges.forEach(function (c) {
      h += '<div class="ch' + (c.done ? ' done' : '') + (c.claimed ? ' cl' : '') + '"><div class="ic">' + c.icon + '</div><div class="bd"><div class="tx">' + c.text + '</div>' +
        '<div class="bar"><i style="width:' + Math.round(100 * c.progress / c.goal) + '%"></i></div><div class="rw">' + c.progress + '/' + c.goal + ' · ' + rw(c) + '</div></div>' +
        '<button class="cl" data-id="' + c.id + '"' + (!c.done || c.claimed ? ' disabled' : '') + '>' + (c.claimed ? '✔' : t[2]) + '</button></div>';
    });
    var b = d.bonus;
    h += '<div class="ch bonus' + (b.claimed ? ' cl' : '') + '"><div class="ic">🎁</div><div class="bd"><div class="tx">' + t[5] + '</div><div class="rw">' + t[6] + ' · ' + rw(b) + '</div></div>' +
      '<button class="cl" data-id="bonus"' + (!b.ready ? ' disabled' : '') + '>' + (b.claimed ? '✔' : t[2]) + '</button></div>';
    var w = d.streak;
    if (w) {
      var dots = ''; for (var i = 1; i <= w.goal; i++) dots += '<b class="' + (i <= w.days ? 'on' : '') + '">' + (i <= w.days ? '✔' : i) + '</b>';
      h += '<div class="ch week"><div class="ic">🧰</div><div class="bd"><div class="tx">' + t[13] + ' · ' + w.days + '/' + w.goal + ' ' + t[15] + '</div><div class="dots">' + dots + '</div><div class="rw">' + t[14] + ' · ' + rw(w) + '</div></div></div>';
    }
    h += '</div><div class="ft">⏰ ' + t[4] + ' ' + fmt(d.resetIn) + '</div><div class="note' + (claimedSomething ? ' on' : '') + '"><p>' + t[10] + '</p><button class="rl">' + t[11] + '</button></div></div>';
    root.innerHTML = h;
  }
  function load() {
    fetch('/api/ag/challenges?lang=' + lang, { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(render).catch(function () {});
  }
  function open() {
    if (root) return;
    root = document.createElement('div'); root.id = 'agCh'; document.body.appendChild(root);
    root.addEventListener('click', function (e) {
      if (e.target === root || e.target.classList.contains('x')) { root.remove(); root = null; return; }
      if (e.target.classList.contains('rl')) { location.reload(); return; }
      var id = e.target.getAttribute && e.target.getAttribute('data-id');
      if (id && !e.target.disabled) {
        e.target.disabled = true;
        fetch('/api/ag/challenges/claim/' + encodeURIComponent(id), { method: 'POST', credentials: 'same-origin' })
          .then(function (r) { if (r.ok) { claimedSomething = true; e.target.textContent = t[3]; } load(); });
      }
    });
    load();
  }
  window.agOpenChallenges = open;
  // el boton del juego "Monedas y CV Cash" abre los desafios
  function hook(obj) {
    if (!obj) return;
    ['navigateTo', 'openTab', 'switchToTab', 'showPaymentsDialog', 'showPayments', 'buyCurrency', 'openBuyCashDialog'].forEach(function (n) {
      var orig = obj[n];
      obj[n] = function () {
        var a = JSON.stringify([].slice.call(arguments)).toLowerCase();
        console.log('[AG] ' + n + ' ' + a);
        if (/cash|coin|money|pay|currency|credit|earn|offer|purchase/.test(a) || /pay|currency|cash/i.test(n)) { open(); return; }
        if (typeof orig === 'function') return orig.apply(this, arguments);
      };
    });
  }
  hook(window);
  document.addEventListener('DOMContentLoaded', function () { hook(window.ZYFrameManager); });
})();
