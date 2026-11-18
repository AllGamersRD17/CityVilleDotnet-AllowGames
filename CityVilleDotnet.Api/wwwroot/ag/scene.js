/* CityVille Revived · Allow Games — fondo animado estilo CityVille, logo animado y personajes alrededor del juego */
(function () {
  if (window.__agScene) return; window.__agScene = 1;
  var D = document, reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
  function lang() {
    var l = '';
    try { l = localStorage.getItem('lang') || ''; } catch (e) { }
    if (!l && window.AG_PLAYER && AG_PLAYER.locale) l = AG_PLAYER.locale;
    l = (l || navigator.language || 'es').slice(0, 2).toLowerCase();
    return /^(es|en|pt|fr|it|de)$/.test(l) ? l : 'en';
  }
  window.agI = function (n, c) { return '<img class="agi' + (c ? ' ' + c : '') + '" src="/ag/ic/' + n + '.png" alt="" draggable="false">'; };

  /* ---------------- 1. escena de fondo ---------------- */
  var B = ['cornerstore', 'tree_shade', 'library', 'pharmacy', 'tree_pine', 'tavern', 'park_gazebo_a', 'hardwarestore', 'tree_shade', 'cv0201_oldschoolpolice', 'bs1001_birdiesdiner', 'tree_pine', 'townhouse_l1', 'bandstand', 'outskirtsfarm', 'tree_shade'];
  function scene() {
    if (D.getElementById('agScene')) return;
    var s = D.createElement('div'); s.id = 'agScene'; s.setAttribute('aria-hidden', 'true');
    var h = '<div class="sun"><i></i></div>';
    for (var i = 0; i < 6; i++) h += '<div class="cl c' + i + '"></div>';
    h += '<div class="hill h1"></div><div class="hill h2"></div><div class="town">';
    var n = Math.ceil((screen.width || 1920) / 70) + 2;
    for (var j = 0; j < n; j++) h += '<img src="/ag/scene/' + B[j % B.length] + '.png" alt="" draggable="false" style="--d:' + ((j * 0.37) % 3).toFixed(2) + 's">';
    h += '</div><div class="road"><img class="taxi t1" src="/ag/scene/car_taxi_se.png" alt=""><img class="taxi t2" src="/ag/scene/car_taxi_sw.png" alt=""></div><div class="grass"></div>';
    for (var k = 0; k < 7; k++) h += '<img class="fl f' + k + '" src="/ag/ic/' + ['coin', 'xp', 'heart', 'coin', 'energy', 'coin', 'xp'][k] + '.png" alt="">';
    s.innerHTML = h;
    D.body.insertBefore(s, D.body.firstChild);
    D.documentElement.classList.add('ag-scene-on');
    if (reduce) s.classList.add('still');
  }

  /* ---------------- 2. logos animados ---------------- */
  function logos() {
    var sel = '.ag-brand .ag-cv, .ag-auth-logo, img.logo, img.ag-logo-img';
    D.querySelectorAll(sel).forEach(function (im, i) {
      if (im.parentNode.classList && im.parentNode.classList.contains('ag-logo')) return;
      var w = D.createElement('span'); w.className = 'ag-logo' + (im.classList.contains('ag-cv') ? ' sm' : ' big');
      w.style.setProperty('--m', 'url(' + im.getAttribute('src') + ')');
      im.parentNode.insertBefore(w, im); w.appendChild(im);
      var sh = D.createElement('i'); sh.className = 'sh'; w.appendChild(sh);
      if (!w.classList.contains('sm')) { for (var k = 0; k < 6; k++) { var sp = D.createElement('b'); sp.className = 'sp s' + k; w.appendChild(sp); } }
    });
    var ag = D.querySelector('.ag-brand .ag-ag'); if (ag) ag.classList.add('ag-ag-anim');
  }

  /* ---------------- 3. personajes a los lados del juego ---------------- */
  var CH = ['lowlitta', 'architect', 'farmer', 'firefighter', 'gastonbaker', 'conductor2', 'teacher', 'captain3', 'pizzacook', 'doctor', 'celebrity', 'governor2', 'son', 'daughter', 'entrepreneur2', 'researcher', 'baseballcoach', 'pigeonlady', 'surfer', 'cruisedirector', 'scientist', 'docteacher', 'weddingcouple', 'cityjack', 'lowlitta2'];
  var TIPS = {
    es: ['¡Recoge tus rentas a tiempo, alcalde!', 'Visita a tus vecinos y gana monedas extra.', 'Entra cada día por tu bono diario.', 'Completa los desafíos para premios extra.', 'Comparte en el muro y ayúdense entre todos.', '¿Algo falla? Avísanos en Soporte.', 'Las franquicias dan monedas extra.', 'Usa la rueda del mouse para acercar la ciudad.', 'Tus negocios necesitan bienes: ¡siembra!', 'Invita a tus amigos con tu enlace.'],
    en: ['Collect your rent on time, Mayor!', 'Visit your neighbors for extra coins.', 'Log in every day for your daily bonus.', 'Finish challenges for extra rewards.', 'Share on the wall and help each other.', 'Something wrong? Tell us in Support.', 'Franchises give you extra coins.', 'Use the mouse wheel to zoom your city.', 'Your businesses need goods: plant crops!', 'Invite your friends with your link.'],
    pt: ['Recolha seus aluguéis a tempo, prefeito!', 'Visite seus vizinhos e ganhe moedas extras.', 'Entre todo dia pelo bônus diário.', 'Complete desafios para prêmios extras.', 'Compartilhe no mural e ajudem-se.', 'Algo deu errado? Avise no Suporte.', 'Franquias dão moedas extras.', 'Use a roda do mouse para dar zoom.', 'Seus negócios precisam de bens: plante!', 'Convide seus amigos com seu link.'],
    fr: ['Récolte tes loyers à temps, Maire !', 'Visite tes voisins pour des pièces en plus.', 'Connecte-toi chaque jour pour ton bonus.', 'Termine les défis pour des récompenses.', 'Partage sur le mur et entraidez-vous.', 'Un problème ? Dis-le-nous dans Support.', 'Les franchises rapportent des pièces.', 'Utilise la molette pour zoomer.', 'Tes commerces ont besoin de biens : plante !', 'Invite tes amis avec ton lien.'],
    it: ['Raccogli gli affitti in tempo, Sindaco!', 'Visita i tuoi vicini per monete extra.', 'Entra ogni giorno per il bonus giornaliero.', 'Completa le sfide per premi extra.', 'Condividi in bacheca e aiutatevi.', 'Qualcosa non va? Scrivici in Supporto.', 'Le franchigie danno monete extra.', 'Usa la rotella del mouse per lo zoom.', 'I tuoi negozi hanno bisogno di merci: semina!', 'Invita i tuoi amici con il tuo link.'],
    de: ['Sammle deine Miete rechtzeitig ein!', 'Besuche Nachbarn für extra Münzen.', 'Komm jeden Tag für deinen Tagesbonus.', 'Erledige Aufgaben für extra Belohnungen.', 'Teile an der Pinnwand und helft euch.', 'Etwas kaputt? Sag es uns im Support.', 'Franchises bringen extra Münzen.', 'Mit dem Mausrad zoomst du die Stadt.', 'Deine Geschäfte brauchen Waren: pflanze!', 'Lade Freunde mit deinem Link ein.']
  };
  var sides = [], tipI = Math.floor(Math.random() * 10), chI = Math.floor(Math.random() * CH.length);
  function nextChar() { chI = (chI + 1) % CH.length; return CH[chI]; }
  function makeSide(cls) {
    var w = D.createElement('div'); w.className = 'ag-side ' + cls; w.setAttribute('aria-hidden', 'true');
    w.innerHTML = '<div class="bub"></div><div class="who"><img alt="" draggable="false"></div><div class="ped"></div>';
    D.body.appendChild(w);
    var o = { el: w, img: w.querySelector('img'), bub: w.querySelector('.bub') };
    o.img.src = '/ag/chars/' + nextChar() + '.png';
    w.querySelector('.who').addEventListener('click', function () { say(o, true); burst(o); });
    return o;
  }
  function say(o, now) {
    var L = TIPS[lang()] || TIPS.en; tipI = (tipI + 1) % L.length;
    o.bub.textContent = L[tipI]; o.el.classList.add('talk', 'wave');
    clearTimeout(o.t1); clearTimeout(o.t2);
    o.t1 = setTimeout(function () { o.el.classList.remove('wave'); }, 1200);
    o.t2 = setTimeout(function () { o.el.classList.remove('talk'); }, now ? 5000 : 6500);
  }
  function burst(o) {
    for (var i = 0; i < 6; i++) {
      var c = D.createElement('img'); c.className = 'ag-pop'; c.src = '/ag/ic/' + (i % 3 ? 'coin' : 'xp') + '.png'; c.alt = '';
      c.style.setProperty('--x', (Math.random() * 120 - 60).toFixed(0) + 'px'); c.style.animationDelay = (i * 60) + 'ms';
      o.el.appendChild(c); setTimeout(function (n) { return function () { n.remove(); }; }(c), 1400);
    }
  }
  function swap(o) {
    o.el.classList.add('out');
    setTimeout(function () { o.img.src = '/ag/chars/' + nextChar() + '.png'; o.el.classList.remove('out'); }, 650);
  }
  function place() {
    var g = D.getElementById('cvGame'); if (!g) return;
    var fine = matchMedia('(pointer: fine)').matches, r = g.getBoundingClientRect(), gap = r.left;
    var vh = innerHeight, ok = fine && gap >= 120 && r.height > 300;
    sides.forEach(function (o, i) {
      if (!ok) { o.el.style.display = 'none'; return; }
      var w = Math.min(gap - 24, 230), x = i === 0 ? (gap - w) / 2 : r.right + (gap - w) / 2;
      o.el.style.display = 'block'; o.el.style.width = w + 'px'; o.el.style.left = x + 'px';
      o.el.style.setProperty('--h', Math.min(w * 1.45, vh * 0.5) + 'px');
    });
  }
  function gameSides() {
    if (!D.getElementById('cvGame') || sides.length) return;
    sides = [makeSide('l'), makeSide('r')];
    place(); addEventListener('resize', place); setInterval(place, 3000);
    if (reduce) return;
    setTimeout(function () { say(sides[0]); }, 9000);
    setInterval(function () { var o = sides[Math.random() < .5 ? 0 : 1]; if (o.el.style.display !== 'none') say(o); }, 38000);
    setInterval(function () { swap(sides[0]); setTimeout(function () { swap(sides[1]); }, 7000); }, 52000);
    setInterval(function () { var o = sides[Math.random() < .5 ? 0 : 1]; o.el.classList.add('hop'); setTimeout(function () { o.el.classList.remove('hop'); }, 900); }, 11000);
  }

  /* ---------------- 4. aviso de actualizacion del servidor ---------------- */
  var AV = {
    es: ['¡Actualización en camino!', 'El juego se va a actualizar en', 'Termina lo que estás haciendo para no perderlo. Volvemos en un par de minutos.', 'Actualizando… el juego vuelve en un momento.'],
    en: ['Update incoming!', 'The game will update in', 'Finish what you are doing so you don\'t lose it. We\'ll be back in a couple of minutes.', 'Updating… the game will be back in a moment.'],
    pt: ['Atualização chegando!', 'O jogo vai atualizar em', 'Termine o que está fazendo para não perder. Voltamos em alguns minutos.', 'Atualizando… o jogo volta em instantes.'],
    fr: ['Mise à jour imminente !', 'Le jeu va se mettre à jour dans', 'Termine ce que tu fais pour ne rien perdre. On revient dans quelques minutes.', 'Mise à jour… le jeu revient dans un instant.'],
    it: ['Aggiornamento in arrivo!', 'Il gioco si aggiornerà tra', 'Finisci quello che stai facendo per non perderlo. Torniamo tra un paio di minuti.', 'Aggiornamento… il gioco torna tra un momento.'],
    de: ['Update kommt!', 'Das Spiel wird aktualisiert in', 'Beende, was du gerade machst, damit nichts verloren geht. Wir sind in ein paar Minuten zurück.', 'Wird aktualisiert… das Spiel ist gleich zurück.']
  };
  var avEl = null, avAt = 0, avT = null;
  function avPaint() {
    if (!avEl) return;
    var L = AV[lang()] || AV.en, left = Math.max(0, Math.round((avAt - Date.now()) / 1000));
    var mm = Math.floor(left / 60), ss = ('0' + left % 60).slice(-2);
    avEl.innerHTML = '<img src="/ag/ic/alert.png" alt=""><div><b>' + L[0] + '</b><span>' + (left > 0 ? L[1] + ' <em>' + mm + ':' + ss + '</em>. ' + L[2] : L[3]) + '</span></div>';
    avEl.classList.toggle('now', left <= 30);
  }
  function avShow(at) {
    avAt = at;
    if (!avEl) { avEl = D.createElement('div'); avEl.id = 'agAviso'; avEl.setAttribute('role', 'alert'); D.body.appendChild(avEl); }
    avPaint(); clearInterval(avT); avT = setInterval(avPaint, 1000);
  }
  function avHide() { if (avEl) { avEl.remove(); avEl = null; } clearInterval(avT); }
  function aviso() {
    fetch('/ag/aviso.json?t=' + Date.now(), { cache: 'no-store', credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw 0;
      var srv = Date.parse(r.headers.get('Date') || '') || Date.now(), off = Date.now() - srv;
      return r.json().then(function (j) { if (!j || !j.at) throw 0; avShow(j.at * 1000 + off); });
    }).catch(function () { avHide(); });
  }
  function avisos() { aviso(); setInterval(aviso, 20000); }

  function go() { scene(); logos(); gameSides(); avisos(); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
})();
