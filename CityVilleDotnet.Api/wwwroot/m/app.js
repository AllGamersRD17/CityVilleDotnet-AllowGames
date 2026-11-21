// Allow Games - CityVille Revived para celular, SIN Flash.
// Dibuja la ciudad con canvas (mismos dibujos del juego) y habla con el servidor por /api/ag/m/gw,
// que usa los mismos servicios que el juego de PC: la ciudad es la misma en los dos.
(function () {
  'use strict';
  var VER = 'v0.40';
  var P = window.AG_PLAYER || {};
  var lang = (P.locale || navigator.language || 'es').slice(0, 2);
  var TX = {
    es: { load: 'Cargando tu ciudad...', items: 'Cargando edificios...', fail: 'No se pudo cargar la ciudad.', retry: 'Reintentar', classic: 'Versión clásica', classicS: 'Clásica', shop: 'Tienda', edit: 'Mover', home: 'Centrar', settings: 'Ajustes', collect: 'Cobrar', plant: 'Sembrar', plow: 'Arar', supply: 'Abastecer', build: 'Construir', finish: 'Terminar', clear: 'Limpiar', ready: '¡Listo!', growing: 'Creciendo', customers: 'Clientes', needGoods: 'Necesita {n} bienes', noEnergy: 'No tienes energía', noCoins: 'No tienes suficientes monedas', noGoods: 'No tienes suficientes bienes', error: 'Algo salió mal, intenta otra vez', crops: 'Cultivos', homes: 'Casas', biz: 'Negocios', deco: 'Decoración', muni: 'Comunidad', plots: 'Parcelas', place: 'Arrastra para mover y toca ✔', blocked: 'No cabe ahí', placed: '¡Colocado!', rotate: 'Girar', sell: 'Vender', sellQ: '¿Vender {n}?', sold: 'Vendido', lvl: 'Nv {n}', full: 'Pantalla completa', lite: 'Ahorro de batería', on: 'Sí', off: 'No', moveHint: 'Toca un edificio para moverlo', min: 'min', h: 'h', d: 'd', newbie: 'Primero termina el tutorial en la versión clásica.' },
    en: { load: 'Loading your city...', items: 'Loading buildings...', fail: 'Could not load your city.', retry: 'Retry', classic: 'Classic version', classicS: 'Classic', shop: 'Shop', edit: 'Move', home: 'Center', settings: 'Settings', collect: 'Collect', plant: 'Plant', plow: 'Plow', supply: 'Supply', build: 'Build', finish: 'Finish', clear: 'Clear', ready: 'Ready!', growing: 'Growing', customers: 'Customers', needGoods: 'Needs {n} goods', noEnergy: 'You are out of energy', noCoins: 'Not enough coins', noGoods: 'Not enough goods', error: 'Something went wrong, try again', crops: 'Crops', homes: 'Homes', biz: 'Businesses', deco: 'Decorations', muni: 'Community', plots: 'Plots', place: 'Drag to move, then tap ✔', blocked: 'It does not fit there', placed: 'Placed!', rotate: 'Rotate', sell: 'Sell', sellQ: 'Sell {n}?', sold: 'Sold', lvl: 'Lv {n}', full: 'Full screen', lite: 'Battery saver', on: 'On', off: 'Off', moveHint: 'Tap a building to move it', min: 'min', h: 'h', d: 'd', newbie: 'Finish the tutorial in the classic version first.' },
    pt: { load: 'Carregando sua cidade...', items: 'Carregando prédios...', fail: 'Não foi possível carregar a cidade.', retry: 'Tentar de novo', classic: 'Versão clássica', classicS: 'Clássica', shop: 'Loja', edit: 'Mover', home: 'Centralizar', settings: 'Ajustes', collect: 'Coletar', plant: 'Plantar', plow: 'Arar', supply: 'Abastecer', build: 'Construir', finish: 'Terminar', clear: 'Limpar', ready: 'Pronto!', growing: 'Crescendo', customers: 'Clientes', needGoods: 'Precisa de {n} bens', noEnergy: 'Sem energia', noCoins: 'Moedas insuficientes', noGoods: 'Bens insuficientes', error: 'Algo deu errado, tente de novo', crops: 'Plantações', homes: 'Casas', biz: 'Negócios', deco: 'Decoração', muni: 'Comunidade', plots: 'Lotes', place: 'Arraste para mover e toque ✔', blocked: 'Não cabe aí', placed: 'Colocado!', rotate: 'Girar', sell: 'Vender', sellQ: 'Vender {n}?', sold: 'Vendido', lvl: 'Nv {n}', full: 'Tela cheia', lite: 'Economia de bateria', on: 'Sim', off: 'Não', moveHint: 'Toque um prédio para movê-lo', min: 'min', h: 'h', d: 'd', newbie: 'Primeiro termine o tutorial na versão clássica.' },
    fr: { load: 'Chargement de ta ville...', items: 'Chargement des bâtiments...', fail: 'Impossible de charger la ville.', retry: 'Réessayer', classic: 'Version classique', classicS: 'Classique', shop: 'Boutique', edit: 'Déplacer', home: 'Centrer', settings: 'Réglages', collect: 'Récolter', plant: 'Planter', plow: 'Labourer', supply: 'Approvisionner', build: 'Construire', finish: 'Terminer', clear: 'Nettoyer', ready: 'Prêt !', growing: 'En croissance', customers: 'Clients', needGoods: 'Il faut {n} marchandises', noEnergy: "Plus d'énergie", noCoins: 'Pas assez de pièces', noGoods: 'Pas assez de marchandises', error: 'Un problème est survenu, réessaie', crops: 'Cultures', homes: 'Maisons', biz: 'Commerces', deco: 'Décorations', muni: 'Communauté', plots: 'Parcelles', place: 'Glisse pour déplacer puis touche ✔', blocked: 'Ça ne rentre pas', placed: 'Placé !', rotate: 'Tourner', sell: 'Vendre', sellQ: 'Vendre {n} ?', sold: 'Vendu', lvl: 'Nv {n}', full: 'Plein écran', lite: 'Économie de batterie', on: 'Oui', off: 'Non', moveHint: 'Touche un bâtiment pour le déplacer', min: 'min', h: 'h', d: 'j', newbie: "Termine d'abord le tutoriel dans la version classique." },
    it: { load: 'Caricamento della città...', items: 'Caricamento edifici...', fail: 'Impossibile caricare la città.', retry: 'Riprova', classic: 'Versione classica', classicS: 'Classica', shop: 'Negozio', edit: 'Sposta', home: 'Centra', settings: 'Impostazioni', collect: 'Raccogli', plant: 'Pianta', plow: 'Ara', supply: 'Rifornisci', build: 'Costruisci', finish: 'Completa', clear: 'Pulisci', ready: 'Pronto!', growing: 'In crescita', customers: 'Clienti', needGoods: 'Servono {n} merci', noEnergy: 'Energia esaurita', noCoins: 'Monete insufficienti', noGoods: 'Merci insufficienti', error: 'Qualcosa è andato storto, riprova', crops: 'Coltivazioni', homes: 'Case', biz: 'Negozi', deco: 'Decorazioni', muni: 'Comunità', plots: 'Campi', place: 'Trascina per spostare e tocca ✔', blocked: 'Non ci sta', placed: 'Posizionato!', rotate: 'Ruota', sell: 'Vendi', sellQ: 'Vendere {n}?', sold: 'Venduto', lvl: 'Liv {n}', full: 'Schermo intero', lite: 'Risparmio batteria', on: 'Sì', off: 'No', moveHint: 'Tocca un edificio per spostarlo', min: 'min', h: 'h', d: 'g', newbie: 'Prima completa il tutorial nella versione classica.' },
    de: { load: 'Deine Stadt wird geladen...', items: 'Gebäude werden geladen...', fail: 'Die Stadt konnte nicht geladen werden.', retry: 'Nochmal', classic: 'Klassische Version', classicS: 'Klassisch', shop: 'Laden', edit: 'Bewegen', home: 'Zentrieren', settings: 'Einstellungen', collect: 'Einsammeln', plant: 'Pflanzen', plow: 'Pflügen', supply: 'Beliefern', build: 'Bauen', finish: 'Fertigstellen', clear: 'Räumen', ready: 'Fertig!', growing: 'Wächst', customers: 'Kunden', needGoods: 'Braucht {n} Waren', noEnergy: 'Keine Energie mehr', noCoins: 'Nicht genug Münzen', noGoods: 'Nicht genug Waren', error: 'Etwas ist schiefgelaufen, versuch es nochmal', crops: 'Felder', homes: 'Häuser', biz: 'Geschäfte', deco: 'Deko', muni: 'Gemeinde', plots: 'Äcker', place: 'Ziehen zum Bewegen, dann ✔', blocked: 'Passt da nicht hin', placed: 'Platziert!', rotate: 'Drehen', sell: 'Verkaufen', sellQ: '{n} verkaufen?', sold: 'Verkauft', lvl: 'St {n}', full: 'Vollbild', lite: 'Akku sparen', on: 'An', off: 'Aus', moveHint: 'Tippe ein Gebäude an, um es zu bewegen', min: 'Min', h: 'Std', d: 'T', newbie: 'Beende zuerst das Tutorial in der klassischen Version.' }
  };
  var t = TX[lang] || TX.es;
  function tf(k, n) { return (t[k] || TX.es[k] || k).replace('{n}', n); }

  var HT = '/assets/hometown/';
  var TW = 20, TH = 10; // medio ancho / medio alto de una casilla (40x20)
  var DIRS = ['SW', 'SE', 'NE', 'NW'];
  var cv = document.getElementById('mv'), cx = cv.getContext('2d');
  var hud = document.getElementById('mh');
  var ld = document.getElementById('mload');
  var weak = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 4) <= 3;
  var saver = false;
  try { saver = localStorage.getItem('agMSaver') === '1'; } catch (e) { }

  var CAT = null, NAMES = {}, LEVELS = [];
  var me = { gold: 0, cash: 0, xp: 0, level: P.level || 1, energy: 0, energyMax: 0, goods: 0 };
  var objs = {}, order = [], rects = [];
  var cam = { x: 0, y: 0, z: 1 };
  var W = 0, H = 0, DPR = 1;
  var dirty = true, fx = [];
  var placing = null, moving = false, bubble = null;
  var dayMs = 82800000, growMul = 1;

  function $(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { n = n | 0; return n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M' : n >= 1e4 ? Math.round(n / 1e3) + 'K' : n.toLocaleString(); }
  function status(msg, pct) { ld.querySelector('p').textContent = msg; if (pct != null) ld.querySelector('.bar i').style.width = pct + '%'; }

  // ---------- servidor ----------
  function gw(calls) {
    return fetch('/api/ag/m/gw', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ calls: calls }) })
      .then(function (r) {
        if (r.status === 401) { location.href = '/Account/Login?ReturnUrl=%2Fm'; throw new Error('auth'); }
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
      }).then(function (j) {
        (j.r || []).forEach(applyMeta);
        return j.r || [];
      });
  }
  function act(action, b, extra) {
    var p = [action, b];
    if (extra) p = p.concat(extra);
    return gw([{ fn: 'WorldService.performAction', params: p }]).then(function (r) { return r[0] || {}; });
  }
  function applyMeta(res) {
    var wu = res && res.metadata && res.metadata.worldUpdate;
    if (!wu || !wu.objects) return;
    Object.keys(wu.objects).forEach(function (id) {
      var o = wu.objects[id];
      if (o) objs[id] = norm(o); else delete objs[id];
    });
    resort();
  }
  function refreshMe() {
    return fetch('/api/ag/m/me', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j) return;
      var lv = me.level;
      me = j; drawHud();
      if (j.level > lv) toast('⭐ ' + tf('lvl', j.level) + '!');
    }).catch(function () { });
  }

  // ---------- catalogo ----------
  function item(n) { return CAT && CAT.items[n]; }
  function nameOf(n) {
    if (NAMES[n]) return NAMES[n];
    var s = String(n).replace(/^(res|bus|deco|dec|mun|plot|land|hood|wonder|mall|atr|con|construction)_/, '').replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    return s;
  }
  function size(o) {
    var it = item(o.itemName) || {};
    var sx = it.sx || 1, sy = it.sy || 1;
    if ((o.direction | 0) % 2 === 1) { var z = sx; sx = sy; sy = z; }
    return [sx, sy];
  }
  function growMs(n) { var it = item(n); return it && it.g ? it.g * dayMs * growMul : 0; }

  function norm(o) {
    var p = o.position || {};
    return {
      id: o.id, itemName: o.itemName, className: o.className, state: o.state, direction: o.direction | 0,
      x: p.x | 0, y: p.y | 0, z: p.z | 0, contractName: o.contractName, plantTime: o.plantTime, buildTime: o.buildTime,
      stage: o.stage, builds: o.builds, finishedBuilds: o.finishedBuilds, visits: o.visits | 0, targetBuildingName: o.targetBuildingName
    };
  }

  // estado real de un objeto: listo para cobrar, creciendo, etc.
  function kind(o) {
    var it = item(o.itemName) || {};
    var cls = o.className;
    if (cls === 'ConstructionSite' || it.t === 'ConstructionSite') return 'con';
    if (cls === 'Plot') {
      if (o.state === 'plowed') return 'plowed';
      if (o.state === 'withered') return 'withered';
      if (o.state === 'grown') return 'ready';
      if (o.state === 'planted' && o.contractName) return Date.now() - o.plantTime >= growMs(o.contractName) ? 'ready' : 'grow';
      return 'plowed';
    }
    if (cls === 'Business' || it.t === 'business') {
      if (o.state === 'closedHarvestable') return 'ready';
      if (o.state === 'open') return 'open';
      return 'closed';
    }
    if (o.state === 'grown') return 'ready';
    if (o.state === 'planted' && it.g) return Date.now() - o.plantTime >= growMs(o.itemName) ? 'ready' : 'grow';
    return 'static';
  }

  // ---------- dibujos ----------
  var IMG = {};
  function img(u) {
    var im = IMG[u];
    if (im) return im;
    im = IMG[u] = new Image();
    im.onload = function () { im.ok = true; dirty = true; };
    im.onerror = function () { im.bad = true; };
    im.src = '/' + u.replace(/^\//, '');
    return im;
  }
  var roadAt = {};
  function isRoad(q) { return q.className === 'Road' || (item(q.itemName) || {}).t === 'road'; }
  function roadShape(o) {
    if (o._road) return o._road;
    var has = function (dx, dy) { return roadAt[(o.x + dx) + ',' + (o.y + dy)] ? 1 : 0; };
    var ne = has(3, 0), nw = has(0, 3), se = has(0, -3), sw = has(-3, 0), n = ne + nw + se + sw, r;
    if (n === 4) r = '4way';
    else if (n === 3) r = !sw ? 'tshape_ne' : !ne ? 'tshape_sw' : !se ? 'tshape_nw' : 'tshape_se';
    else if (n === 2) r = ne && sw ? 'straightaway_n' : nw && se ? 'straightaway_e' : ne && nw ? 'corner_n' : ne && se ? 'corner_e' : se && sw ? 'corner_s' : 'corner_w';
    else if (n === 1) r = ne ? 'road_cap_ne' : nw ? 'road_cap_nw' : se ? 'road_cap_se' : 'road_cap_sw';
    else r = 'road_circle';
    return (o._road = r);
  }
  function pick(it, names, dir) {
    if (!it || !it.img) return null;
    for (var i = 0; i < names.length; i++) {
      var g = it.img[names[i]];
      if (g) return g[dir] || g.ALL || g.SW || g[Object.keys(g)[0]];
    }
    for (var k in it.img) {
      if (/icon|editor|profile|legend|large|mastery|level/i.test(k)) continue;
      var g2 = it.img[k];
      return g2[dir] || g2.ALL || g2.SW || g2[Object.keys(g2)[0]];
    }
    return null;
  }
  // capas que se dibujan para un objeto
  function layers(o) {
    var it = item(o.itemName);
    if (!it) return [];
    var dir = DIRS[o.direction] || 'SW', k = kind(o);
    if (it.t === 'road') return [pick(it, [roadShape(o)], 'ALL')];
    if (k === 'con') return [pick(it, ['stage_' + (o.stage | 0), 'stage_0'], dir)];
    if (o.className === 'Plot') {
      var out = [pick(it, ['plowed'], 'ALL')];
      var c = o.contractName && item(o.contractName);
      if (c && (o.state === 'planted' || o.state === 'grown' || o.state === 'withered')) {
        var st = o.state === 'withered' ? ['withered'] : k === 'ready' ? ['grown'] :
          ((Date.now() - o.plantTime) / Math.max(1, growMs(o.contractName)) < 0.5 ? ['planted#1', 'planted', 'planted#2'] : ['planted#2', 'planted', 'planted#1']);
        out.push(pick(c, st, 'ALL'));
      }
      return out;
    }
    var names = k === 'ready' ? ['grown', o.state, 'static', 'planted'] : [o.state, 'static', 'grown', 'planted', 'open', 'closed', 'initial'];
    return [pick(it, names, dir)];
  }

  // coloca las capas: cada imagen se alinea abajo-izquierda con el rombo de su casilla
  function place(o, L, B) {
    var res = [];
    var groups = layers(o);
    for (var g = 0; g < groups.length; g++) {
      var ls = groups[g];
      if (!ls) continue;
      var base = null, i;
      for (i = 0; i < ls.length; i++) if (ls[i].t === 'base') { base = ls[i]; break; }
      var ref = base || ls[0];
      var ri = img(ref.u);
      if (!ri.ok) { if (!ri.bad) return null; continue; }
      var rh = ref.fh || ri.height;
      var ox = L - (base ? (ref.x || 0) : 0), oy = B - rh - (base ? (ref.y || 0) : 0);
      if (!base) { ox = L; oy = B - rh; }
      for (i = 0; i < ls.length; i++) {
        var l = ls[i], im = img(l.u);
        if (!im.ok) continue;
        var w = l.fw || im.width, h = l.fh || im.height;
        var x = ox + (l.x || 0), y = (base ? oy : B - h) + (l.y || 0);
        if (base) y = oy + (l.y || 0);
        res.push([im, x, y, w, h, l.fw ? 1 : 0]);
      }
    }
    return res;
  }

  function footprint(o) {
    var s = size(o);
    return { L: (o.x - o.y - s[1]) * TW, R: (o.x + s[0] - o.y) * TW, B: -(o.x + o.y) * TH, T: -(o.x + s[0] + o.y + s[1]) * TH, sx: s[0], sy: s[1] };
  }
  function resort() {
    order = Object.keys(objs).map(function (k) { return objs[k]; });
    roadAt = {};
    order.forEach(function (o) { o._road = null; if (isRoad(o)) roadAt[o.x + ',' + o.y] = 1; });
    order.forEach(function (o) { var s = size(o); o._d = o.x + o.y + (s[0] + s[1]) / 2; o._flat = (item(o.itemName) || {}).t === 'road' || o.className === 'Plot' ? 1 : 0; });
    order.sort(function (a, b) { return (b._flat - a._flat) || (b._d - a._d) || (a.x - b.x); });
    dirty = true;
  }

  // ---------- camara ----------
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, weak || saver ? 1.25 : 2);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    dirty = true;
    layoutHud();
  }
  function toScreen(wx, wy) { return [(wx - cam.x) * cam.z + W / 2, (wy - cam.y) * cam.z + H / 2]; }
  function toWorld(sx, sy) { return [(sx - W / 2) / cam.z + cam.x, (sy - H / 2) / cam.z + cam.y]; }
  function toTile(wx, wy) { var a = wx / TW, b = -wy / TH; return [(a + b) / 2, (b - a) / 2]; } // x-y=a, x+y=b
  function zoomAt(f, sx, sy) {
    var before = toWorld(sx, sy);
    cam.z = Math.max(0.3, Math.min(2.2, cam.z * f));
    var after = toWorld(sx, sy);
    cam.x += before[0] - after[0]; cam.y += before[1] - after[1];
    dirty = true; closeBubble();
  }
  function center() {
    var n = 0, sx = 0, sy = 0;
    order.forEach(function (o) { if (o._flat && order.length > 30) return; var f = footprint(o); sx += (f.L + f.R) / 2; sy += (f.T + f.B) / 2; n++; });
    if (!n && rects.length) { var r = rects[0]; sx = (r.x - r.y) * TW; sy = -(r.x + r.y + r.width) * TH; n = 1; }
    cam.x = n ? sx / n : 0; cam.y = n ? sy / n : 0;
    cam.z = Math.min(W, H) < 500 ? 0.75 : 1;
    dirty = true;
  }

  // ---------- dibujar ----------
  var coinIc = img('assets/hometown/gen_icon_coins_small.png');
  var goodsIc = img('assets/hometown/gen_icon_goods_small.png');
  var hammer = img('assets/hometown/cit_editorbutton_edit.png');
  function diamond(x, y, sx, sy) {
    cx.beginPath();
    cx.moveTo((x - y) * TW, -(x + y) * TH);
    cx.lineTo((x + sx - y) * TW, -(x + sx + y) * TH);
    cx.lineTo((x + sx - y - sy) * TW, -(x + sx + y + sy) * TH);
    cx.lineTo((x - y - sy) * TW, -(x + y + sy) * TH);
    cx.closePath();
  }
  function frame() {
    requestAnimationFrame(frame);
    var now = performance.now();
    if (fx.length) dirty = true;
    if (!dirty || !CAT) return;
    if (saver && now - (frame.last || 0) < 50 && !fx.length) return;
    frame.last = now;
    dirty = false;
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.fillStyle = '#3f7d2a'; cx.fillRect(0, 0, cv.width, cv.height);
    var s = cam.z * DPR;
    cx.setTransform(s, 0, 0, s, (W / 2 - cam.x * cam.z) * DPR, (H / 2 - cam.y * cam.z) * DPR);
    cx.imageSmoothingEnabled = cam.z < 0.98;
    // terreno
    cx.fillStyle = '#7cb342';
    rects.forEach(function (r) { diamond(r.x, r.y, r.width, r.height); cx.fill(); });
    if (cam.z > 0.6) {
      cx.strokeStyle = 'rgba(0,0,0,.05)'; cx.lineWidth = 1 / cam.z;
      rects.forEach(function (r) { diamond(r.x, r.y, r.width, r.height); cx.stroke(); });
    }
    var v0 = toWorld(-200, -260), v1 = toWorld(W + 200, H + 120);
    var marks = [];
    for (var i = 0; i < order.length; i++) {
      var o = order[i];
      if (placing && placing.obj === o) continue;
      var f = footprint(o);
      if (f.R < v0[0] || f.L > v1[0] || f.B < v0[1] || f.T - 300 > v1[1]) { o._r = null; continue; }
      var ps = place(o, f.L, f.B);
      if (!ps) { o._r = null; continue; }
      var bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
      for (var j = 0; j < ps.length; j++) {
        var q = ps[j];
        if (q[5]) cx.drawImage(q[0], 0, 0, q[3], q[4], q[1], q[2], q[3], q[4]); else cx.drawImage(q[0], q[1], q[2], q[3], q[4]);
        bx0 = Math.min(bx0, q[1]); by0 = Math.min(by0, q[2]); bx1 = Math.max(bx1, q[1] + q[3]); by1 = Math.max(by1, q[2] + q[4]);
      }
      o._r = [bx0, by0, bx1, by1, ps];
      var k = kind(o);
      if (k === 'ready' || k === 'closed' || k === 'con' || k === 'plowed' || k === 'withered') marks.push([o, k, (f.L + f.R) / 2, by0]);
    }
    // piezas que se estan colocando
    if (placing) {
      var po = placing.obj, pf = footprint(po);
      cx.globalAlpha = 0.85;
      cx.fillStyle = placing.ok ? 'rgba(80,220,80,.45)' : 'rgba(230,60,60,.5)';
      diamond(po.x, po.y, pf.sx, pf.sy); cx.fill();
      var pp = place(po, pf.L, pf.B) || [];
      pp.forEach(function (q) { if (q[5]) cx.drawImage(q[0], 0, 0, q[3], q[4], q[1], q[2], q[3], q[4]); else cx.drawImage(q[0], q[1], q[2], q[3], q[4]); });
      cx.globalAlpha = 1;
    }
    // iconos encima (cobrar, abastecer, construir)
    var bob = saver || weak ? 0 : Math.sin(now / 300) * 3;
    marks.forEach(function (m) {
      var ic = m[1] === 'ready' ? coinIc : m[1] === 'closed' ? goodsIc : m[1] === 'con' ? hammer : null;
      if (!ic || !ic.ok) return;
      var sz = 30 / Math.max(cam.z, 0.6);
      cx.drawImage(ic, m[2] - sz / 2, m[3] - sz - 4 + bob, sz, sz);
    });
    if (marks.length && !saver && !weak && !frame.tm) frame.tm = setTimeout(function () { frame.tm = 0; dirty = true; }, 90); // los iconos saltan un poquito (sin gastar bateria)
    // numeritos que suben (+monedas, +xp)
    fx = fx.filter(function (e) {
      var a = (now - e.t) / 1200;
      if (a >= 1) return false;
      cx.globalAlpha = 1 - a;
      cx.font = '900 ' + (18 / Math.max(cam.z, 0.6)) + 'px "Trebuchet MS",sans-serif';
      cx.textAlign = 'center'; cx.lineWidth = 4 / cam.z; cx.strokeStyle = '#3a2a10'; cx.fillStyle = e.c;
      cx.strokeText(e.s, e.x, e.y - a * 50); cx.fillText(e.s, e.x, e.y - a * 50);
      cx.globalAlpha = 1;
      return true;
    });
  }
  function float(o, s, c, dy) { var f = footprint(o); fx.push({ x: (f.L + f.R) / 2, y: (o._r ? o._r[1] : f.T) + (dy || 0), s: s, c: c || '#ffe14d', t: performance.now() }); dirty = true; }

  // ---------- tocar ----------
  var alphaCv = document.createElement('canvas'); alphaCv.width = alphaCv.height = 1;
  var alphaCx = alphaCv.getContext('2d', { willReadFrequently: true });
  function hitAt(sx, sy) {
    var w = toWorld(sx, sy), tl = toTile(w[0], w[1]);
    for (var i = order.length - 1; i >= 0; i--) {
      var o = order[i], r = o._r;
      if (!r || w[0] < r[0] || w[0] > r[2] || w[1] < r[1] || w[1] > r[3]) continue;
      // primero el piso del edificio
      var s = size(o);
      if (tl[0] >= o.x && tl[0] < o.x + s[0] && tl[1] >= o.y && tl[1] < o.y + s[1]) return o;
      // despues los pixeles del dibujo
      for (var j = r[4].length - 1; j >= 0; j--) {
        var q = r[4][j];
        if (w[0] < q[1] || w[0] > q[1] + q[3] || w[1] < q[2] || w[1] > q[2] + q[4]) continue;
        try {
          alphaCx.clearRect(0, 0, 1, 1);
          alphaCx.drawImage(q[0], Math.floor(w[0] - q[1]), Math.floor(w[1] - q[2]), 1, 1, 0, 0, 1, 1);
          if (alphaCx.getImageData(0, 0, 1, 1).data[3] > 40) return o;
        } catch (e) { return o; }
      }
    }
    return null;
  }

  var ptrs = {}, drag = null, pinch = null;
  cv.addEventListener('pointerdown', function (e) {
    cv.setPointerCapture(e.pointerId);
    ptrs[e.pointerId] = [e.clientX, e.clientY];
    var ids = Object.keys(ptrs);
    if (ids.length === 2) {
      var a = ptrs[ids[0]], b = ptrs[ids[1]];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: cam.z };
      drag = null;
    } else if (ids.length === 1) {
      drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, t: Date.now(), moved: false, grab: placing && hitPlacing(e.clientX, e.clientY) };
    }
  });
  function hitPlacing(sx, sy) {
    var w = toWorld(sx, sy), tl = toTile(w[0], w[1]), o = placing.obj, s = size(o);
    return tl[0] >= o.x - 1 && tl[0] < o.x + s[0] + 1 && tl[1] >= o.y - 1 && tl[1] < o.y + s[1] + 1;
  }
  cv.addEventListener('pointermove', function (e) {
    if (!ptrs[e.pointerId]) return;
    ptrs[e.pointerId] = [e.clientX, e.clientY];
    var ids = Object.keys(ptrs);
    if (pinch && ids.length >= 2) {
      var a = ptrs[ids[0]], b = ptrs[ids[1]];
      var d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      zoomAt((pinch.z * d / pinch.d) / cam.z, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      return;
    }
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 8) { drag.moved = true; closeBubble(); }
    if (!drag.moved) return;
    if (drag.grab) {
      var w = toWorld(e.clientX, e.clientY), tl = toTile(w[0], w[1]), s = size(placing.obj);
      var nx = Math.round(tl[0] - s[0] / 2), ny = Math.round(tl[1] - s[1] / 2);
      if (nx !== placing.obj.x || ny !== placing.obj.y) { placing.obj.x = nx; placing.obj.y = ny; checkPlace(); }
      return;
    }
    cam.x = drag.cx - dx / cam.z; cam.y = drag.cy - dy / cam.z; dirty = true;
  });
  function up(e) {
    if (!ptrs[e.pointerId]) return;
    delete ptrs[e.pointerId];
    if (Object.keys(ptrs).length < 2) pinch = null;
    if (drag && !drag.moved && Date.now() - drag.t < 500 && !Object.keys(ptrs).length) tap(e.clientX, e.clientY);
    if (!Object.keys(ptrs).length) drag = null;
  }
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', function (e) { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY); }, { passive: false });

  function tap(sx, sy) {
    closeBubble();
    if (placing) {
      var w = toWorld(sx, sy), tl = toTile(w[0], w[1]), s = size(placing.obj);
      placing.obj.x = Math.round(tl[0] - s[0] / 2); placing.obj.y = Math.round(tl[1] - s[1] / 2);
      checkPlace();
      return;
    }
    var o = hitAt(sx, sy);
    if (!o) return;
    if (moving) { startMove(o); return; }
    var k = kind(o);
    // acciones directas como en Hometown: un toque cobra
    if (k === 'ready') return doHarvest(o);
    if (k === 'con') return doBuild(o);
    if (k === 'withered') return doClear(o);
    if (k === 'plowed') return openCrops(o);
    if (k === 'closed') return showBubble(o, nameOf(o.itemName), tf('needGoods', (item(o.itemName) || {}).req || 0), [[t.supply, function () { doSupply(o); }]]);
    var sub = '';
    if (k === 'grow') sub = t.growing + ' · ' + left(o.plantTime + growMs(o.contractName || o.itemName));
    if (k === 'open') sub = t.customers + ' ' + (o.visits | 0) + '/' + ((item(o.itemName) || {}).req || '?');
    showBubble(o, nameOf(o.contractName || o.itemName), sub, []);
  }
  function left(at) {
    var ms = Math.max(0, at - Date.now()), m = Math.ceil(ms / 60000);
    if (m < 60) return m + ' ' + t.min;
    var h = Math.floor(m / 60);
    return h < 48 ? h + t.h + ' ' + (m % 60) + t.min : Math.floor(h / 24) + t.d + ' ' + (h % 24) + t.h;
  }

  // ---------- acciones ----------
  function pos(o) { return { x: o.x, y: o.y, z: o.z || 0 }; }
  function bobj(o, extra) {
    var b = { id: o.id, position: pos(o), itemName: o.itemName, className: o.className, state: o.state, direction: o.direction };
    for (var k in extra || {}) b[k] = extra[k];
    return b;
  }
  function fail(r) {
    var et = r && r.errorType;
    toast(et === 4 || /energy/i.test(r && r.errorData) ? t.noEnergy : (r && r.errorData) || t.error);
  }
  function ok(r) { return r && (!r.errorType || r.errorType === 0); }
  var busy = {};
  function once(o, fn) { if (busy[o.id]) return; busy[o.id] = 1; setTimeout(function () { delete busy[o.id]; }, 1500); fn(); }

  function doHarvest(o) {
    var it = item(o.itemName) || {};
    if (me.energy < (it.eh || 0) && o.className !== 'Business') { toast(t.noEnergy); return; }
    once(o, function () {
      var before = me.gold, bxp = me.xp, bg = me.goods;
      act('harvest', bobj(o)).then(function (r) {
        if (!ok(r)) return fail(r);
        refreshMe().then(function () {
          if (me.gold > before) float(o, '+' + fmt(me.gold - before), '#ffe14d');
          if (me.goods > bg) float(o, '+' + fmt(me.goods - bg) + ' 📦', '#ffb74d', -22);
          if (me.xp > bxp) float(o, '+' + fmt(me.xp - bxp) + ' XP', '#7fe0ff', -44);
          bump('c');
        });
      }).catch(function () { toast(t.error); });
    });
  }
  function doSupply(o) {
    var need = (item(o.itemName) || {}).req || 0;
    if (me.goods < need) { toast(t.noGoods); return; }
    once(o, function () {
      act('openBusiness', bobj(o), [null, ['goods']]).then(function (r) {
        if (!ok(r)) return fail(r);
        float(o, '-' + need + ' 📦', '#ffb74d'); refreshMe();
      }).catch(function () { toast(t.error); });
    });
  }
  function doBuild(o) {
    var c = item(o.itemName) || {};
    once(o, function () {
      act('build', bobj(o)).then(function (r) {
        if (!ok(r)) return fail(r);
        var cur = objs[o.id] || o;
        refreshMe();
        if (c.ns && (cur.stage | 0) >= c.ns) {
          act('finish', bobj(cur)).then(function (r2) {
            if (!ok(r2)) return toast(t.classic + ': ' + t.finish);
            float(cur, t.ready, '#9cff6a'); refreshMe();
          });
        } else float(cur, '🔨', '#fff');
      }).catch(function () { toast(t.error); });
    });
  }
  function doClear(o) {
    once(o, function () {
      act('clearWithered', bobj(o)).then(function (r) { if (!ok(r)) return fail(r); refreshMe(); }).catch(function () { toast(t.error); });
    });
  }
  function doPlant(o, crop) {
    var c = item(crop) || {};
    if (me.gold < (c.cost || 0)) { toast(t.noCoins); return; }
    closeSheet();
    once(o, function () {
      // la parcela cambia enseguida para que se sienta rapido
      o.state = 'planted'; o.contractName = crop; o.plantTime = Date.now(); dirty = true;
      act('startContract', bobj(o, { state: 'planted', contractName: crop })).then(function (r) {
        if (!ok(r)) { o.state = 'plowed'; o.contractName = null; dirty = true; return fail(r); }
        float(o, '-' + fmt(c.cost || 0), '#ffe14d'); refreshMe();
      }).catch(function () { toast(t.error); });
    });
  }

  // los negocios abiertos reciben clientes (en la PC los traen los muñequitos que caminan)
  setInterval(function () {
    if (!CAT || document.hidden) return;
    var batch = {}, n = 0;
    order.forEach(function (o) { if (kind(o) === 'open') { batch[o.id] = { '0': { count: 1 } }; n++; } });
    if (n) gw([{ fn: 'UserService.processVisitsBatch', params: [batch] }]).catch(function () { });
  }, 6000);
  // las casas y cultivos que terminan de crecer
  setInterval(function () { dirty = true; }, 15000);
  setInterval(function () { if (!document.hidden) refreshMe(); }, 60000);

  // ---------- colocar / mover ----------
  function occupied(o) {
    var s = size(o), i, q, qs;
    var inside = rects.some(function (r) { return o.x >= r.x && o.y >= r.y && o.x + s[0] <= r.x + r.width && o.y + s[1] <= r.y + r.height; });
    if (!inside) {
      // puede quedar entre dos rectangulos: se mira casilla por casilla
      for (var x = o.x; x < o.x + s[0]; x++) for (var y = o.y; y < o.y + s[1]; y++)
        if (!rects.some(function (r) { return x >= r.x && y >= r.y && x < r.x + r.width && y < r.y + r.height; })) return true;
    }
    for (i = 0; i < order.length; i++) {
      q = order[i];
      if (q === o || (placing && q === placing.src)) continue;
      qs = size(q);
      if (o.x < q.x + qs[0] && o.x + s[0] > q.x && o.y < q.y + qs[1] && o.y + s[1] > q.y) return true;
    }
    return false;
  }
  function checkPlace() { placing.ok = !occupied(placing.obj); dirty = true; }
  function classOf(n) {
    var it = item(n) || {};
    var m = { residence: 'Residence', business: 'Business', decoration: 'Decoration', plot: 'Plot', municipal: 'Municipal', road: 'Road', sidewalk: 'Sidewalk', landmark: 'Landmark', storage: 'Storage', wonder: 'Wonder' };
    return m[it.t] || 'Decoration';
  }
  function startPlace(name) {
    closeSheet();
    var w = toWorld(W / 2, H / 2), tl = toTile(w[0], w[1]);
    var o = { id: 100000 + Math.floor(Math.random() * 800000), itemName: name, className: classOf(name), state: 'static', direction: 0, x: Math.round(tl[0]), y: Math.round(tl[1]), z: 0 };
    var it = item(name) || {};
    o.state = it.t === 'plot' ? 'plowed' : it.t === 'residence' ? 'planted' : it.t === 'business' ? 'closed' : 'static';
    placing = { obj: o, isNew: true };
    checkPlace(); placeBar();
    if (!placing.ok) nudge();
  }
  function startMove(o) {
    moving = false; hint(null);
    var c = {}; for (var k in o) c[k] = o[k];
    placing = { obj: c, src: o, isNew: false };
    checkPlace(); placeBar();
  }
  // busca un hueco libre cerca del centro de la pantalla
  function nudge() {
    var o = placing.obj, bx = o.x, by = o.y;
    for (var r = 1; r < 25; r++) for (var dx = -r; dx <= r; dx++) for (var dy = -r; dy <= r; dy++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      o.x = bx + dx; o.y = by + dy;
      if (!occupied(o)) { placing.ok = true; dirty = true; return; }
    }
    o.x = bx; o.y = by; dirty = true;
  }
  function endPlace() { hud.classList.remove('pl'); placing = null; var b = hud.querySelector('.place'); if (b) b.remove(); hint(null); dirty = true; }
  function confirmPlace() {
    if (!placing || !placing.ok) { toast(t.blocked); return; }
    var p = placing, o = p.obj;
    endPlace();
    if (p.isNew) {
      var it = item(o.itemName) || {};
      if (me.gold < (it.cost || 0)) { toast(t.noCoins); return; }
      objs['tmp' + o.id] = o; resort();
      act('place', { position: pos(o), className: o.className, state: o.state, itemName: o.itemName, deleted: false, direction: o.direction, id: o.id }, [null, [{ mapOwner: parseInt(P.uid, 10) || null }]]).then(function (r) {
        delete objs['tmp' + o.id];
        if (!ok(r)) { resort(); return fail(r); }
        resort(); toast(t.placed); refreshMe();
      }).catch(function () { delete objs['tmp' + o.id]; resort(); toast(t.error); });
    } else {
      var src = p.src, old = { x: src.x, y: src.y, d: src.direction };
      src.x = o.x; src.y = o.y; src.direction = o.direction; resort();
      act('move', bobj(src)).then(function (r) {
        if (!ok(r)) { src.x = old.x; src.y = old.y; src.direction = old.d; resort(); return fail(r); }
      }).catch(function () { src.x = old.x; src.y = old.y; src.direction = old.d; resort(); toast(t.error); });
    }
  }
  function sellPlacing() {
    var src = placing && placing.src;
    if (!src) return;
    if (!confirm(tf('sellQ', nameOf(src.itemName)))) return;
    endPlace();
    act('sell', bobj(src)).then(function (r) {
      if (!ok(r)) return fail(r);
      delete objs[src.id]; resort(); toast(t.sold); refreshMe();
    }).catch(function () { toast(t.error); });
  }
  function placeBar() {
    var old = hud.querySelector('.place'); if (old) old.remove();
    var b = $('<div class="place"><button class="no" aria-label="x"></button><button class="rot" aria-label="' + t.rotate + '"></button>' + (placing.isNew ? '' : '<button class="sel" aria-label="' + t.sell + '"></button>') + '<button class="ok" aria-label="ok"></button></div>');
    b.querySelector('.no').onclick = endPlace;
    b.querySelector('.ok').onclick = confirmPlace;
    b.querySelector('.rot').onclick = function () { placing.obj.direction = (placing.obj.direction + 1) % 4; checkPlace(); };
    var s = b.querySelector('.sel'); if (s) s.onclick = sellPlacing;
    hud.appendChild(b); hud.classList.add('pl');
    hint(t.place);
  }

  // ---------- interfaz ----------
  var top, tab, toastEl, sheetEl, hintEl;
  function buildHud() {
    top = $('<div class="top"><div class="lv"><div class="st">1</div><div class="bar"><i style="width:0"></i><b></b></div></div>' +
      '<div class="pill c"><span>0</span></div><div class="pill m"><span>0</span></div><div class="pill e"><span>0</span><small></small></div><div class="pill g"><span>0</span></div>' +
      '<button class="gear" aria-label="' + t.settings + '"></button></div>');
    top.querySelector('.gear').onclick = openSettings;
    hud.appendChild(top);
    tab = $('<div class="tab">' +
      '<button data-a="shop"><img src="' + HT + 'img_menu_store.png" alt=""><span>' + t.shop + '</span></button>' +
      '<button data-a="move"><img src="' + HT + 'img_menu_design.png" alt=""><span>' + t.edit + '</span></button>' +
      '<button data-a="home"><img src="' + HT + 'hud_visit_home.png" alt=""><span>' + t.home + '</span></button>' +
      '<button data-a="classic"><img src="' + HT + 'img_menu_friends.png" alt=""><span>' + t.classicS + '</span></button></div>');
    tab.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var a = b.getAttribute('data-a');
      closeBubble();
      if (a === 'shop') openShop();
      if (a === 'move') { moving = !moving; hint(moving ? t.moveHint : null); }
      if (a === 'home') center();
      if (a === 'classic') { try { localStorage.setItem('agMode', 'classic'); } catch (er) { } location.href = '/Game?hud=1'; }
    };
    hud.appendChild(tab);
    var zm = $('<div class="zm"><button aria-label="+">+</button><button aria-label="-">−</button></div>');
    zm.children[0].onclick = function () { zoomAt(1.25, W / 2, H / 2); };
    zm.children[1].onclick = function () { zoomAt(0.8, W / 2, H / 2); };
    hud.appendChild(zm);
    toastEl = $('<div class="toast"></div>'); hud.appendChild(toastEl);
    sheetEl = $('<div class="sheet"><header><h3></h3><button class="x" aria-label="x">x</button></header><div class="body" style="display:flex;flex-direction:column;min-height:0;flex:1"></div></div>');
    sheetEl.querySelector('.x').onclick = closeSheet;
    hud.appendChild(sheetEl);
  }
  function layoutHud() {
    if (!top) return;
    var need = 640, sc = Math.min(1, W / need);
    top.style.transform = sc < 1 ? 'scale(' + Math.max(sc, 0.62) + ')' : '';
    top.style.width = sc < 1 ? (100 / Math.max(sc, 0.62)) + '%' : '';
  }
  function lvInfo() {
    var cur = LEVELS[me.level - 1] || 0, nxt = LEVELS[me.level] || 0;
    if (!nxt || nxt <= cur) return [100, fmt(me.xp)];
    return [Math.max(0, Math.min(100, (me.xp - cur) * 100 / (nxt - cur))), fmt(me.xp) + ' / ' + fmt(nxt)];
  }
  function drawHud() {
    if (!top) return;
    top.querySelector('.st').textContent = me.level;
    var li = lvInfo();
    top.querySelector('.bar i').style.width = li[0] + '%';
    top.querySelector('.bar b').textContent = li[1];
    top.querySelector('.c span').textContent = fmt(me.gold);
    top.querySelector('.m span').textContent = fmt(me.cash);
    top.querySelector('.e span').textContent = me.energy;
    top.querySelector('.e small').textContent = '/' + me.energyMax;
    top.querySelector('.g span').textContent = fmt(me.goods);
  }
  function bump(c) { var p = top && top.querySelector('.pill.' + c); if (!p) return; p.classList.add('bump'); setTimeout(function () { p.classList.remove('bump'); }, 250); }
  var tt;
  function toast(s) { toastEl.textContent = s; toastEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('on'); }, 2200); }
  function hint(s) { if (hintEl) { hintEl.remove(); hintEl = null; } if (s) { hintEl = $('<div class="hint"></div>'); hintEl.textContent = s; hud.appendChild(hintEl); } }

  function showBubble(o, title, sub, btns) {
    closeBubble();
    var f = footprint(o), sp = toScreen((f.L + f.R) / 2, o._r ? o._r[1] : f.T);
    var b = $('<div class="bub"><div class="t">' + esc(title) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div><div class="row"></div></div>');
    btns.forEach(function (x) { var bt = document.createElement('button'); bt.textContent = x[0]; bt.onclick = function () { closeBubble(); x[1](); }; b.querySelector('.row').appendChild(bt); });
    b.style.left = Math.max(80, Math.min(W - 80, sp[0])) + 'px';
    b.style.top = Math.max(120, sp[1] - 6) + 'px';
    hud.appendChild(b); bubble = b;
    setTimeout(function () { if (bubble === b) closeBubble(); }, 5000);
  }
  function closeBubble() { if (bubble) { bubble.remove(); bubble = null; } }

  function openSheet(title, body) {
    sheetEl.querySelector('h3').textContent = title;
    var bd = sheetEl.querySelector('.body'); bd.innerHTML = ''; bd.appendChild(body);
    sheetEl.classList.add('on');
  }
  function closeSheet() { sheetEl.classList.remove('on'); }
  function timeTxt(days) {
    var m = Math.round(days * dayMs * growMul / 60000);
    return m < 60 ? m + ' ' + t.min : m < 2880 ? Math.round(m / 60) + ' ' + t.h : Math.round(m / 1440) + ' ' + t.d;
  }
  function card(n, onPick, extra) {
    var it = item(n) || {};
    var lock = (it.lvl || 0) > me.level;
    var c = $('<button class="card' + (lock ? ' lock' : '') + '" data-lv="' + esc(tf('lvl', it.lvl || 0)) + '"><img loading="lazy" alt=""><b></b><span class="pr"><img src="' + HT + 'gen_icon_coins_small.png" alt="">' + fmt(it.cost || 0) + '</span>' + (extra ? '<span class="tm">' + esc(extra) + '</span>' : '') + '</button>');
    c.querySelector('img').src = it.icon ? '/' + it.icon : '';
    c.querySelector('img').onerror = function () { this.style.visibility = 'hidden'; };
    c.querySelector('b').textContent = nameOf(n);
    c.onclick = function () { if (lock) { toast(tf('lvl', it.lvl)); return; } onPick(n); };
    return c;
  }
  function openCrops(o) {
    var list = Object.keys(CAT.items).filter(function (n) { var it = CAT.items[n]; return it.t === 'plot_contract' && it.buy && !it.prem && it.on === 'plotEarth' && it.icon && it.g > 0 && it.cost > 0 && it.lvl; });
    list.sort(function (a, b) { return (item(a).lvl || 0) - (item(b).lvl || 0) || (item(a).g || 0) - (item(b).g || 0); });
    list = list.filter(function (n) { return (item(n).lvl || 0) <= me.level + 5; }).slice(0, 80);
    var g = $('<div class="grid"></div>');
    list.forEach(function (n) { g.appendChild(card(n, function (c) { doPlant(o, c); }, timeTxt(item(n).g || 0))); });
    openSheet(t.crops, g);
  }
  var SHOP = [['homes', 'residence'], ['biz', 'business'], ['deco', 'decorRoads'], ['muni', 'municipal'], ['plots', 'plot']];
  function openShop(which) {
    which = which || 'homes';
    var wrap = $('<div style="display:flex;flex-direction:column;min-height:0;flex:1"><div class="tabs"></div><div class="grid"></div></div>');
    SHOP.forEach(function (s) {
      var b = document.createElement('button'); b.textContent = t[s[0]]; if (s[0] === which) b.className = 'on';
      b.onclick = function () { openShop(s[0]); };
      wrap.querySelector('.tabs').appendChild(b);
    });
    var cat = SHOP.filter(function (s) { return s[0] === which; })[0][1];
    var names = cat === 'plot' ? ['plot_crop'] : (CAT.market[cat] || []);
    names = names.filter(function (n) {
      var it = item(n);
      if (!it || !it.buy || !it.pl || it.prem || !it.icon || !(it.cost >= 10) || !it.lvl) return false;
      if (!(it.sx && it.sy)) return false;
      return ['residence', 'business', 'decoration', 'municipal', 'plot', 'road'].indexOf(it.t) >= 0;
    });
    var seen = {};
    names = names.filter(function (n) { if (seen[n]) return false; seen[n] = 1; return true; });
    names.sort(function (a, b) { return (item(a).lvl || 0) - (item(b).lvl || 0) || (item(a).cost || 0) - (item(b).cost || 0); });
    var g = wrap.querySelector('.grid');
    var shown = 0;
    names.forEach(function (n) { if (shown >= 150) return; if ((item(n).lvl || 0) > me.level + 8) return; shown++; g.appendChild(card(n, startPlace)); });
    openSheet(t.shop, wrap);
  }
  function openSettings() {
    var l = $('<div class="list"></div>');
    var add = function (txt, cls, fn) { var b = document.createElement('button'); b.className = cls || ''; b.textContent = txt; b.onclick = fn; l.appendChild(b); };
    add(t.lite + ': ' + (saver ? t.on : t.off), 'b', function () { saver = !saver; try { localStorage.setItem('agMSaver', saver ? '1' : '0'); } catch (e) { } resize(); openSettings(); });
    if (document.documentElement.requestFullscreen) add(t.full, 'b', function () { document.documentElement.requestFullscreen().catch(function () { }); closeSheet(); });
    add(t.classic, 'o', function () { try { localStorage.setItem('agMode', 'classic'); } catch (e) { } location.href = '/Game?hud=1'; });
    var v = document.createElement('p'); v.style.cssText = 'text-align:center;color:#7a6440;font-size:12px;margin:4px 0 0;font-weight:700'; v.textContent = 'CityVille Revived BETA ' + VER + ' · Allow Games';
    l.appendChild(v);
    openSheet(t.settings, l);
  }

  // ---------- arranque ----------
  function boot() {
    status(t.items, 10);
    var cat = fetch('/assets/m/items.json?v=1', { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error('items'); return r.json(); });
    var names = fetch('/assets/m/names_' + lang + '.json?v=1').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    var namesEn = lang === 'en' ? Promise.resolve({}) : fetch('/assets/m/names_en.json?v=1').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    var lv = fetch('/api/ag/levels').then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
    cat.then(function () { status(t.load, 45); });
    Promise.all([cat, names, namesEn, lv, gw([{ fn: 'UserService.initUser', params: [] }])]).then(function (a) {
      CAT = a[0]; dayMs = (CAT.day || 82800) * 1000; growMul = CAT.grow || 1;
      NAMES = {}; var k;
      for (k in a[2]) NAMES[k] = a[2][k];
      for (k in a[1]) NAMES[k] = a[1][k];
      LEVELS = Array.isArray(a[3]) ? a[3] : (a[3] && a[3].levels) || [];
      var res = a[4][0] || {};
      var ui = res.data && res.data.userInfo;
      if (!ui || !ui.world) throw new Error('init ' + (res.errorType || ''));
      var pl = ui.player || {};
      me.gold = pl.gold | 0; me.cash = pl.cash | 0; me.xp = pl.xp | 0; me.level = pl.level || 1; me.energy = pl.energy | 0; me.energyMax = pl.energyMax | 0;
      me.goods = (pl.commodities && pl.commodities.storage && pl.commodities.storage.goods) | 0;
      rects = (ui.world.mapRects || []).map(function (r) { return { x: r.x | 0, y: r.y | 0, width: r.width | 0, height: r.height | 0 }; });
      objs = {};
      (ui.world.objects || []).forEach(function (o) { if (o && !o.deleted && o.position) objs[o.id] = norm(o); });
      resort();
      status(t.load, 90);
      buildHud(); resize(); drawHud(); center();
      if (!order.length) { toast(t.newbie); }
      setTimeout(function () { ld.classList.add('out'); setTimeout(function () { ld.remove(); }, 450); }, 300);
      refreshMe();
    }).catch(function (e) {
      if (e && e.message === 'auth') return;
      console.warn('[AG m]', e);
      status(t.fail, 100);
      var b = document.createElement('a'); b.href = '#'; b.textContent = t.retry; b.onclick = function (ev) { ev.preventDefault(); location.reload(); };
      var c = document.createElement('a'); c.href = '/Game?hud=1'; c.textContent = t.classic;
      ld.appendChild(b); ld.appendChild(c);
    });
  }
  if (/[?&]debug/.test(location.search)) window.__agm = { scr: function (x, y) { return toScreen((x - y) * TW, -(x + y) * TH); }, tap: tap, shop: openShop, get objs() { return objs; } };
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { dirty = true; refreshMe(); } });
  resize();
  requestAnimationFrame(frame);
  boot();
})();
