// CityVille Revived - Allow Games: solicitudes de franquicia.
// Cuando un amigo pone su negocio en un terreno vacio de tu ciudad, aqui te sale para Aprobar o Rechazar.
(function () {
  var P = window.AG_PLAYER || {};
  var lang = (P.locale || navigator.language || 'es').slice(0, 2);
  var L = {
    es: { title: '¡Solicitud de franquicia!', wants: 'quiere abrir', inCity: 'en tu ciudad', ok: 'Aprobar', no: 'Rechazar', done: '¡Franquicia aprobada! Recargando tu ciudad...', denied: 'Solicitud rechazada', fail: 'No se pudo. Intenta otra vez.', tip: 'Los dos ganan monedas cuando la gente compra ahí.', more: 'más esperando' },
    en: { title: 'Franchise request!', wants: 'wants to open', inCity: 'in your city', ok: 'Approve', no: 'Decline', done: 'Franchise approved! Reloading your city...', denied: 'Request declined', fail: "Couldn't do it. Try again.", tip: 'You both earn coins when people shop there.', more: 'more waiting' },
    pt: { title: 'Pedido de franquia!', wants: 'quer abrir', inCity: 'na sua cidade', ok: 'Aprovar', no: 'Recusar', done: 'Franquia aprovada! Recarregando sua cidade...', denied: 'Pedido recusado', fail: 'Não deu. Tente de novo.', tip: 'Vocês dois ganham moedas quando o povo compra lá.', more: 'esperando' },
    fr: { title: 'Demande de franchise !', wants: 'veut ouvrir', inCity: 'dans ta ville', ok: 'Accepter', no: 'Refuser', done: 'Franchise acceptée ! Ta ville se recharge...', denied: 'Demande refusée', fail: 'Échec. Réessaie.', tip: 'Vous gagnez tous les deux des pièces quand les gens y achètent.', more: 'en attente' },
    it: { title: 'Richiesta di franchising!', wants: 'vuole aprire', inCity: 'nella tua città', ok: 'Approva', no: 'Rifiuta', done: 'Franchising approvato! Ricarico la tua città...', denied: 'Richiesta rifiutata', fail: 'Non riuscito. Riprova.', tip: 'Guadagnate entrambi monete quando la gente compra lì.', more: 'in attesa' },
    de: { title: 'Franchise-Anfrage!', wants: 'möchte eröffnen:', inCity: 'in deiner Stadt', ok: 'Annehmen', no: 'Ablehnen', done: 'Franchise angenommen! Deine Stadt lädt neu...', denied: 'Anfrage abgelehnt', fail: 'Hat nicht geklappt. Versuch es nochmal.', tip: 'Ihr verdient beide Münzen, wenn dort eingekauft wird.', more: 'warten noch' }
  };
  var t = L[lang] || L.es;
  var shown = {};

  var css = '#agFr{position:fixed;inset:0;z-index:99990;display:flex;align-items:center;justify-content:center;background:rgba(8,40,60,.5);font-family:CV,sans-serif;animation:agFrIn .25s}@keyframes agFrIn{from{opacity:0}}' +
    '#agFr .bx{position:relative;width:min(420px,92vw);background:linear-gradient(#fffdf4,#fff3cf);border:5px solid #1c6e9c;border-radius:22px;box-shadow:0 10px 0 rgba(0,0,0,.2),0 24px 60px rgba(0,0,0,.4);padding:14px 16px 18px;text-align:center;color:#5a3a00;animation:agFrPop .45s cubic-bezier(.3,1.6,.5,1)}@keyframes agFrPop{from{transform:scale(.5);opacity:0}}' +
    '#agFr .rb{margin:0 auto 10px;width:max-content;max-width:94%;padding:6px 26px;background:linear-gradient(#ffe36b,#f5b81c);border:4px solid #b07a06;border-radius:999px;color:#fff;font-size:22px;text-shadow:-2px -2px 0 #8a5a00,2px -2px 0 #8a5a00,-2px 2px 0 #8a5a00,2px 2px 0 #8a5a00}' +
    '#agFr .rw{display:flex;align-items:center;justify-content:center;gap:12px;margin:6px 0}#agFr .av{width:64px;height:64px;border-radius:14px;border:3px solid #9fd0ec;object-fit:cover;background:#fff}#agFr .bz{width:84px;height:84px;object-fit:contain;filter:drop-shadow(0 4px 0 rgba(0,0,0,.15))}' +
    '#agFr p{margin:8px 0;font-size:16px;color:#0a5f8c}#agFr p b{color:#5a3a00}#agFr small{display:block;color:#8a7a4f;font-size:12px;margin-top:6px}' +
    '#agFr .bt{display:flex;gap:10px;justify-content:center;margin-top:12px}#agFr button{border:0;border-radius:999px;padding:9px 22px;color:#fff;font:700 18px CV,sans-serif;cursor:pointer;text-shadow:0 2px 0 rgba(0,0,0,.25)}' +
    '#agFr .ok{background:linear-gradient(#8ee05a,#4caf27);box-shadow:0 5px 0 #2f7d17}#agFr .no{background:linear-gradient(#ff8a80,#e8382f);box-shadow:0 5px 0 #9c1d16}#agFr button:disabled{opacity:.6;cursor:default}';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pretty(n) { return String(n || '').replace(/^(bus|biz|business)_/i, '').replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function post(url, body) {
    return fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw r; return r; });
  }

  function show(list) {
    if (document.getElementById('agFr') || !list.length) return;
    var o = list[0]; shown[o.senderId + '/' + o.lotId] = 1;
    if (!document.getElementById('agFrCss')) { var st = document.createElement('style'); st.id = 'agFrCss'; st.textContent = css; document.head.appendChild(st); }
    var name = o.franchise || pretty(o.business);
    var d = document.createElement('div'); d.id = 'agFr';
    d.innerHTML = '<div class="bx"><div class="rb">' + esc(t.title) + '</div><div class="rw">' +
      '<img class="av" src="' + esc(o.from.avatar || '/blank.png') + '" alt="" onerror="this.src=\'/blank.png\'">' +
      (o.item && o.item.icon ? '<img class="bz" src="' + esc(o.item.icon) + '" alt="" onerror="this.remove()">' : '') +
      '</div><p><b>' + esc(o.from.name) + '</b> ' + esc(t.wants) + ' <b>' + esc(name) + '</b> ' + esc(t.inCity) + '</p>' +
      '<small>' + esc(t.tip) + (list.length > 1 ? ' · +' + (list.length - 1) + ' ' + esc(t.more) : '') + '</small>' +
      '<div class="bt"><button class="no">' + esc(t.no) + '</button><button class="ok">' + esc(t.ok) + '</button></div></div>';
    ['keydown', 'keyup', 'keypress'].forEach(function (ev) { d.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    document.body.appendChild(d);
    var p = d.querySelector('p');
    function busy(b) { d.querySelectorAll('button').forEach(function (x) { x.disabled = b; }); }
    d.querySelector('.ok').onclick = function () {
      busy(true);
      post('/api/ag/franchise/accept', { senderId: String(o.senderId), lotId: o.lotId })
        .then(function () { p.textContent = t.done; setTimeout(function () { location.reload(); }, 1800); })
        .catch(function () { p.textContent = t.fail; busy(false); });
    };
    d.querySelector('.no').onclick = function () {
      busy(true);
      post('/api/ag/franchise/deny', { senderId: String(o.senderId), lotId: o.lotId })
        .then(function () { p.textContent = t.denied; setTimeout(function () { d.remove(); check(); }, 1200); })
        .catch(function () { p.textContent = t.fail; busy(false); });
    };
  }

  function check() {
    fetch('/api/ag/franchise/pending', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (list) { show((list || []).filter(function (o) { return !shown[o.senderId + '/' + o.lotId]; })); })
      .catch(function () { });
  }
  window.agFranchiseCheck = check;
  // espera a que el juego cargue y despues revisa cada 2 minutos
  setTimeout(check, 25000);
  setInterval(check, 120000);
})();
