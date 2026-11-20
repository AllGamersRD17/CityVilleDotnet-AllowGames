// CityVille Revived - Allow Games: si el juego no termina de cargar (sobre todo en celulares y la app),
// manda al servidor un reporte tecnico (navegador, errores, hasta donde llego la carga) para poder arreglarlo.
// No manda datos personales.
(function () {
  if (window.agDiag) return; window.agDiag = true;
  var errs = [], t0 = Date.now();
  var panicSent = false;
  function add(kind, msg) {
    msg = String(msg);
    if (errs.length < 40) errs.push(Math.round((Date.now() - t0) / 1000) + 's ' + kind + ': ' + msg.slice(0, 600));
    // Ruffle se cayo: avisar enseguida
    if (!panicSent && /panicked|RuntimeError|unreachable|out of memory|memory access out of bounds/i.test(msg)) { panicSent = true; setTimeout(function () { report('panic'); }, 1500); }
  }
  addEventListener('error', function (e) { add('error', (e.message || '') + ' @' + (e.filename || '').split('/').pop() + ':' + (e.lineno || '')); }, true);
  addEventListener('unhandledrejection', function (e) { add('promise', e.reason && (e.reason.message || e.reason)); });
  ['error', 'warn'].forEach(function (k) {
    var o = console[k];
    console[k] = function () { try { add(k, [].slice.call(arguments).join(' ')); } catch (x) { } return o.apply(console, arguments); };
  });

  function gl() {
    try { var c = document.createElement('canvas'); return c.getContext('webgl2') ? 'webgl2' : c.getContext('webgl') ? 'webgl' : 'none'; } catch (e) { return 'err'; }
  }
  function report(reason) {
    var res = [];
    try { res = performance.getEntriesByType('resource'); } catch (e) { }
    var big = res.filter(function (r) { return /\.(swf|wasm|xml|z)(\?|$)|ruffle/.test(r.name); })
      .map(function (r) { return r.name.replace(location.origin, '').slice(0, 80) + ' ' + Math.round(r.duration) + 'ms ' + (r.transferSize || 0) + 'b'; });
    var last = res.slice(-8).map(function (r) { return r.name.replace(location.origin, '').slice(0, 80); });
    var ro = document.querySelector('#cvGame ruffle-object, #cvGame ruffle-embed, #cvGame object');
    var body = {
      reason: reason, secs: Math.round((Date.now() - t0) / 1000), ua: navigator.userAgent,
      screen: screen.width + 'x' + screen.height + ' dpr' + (window.devicePixelRatio || 1) + ' view ' + innerWidth + 'x' + innerHeight,
      cpu: navigator.hardwareConcurrency || 0, mem: navigator.deviceMemory || 0, gl: gl(),
      wasm: typeof WebAssembly === 'object', ruffle: !!(window.RufflePlayer && window.RufflePlayer.newest),
      player: ro ? ro.tagName.toLowerCase() + (ro.readyState !== undefined ? ' rs' + ro.readyState : '') : 'none',
      resources: res.length, big: big, last: last, errors: errs
    };
    try {
      fetch('/api/ag/diag', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true });
    } catch (e) { }
  }
  var loaded = false;
  addEventListener('ag:loaded', function () { loaded = true; });
  // sin cargar a los 60 s: reporte (una vez)
  setTimeout(function () { if (!loaded) report('slow60'); }, 60000);
  setTimeout(function () { if (!loaded) report('stuck150'); }, 150000);
})();
