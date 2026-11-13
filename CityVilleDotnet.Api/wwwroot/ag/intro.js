// Intro animada de Allow Games (estilo splash de estudio, como la de Zynga pero mejor).
// Solo el logo de Allow Games, una vez por sesion del navegador. Se salta con un clic o una tecla.
(function () {
  var seen = false;
  try { seen = sessionStorage.getItem('agIntro2') === '1'; sessionStorage.setItem('agIntro2', '1'); } catch (e) {}
  if (seen) return;

  function presents() {
    var l = '';
    try { l = localStorage.getItem('lang') || ''; } catch (e) {}
    var m = document.cookie.match(/gameLocale=([a-z]{2})/);
    l = (l || (m && m[1]) || navigator.language || 'es').slice(0, 2);
    return { en: 'presents', pt: 'apresenta', fr: 'présente', it: 'presenta', de: 'präsentiert' }[l] || 'presenta';
  }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LOGO = '/ag/allowgames.png';
  var css =
    '#agIntro{position:fixed;inset:0;z-index:100000;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:pointer;' +
    'background:radial-gradient(ellipse at 50% 55%,#2a1660 0%,#120a2e 38%,#04050c 75%);-webkit-user-select:none;user-select:none;transition:opacity .7s ease,transform .7s ease}' +
    '#agIntro.out{opacity:0;transform:scale(1.06);pointer-events:none}' +
    // rayos de luz girando detras del logo
    '#agIntro .rays{position:absolute;width:160vmax;height:160vmax;left:50%;top:50%;margin:-80vmax 0 0 -80vmax;opacity:0;' +
    'background:repeating-conic-gradient(from 0deg,rgba(124,92,255,.16) 0deg 6deg,transparent 6deg 18deg);' +
    '-webkit-mask:radial-gradient(circle,#000 0%,transparent 55%);mask:radial-gradient(circle,#000 0%,transparent 55%);' +
    'animation:agRays 1.2s ease .35s forwards,agSpin 24s linear infinite}' +
    // halo de neon
    '#agIntro .glow{position:absolute;width:min(90vw,760px);height:min(50vw,420px);border-radius:50%;opacity:0;filter:blur(60px);' +
    'background:radial-gradient(circle,#00d9ff 0%,#8a3dff 45%,transparent 70%);animation:agGlow 1.4s ease .45s forwards}' +
    '#agIntro .stage{position:relative;display:flex;flex-direction:column;align-items:center}' +
    '#agIntro .logo{position:relative;width:min(72vw,560px);aspect-ratio:800/455;opacity:0;transform:scale(.35) translateY(30px);' +
    'animation:agPop .9s cubic-bezier(.18,1.45,.42,1) .25s forwards}' +
    '#agIntro .logo img{width:100%;height:100%;display:block;filter:drop-shadow(0 10px 30px rgba(0,0,0,.6)) drop-shadow(0 0 22px rgba(120,80,255,.45))}' +
    // destello que recorre el logo (recortado con la forma del logo)
    '#agIntro .shine{position:absolute;inset:0;-webkit-mask:url(' + LOGO + ') center/contain no-repeat;mask:url(' + LOGO + ') center/contain no-repeat;' +
    'background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.95) 50%,transparent 65%) -150% 0/250% 100% no-repeat;animation:agShine 1s ease-in-out 1.15s forwards}' +
    '#agIntro .tag{margin-top:22px;color:#e6dcff;font:700 clamp(11px,1.6vw,15px)/1 Montserrat,"Segoe UI",Arial,sans-serif;letter-spacing:.7em;padding-left:.7em;text-transform:uppercase;opacity:0;' +
    'animation:agTag .8s ease 1.35s forwards}' +
    '#agIntro .line{width:0;height:2px;margin-top:12px;background:linear-gradient(90deg,transparent,#00d9ff,#b14bff,transparent);animation:agLine .9s ease 1.25s forwards}' +
    // particulas
    '#agIntro i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff;opacity:0;box-shadow:0 0 8px #9b7bff;animation:agSpark 1.6s ease-out forwards}' +
    '#agIntro .skip{position:absolute;right:18px;bottom:16px;color:rgba(255,255,255,.45);font:600 12px "Segoe UI",Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase}' +
    '@keyframes agPop{0%{opacity:0;transform:scale(.35) translateY(30px)}60%{opacity:1}100%{opacity:1;transform:none}}' +
    '@keyframes agRays{to{opacity:1}}@keyframes agSpin{to{transform:rotate(360deg)}}' +
    '@keyframes agGlow{0%{opacity:0;transform:scale(.6)}100%{opacity:.55;transform:scale(1)}}' +
    '@keyframes agShine{to{background-position:150% 0}}' +
    '@keyframes agTag{from{opacity:0;transform:translateY(8px);letter-spacing:1.2em}to{opacity:1;transform:none;letter-spacing:.7em}}' +
    '@keyframes agLine{to{width:min(46vw,320px)}}' +
    '@keyframes agSpark{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(1.2)}}' +
    '@media (prefers-reduced-motion:reduce){#agIntro *{animation-duration:.01s!important;animation-delay:0s!important}}';

  var st = document.createElement('style'); st.textContent = css;
  var d = document.createElement('div');
  d.id = 'agIntro';
  d.setAttribute('aria-label', 'Allow Games');
  d.innerHTML = '<div class="rays"></div><div class="glow"></div>' +
    '<div class="stage"><div class="logo"><img src="' + LOGO + '" alt="Allow Games" draggable="false"><div class="shine"></div></div>' +
    '<div class="line"></div><div class="tag">' + presents() + '</div></div>' +
    '<div class="skip">▶▶</div>';

  // chispas que salen del logo cuando aparece
  if (!reduce) {
    for (var k = 0; k < 26; k++) {
      var p = document.createElement('i'), a = Math.random() * Math.PI * 2, r = 140 + Math.random() * 260;
      p.style.left = '50%'; p.style.top = '50%';
      p.style.setProperty('--x', Math.round(Math.cos(a) * r) + 'px');
      p.style.setProperty('--y', Math.round(Math.sin(a) * r * .6) + 'px');
      p.style.animationDelay = (0.75 + Math.random() * 0.35) + 's';
      if (k % 3 === 0) p.style.background = '#00d9ff'; else if (k % 3 === 1) p.style.background = '#c77dff';
      d.appendChild(p);
    }
  }

  var done = false;
  function finish() {
    if (done) return; done = true;
    d.classList.add('out');
    setTimeout(function () { if (d.parentNode) d.remove(); if (st.parentNode) st.remove(); }, 750);
  }
  d.addEventListener('click', finish);
  document.addEventListener('keydown', function onKey() { finish(); document.removeEventListener('keydown', onKey); });

  function show() {
    document.head.appendChild(st);
    document.body.appendChild(d);
    var img = new Image(); img.src = LOGO; // precarga
    setTimeout(finish, reduce ? 1200 : 3300);
  }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
