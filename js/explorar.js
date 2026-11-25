/* ══════════════════════════════════════════
   FASE 2 · EXPLORADOR
   Panel izquierdo (vista · buscador · categorías · filtros) y las vistas
   Archivo (cuadrícula) y Lista. Un único estado de filtros, compartido
   con el rizoma: cada registro lleva c._visible, que el rizoma lee.

   Todo se arma desde CONTENIDOS / SUBPROYECTOS: al crecer el catálogo,
   las categorías, los filtros y los contadores se actualizan solos.
══════════════════════════════════════════ */
var EXP = (function () {
  'use strict';

  /* ── Nombres para mostrar (los mismos rótulos que ya usaba el archivo) ── */
  var OBRA_CORTA = {
    'SUB-02': 'Dramaturgias · De los mundos',
    'SUB-03': 'Arte Danzario · Enmarañar-Ser',
    'SUB-04': 'Aulide · Per(r)o mundo',
    'SUB-05': 'Creación Artística · Carne de mis bosques',
    'SUB-06': 'Salidas de campo'
  };
  var NICHO_ORDEN = ['respiracion', 'toque', 'encauchamientos', 'plantaciones', 'abejas', 'pajaros', 'agua', 'enmarañamientos'];
  var NOMBRES = {
    respiracion: 'Respiración', pajaros: 'Pájaros', 'estudios-con-hojas': 'Estudios con hojas',
    apto: 'Apto', sinrevisar: 'Sin revisar'
  };
  var LOTE = 60;   // tarjetas o filas que se pintan de una vez (el resto llega al bajar)

  function nombreDe(v) {
    if (NOMBRES[v]) return NOMBRES[v];
    var s = String(v).replace(/-/g, ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function obraCorta(subId) {
    if (OBRA_CORTA[subId]) return OBRA_CORTA[subId];
    var s = SUBPROYECTOS[subId];
    return s ? s.titulo : subId;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }
  function norm(s) {
    s = String(s == null ? '' : s).toLowerCase();
    return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s;
  }
  function rgbCss(a, alfa) {
    return 'rgba(' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ',' + (alfa == null ? 1 : alfa) + ')';
  }
  function esMovil() { return window.matchMedia('(max-width: 860px)').matches; }
  function $(id) { return document.getElementById(id); }

  /* ── Grupos de filtros secundarios ── */
  var GRUPOS = [
    { id: 'obra', titulo: 'Obra / grupo',
      valores: function (c) { return [c.sub]; }, nombre: obraCorta,
      color: function (v) { return SUB_RGB[v]; } },
    { id: 'nicho', titulo: 'Nicho somato-poético',
      valores: function (c) { return c.temas || []; }, nombre: nombreDe, orden: NICHO_ORDEN },
    { id: 'practica', titulo: 'Práctica emergente',
      valores: function (c) { return c.practicas || []; }, nombre: nombreDe },
    { id: 'estado', titulo: 'Estado',
      valores: function (c) { return c.estado ? [c.estado] : []; }, nombre: nombreDe }
  ];

  /* ── Estado único de filtros ── */
  var st = {
    q: '', terminos: [],
    tiposOff: {},                                   // categorías apagadas
    sel: { obra: {}, nicho: {}, practica: {}, estado: {} },
    modo: 'cuadricula',                             // 'cuadricula' | 'lista'
    orden: { campo: null, dir: 1 },
    ultima: 'mapa',                                 // última vista del explorador
    color: 'obra',                                  // color de los nodos del rizoma: 'obra' | 'tipo'
    pintados: 0
  };
  var tipos = [];        // tipos reales presentes en el catálogo
  var visibles = [];     // registros que pasan los filtros
  var observador = null;

  function nSel(gid) { return Object.keys(st.sel[gid]).length; }

  function pasa(c, omitir) {
    if (omitir !== 'tipo' && st.tiposOff[c.tipo]) return false;
    for (var i = 0; i < st.terminos.length; i++) {
      if (c._busq.indexOf(st.terminos[i]) === -1) return false;
    }
    for (var g = 0; g < GRUPOS.length; g++) {
      var G = GRUPOS[g];
      if (G.id === omitir || !nSel(G.id)) continue;
      var vals = G.valores(c), ok = false;
      for (var k = 0; k < vals.length; k++) { if (st.sel[G.id][vals[k]]) { ok = true; break; } }
      if (!ok) return false;
    }
    return true;
  }
  function hayFiltros() {
    if (st.terminos.length || Object.keys(st.tiposOff).length) return true;
    for (var g = 0; g < GRUPOS.length; g++) if (nSel(GRUPOS[g].id)) return true;
    return false;
  }

  /* ── Preparación: índice de búsqueda, tipos y opciones ── */
  function preparar() {
    var vistos = {};
    CONTENIDOS.forEach(function (c) {
      var sub = SUBPROYECTOS[c.sub] || {};
      c._busq = norm([c.id, c.titulo, c.desc, (c.tags || []).join(' '), (c.temas || []).join(' '),
        (c.practicas || []).join(' '), sub.titulo, sub.grupo, c.tipo].join(' '));
      c._visible = true;
      if (!vistos[c.tipo]) { vistos[c.tipo] = true; tipos.push(c.tipo); }
    });
    // orden de categorías: de la más numerosa a la menos
    tipos.sort(function (a, b) { return contarTipo(b, true) - contarTipo(a, true); });
    GRUPOS.forEach(function (G) {
      var set = {};
      CONTENIDOS.forEach(function (c) { G.valores(c).forEach(function (v) { set[v] = true; }); });
      var ops = Object.keys(set);
      ops.sort(function (a, b) {
        if (G.orden) {
          var ia = G.orden.indexOf(a), ib = G.orden.indexOf(b);
          if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        }
        return a < b ? -1 : 1;
      });
      G.opciones = ops;
    });
  }
  function contarTipo(tipo, total) {
    var n = 0;
    CONTENIDOS.forEach(function (c) { if (c.tipo === tipo && (total || pasa(c, 'tipo'))) n++; });
    return n;
  }
  function contarOpcion(G, v) {
    var n = 0;
    CONTENIDOS.forEach(function (c) { if (G.valores(c).indexOf(v) !== -1 && pasa(c, G.id)) n++; });
    return n;
  }

  /* ══════════════════════════════════════════
     PANEL
  ══════════════════════════════════════════ */
  function construirPanel() {
    // Categorías
    $('exp-cats').innerHTML = tipos.map(function (t) {
      var cat = categoriaDe(t);
      return '<button class="exp-cat" data-tipo="' + esc(t) + '" style="--cat:' + rgbCss(cat.rgb) + '" aria-pressed="true">' +
        '<span class="exp-cat-mini" data-mini="' + esc(t) + '"></span>' +
        '<span class="exp-cat-nom">' + esc(cat.plural) + '</span>' +
        '<span class="exp-cat-n"></span>' +
        '<span class="exp-cat-luz" aria-hidden="true"></span>' +
      '</button>';
    }).join('');

    // Filtros secundarios plegables
    $('exp-filtros').innerHTML = GRUPOS.map(function (G) {
      return '<details class="exp-filtro" data-grupo="' + G.id + '">' +
        '<summary><span>' + esc(G.titulo) + '</span><span class="exp-filtro-n"></span></summary>' +
        '<div class="exp-chips">' + G.opciones.map(function (v) {
          var col = G.color && G.color(v);
          return '<button class="exp-chip" data-grupo="' + G.id + '" data-valor="' + esc(v) + '"' +
            (col ? ' style="--chip:' + rgbCss(col) + '"' : '') + '>' +
            (col ? '<span class="exp-chip-punto"></span>' : '') +
            '<span>' + esc(G.nombre(v)) + '</span><span class="exp-chip-n"></span></button>';
        }).join('') + '</div></details>';
    }).join('');

    // Color de los nodos del rizoma: por obra (identidad actual) o por categoría
    $('exp-extra').innerHTML = '<div class="exp-rotulo">Color de los nodos</div>' +
      '<div class="exp-color" id="exp-color"><button data-color="obra">por obra</button>' +
      '<button data-color="tipo">por categoría</button></div>';
    $('exp-color').addEventListener('click', function (e) {
      var b = e.target.closest('[data-color]');
      if (b) { st.color = b.dataset.color; refrescarPanel(); }
    });

    // Eventos
    $('exp-vistas').addEventListener('click', function (e) {
      var b = e.target.closest('[data-exp-vista]');
      if (!b || b.disabled) return;
      irA(b.dataset.expVista);
      if (esMovil()) document.body.classList.remove('exp-abierto');
    });
    var q = $('exp-q');
    q.addEventListener('input', function () { fijarBusqueda(q.value); });
    $('exp-q-x').addEventListener('click', function () { q.value = ''; fijarBusqueda(''); q.focus(); });
    $('exp-cats').addEventListener('click', function (e) {
      var b = e.target.closest('.exp-cat');
      if (b) alternarTipo(b.dataset.tipo);
    });
    $('exp-cat-todas').addEventListener('click', function () { st.tiposOff = {}; aplicar(); });
    $('exp-filtros').addEventListener('click', function (e) {
      var b = e.target.closest('.exp-chip');
      if (b) alternarOpcion(b.dataset.grupo, b.dataset.valor);
    });
    $('exp-limpiar').addEventListener('click', limpiar);
    $('exp-tirador').addEventListener('click', function () {
      if (esMovil()) document.body.classList.toggle('exp-abierto');
      else { document.body.classList.toggle('exp-plegado'); avisarLayout(); }
      rotuloTirador();
    });
    $('exp-velo').addEventListener('click', function () { document.body.classList.remove('exp-abierto'); rotuloTirador(); });
    window.addEventListener('resize', rotuloTirador);
  }

  function rotuloTirador() {
    var t = $('exp-tirador'); if (!t) return;
    var plegado = document.body.classList.contains('exp-plegado');
    var abierto = document.body.classList.contains('exp-abierto');
    var n = hayFiltros() ? ' · ' + visibles.length : '';
    if (esMovil()) t.innerHTML = abierto ? '✕ cerrar' : '☰ explorar' + n;
    else t.innerHTML = plegado ? '› explorar' + n : '‹ plegar';
  }
  function avisarLayout() { window.dispatchEvent(new Event('exp-layout')); }

  function refrescarPanel() {
    document.querySelectorAll('#exp-cats .exp-cat').forEach(function (b) {
      var t = b.dataset.tipo, on = !st.tiposOff[t];
      b.classList.toggle('off', !on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.querySelector('.exp-cat-n').textContent = contarTipo(t);
    });
    $('exp-cat-todas').style.visibility = Object.keys(st.tiposOff).length ? 'visible' : 'hidden';
    GRUPOS.forEach(function (G) {
      var det = document.querySelector('.exp-filtro[data-grupo="' + G.id + '"]');
      var n = nSel(G.id);
      det.querySelector('.exp-filtro-n').textContent = n ? n + ' activo' + (n > 1 ? 's' : '') : '';
      det.querySelectorAll('.exp-chip').forEach(function (b) {
        var v = b.dataset.valor, cnt = contarOpcion(G, v), act = !!st.sel[G.id][v];
        b.classList.toggle('on', act);
        b.classList.toggle('vacio', !cnt && !act);
        b.querySelector('.exp-chip-n').textContent = cnt;
      });
    });
    $('exp-conteo').textContent = visibles.length;
    $('exp-conteo-rotulo').innerHTML = (visibles.length === 1 ? 'archivo visible' : 'archivos visibles') +
      '<br>de ' + CONTENIDOS.length;
    $('exp-limpiar').style.visibility = hayFiltros() ? 'visible' : 'hidden';
    $('exp-q-x').style.visibility = st.q ? 'visible' : 'hidden';
    var modoVista = (typeof vistaActual !== 'undefined' && vistaActual === 'archivo')
      ? (st.modo === 'lista' ? 'lista' : 'archivo') : 'rizoma';
    document.querySelectorAll('#exp-vistas [data-exp-vista]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.expVista === modoVista);
    });
    document.querySelectorAll('#exp-color [data-color]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.color === st.color);
    });
    document.body.classList.toggle('exp-rizoma', modoVista === 'rizoma');
    rotuloTirador();
  }

  /* ── Acciones sobre el estado ── */
  function fijarBusqueda(texto) {
    st.q = texto;
    st.terminos = norm(texto).split(/\s+/).filter(Boolean);
    aplicar();
  }
  function alternarTipo(t) {
    if (st.tiposOff[t]) delete st.tiposOff[t]; else st.tiposOff[t] = true;
    aplicar();
  }
  // Tarjetas grandes del archivo: «solo esta categoría»; al repetir, vuelven todas
  function soloTipo(t) {
    var apagadas = Object.keys(st.tiposOff).length;
    var yaSola = !st.tiposOff[t] && apagadas === tipos.length - 1;
    st.tiposOff = {};
    if (!yaSola) tipos.forEach(function (x) { if (x !== t) st.tiposOff[x] = true; });
    aplicar();
  }
  function alternarOpcion(gid, v) {
    if (st.sel[gid][v]) delete st.sel[gid][v]; else st.sel[gid][v] = true;
    aplicar();
  }
  function soloObra(subId) {
    limpiar(true);
    st.sel.obra[subId] = true;
    var det = document.querySelector('.exp-filtro[data-grupo="obra"]');
    if (det) det.open = true;
    aplicar();
  }
  function limpiar(silencio) {
    st.q = ''; st.terminos = []; st.tiposOff = {};
    GRUPOS.forEach(function (G) { st.sel[G.id] = {}; });
    var q = $('exp-q'); if (q) q.value = '';
    if (silencio !== true) aplicar();
  }

  /* ── Aplicar: recalcula visibles y repinta lo que esté a la vista ── */
  function aplicar() {
    visibles = [];
    CONTENIDOS.forEach(function (c) {
      c._visible = pasa(c);
      if (c._visible) visibles.push(c);
    });
    refrescarPanel();
    if (typeof vistaActual !== 'undefined' && vistaActual === 'archivo') pintarArchivo();
  }

  /* ══════════════════════════════════════════
     VISTAS · ARCHIVO (cuadrícula) y LISTA
  ══════════════════════════════════════════ */
  function ordenados() {
    var o = st.orden;
    if (!o.campo) return visibles;
    var clave = {
      id: function (c) { return c.id; },
      titulo: function (c) { return norm(c.titulo); },
      tipo: function (c) { return c.tipo; },
      obra: function (c) { return c.sub; },
      fecha: function (c) { return /^\d{4}/.test(c.fecha || '') ? c.fecha : '9999'; }
    }[o.campo];
    return visibles.slice().sort(function (a, b) {
      var x = clave(a), y = clave(b);
      return (x < y ? -1 : x > y ? 1 : 0) * o.dir;
    });
  }

  function etiquetaConteo(c) {
    if (c.esSerie && c.conteo) return c.conteo;
    return '';
  }

  /* ── Miniaturas ──────────────────────────────────────────────────
     Orden de preferencia:
       1. c.thumb  → miniatura elegida a mano en el catálogo
       2. video de YouTube → su carátula
       3. primera imagen de la galería en Cloudinary (recortada a 480×320, liviana)
       4. sin imagen → portada diseñada (color de la categoría + título)
     Si una imagen falla al cargar, queda a la vista la portada diseñada.
  ──────────────────────────────────────────────────────────────── */
  var NUBE = 'https://res.cloudinary.com/dt6cvonyy/';
  var RECORTE = 'c_fill,w_480,h_320,q_auto,f_auto/';
  function ytDe(c) {
    if (c.youtubeId) return c.youtubeId;
    var m = /^youtube:([\w-]{6,})$/.exec(c.archivo || '');
    return (m && m[1] !== 'pendiente') ? m[1] : '';
  }
  function urlNube(archivo, recorte) {
    var pid = archivo.replace(/\.(webp|jpg|jpeg|png|mp4|mov|avi)$/i, '');
    if (esVideo(archivo)) return encodeURI(NUBE + 'video/upload/' + recorte + pid + '.jpg');
    var conExt = /\.(webp|jpg|jpeg|png)$/i.test(archivo);
    return encodeURI(NUBE + 'image/upload/' + recorte + (conExt ? pid : pid + '.jpg'));
  }
  function miniaturaUrl(c, recorte) {
    recorte = recorte || RECORTE;
    if (c.thumb) return /^https?:/.test(c.thumb) ? c.thumb : urlNube(c.thumb, recorte);
    var yt = ytDe(c);
    if (yt) return 'https://img.youtube.com/vi/' + yt + '/hqdefault.jpg';
    var fs = c.cloudinaryFiles || [];
    if (fs.length) {
      for (var i = 0; i < fs.length; i++) if (!esVideo(fs[i])) return urlNube(fs[i], recorte);
      return urlNube(fs[0], recorte);
    }
    return '';
  }
  function imgHTML(c, cls) {
    var url = miniaturaUrl(c);
    if (!url) return '';
    return '<img class="' + cls + (ytDe(c) && !c.thumb ? ' es-yt' : '') + '" src="' + esc(url) +
      '" alt="" loading="lazy" decoding="async" onerror="this.remove()">';
  }
  // Para el rótulo del rizoma
  function miniaturaHTML(c) { return imgHTML(c, 'rz-img'); }

  function portadaHTML(c) {
    // Portada diseñada: color de la categoría + título en itálica
    return '<div class="arc-portada"><span class="arc-portada-tipo">' + esc(categoriaDe(c.tipo).nombre) + '</span>' +
      '<span class="arc-portada-tit">' + esc(c.titulo) + '</span></div>';
  }
  function thumbHTML(c) {
    var esVid = c.tipo === 'video';
    return portadaHTML(c) + imgHTML(c, 'arc-img') + (esVid ? '<span class="arc-play" aria-hidden="true"></span>' : '');
  }

  function tarjetaHTML(c) {
    var cat = categoriaDe(c.tipo), n = etiquetaConteo(c);
    return '<article class="arc-card" data-id="' + esc(c.id) + '" tabindex="0" style="--cat:' + rgbCss(cat.rgb) + '">' +
      '<div class="arc-thumb">' + thumbHTML(c) + (n ? '<span class="arc-n">' + esc(n) + '</span>' : '') + '</div>' +
      '<div class="arc-pie"><span class="arc-cod">' + esc(c.id) + '</span>' +
      '<h3 class="arc-tit">' + esc(c.titulo) + '</h3></div>' +
      '<div class="arc-meta">' + esc(cat.nombre) + ' · ' + esc(obraCorta(c.sub)) + '</div>' +
    '</article>';
  }

  var COLS = [
    { campo: 'id', rotulo: 'Código' }, { campo: 'titulo', rotulo: 'Título' }, { campo: 'tipo', rotulo: 'Tipo' },
    { campo: 'obra', rotulo: 'Obra / grupo', cls: 'col-obra' }, { campo: 'fecha', rotulo: 'Fecha', cls: 'col-fecha' },
    { campo: null, rotulo: 'Nichos', cls: 'col-nichos' }, { campo: null, rotulo: 'Estado', cls: 'col-estado' }
  ];
  function cabeceraListaHTML() {
    return '<div class="lst-fila lst-cab">' + COLS.map(function (col) {
      var act = col.campo && st.orden.campo === col.campo;
      return '<div class="lst-celda ' + (col.cls || '') + '">' + (col.campo
        ? '<button class="lst-orden' + (act ? ' on' : '') + '" data-orden="' + col.campo + '">' + col.rotulo +
          '<span>' + (act ? (st.orden.dir > 0 ? '↑' : '↓') : '') + '</span></button>'
        : col.rotulo) + '</div>';
    }).join('') + '</div>';
  }
  function filaHTML(c) {
    var cat = categoriaDe(c.tipo);
    return '<div class="lst-fila" data-id="' + esc(c.id) + '" tabindex="0" style="--cat:' + rgbCss(cat.rgb) + '">' +
      '<div class="lst-celda lst-cod">' + esc(c.id) + '</div>' +
      '<div class="lst-celda lst-tit">' + esc(c.titulo) + (etiquetaConteo(c) ? ' <span class="lst-n">' + esc(etiquetaConteo(c)) + '</span>' : '') + '</div>' +
      '<div class="lst-celda lst-tipo"><span class="lst-punto"></span>' + esc(cat.nombre) + '</div>' +
      '<div class="lst-celda col-obra">' + esc(obraCorta(c.sub)) + '</div>' +
      '<div class="lst-celda col-fecha">' + esc(c.fecha && c.fecha !== '—' ? c.fecha : '') + '</div>' +
      '<div class="lst-celda col-nichos">' + esc((c.temas || []).map(nombreDe).join(' · ')) + '</div>' +
      '<div class="lst-celda col-estado">' + esc(c.estado ? nombreDe(c.estado) : '') + '</div>' +
    '</div>';
  }

  function activosHTML() {
    var chips = [];
    if (st.q) chips.push('<button class="arc-activo" data-quitar="q">«' + esc(st.q) + '» ×</button>');
    Object.keys(st.tiposOff).forEach(function (t) {
      chips.push('<button class="arc-activo" data-quitar="tipo" data-valor="' + esc(t) + '">sin ' + esc(categoriaDe(t).plural.toLowerCase()) + ' ×</button>');
    });
    GRUPOS.forEach(function (G) {
      Object.keys(st.sel[G.id]).forEach(function (v) {
        chips.push('<button class="arc-activo" data-quitar="' + G.id + '" data-valor="' + esc(v) + '">' + esc(G.nombre(v)) + ' ×</button>');
      });
    });
    return chips.join('');
  }

  function pintarArchivo() {
    var grid = $('arc-grid'), lista = $('arc-lista');
    if (!grid) return;
    var esLista = st.modo === 'lista';
    grid.style.display = esLista ? 'none' : '';
    lista.style.display = esLista ? '' : 'none';
    grid.innerHTML = '';
    lista.innerHTML = esLista ? cabeceraListaHTML() : '';
    st.pintados = 0;
    $('conteo-num').textContent = visibles.length;
    $('conteo-total').textContent = CONTENIDOS.length;
    $('arc-modo-rotulo').textContent = esLista ? 'lista' : 'cuadrícula';
    $('arc-activos').innerHTML = activosHTML();
    $('arc-vacio').style.display = visibles.length ? 'none' : 'block';
    pintarCategorias();
    st._orden = ordenados();
    pintarLote();
  }
  // Imagen representativa de cada categoría: la del primer archivo que tenga miniatura
  var imgCategoria = {};
  function imagenDeCategoria(t) {
    if (t in imgCategoria) return imgCategoria[t];
    // entre los archivos de la categoría que tienen imagen, el de mayor peso en el catálogo
    var url = '', mejor = -1;
    CONTENIDOS.forEach(function (c) {
      if (c.tipo !== t) return;
      var u = miniaturaUrl(c);
      if (u && (c.peso || 0) > mejor) { mejor = c.peso || 0; url = u; }
    });
    return (imgCategoria[t] = url);
  }
  // Tarjetas grandes de categoría (arriba del archivo): miniatura, nombre y cantidad
  function pintarCategorias() {
    var cont = $('arc-categorias');
    if (!cont) return;
    var apagadas = Object.keys(st.tiposOff).length;
    cont.innerHTML = tipos.map(function (t) {
      var cat = categoriaDe(t), url = imagenDeCategoria(t), n = contarTipo(t);
      var off = !!st.tiposOff[t], sola = !off && apagadas === tipos.length - 1;
      return '<button class="cat-card' + (off ? ' off' : '') + (sola ? ' sola' : '') + '" data-solo-tipo="' + esc(t) +
        '" style="--cat:' + rgbCss(cat.rgb) + '" title="' + (sola ? 'Mostrar todas las categorías' : 'Ver solo ' + esc(cat.plural.toLowerCase())) + '">' +
        '<span class="cat-img"' + (url ? ' style="background-image:url(&quot;' + esc(url) + '&quot;)"' : '') + '></span>' +
        '<span class="cat-txt"><span class="cat-nom">' + esc(cat.plural) + '</span>' +
        '<span class="cat-n">' + n + (n === 1 ? ' archivo' : ' archivos') + '</span></span>' +
      '</button>';
    }).join('');
  }
  function pintarMinisPanel() {
    document.querySelectorAll('#exp-cats [data-mini]').forEach(function (el) {
      var url = imagenDeCategoria(el.dataset.mini);
      if (url) el.style.backgroundImage = 'url("' + url + '")';
    });
  }

  function pintarLote() {
    var arr = st._orden || [], hasta = Math.min(arr.length, st.pintados + LOTE);
    var html = '';
    for (var i = st.pintados; i < hasta; i++) html += (st.modo === 'lista' ? filaHTML(arr[i]) : tarjetaHTML(arr[i]));
    (st.modo === 'lista' ? $('arc-lista') : $('arc-grid')).insertAdjacentHTML('beforeend', html);
    st.pintados = hasta;
    $('arc-mas').style.display = st.pintados < arr.length ? 'block' : 'none';
  }

  function abrirPorId(id) {
    var c = CONTENIDOS.filter(function (x) { return x.id === id; })[0];
    if (c) mostrarNodo(c);
  }

  function construirArchivo() {
    var vista = $('vista-archivo');
    vista.addEventListener('click', function (e) {
      var q = e.target.closest('[data-quitar]');
      if (q) {
        var g = q.dataset.quitar, v = q.dataset.valor;
        if (g === 'q') { $('exp-q').value = ''; fijarBusqueda(''); }
        else if (g === 'tipo') alternarTipo(v);
        else alternarOpcion(g, v);
        return;
      }
      var o = e.target.closest('[data-orden]');
      if (o) {
        var campo = o.dataset.orden;
        if (st.orden.campo === campo) { if (st.orden.dir === 1) st.orden.dir = -1; else st.orden = { campo: null, dir: 1 }; }
        else st.orden = { campo: campo, dir: 1 };
        pintarArchivo();
        return;
      }
      var cat = e.target.closest('[data-solo-tipo]');
      if (cat) { soloTipo(cat.dataset.soloTipo); return; }
      if (e.target.closest('#arc-limpiar')) { limpiar(); return; }
      if (e.target.closest('#arc-mas')) { pintarLote(); return; }
      var it = e.target.closest('.arc-card, .lst-fila[data-id]');
      if (it) abrirPorId(it.dataset.id);
    });
    vista.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var it = e.target.closest('.arc-card, .lst-fila[data-id]');
      if (it) abrirPorId(it.dataset.id);
    });
    // Al acercarse al final, pintar el siguiente lote
    if ('IntersectionObserver' in window) {
      observador = new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting && st.pintados < (st._orden || []).length) pintarLote();
      }, { root: vista, rootMargin: '600px' });
      observador.observe($('arc-mas'));
    }
  }

  // Desde el rizoma: mostrar una tarjeta concreta en el archivo
  function revelarTarjeta(id) {
    var c = CONTENIDOS.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    if (!c._visible) limpiar(true);
    st.modo = 'cuadricula';
    aplicar();
    mostrarVista('archivo');
    var pos = (st._orden || []).indexOf(c);
    while (st.pintados <= pos && st.pintados < st._orden.length) pintarLote();
    setTimeout(function () {
      var card = document.querySelector('.arc-card[data-id="' + id + '"]');
      if (!card) return;
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('senalada');
      setTimeout(function () { card.classList.remove('senalada'); }, 2400);
    }, 450);
  }

  /* ── Cambio de vista ── */
  function irA(cual) {
    if (cual === 'rizoma') { mostrarVista('mapa'); return; }
    st.modo = cual === 'lista' ? 'lista' : 'cuadricula';
    if (vistaActual === 'archivo') { pintarArchivo(); refrescarPanel(); $('vista-archivo').scrollTop = 0; }
    else mostrarVista('archivo');
  }
  // La llama mostrarVista() cada vez que cambia la vista
  function alCambiarVista(nombre) {
    var enExp = nombre === 'mapa' || nombre === 'archivo';
    document.body.classList.toggle('exp-on', enExp);
    document.body.classList.remove('exp-abierto');
    if (enExp) st.ultima = nombre;
    var rot = st.ultima === 'archivo' ? '← Volver al archivo' : '← Volver al rizoma';
    document.querySelectorAll('[data-back]').forEach(function (b) { b.textContent = rot; });
    refrescarPanel();
    avisarLayout();
  }

  /* ── Arranque ── */
  preparar();
  construirPanel();
  construirArchivo();
  pintarMinisPanel();
  aplicar();

  return {
    st: st, pasa: pasa, aplicar: aplicar, limpiar: limpiar, irA: irA,
    soloObra: soloObra, soloTipo: soloTipo, alternarTipo: alternarTipo,
    pintarArchivo: pintarArchivo, alCambiarVista: alCambiarVista, revelarTarjeta: revelarTarjeta,
    obraCorta: obraCorta, nombreDe: nombreDe, esc: esc, miniaturaUrl: miniaturaUrl, miniaturaHTML: miniaturaHTML, rgbCss: rgbCss, esMovil: esMovil,
    visibles: function () { return visibles; }, tipos: function () { return tipos; }
  };
})();
