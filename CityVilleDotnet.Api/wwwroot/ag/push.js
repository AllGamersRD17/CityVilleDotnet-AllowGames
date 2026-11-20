// CityVille Revived - Allow Games: avisos en el celular/PC como Facebook.
// Pide permiso con una tarjeta bonita (no con el cartel feo del navegador de una vez),
// registra el service worker y guarda la suscripcion en el servidor.
(function () {
  var P = window.AG_PLAYER || {};
  var lang = (P.locale || navigator.language || 'es').slice(0, 2);
  var T = {
    es: { t: '¡No te pierdas nada!', b: 'Te avisamos cuando te escriban, te ayuden, te manden regalos o tu premio diario esté listo.', ok: 'Activar avisos', no: 'Ahora no', done: '¡Listo! Te avisaremos.' },
    en: { t: "Don't miss a thing!", b: "We'll tell you when someone messages you, helps you, sends a gift or your daily reward is ready.", ok: 'Turn on notifications', no: 'Not now', done: "Done! We'll let you know." },
    pt: { t: 'Não perca nada!', b: 'Avisamos quando te escreverem, te ajudarem, mandarem presentes ou seu prêmio diário estiver pronto.', ok: 'Ativar avisos', no: 'Agora não', done: 'Pronto! Vamos te avisar.' },
    fr: { t: 'Ne rate rien !', b: "On te prévient quand on t'écrit, t'aide, t'envoie un cadeau ou quand ton cadeau du jour est prêt.", ok: 'Activer les notifications', no: 'Plus tard', done: 'C’est fait !' },
    it: { t: 'Non perderti niente!', b: 'Ti avvisiamo quando ti scrivono, ti aiutano, ti mandano regali o il premio giornaliero è pronto.', ok: 'Attiva le notifiche', no: 'Non ora', done: 'Fatto! Ti avviseremo.' },
    de: { t: 'Verpass nichts!', b: 'Wir sagen dir Bescheid, wenn dir jemand schreibt, hilft, ein Geschenk schickt oder dein Tagesbonus bereit ist.', ok: 'Benachrichtigungen an', no: 'Später', done: 'Fertig! Wir melden uns.' }
  };
  var t = T[lang] || T.es;
  var inApp = /AllowGamesApp/.test(navigator.userAgent);
  var isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;

  // abrir lo que dice el aviso (?dm=nombre, ?open=friends) o lo que manda el service worker
  function nav(url) {
    try {
      var u = new URL(url, location.origin), dm = u.searchParams.get('dm'), open = u.searchParams.get('open');
      if (dm && window.agChat) window.agChat.open(dm);
      else if (open === 'friends' && window.agOpenCommunity) window.agOpenCommunity();
    } catch (e) { }
  }
  if (location.search.indexOf('dm=') >= 0 || location.search.indexOf('open=') >= 0) {
    var once = false;
    addEventListener('ag:loaded', function () { if (!once) { once = true; setTimeout(function () { nav(location.href); }, 800); } });
  }
  if (navigator.serviceWorker) navigator.serviceWorker.addEventListener('message', function (e) { if (e.data && e.data.agNav) nav(e.data.agNav); });

  if (inApp) return; // la app de Android tiene sus propios avisos
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return;
  if (isIos && !standalone) return; // en iPhone solo funciona con la app agregada a inicio
  if (!document.getElementById('cvGame')) return;

  function b64(s) {
    var p = '='.repeat((4 - s.length % 4) % 4), r = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')), a = new Uint8Array(r.length);
    for (var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i);
    return a;
  }
  function u64(buf) { var s = String.fromCharCode.apply(null, new Uint8Array(buf)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }

  function subscribe(test) {
    return navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(function () { return navigator.serviceWorker.ready; })
      .then(function (reg) {
        return fetch('/api/ag/push/key').then(function (r) { return r.json(); }).then(function (k) {
          return reg.pushManager.getSubscription().then(function (s) {
            return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(k.key) });
          });
        });
      })
      .then(function (s) {
        return fetch('/api/ag/push/sub', {
          method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: s.endpoint, p256dh: u64(s.getKey('p256dh')), auth: u64(s.getKey('auth')), lang: lang, tz: -new Date().getTimezoneOffset() })
        });
      })
      .then(function (r) { if (test && r.ok) fetch('/api/ag/push/test', { method: 'POST', credentials: 'same-origin' }); });
  }

  if (Notification.permission === 'granted') { subscribe(false).catch(function () { }); return; }
  if (Notification.permission === 'denied') return;
  var later = 0; try { later = +localStorage.getItem('agPushLater') || 0; } catch (e) { }
  if (Date.now() - later < 3 * 864e5) return;

  function card() {
    if (document.getElementById('agPush')) return;
    var css = '#agPush{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top));transform:translate(-50%,-140%);z-index:99995;width:min(420px,94vw);display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:20px;background:#fffdf4;border:3px solid #1c6e9c;box-shadow:0 10px 30px rgba(0,0,0,.35);font-family:CV,sans-serif;color:#21445a;transition:transform .45s cubic-bezier(.2,1.4,.4,1)}' +
      '#agPush.in{transform:translate(-50%,0)}#agPush .bell{font-size:34px;animation:agBell 1.2s ease-in-out infinite;transform-origin:50% 10%}' +
      '@keyframes agBell{0%,60%,100%{transform:rotate(0)}10%{transform:rotate(18deg)}20%{transform:rotate(-16deg)}30%{transform:rotate(10deg)}40%{transform:rotate(-6deg)}}' +
      '#agPush b{display:block;font-size:16px;color:#0a5f8c}#agPush p{margin:2px 0 8px;font-size:13px;line-height:1.3}' +
      '#agPush .bt{display:flex;gap:8px}#agPush button{border:0;border-radius:999px;padding:8px 14px;font:700 14px CV,sans-serif;cursor:pointer}' +
      '#agPush .ok{background:linear-gradient(#8ee05a,#4caf27);color:#fff;box-shadow:0 3px 0 #2f7d17}#agPush .no{background:#e7eef2;color:#46606e}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'agPush';
    d.innerHTML = '<div class="bell">🔔</div><div><b>' + t.t + '</b><p>' + t.b + '</p><div class="bt"><button class="ok">' + t.ok + '</button><button class="no">' + t.no + '</button></div></div>';
    document.body.appendChild(d);
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('in'); }); });
    function close() { d.classList.remove('in'); setTimeout(function () { d.remove(); }, 500); }
    d.querySelector('.no').onclick = function () { try { localStorage.setItem('agPushLater', String(Date.now())); } catch (e) { } close(); };
    d.querySelector('.ok').onclick = function () {
      Notification.requestPermission().then(function (p) {
        if (p === 'granted') { d.querySelector('p').textContent = t.done; d.querySelector('.bt').remove(); subscribe(true).catch(function () { }); setTimeout(close, 1800); }
        else close();
      });
    };
  }
  var shown = false;
  addEventListener('ag:loaded', function () { if (!shown) { shown = true; setTimeout(card, 25000); } });
})();
