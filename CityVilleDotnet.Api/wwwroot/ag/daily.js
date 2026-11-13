// CityVille Revived - Allow Games: aviso del bono diario (las monedas ya se sumaron en el servidor)
(function () {
  var P = window.AG_PLAYER || {}, B = P.daily;
  if (!B) return;
  var L = {
    es: ['¡Bono diario!', 'Día', 'de 5', 'Vuelve mañana para el día', '¡Regalo sorpresa!', 'monedas', 'de energía', 'dinero', '¡Genial!', 'Juega 5 días seguidos para ganar el regalo sorpresa.'],
    en: ['Daily bonus!', 'Day', 'of 5', 'Come back tomorrow for day', 'Surprise gift!', 'coins', 'energy', 'cash', 'Great!', 'Play 5 days in a row to win the surprise gift.'],
    pt: ['Bônus diário!', 'Dia', 'de 5', 'Volte amanhã para o dia', 'Presente surpresa!', 'moedas', 'de energia', 'dinheiro', 'Legal!', 'Jogue 5 dias seguidos para ganhar o presente surpresa.'],
    fr: ['Bonus du jour !', 'Jour', 'sur 5', 'Reviens demain pour le jour', 'Cadeau surprise !', 'pièces', 'd\'énergie', 'billets', 'Génial !', 'Joue 5 jours de suite pour gagner le cadeau surprise.'],
    it: ['Bonus giornaliero!', 'Giorno', 'di 5', 'Torna domani per il giorno', 'Regalo sorpresa!', 'monete', 'di energia', 'contanti', 'Fantastico!', 'Gioca 5 giorni di fila per vincere il regalo sorpresa.'],
    de: ['Tagesbonus!', 'Tag', 'von 5', 'Komm morgen wieder für Tag', 'Überraschungsgeschenk!', 'Münzen', 'Energie', 'Geld', 'Super!', 'Spiele 5 Tage am Stück für das Überraschungsgeschenk.']
  };
  var t = L[(P.locale || navigator.language || 'es').slice(0, 2)] || L.es;
  var css = '#agDaily{position:fixed;inset:0;z-index:99997;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(5,20,30,.6);opacity:0;transition:opacity .5s}' +
    '#agDaily.on{opacity:1}#agDaily *{box-sizing:border-box}' +
    '#agDaily .c{width:100%;max-width:520px;max-height:calc(100vh - 32px);overflow:auto;background:#2f8fc4;border:4px solid #1c6e9c;border-radius:22px;padding:12px;box-shadow:0 10px 0 rgba(0,0,0,.2);font-family:CV,sans-serif}' +
    '#agDaily h2{margin:2px 0 10px;text-align:center;color:#fff;font-size:clamp(20px,5vw,28px);text-shadow:-2px -2px 0 #073b57,2px -2px 0 #073b57,-2px 2px 0 #073b57,2px 2px 0 #073b57}' +
    '#agDaily .in{background:#fbf6e6;border:3px solid #d9c79a;border-radius:16px;padding:14px;text-align:center}' +
    '#agDaily .days{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:12px}' +
    '#agDaily .d{position:relative;background:#fff;border:3px solid #d9c79a;border-radius:12px;padding:6px 2px 4px;min-width:0}' +
    '#agDaily .d.now{border-color:#4fae1f;background:#eaffd9;transform:scale(1.06)}' +
    '#agDaily .d img{width:100%;max-width:44px;height:auto;display:block;margin:0 auto}' +
    '#agDaily .d b{display:block;font-size:12px;color:#0a5f8c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#agDaily .d .ok{position:absolute;right:-4px;top:-6px;width:22px}' +
    '#agDaily .r{font-size:clamp(17px,4.2vw,21px);font-weight:700;color:#2c7710;margin:4px 0;overflow-wrap:anywhere}' +
    '#agDaily .n{font-size:14px;color:#5f6b4a;margin:6px 0 0;overflow-wrap:anywhere}' +
    '#agDaily button{margin-top:12px;padding:9px 34px;border:3px solid #2e7d1d;border-radius:999px;background:linear-gradient(#7fd14a,#4aa62a);color:#fff;font:700 18px CV,sans-serif;text-shadow:0 2px 0 #2e7d1d;cursor:pointer;max-width:100%}';
  function show() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var icons = ['doober_coin', 'doober_coin', 'doober_coin', 'doober_coin', 'present_big'];
    var amounts = ['25', '50 +1⚡', '100 +2⚡', '200 +3⚡', '?'];
    var h = '<div class="c" role="dialog"><h2>' + t[0] + '</h2><div class="in"><div class="days">';
    for (var i = 1; i <= 5; i++) {
      h += '<div class="d' + (i === B.day ? ' now' : '') + '"><b>' + t[1] + ' ' + i + '</b><img src="/ag/daily/' + icons[i - 1] + '.png" alt="">' +
        '<b>' + amounts[i - 1] + '</b>' + (i < B.day ? '<img class="ok" src="/ag/daily/check.png" alt="✔">' : '') + '</div>';
    }
    var parts = [];
    if (B.coins) parts.push('+' + B.coins + ' ' + t[5]);
    if (B.energy) parts.push('+' + B.energy + ' ' + t[6]);
    if (B.cash) parts.push('+' + B.cash + ' ' + t[7]);
    h += '</div>' + (B.surprise ? '<div class="r">' + t[4] + '</div>' : '') + '<div class="r">' + parts.join(' · ') + '</div>' +
      '<p class="n">' + t[1] + ' ' + B.day + ' ' + t[2] + '. ' + (B.day < 5 ? t[3] + ' ' + (B.day + 1) + '. ' + t[9] : '') + '</p>' +
      '<button type="button">' + t[8] + '</button></div></div>';
    var d = document.createElement('div'); d.id = 'agDaily'; d.innerHTML = h; document.body.appendChild(d);
    requestAnimationFrame(function () { d.classList.add('on'); });
    d.querySelector('button').onclick = function () { d.classList.remove('on'); setTimeout(function () { d.remove(); }, 500); };
  }
  var done = false;
  function go() {
    if (done) return;
    setTimeout(function () {
      if (done) return;
      if (document.getElementById('agCarta')) { window.addEventListener('ag:carta', function () { if (!done) { done = true; setTimeout(show, 400); } }); return; }
      done = true; show();
    }, 1800);
  }
  if (window.agLoaded) go(); else window.addEventListener('ag:loaded', go);
})();
