// Intro de Allow Games: el logo entra con golpe (destello, onda, temblor, chispas) y despues
// salen los nombres de la gente y los proyectos que hicieron posible el revival, como agradecimiento.
// Una vez por sesion del navegador. Se salta tocando la pantalla o con cualquier tecla.
(function () {
  var seen = false;
  try { seen = sessionStorage.getItem('agIntro4') === '1'; sessionStorage.setItem('agIntro4', '1'); } catch (e) { }
  if (seen) return;

  var l = '';
  try { l = localStorage.getItem('lang') || ''; } catch (e) { }
  var m = document.cookie.match(/gameLocale=([a-z]{2})/);
  l = (l || (m && m[1]) || navigator.language || 'es').slice(0, 2);
  var TX = {
    es: { made: 'Creado por', pres: 'presenta', thanks: 'Gracias a quienes lo hicieron posible', orig: 'Juego original', skip: 'Toca para saltar' },
    en: { made: 'Made by', pres: 'presents', thanks: 'Thanks to everyone who made this possible', orig: 'Original game', skip: 'Tap to skip' },
    pt: { made: 'Criado por', pres: 'apresenta', thanks: 'Obrigado a quem tornou isso possível', orig: 'Jogo original', skip: 'Toque para pular' },
    fr: { made: 'Créé par', pres: 'présente', thanks: 'Merci à ceux qui ont rendu cela possible', orig: 'Jeu original', skip: 'Touche pour passer' },
    it: { made: 'Creato da', pres: 'presenta', thanks: 'Grazie a chi lo ha reso possibile', orig: 'Gioco originale', skip: 'Tocca per saltare' },
    de: { made: 'Gemacht von', pres: 'präsentiert', thanks: 'Danke an alle, die das möglich gemacht haben', orig: 'Originalspiel', skip: 'Tippen zum Überspringen' }
  };
  var t = TX[l] || TX.es;
  // gente y proyectos de donde salieron el servidor, los archivos y las herramientas (ver /creditos.html)
  var NAMES = [
    ['besuper', 'CityVille .NET'],
    ['xmohamedX1', 'Art'],
    ['Captain Rusty', 'Prototype 2011'],
    ['MissTery', 'Raise the Empires'],
    ['Antonio225', 'Prototype'],
    ['nidzo', 'Art'],
    ['MobaChocolate', 'Preservation'],
    ['Ruffle', 'Flash'],
    ['FluorineFX', 'AMF']
  ];
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // celulares, tablets y la app: version liviana (sin brillo ni copias de colores) para que no se trabe
  var lite = /AllowGamesApp|Android|iPhone|iPad/.test(navigator.userAgent) || (window.matchMedia && matchMedia('(pointer: coarse)').matches) || (navigator.hardwareConcurrency || 8) <= 4;
  var LOGO = '/ag/allowgames.png', CV = '/ag/logo_revived.png';

  var css =
    '#agIntro{position:fixed;inset:0;z-index:100000;overflow:hidden;cursor:pointer;background:#000;-webkit-user-select:none;user-select:none;transition:opacity .6s ease;font-family:CV,Montserrat,"Segoe UI",Arial,sans-serif}' +
    '#agIntro.out{opacity:0;pointer-events:none}' +
    '#agIntro .sc{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column}' +
    // escena 1: golpe del logo
    '#agIntro .bg{position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at 50% 55%,#3a1580 0%,#160a36 40%,#000 78%);animation:agIn .2s ease .55s forwards}' +
    '#agIntro .rays{position:absolute;width:120vmax;height:120vmax;left:50%;top:50%;margin:-60vmax 0 0 -60vmax;opacity:0;background:repeating-conic-gradient(from 0deg,rgba(140,100,255,.18) 0 5deg,transparent 5deg 15deg);-webkit-mask:radial-gradient(circle,#000 0%,transparent 55%);mask:radial-gradient(circle,#000 0%,transparent 55%);animation:agIn .4s ease .6s forwards;will-change:opacity}' +
    '#agIntro .flash{position:absolute;inset:0;background:#fff;opacity:0;animation:agFlash .5s ease-out .55s forwards}' +
    '#agIntro .ring{position:absolute;left:50%;top:50%;width:600px;height:600px;margin:-300px 0 0 -300px;border-radius:50%;border:4px solid #8be9ff;opacity:0;transform:scale(.05);animation:agRing .8s cubic-bezier(.1,.7,.3,1) .58s forwards;will-change:transform,opacity}' +
    '#agIntro .ring.r2{border-color:#d29bff;animation-delay:.72s}' +
    '#agIntro .shake{position:relative;display:flex;flex-direction:column;align-items:center;animation:agShake .45s linear .58s;will-change:transform}' +
    '#agIntro .logo{position:relative;width:min(74vw,600px);aspect-ratio:800/455;opacity:0;transform:scale(3.2);animation:agSlam .32s cubic-bezier(.7,0,1,.6) .25s forwards;will-change:transform,opacity}' +
    '#agIntro .logo img{position:absolute;inset:0;width:100%;height:100%}' +
    // efecto glitch (copias rojo/azul que tiemblan)
    '#agIntro .logo .g1,#agIntro .logo .g2{opacity:0;will-change:transform,opacity}' +
    '#agIntro .logo .g1{animation:agGl1 .4s steps(2) .6s 1}' +
    '#agIntro .logo .g2{animation:agGl2 .4s steps(2) .6s 1}' +
    '#agIntro .shine{position:absolute;inset:0;-webkit-mask:url(' + LOGO + ') center/contain no-repeat;mask:url(' + LOGO + ') center/contain no-repeat;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.95) 50%,transparent 65%) -150% 0/250% 100% no-repeat;animation:agShine .9s ease-in-out 1.3s forwards}' +
    '#agIntro .line{width:0;height:3px;margin-top:14px;background:linear-gradient(90deg,transparent,#00d9ff,#b14bff,transparent);animation:agLine .7s ease 1.1s forwards}' +
    '#agIntro .tag{margin-top:14px;color:#e6dcff;font-weight:700;font-size:clamp(12px,1.8vw,16px);letter-spacing:.7em;padding-left:.7em;text-transform:uppercase;opacity:0;animation:agTag .7s ease 1.25s forwards}' +
    '#agIntro i.sp{position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:#fff;opacity:0;box-shadow:0 0 10px #9b7bff;animation:agSpark 1.3s ease-out forwards}' +
    '#agIntro .s1.go{animation:agOut .5s ease forwards}' +
    // escena 2: gracias
    '#agIntro .s2{opacity:0;pointer-events:none;background:radial-gradient(ellipse at 50% 40%,#1d0f47 0%,#07051a 60%,#000 100%);padding:4vh 4vw}' +
    '#agIntro .s2.on{opacity:1;transition:opacity .4s}' +
    '#agIntro .me{text-align:center;margin-bottom:2.2vh;opacity:0;transform:scale(.7);will-change:transform,opacity}' +
    '#agIntro .s2.on .me{animation:agCv .6s cubic-bezier(.2,1.5,.4,1) forwards}' +
    '#agIntro .me span{display:block;color:#a99be0;font-size:clamp(10px,1.3vw,13px);letter-spacing:.3em;text-transform:uppercase}' +
    '#agIntro .me b{display:block;font-size:clamp(26px,4.6vw,48px);font-weight:700;color:#fff;line-height:1.1;background:linear-gradient(90deg,#8be9ff,#ffffff 45%,#d29bff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}' +
    '#agIntro .me i{display:block;font-style:normal;color:#e6dcff;font-size:clamp(10px,1.3vw,13px);letter-spacing:.2em;text-transform:uppercase;margin-top:2px}' +
    '#agIntro .s2 h2{margin:0 0 3vh;color:#fff;font-weight:700;font-size:clamp(16px,2.8vw,28px);text-align:center;text-shadow:0 0 18px #8a3dff;opacity:0;transform:translateY(-14px)}' +
    '#agIntro .s2.on h2{animation:agUp .5s ease forwards}' +
    '#agIntro .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.6vh 3vw;width:min(92vw,900px)}' +
    '#agIntro .nm{opacity:0;transform:scale(.6) translateY(16px);text-align:center;padding:1vh .6vw;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(160,130,255,.35);will-change:transform,opacity}' +
    '#agIntro .nm.on{animation:agName .45s cubic-bezier(.2,1.6,.4,1) forwards}' +
    '#agIntro .nm b{display:block;color:#fff;font-size:clamp(15px,2.4vw,26px);font-weight:700;text-shadow:0 0 8px rgba(0,217,255,.7)}' +
    '#agIntro .nm span{display:block;color:#a99be0;font-size:clamp(10px,1.3vw,13px);letter-spacing:.25em;text-transform:uppercase;margin-top:2px}' +
    '#agIntro .orig{margin-top:3vh;color:#b9b0d9;font-size:clamp(11px,1.4vw,14px);letter-spacing:.2em;text-transform:uppercase;opacity:0}' +
    '#agIntro .orig b{color:#fff;letter-spacing:.1em}' +
    '#agIntro .orig.on{animation:agUp .5s ease forwards}' +
    '#agIntro .cv{height:min(16vh,120px);margin-top:3vh;opacity:0;transform:scale(.7)}' +
    '#agIntro .cv.on{animation:agCv .7s cubic-bezier(.2,1.5,.4,1) forwards}' +
    '#agIntro .skip{position:absolute;right:16px;bottom:14px;color:rgba(255,255,255,.5);font-size:12px;letter-spacing:.12em;text-transform:uppercase;z-index:2}' +
    '@media (orientation:portrait){#agIntro .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
    '@media (max-height:420px){#agIntro .me{margin-bottom:1.2vh}#agIntro .s2 h2{font-size:15px}#agIntro .nm b{font-size:14px}#agIntro .grid{gap:1vh 2vw}#agIntro .nm{padding:.5vh .4vw}#agIntro .cv{height:13vh;margin-top:2vh}#agIntro .s2 h2{margin-bottom:2vh}}' +
    '@keyframes agIn{to{opacity:1}}' +
    '@keyframes agFlash{0%{opacity:.95}100%{opacity:0}}' +
    '@keyframes agRing{0%{opacity:1;transform:scale(.05)}100%{opacity:0;transform:scale(1.6)}}' +
    '@keyframes agSlam{0%{opacity:0;transform:scale(3.2)}100%{opacity:1;transform:scale(1)}}' +
    '@keyframes agShake{0%,100%{transform:none}10%{transform:translate(-14px,8px) rotate(-1deg)}25%{transform:translate(12px,-10px) rotate(1deg)}40%{transform:translate(-9px,6px)}55%{transform:translate(7px,-5px)}70%{transform:translate(-4px,3px)}85%{transform:translate(2px,-2px)}}' +
    '@keyframes agGl1{0%{opacity:.5;transform:translate(-10px,2px)}50%{opacity:.35;transform:translate(7px,-3px)}100%{opacity:0;transform:none}}' +
    '@keyframes agGl2{0%{opacity:.5;transform:translate(10px,-2px)}50%{opacity:.35;transform:translate(-7px,3px)}100%{opacity:0;transform:none}}' +
    '@keyframes agShine{to{background-position:150% 0}}' +
    '@keyframes agLine{to{width:min(50vw,360px)}}' +
    '@keyframes agTag{from{opacity:0;letter-spacing:1.4em}to{opacity:1;letter-spacing:.7em}}' +
    '@keyframes agSpark{0%{opacity:0;transform:translate(0,0) scale(.5)}12%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(1.3)}}' +
    '@keyframes agOut{to{opacity:0;transform:scale(1.15)}}' +
    '@keyframes agUp{to{opacity:1;transform:none}}' +
    '@keyframes agName{0%{opacity:0;transform:scale(.6) translateY(16px)}100%{opacity:1;transform:none}}' +
    '@keyframes agCv{to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){#agIntro *{animation-duration:.01s!important;animation-delay:0s!important}}';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var st = document.createElement('style'); st.textContent = css;
  var d = document.createElement('div'); d.id = 'agIntro'; d.setAttribute('aria-label', 'Allow Games');
  d.innerHTML =
    '<div class="sc s1"><div class="bg"></div><div class="rays"></div><div class="ring"></div><div class="ring r2"></div>' +
    '<div class="shake"><div class="logo"><img src="' + LOGO + '" alt="Allow Games" draggable="false">' + (lite ? '' : '<img class="g1" src="' + LOGO + '" alt=""><img class="g2" src="' + LOGO + '" alt=""><div class="shine"></div>') + '</div>' +
    '<div class="line"></div><div class="tag">' + esc(t.pres) + '</div></div><div class="flash"></div></div>' +
    '<div class="sc s2"><div class="me"><span>' + esc(t.made) + '</span><b>AllGamersRD</b><i>Allow Games · CityVille Revived</i></div><h2>' + esc(t.thanks) + '</h2><div class="grid">' +
    NAMES.map(function (n) { return '<div class="nm"><b>' + esc(n[0]) + '</b><span>' + esc(n[1]) + '</span></div>'; }).join('') +
    '</div><div class="orig">' + esc(t.orig) + ' · <b>Zynga</b></div><img class="cv" src="' + CV + '" alt="CityVille Revived"></div>' +
    '<div class="skip">' + esc(t.skip) + ' ▶▶</div>';

  // chispas del golpe
  var s1 = d.querySelector('.s1');
  if (!reduce) {
    for (var k = 0; k < (lite ? 12 : 24); k++) {
      var p = document.createElement('i'), a = Math.random() * Math.PI * 2, r = 160 + Math.random() * 380;
      p.className = 'sp';
      p.style.setProperty('--x', Math.round(Math.cos(a) * r) + 'px');
      p.style.setProperty('--y', Math.round(Math.sin(a) * r * .65) + 'px');
      p.style.animationDelay = (0.56 + Math.random() * 0.25) + 's';
      if (k % 3 === 0) p.style.background = '#00d9ff'; else if (k % 3 === 1) p.style.background = '#c77dff';
      s1.appendChild(p);
    }
  }

  var timers = [], done = false;
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function finish() {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    d.classList.add('out');
    setTimeout(function () { if (d.parentNode) d.remove(); if (st.parentNode) st.remove(); }, 650);
  }
  d.addEventListener('click', finish);
  document.addEventListener('keydown', function onKey() { finish(); document.removeEventListener('keydown', onKey); });

  function show() {
    document.head.appendChild(st);
    document.body.appendChild(d);
    if (reduce) { at(1500, finish); return; }
    // escena 2: los nombres van saliendo uno por uno.
    // En la app de Android la intro del logo ya salio en la pantalla de la app: se va directo a los nombres.
    var app = /AllowGamesApp/.test(navigator.userAgent), o = app ? -2650 : 0;
    if (app) { s1.style.display = 'none'; }
    at(2500 + o, function () { s1.classList.add('go'); });
    at(2850 + o, function () { d.querySelector('.s2').classList.add('on'); });
    var nms = d.querySelectorAll('.nm');
    for (var i = 0; i < nms.length; i++) (function (el, i) { at(3150 + o + i * 160, function () { el.classList.add('on'); }); })(nms[i], i);
    var tEnd = 3150 + o + nms.length * 160;
    at(tEnd + 150, function () { d.querySelector('.orig').classList.add('on'); });
    at(tEnd + 450, function () { d.querySelector('.cv').classList.add('on'); });
    at(tEnd + 2200, finish);
  }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
