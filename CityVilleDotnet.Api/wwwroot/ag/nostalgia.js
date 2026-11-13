// CityVille Revived - Allow Games
// Carta de bienvenida de Lowlitta para partidas nuevas (nivel 1), una sola vez por jugador.
(function () {
  var P = window.AG_PLAYER || {};
  if (!P.uid || P.level > 1) return;
  var key = 'agCarta_' + P.uid;
  try { if (localStorage.getItem(key)) return; } catch (e) {}

  var L = {
    es: {
      t: 'Una carta para ti, alcalde',
      p: ['Hola, alcalde. Soy Lowlitta.',
          'Ha pasado mucho tiempo… más de diez años desde que las luces de esta ciudad se apagaron.',
          'Samantha levantó estas calles contigo, ladrillo a ladrillo. Un invierno se despidió de todos y nunca volvió. Antes de irse me dejó una nota en la alcaldía:',
          '«Cuida la ciudad. Algún día los alcaldes regresarán.»',
          'Y aquí estás. Las casas siguen esperando, los vecinos guardaron tus recuerdos y el tren todavía pita a la misma hora.',
          'Ella estaría orgullosa. Construyamos juntos otra vez.'],
      f: '— Lowlitta, en memoria de Samantha', b: 'Bienvenido a casa'
    },
    en: {
      t: 'A letter for you, Mayor',
      p: ['Hello, Mayor. I\'m Lowlitta.',
          'It\'s been a long time… more than ten years since the lights of this city went dark.',
          'Samantha built these streets with you, brick by brick. One winter she said goodbye to everyone and never came back. Before she left, she left a note at City Hall:',
          '"Take care of the city. Someday the mayors will return."',
          'And here you are. The houses are still waiting, the neighbors kept your memories, and the train still whistles at the same hour.',
          'She would be proud. Let\'s build it together again.'],
      f: '— Lowlitta, in memory of Samantha', b: 'Welcome home'
    },
    pt: {
      t: 'Uma carta para você, prefeito',
      p: ['Olá, prefeito. Eu sou a Lowlitta.',
          'Faz muito tempo… mais de dez anos desde que as luzes desta cidade se apagaram.',
          'A Samantha ergueu estas ruas com você, tijolo por tijolo. Num inverno ela se despediu de todos e nunca mais voltou. Antes de partir, deixou um bilhete na prefeitura:',
          '"Cuide da cidade. Um dia os prefeitos vão voltar."',
          'E aqui está você. As casas ainda esperam, os vizinhos guardaram suas lembranças e o trem ainda apita na mesma hora.',
          'Ela estaria orgulhosa. Vamos construir juntos de novo.'],
      f: '— Lowlitta, em memória da Samantha', b: 'Bem-vindo de volta'
    },
    fr: {
      t: 'Une lettre pour vous, Maire',
      p: ['Bonjour, Maire. Je suis Lowlitta.',
          'Cela fait longtemps… plus de dix ans que les lumières de cette ville se sont éteintes.',
          'Samantha a bâti ces rues avec vous, brique après brique. Un hiver, elle a dit au revoir à tout le monde et n\'est jamais revenue. Avant de partir, elle a laissé un mot à la mairie :',
          '« Prends soin de la ville. Un jour, les maires reviendront. »',
          'Et vous voilà. Les maisons attendent toujours, les voisins ont gardé vos souvenirs et le train siffle toujours à la même heure.',
          'Elle serait fière. Reconstruisons ensemble.'],
      f: '— Lowlitta, en mémoire de Samantha', b: 'Bon retour'
    },
    it: {
      t: 'Una lettera per te, Sindaco',
      p: ['Ciao, Sindaco. Sono Lowlitta.',
          'È passato tanto tempo… più di dieci anni da quando le luci di questa città si sono spente.',
          'Samantha ha costruito queste strade con te, mattone dopo mattone. Un inverno ha salutato tutti e non è più tornata. Prima di partire ha lasciato un biglietto in municipio:',
          '«Prenditi cura della città. Un giorno i sindaci torneranno.»',
          'Ed eccoti qui. Le case aspettano ancora, i vicini hanno custodito i tuoi ricordi e il treno fischia ancora alla stessa ora.',
          'Sarebbe orgogliosa. Costruiamo insieme di nuovo.'],
      f: '— Lowlitta, in memoria di Samantha', b: 'Bentornato a casa'
    },
    de: {
      t: 'Ein Brief für dich, Bürgermeister',
      p: ['Hallo, Bürgermeister. Ich bin Lowlitta.',
          'Es ist lange her… mehr als zehn Jahre, seit die Lichter dieser Stadt erloschen sind.',
          'Samantha hat diese Straßen mit dir gebaut, Stein für Stein. In einem Winter verabschiedete sie sich von allen und kam nie zurück. Bevor sie ging, hinterließ sie eine Notiz im Rathaus:',
          '„Pass auf die Stadt auf. Eines Tages kehren die Bürgermeister zurück.“',
          'Und hier bist du. Die Häuser warten noch, die Nachbarn haben deine Erinnerungen bewahrt, und der Zug pfeift noch zur selben Stunde.',
          'Sie wäre stolz. Lass uns wieder gemeinsam bauen.'],
      f: '— Lowlitta, in Erinnerung an Samantha', b: 'Willkommen zu Hause'
    }
  };
  var lang = (P.locale || navigator.language || 'es').slice(0, 2).toLowerCase();
  var T = L[lang] || L.es;

  var css = '#agCarta{position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px;' +
    'background:radial-gradient(ellipse at center,rgba(20,24,40,.82),rgba(5,6,12,.95));opacity:0;transition:opacity 1.2s;box-sizing:border-box}' +
    '#agCarta.on{opacity:1}#agCarta *{box-sizing:border-box}' +
    '#agCarta .c{position:relative;width:100%;max-width:560px;max-height:calc(100vh - 32px);overflow-y:auto;overflow-x:hidden;' +
    'background:#fbf6e6;border:4px solid #d9c79a;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,.6);' +
    'padding:22px 22px 18px;font-family:CV,Fredoka,"Trebuchet MS",sans-serif;color:#3b3a33;filter:sepia(.12)}' +
    '#agCarta .h{display:flex;align-items:center;gap:14px;margin-bottom:10px}' +
    '#agCarta .h img{width:76px;height:76px;flex:0 0 76px;border-radius:50%;object-fit:cover;object-position:top;border:4px solid #2f8fc4;background:#cfe9f7}' +
    '#agCarta h2{margin:0;font-size:clamp(18px,4.6vw,24px);line-height:1.2;color:#0a5f8c;overflow-wrap:anywhere}' +
    '#agCarta p{margin:0 0 10px;font-size:clamp(14px,3.8vw,16px);line-height:1.5;overflow-wrap:break-word;opacity:0;transform:translateY(6px);transition:opacity .9s,transform .9s}' +
    '#agCarta p.v{opacity:1;transform:none}#agCarta p.q{font-style:italic;color:#6b5a2e;padding-left:12px;border-left:3px solid #d9c79a}' +
    '#agCarta .f{text-align:right;font-weight:600;color:#6b5a2e;margin-top:4px}' +
    '#agCarta button{display:block;margin:14px auto 0;max-width:100%;padding:10px 28px;border:3px solid #2e7d1d;border-radius:999px;' +
    'background:linear-gradient(#7fd14a,#4aa62a);color:#fff;font:700 clamp(15px,4vw,18px) CV,Fredoka,sans-serif;text-shadow:0 2px 0 #2e7d1d;' +
    'cursor:pointer;opacity:0;transition:opacity .8s;white-space:normal}#agCarta button.v{opacity:1}';
  var st = document.createElement('style'); st.textContent = css;

  var d = document.createElement('div'); d.id = 'agCarta';
  var html = '<div class="c" role="dialog" aria-label="' + T.t + '"><div class="h"><img src="/ag/lowlitta.png" alt="Lowlitta"><h2>' + T.t + '</h2></div>';
  for (var i = 0; i < T.p.length; i++) html += '<p' + (T.p[i].charAt(0) === '«' || T.p[i].charAt(0) === '"' || T.p[i].charAt(0) === '„' ? ' class="q"' : '') + '>' + T.p[i] + '</p>';
  html += '<p class="f">' + T.f + '</p><button type="button">' + T.b + '</button></div>';
  d.innerHTML = html;

  function show() {
    document.head.appendChild(st); document.body.appendChild(d);
    requestAnimationFrame(function () { d.classList.add('on'); });
    var ps = d.querySelectorAll('p'), k = 0;
    (function next() {
      if (k < ps.length) { ps[k++].classList.add('v'); setTimeout(next, k === 1 ? 900 : 1700); }
      else d.querySelector('button').classList.add('v');
    })();
  }
  d.addEventListener('click', function (e) {
    if (e.target.tagName !== 'BUTTON') return;
    try { localStorage.setItem(key, '1'); } catch (x) {}
    d.classList.remove('on'); setTimeout(function () { d.remove(); window.dispatchEvent(new Event('ag:carta')); }, 1200);
  });
  // despues de la intro de Allow Games
  // se muestra cuando el juego termino de cargar (despues de la pantalla de carga)
  var shown = false;
  function go() { if (shown) return; shown = true; setTimeout(show, 900); }
  if (window.agLoaded) go(); else window.addEventListener('ag:loaded', go);
  setTimeout(go, 120000);
})();
