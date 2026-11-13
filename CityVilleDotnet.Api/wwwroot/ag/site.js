// CityVille Revived - Allow Games: contador en linea, banner de temporada y textos de invitacion
(function () {
  var L = { es: ['Invita a tus amigos y serán tus vecinos:', 'Copiar', 'en línea'],
            en: ['Invite your friends and they become your neighbors:', 'Copy', 'online'],
            pt: ['Convide seus amigos e eles serão seus vizinhos:', 'Copiar', 'online'],
            fr: ['Invitez vos amis, ils deviendront vos voisins :', 'Copier', 'en ligne'],
            it: ['Invita i tuoi amici e diventeranno tuoi vicini:', 'Copia', 'online'],
            de: ['Lade Freunde ein, sie werden deine Nachbarn:', 'Kopieren', 'online'] };
  var c = ((window.AG_PLAYER && window.AG_PLAYER.locale) || (document.cookie.match(/gameLocale=([a-z]{2})/) || [])[1] || '').slice(0, 2);
  var t = L[c || (navigator.language || 'es').slice(0, 2)] || L.es;
  var a = document.querySelector('[data-i="inv"]'); if (a) a.textContent = t[0];
  var b = document.querySelector('[data-i="copy"]'); if (b) b.textContent = t[1];
  function stats() {
    fetch('/api/ag/stats').then(function (r) { return r.json(); }).then(function (s) {
      var o = document.getElementById('agOnline'); if (o) o.textContent = s.online + ' ' + t[2];
    }).catch(function () {});
  }
  stats(); setInterval(stats, 60000);
  fetch('/api/ag/season').then(function (r) { return r.json(); }).then(function (s) {
    var e = document.getElementById('agBanner');
    if (e && s.banner) { e.textContent = s.banner; e.hidden = false; }
  }).catch(function () {});
})();
