/* ══════════════════════════════════════════
   Los datos del catálogo (SUBPROYECTOS, ARCHIVOS, CONEXIONES_*)
   viven en data/catalogo.js
══════════════════════════════════════════ */

// ─── CATEGORÍAS · un color propio por tipo de archivo ─────────────────────
// Se muestran en el panel, las tarjetas, la lista y (opcional) los nodos.
// Solo aparecen en pantalla las que existan de verdad en el catálogo.
// Para un tipo nuevo basta agregar aquí su nombre y color.
var CATEGORIAS = {
  foto:      { nombre: 'Fotografía', plural: 'Fotografías', rgb: [237, 125,  58] },  // ocre
  video:     { nombre: 'Video',      plural: 'Videos',      rgb: [242, 204, 107] },  // willow
  texto:     { nombre: 'Texto',      plural: 'Textos',      rgb: [ 47, 191, 113] },  // verde
  hoja:      { nombre: 'Tabla',      plural: 'Tablas',      rgb: [190, 184, 172] },
  audio:     { nombre: 'Audio',      plural: 'Audios',      rgb: [100, 180, 230] },
  documento: { nombre: 'Documento',  plural: 'Documentos',  rgb: [220,  80,  90] },
  dibujo:    { nombre: 'Dibujo',     plural: 'Dibujos',     rgb: [229, 181,  59] }
};
function categoriaDe(tipo) {
  if (CATEGORIAS[tipo]) return CATEGORIAS[tipo];
  var n = String(tipo || 'archivo');
  n = n.charAt(0).toUpperCase() + n.slice(1);
  return (CATEGORIAS[tipo] = { nombre: n, plural: n, rgb: [168, 163, 165] });
}

// Color base por subproyecto (grupo) — color por defecto de los nodos del rizoma
// I·Dramaturgias=pumpkin · II·Danzario=emerald · III·Aulide=watermelon · IV·Creación=willow · VI·Campo=azul suave
var SUB_RGB = {
  'SUB-01': [168, 163, 165],   // gestión — neutro
  'SUB-02': [237, 125,  58],   // Dramaturgias · pumpkin/naranja
  'SUB-03': [ 47, 210, 120],   // Arte Danzario · emerald/verde vibrante
  'SUB-04': [220,  80,  90],   // Aulide · watermelon/rojo-rosa
  'SUB-05': [242, 210,  80],   // Creación Artística · willow/amarillo
  'SUB-06': [100, 180, 230]    // Salidas de campo · azul cielo
};
// Ambientales: tonos atenuados de la misma familia para que se lean como "atmósfera"
// pero con la misma temperatura cromática del sistema principal
var AMBIENT_RGB = [
  [180, 140,  50],  // Amarillo oscuro
  [180,  95,  70],  
  [ 47, 130,  85],  // verde oscuro
  [180, 140,  50],  // Amarillo oscuro
  [140, 135, 138],  
  [195, 110,  60]   
];

/* ══════════════════════════════════════════
   FUSIONAR ARCHIVOS → NODOS
══════════════════════════════════════════ */
var CONTENIDOS = [];
ARCHIVOS.forEach(function(a) {
  if (a.sub === 'SUB-01') return;  // gestión: no visible en plataforma
  var item = Object.assign({}, a);
  if (!item.tags) item.tags = [];
  if (!item.esSerie) item.esSerie = false;
  item.icono = iconoTipo(a.tipo);
  CONTENIDOS.push(item);
});

function iconoTipo(t) {
  return { texto:'T', video:'>', foto:'o', hoja:'#', plantilla:'■', dibujo:'*' }[t] || '·';
}

/* ══════════════════════════════════════════
   NAVEGACIÓN DE VISTAS
══════════════════════════════════════════ */
var vistaActual = 'mapa';

// ── Extensiones de video reconocidas en Cloudinary ────────────────
var VIDEO_EXT = ['mp4','mov','avi','webm','mkv','MP4','MOV','AVI','WEBM'];
function esVideo(fname) {
  var ext = fname.split('.').pop().toLowerCase();
  // Cloudinary también sube videos sin extensión visible — detectar por path
  var lower = fname.toLowerCase();
  return VIDEO_EXT.indexOf(ext) !== -1 ||
         lower.indexOf('.mov') !== -1 || lower.indexOf('.mp4') !== -1;
}

function renderGaleria(files, contenedor) {
  window._lbFolder = '';
  window._lbFiles  = files;
  var baseImg   = 'https://res.cloudinary.com/dt6cvonyy/image/upload/w_400,h_300,c_fill,q_auto/';
  var baseVideo = 'https://res.cloudinary.com/dt6cvonyy/video/upload/w_400,h_300,c_fill,q_auto/';
  var baseVideoFull = 'https://res.cloudinary.com/dt6cvonyy/video/upload/';

  var fotos  = files.filter(function(f) { return !esVideo(f); });
  var videos = files.filter(function(f) { return esVideo(f); });
  var total  = files.length;

  var html = '<div style="margin-top:8px;">';
  html += '<div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.14em;color:var(--musgo);text-transform:uppercase;margin-bottom:10px;">' +
    total + ' archivos · ' + fotos.length + ' fotos · ' + videos.length + ' videos · click para ampliar</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;">';

  files.forEach(function(fname, i) {
    // Quitar extensión del public_id para que Cloudinary maneje el formato
    var pid = fname.replace(/\.(webp|jpg|jpeg|png|mp4|mov|avi)$/i, '');
    if (esVideo(fname)) {
      var thumb = baseVideo + pid + '.jpg';
      html += '<div style="aspect-ratio:4/3;overflow:hidden;cursor:pointer;background:#000;position:relative;" ' +
        'onclick="LB.open(\'\', window._lbFiles, ' + i + ')">' +
        '<img src="' + thumb + '" style="width:100%;height:100%;object-fit:cover;opacity:0.8;" loading="lazy" ' +
        'onerror="this.style.display=\'none\'">' +
        '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">' +
        '<div style="width:32px;height:32px;border:2px solid rgba(236,230,220,0.6);border-radius:50%;display:flex;align-items:center;justify-content:center;">' +
        '<div style="width:0;height:0;border-top:8px solid transparent;border-bottom:8px solid transparent;border-left:12px solid rgba(236,230,220,0.8);margin-left:3px;"></div>' +
        '</div></div></div>';
    } else {
      // Si el public_id ya tiene extensión (.webp, .jpg) usarla; si no, pedir jpg
      var ext = fname.match(/\.(webp|jpg|jpeg|png)$/i);
      var imgUrl = ext ? baseImg + pid : baseImg + pid + '.jpg';
      html += '<div style="aspect-ratio:4/3;overflow:hidden;cursor:pointer;background:rgba(255,255,255,0.04);" ' +
        'onclick="LB.open(\'\', window._lbFiles, ' + i + ')">' +
        '<img src="' + imgUrl + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy" ' +
        'onerror="this.parentElement.style.display=\'none\'">' +
        '</div>';
    }
  });

  html += '</div></div>';
  contenedor.innerHTML = html;
}

// ── SEGUIR LA MARAÑA — algoritmo de navegación rizomática ─────────
var _maranaHistorial = [];   // IDs visitados en esta sesión
var _maranaActual    = null; // ID del nodo actual

function calcularAfinidad(a, b) {
  // a y b son objetos CONTENIDOS
  var score = 0;
  var pracA = a.practicas || [];
  var pracB = b.practicas || [];
  var temA  = a.temas || [];
  var temB  = b.temas || [];

  // Prácticas compartidas × 3
  pracA.forEach(function(p) { if (pracB.indexOf(p) !== -1) score += 3; });
  // Nichos compartidos × 2
  temA.forEach(function(t)  { if (temB.indexOf(t) !== -1) score += 2; });
  // Distinto grupo × 1 (cruce entre SUBs)
  if (a.sub !== b.sub) score += 1;

  return score;
}

function seguirMarana() {
  if (!_maranaActual) return;

  var actual = CONTENIDOS.filter(function(c) { return c.id === _maranaActual; })[0];
  if (!actual) return;

  // Candidatos: todos excepto el actual
  var candidatos = CONTENIDOS.filter(function(c) {
    return c.id !== _maranaActual && c.sub !== 'SUB-01';
  });

  // Si todos fueron visitados, resetear historial (menos el actual)
  var noVisitados = candidatos.filter(function(c) {
    return _maranaHistorial.indexOf(c.id) === -1;
  });
  if (noVisitados.length === 0) {
    _maranaHistorial = [_maranaActual];
    noVisitados = candidatos;
  }

  // Calcular scores y ordenar
  var scored = noVisitados.map(function(c) {
    return { cont: c, score: calcularAfinidad(actual, c) };
  });
  scored.sort(function(a, b) { return b.score - a.score; });

  // Tomar el top 5 y elegir uno al azar
  var pool = scored.slice(0, Math.min(5, scored.length));
  var elegido = pool[Math.floor(Math.random() * pool.length)];

  if (!elegido) return;

  // Registrar en historial
  _maranaHistorial.push(elegido.cont.id);

  // Mostrar hint de afinidad
  var hint = document.getElementById('marana-hint');
  if (hint) {
    var pracComp = (actual.practicas || []).filter(function(p) {
      return (elegido.cont.practicas || []).indexOf(p) !== -1;
    });
    var temComp = (actual.temas || []).filter(function(t) {
      return (elegido.cont.temas || []).indexOf(t) !== -1;
    });
    var razon = pracComp.length > 0 ? pracComp[0] : (temComp.length > 0 ? temComp[0] : 'deriva');
    hint.textContent = '↳ vía ' + razon + ' · ' + (_maranaHistorial.length - 1) + ' saltos';
  }

  // Navegar
  mostrarNodo(elegido.cont);
}

function mostrarVista(nombre) {
  document.getElementById('vista-mapa').style.display = nombre === 'mapa' ? 'block' : 'none';
  document.getElementById('panel').classList.remove('open');

  document.querySelectorAll('.vista-pagina').forEach(function(p) { p.classList.remove('visible'); });

  document.querySelectorAll('.nav-link').forEach(function(l) {
    l.classList.toggle('active', l.dataset.vista === nombre);
  });

  if (nombre === 'mapa') {
    document.getElementById('vista-mapa').style.display = 'block';
    document.getElementById('sello-institucional').style.display = 'block';
    document.getElementById('canvas-wrapper').style.pointerEvents = 'all';
    document.querySelector('nav').classList.remove('nav--pagina');
    document.getElementById('nav-toggle').classList.remove('nav--pagina');
    if (typeof sketch !== 'undefined' && sketch.loop) sketch.loop();
    vistaActual = 'mapa';
    if (window.EXP) EXP.alCambiarVista('mapa');
    return;
  }

  // Fuera del mapa: pausar p5 completamente y bloquear su canvas
  document.getElementById('canvas-wrapper').style.pointerEvents = 'none';
  // El archivo es parte del explorador: conserva el menú oscuro, igual que el rizoma
  document.querySelector('nav').classList.toggle('nav--pagina', nombre !== 'archivo');
  document.getElementById('nav-toggle').classList.toggle('nav--pagina', nombre !== 'archivo');
  if (typeof sketch !== 'undefined' && sketch.noLoop) sketch.noLoop();
  document.getElementById('sello-institucional').style.display = 'none';

  document.getElementById('vista-mapa').style.display = 'none';
  var el = document.getElementById('vista-' + nombre);
  if (el) {
    vistaActual = nombre;
    el.style.pointerEvents = 'all';
    el.setAttribute('tabindex', '-1');   // hace el div focusable
    requestAnimationFrame(function() {
      el.classList.add('visible');
      el.focus({ preventScroll: true }); // foco para recibir scroll de teclado
    });
  }
  if (window.EXP) {
    EXP.alCambiarVista(nombre);
    if (nombre === 'archivo') EXP.pintarArchivo();
  }
}

function mostrarNodo(cont) {
  // Registrar nodo actual para seguirMarana
  _maranaActual = cont.id;
  if (_maranaHistorial.indexOf(cont.id) === -1) {
    _maranaHistorial.push(cont.id);
  }

  document.getElementById('nodo-tipo').textContent = cont.tipo.toUpperCase();
  document.getElementById('nodo-tipo').className = 'panel-tipo tipo-' + cont.tipo;
  var sub = SUBPROYECTOS[cont.sub];
  document.getElementById('nodo-rama').innerHTML = (sub ? sub.titulo : cont.sub) + ' · ' + cont.id;
  document.getElementById('nodo-titulo').textContent = cont.titulo;
  document.getElementById('nodo-desc').textContent = cont.desc;
  document.getElementById('nodo-archivo-nombre').textContent = cont.archivo || '';

  var tagsEl = document.getElementById('nodo-tags');
  tagsEl.innerHTML = '';
  (cont.tags || []).forEach(function(t) {
    var sp = document.createElement('span');
    sp.className = 'panel-tag'; sp.textContent = '#' + t;
    tagsEl.appendChild(sp);
  });
  (cont.temas || []).forEach(function(t) {
    var sp = document.createElement('span');
    sp.className = 'panel-tag tema'; sp.textContent = '·' + t;
    tagsEl.appendChild(sp);
  });

  // Limpiar primero, mostrar vista, luego inyectar iframe
  var mediaEl = document.getElementById('nodo-media-wrapper');
  var cuerpoEl = document.getElementById('nodo-cuerpo-extra');
  mediaEl.innerHTML = '';
  cuerpoEl.innerHTML = '';

  mostrarVista('nodo');

  // setTimeout garantiza que el DOM ya está visible antes de crear el iframe
  var youtubeId = cont.youtubeId;
  setTimeout(function() {
    if (youtubeId) {
      mediaEl.innerHTML = '<div style="position:relative;width:100%;padding-bottom:56.25%;background:#000;border-radius:2px;overflow:hidden;">' +
        '<iframe style="position:absolute;inset:0;width:100%;height:100%;border:none;" ' +
        'src="https://www.youtube.com/embed/' + youtubeId + '?rel=0&modestbranding=1" ' +
        'allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div>';
    } else if (cont.driveEmbed) {
      mediaEl.innerHTML = '<div style="width:100%;height:600px;border:1px solid rgba(236,230,220,0.08);border-radius:2px;overflow:hidden;">' +
        '<iframe src="' + cont.driveEmbed + '" style="width:100%;height:100%;border:none;" allow="autoplay"></iframe></div>';
    } else if (cont.cloudinaryFolder && cont.cloudinaryFiles && cont.cloudinaryFiles.length > 0) {
      renderGaleria(cont.cloudinaryFiles, mediaEl);
    } else {
      mediaEl.innerHTML = '<div style="width:100%;aspect-ratio:16/9;' +
        'background:repeating-linear-gradient(45deg,rgba(236,230,220,0.02) 0 12px,rgba(236,230,220,0.04) 12px 13px);' +
        'border:1px dashed rgba(236,230,220,0.12);display:flex;align-items:center;justify-content:center;' +
        'font-family:var(--font-mono);font-size:11px;letter-spacing:0.14em;color:var(--text-dim);text-align:center;padding:24px;">' +
        '<div>[ contenido · pendiente de publicación ]<br><br>' +
        '<span style="font-style:italic;font-size:10px;">video · galería · pdf · repositorio · según tipo de archivo</span></div></div>';
      cuerpoEl.innerHTML = '<p>El catálogo registra este archivo y sus conexiones en el rizoma. El contenido se publicará en la segunda fase de deploy en la VM de la universidad.</p>';
    }
  }, 200);
}

document.querySelectorAll('.nav-link').forEach(function(a) {
  a.addEventListener('click', function(e) { e.preventDefault(); mostrarVista(this.dataset.vista); });
});
document.getElementById('nav-home').addEventListener('click', function() { mostrarVista('mapa'); });
document.querySelectorAll('[data-back]').forEach(function(btn) {
  // vuelve a la última vista del explorador (rizoma o archivo)
  btn.addEventListener('click', function() { mostrarVista(window.EXP ? EXP.st.ultima : 'mapa'); });
});

/* ── Toggle nav ── */
document.getElementById('nav-toggle').addEventListener('click', function() {
  var hidden = document.body.classList.toggle('nav-hidden');
  document.getElementById('nav-toggle-label').textContent = hidden ? 'mostrar menú' : 'ocultar menú';
  // Calcular nuevo navH y disparar evento para que p5 redistribuya nodos
  var newNavH = hidden ? 0 : parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
  window.dispatchEvent(new CustomEvent('nav-toggled', { detail: { navH: newNavH } }));
  // Forzar reflow en vista-pagina visible para que recalcule su scroll height
  setTimeout(function() {
    var vistaVisible = document.querySelector('.vista-pagina.visible');
    if (vistaVisible) {
      vistaVisible.style.overflow = 'hidden';
      vistaVisible.offsetHeight; // trigger reflow
      vistaVisible.style.overflow = '';
    }
  }, 460); // después de que termine la transición del nav (0.45s)
});

/* El archivo (cuadrícula, lista y filtros) vive ahora en js/explorar.js */

// ── Navegación cruzada: mapa ↔ archivo ────────────────────────────
// Desde el panel del mapa → ir a la tarjeta en el archivo
function irAlArchivoDesdeMapa() {
  var nodeId = document.getElementById('panel-btn-archivo').dataset.nodeId;
  if (window.EXP) EXP.revelarTarjeta(nodeId);
}

// Desde una tarjeta del archivo → volver al mapa y abrir el panel del nodo
function irAlMapaDesdeArchivo(nodeId) {
  mostrarVista('mapa');
  setTimeout(function() {
    var nodo = nCont.find(function(n) { return n.cont.id === nodeId; });
    if (nodo) abrirPanel(nodo);
  }, 500);
}
/* ══════════════════════════════════════════
   PANEL NODO (en mapa)
══════════════════════════════════════════ */
var panel       = document.getElementById('panel');
var panelTipo   = document.getElementById('panel-tipo');
var panelRama   = document.getElementById('panel-rama');
var panelTitulo = document.getElementById('panel-titulo');
var panelArchivoNombre = document.getElementById('panel-archivo-nombre');
var panelMeta   = document.getElementById('panel-meta');
var panelDesc   = document.getElementById('panel-desc');
var panelTags   = document.getElementById('panel-tags');
var panelConexiones = document.getElementById('panel-conexiones');
var panelConexionesLista = document.getElementById('panel-conexiones-lista');
var panelLink   = document.getElementById('panel-link');
var hint        = document.getElementById('hint');
var nodeCountEl = document.getElementById('node-count');

var cursorRing  = document.getElementById('cursor-ring');
var cursorDot   = document.getElementById('cursor-dot');
var cursorH     = document.getElementById('cursor-h');
var cursorV     = document.getElementById('cursor-v');

var selectedNode = null;
var mouseAbsX = -999, mouseAbsY = -999, firstMove = false;
var targetX = -999, targetY = -999;
var cursorX = -999, cursorY = -999;

document.addEventListener('mousemove', function(e) {
  targetX = e.clientX; 
  targetY = e.clientY;
  mouseAbsX = e.clientX; 
  mouseAbsY = e.clientY;
  if (!firstMove) { 
    firstMove = true; 
    cursorX = targetX; // Se iguala para que no "vuele" desde fuera
    cursorY = targetY;
    setTimeout(function() { hint.classList.add('fade'); }, 4000); 
  }
});

function animarCursor() {
  if (firstMove) {
    cursorX += (targetX - cursorX) * 0.45;
    cursorY += (targetY - cursorY) * 0.45;
    
    cursorRing.style.left = cursorX + 'px';
    cursorRing.style.top  = cursorY + 'px';
    cursorDot.style.left  = cursorX + 'px';
    cursorDot.style.top   = cursorY + 'px';
    cursorH.style.left    = cursorX + 'px';
    cursorH.style.top     = cursorY + 'px';
    cursorV.style.left    = cursorX + 'px';
    cursorV.style.top     = cursorY + 'px';
  }
  requestAnimationFrame(animarCursor);
}
animarCursor();

document.getElementById('panel-close').addEventListener('click', function() {
  panel.classList.remove('open'); selectedNode = null;
  document.getElementById('panel-media').innerHTML = '';
});

function abrirPanel(n) {
  selectedNode = n;
  var c = n.cont;
  panelTipo.textContent = c.tipo.toUpperCase();
  panelTipo.className = 'panel-tipo tipo-' + c.tipo;
  var sub = SUBPROYECTOS[c.sub];
  panelRama.innerHTML = c.id + ' · Rama <span>' + (sub ? sub.titulo : c.sub) + '</span>';
  panelTitulo.textContent = c.titulo;
  panelArchivoNombre.textContent = c.archivo;

  panelMeta.innerHTML = '' +
    (c.tam && c.tam !== '—' ? '<dt>tamaño</dt><dd>' + c.tam + '</dd>' : '') +
    (c.fecha && c.fecha !== '—' ? '<dt>fecha</dt><dd>' + c.fecha + '</dd>' : '') +
    (c.esSerie ? '<dt>conteo</dt><dd>' + c.conteo + '</dd>' : '') +
    '<dt>estado</dt><dd>' + (c.estado || '—') + '</dd>';

  panelDesc.textContent = c.desc;

  panelTags.innerHTML = '';
  (c.tags || []).forEach(function(t) {
    var sp = document.createElement('span'); sp.className = 'panel-tag'; sp.textContent = '#' + t;
    panelTags.appendChild(sp);
  });
  (c.temas || []).forEach(function(t) {
    var sp = document.createElement('span'); sp.className = 'panel-tag tema'; sp.textContent = '·' + t;
    panelTags.appendChild(sp);
  });

  // Conexiones (si existen para este nodo)
  var conexs = CONEXIONES_TEXTO[c.id];
  if (conexs && conexs.length) {
    panelConexiones.style.display = 'block';
    panelConexionesLista.innerHTML = conexs.map(function(con) {
      return '<div class="panel-conexion"><strong>' + con.tipo + '</strong> → <em>' + con.destino + '</em><br>' + con.texto + '</div>';
    }).join('');
  } else {
    panelConexiones.style.display = 'none';
  }

  // Botón "ver en archivo" — siempre visible desde el mapa
  var btnArchivo = document.getElementById('panel-btn-archivo');
  btnArchivo.style.display = 'inline-flex';
  btnArchivo.dataset.nodeId = c.id;

  panel.classList.add('open');

  // YouTube embed o galería Cloudinary o placeholder
  var panelMedia = document.getElementById('panel-media');
  var panelLink = document.getElementById('panel-link');

  if (c.youtubeId) {
    panelLink.style.display = 'none';
    panelMedia.innerHTML = '<div style="position:relative;width:100%;padding-bottom:56.25%;background:#000;margin-top:8px;">' +
      '<iframe style="position:absolute;inset:0;width:100%;height:100%;border:none;" ' +
      'src="https://www.youtube.com/embed/' + c.youtubeId + '?rel=0&modestbranding=1" ' +
      'allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div>';

  } else if (c.cloudinaryFolder && c.cloudinaryFiles && c.cloudinaryFiles.length > 0) {
    panelLink.style.display = 'none';
    renderGaleria(c.cloudinaryFiles, panelMedia);

  } else {
    panelLink.style.display = '';
    panelMedia.innerHTML = '';
  }
}

/* ══════════════════════════════════════════
   p5.js — MAPA RIZOMÁTICO
══════════════════════════════════════════ */
var nCont = [];
var nAmb  = [];

/* ── RED DE RELACIONES ───────────────────────────────────────────
   Dos archivos se relacionan por lo que comparten: cada etiqueta, nicho o
   práctica en común suma 1 punto; pertenecer a la misma obra suma 1; una
   conexión curada a mano (CONEXIONES_VISUALES) suma 3.
   · Hay conexión cuando suman 2 puntos o más (o es curada).
   · grado[i]  = cuántas conexiones tiene el archivo → tamaño del nodo.
   · v (0–1)   = qué tan fuerte es la conexión → grosor, opacidad y velocidad.
   Se calcula una sola vez al cargar. Para que siga legible y fluido con
   cientos de archivos, se dibujan las 5 conexiones más fuertes de cada nodo
   (3 o 4 cuando el catálogo crece) y hasta 12 del nodo que se señala.
──────────────────────────────────────────────────────────────── */
function calcularRed(items) {
  var N = items.length, UMBRAL = 2, K_HOVER = 12;
  var K_BASE = N <= 80 ? 5 : (N <= 200 ? 4 : 3);   // menos trazos por nodo cuando hay muchos
  var pos = {}, grupos = {}, pares = {}, curadas = {};
  items.forEach(function(c, i) { pos[c.id] = i; });
  function anotar(clave, i) { (grupos[clave] || (grupos[clave] = [])).push(i); }
  items.forEach(function(c, i) {
    (c.tags || []).forEach(function(t) { anotar('e:' + t, i); });
    (c.temas || []).forEach(function(t) { anotar('n:' + t, i); });
    (c.practicas || []).forEach(function(t) { anotar('p:' + t, i); });
    anotar('o:' + c.sub, i);
  });
  function sumar(i, j, w) {
    if (i === j) return;
    var k = Math.min(i, j) * N + Math.max(i, j);
    pares[k] = (pares[k] || 0) + w;
    return k;
  }
  Object.keys(grupos).forEach(function(clave) {
    var m = grupos[clave];
    for (var a = 0; a < m.length; a++) for (var b = a + 1; b < m.length; b++) sumar(m[a], m[b], 1);
  });
  (typeof CONEXIONES_VISUALES !== 'undefined' ? CONEXIONES_VISUALES : []).forEach(function(par) {
    if (pos[par[0]] === undefined || pos[par[1]] === undefined) return;
    curadas[sumar(pos[par[0]], pos[par[1]], 3)] = true;
  });

  var grado = [], porNodo = [], i;
  for (i = 0; i < N; i++) { grado.push(0); porNodo.push([]); }
  Object.keys(pares).forEach(function(k) {
    var w = pares[k];
    if (w < UMBRAL && !curadas[k]) return;
    var a = Math.floor(k / N), b = k % N;
    var e = { a: a, b: b, w: w, cur: !!curadas[k], base: false, v: 0,
              seed: a * 31 + b * 17, off: 0, dir: ((a + b) % 3 === 0) ? -1 : 1 };
    grado[a]++; grado[b]++;
    porNodo[a].push(e); porNodo[b].push(e);
  });
  var wMin = Infinity, wMax = 0, aristas = [], vistas = {};
  porNodo.forEach(function(lista) {
    lista.sort(function(x, y) { return y.w - x.w; });
    for (var q = 0; q < lista.length && q < K_BASE; q++) lista[q].base = true;
    if (lista.length > K_HOVER) lista.length = K_HOVER;
  });
  porNodo.forEach(function(lista) {
    lista.forEach(function(e) {
      var k = e.a * N + e.b;
      if (vistas[k]) return;
      vistas[k] = true;
      if (e.base) aristas.push(e);
      if (e.w < wMin) wMin = e.w;
      if (e.w > wMax) wMax = e.w;
    });
  });
  porNodo.forEach(function(lista) {
    lista.forEach(function(e) { e.v = wMax > wMin ? (e.w - wMin) / (wMax - wMin) : 0.5; });
  });
  var vecinos = porNodo.map(function(lista, idx) {
    var m = {};
    lista.forEach(function(e) { m[e.a === idx ? e.b : e.a] = true; });
    return m;
  });
  var gMin = Math.min.apply(null, grado.length ? grado : [0]);
  var gMax = Math.max.apply(null, grado.length ? grado : [0]);
  return { aristas: aristas, porNodo: porNodo, vecinos: vecinos, grado: grado, gMin: gMin, gMax: gMax };
}
var RED = calcularRed(CONTENIDOS);
var navH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));

var sketch = new p5(function(p) {
  var RADIO    = 130;   // v16: lupa más pequeña e íntima (195→130)
  var MAX_CON  = 260;   // rango de conexión: se mantiene alto (más conexiones visibles)
  var SOFT     = 60;

  // ── PLANO FOCAL DE PROFUNDIDAD ─────────────────────────────────
  // Cada nodo tiene n.z en [-1, 1]. focalZ es el "plano" del observador.
  // Los nodos cerca de focalZ se ven plenos; los lejanos siguen visibles
  // pero tenues. El hover del cursor "atrae" un nodo hacia el plano focal.
  var focalZ = 0;
  var focalZTarget = 0;
  var DEPTH_RANGE = 0.7;    // ancho de la ventana de foco
  var DEPTH_FLOOR = 0.28;   // piso de visibilidad: nodos lejos no desaparecen
  var focalUIFadeFrames = 0;

  // depthFactor calcula visibilidad por profundidad. Cuando hoverBoost > 0,
  // el nodo "se acerca" virtualmente al plano focal (efecto de atracción).
  function depthFactor(nz, hoverBoost) {
    hoverBoost = hoverBoost || 0;
    var d = Math.abs(nz - focalZ);
    // hoverBoost reduce la distancia efectiva al plano focal
    d = d * (1 - hoverBoost * 0.85);
    if (d >= DEPTH_RANGE) return DEPTH_FLOOR * 0.6;  // muy lejos: tenue pero visible
    var t = 1 - (d / DEPTH_RANGE);
    var smooth = t * t * (3 - 2 * t);
    // mapeo: piso DEPTH_FLOOR cuando t=0, lleno 1.0 cuando t=1
    return DEPTH_FLOOR + (1 - DEPTH_FLOOR) * smooth;
  }

  // Área del rizoma: todo lo que deja libre el panel izquierdo y el menú inferior
  function areaRizoma() {
    var oculto = document.body.classList.contains('nav-hidden');
    navH = oculto ? 0 : (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0);
    var r = document.getElementById('vista-mapa').getBoundingClientRect();
    var w = Math.round(r.width);
    if (!w) {  // la app aún está oculta: estimar
      var panelW = window.matchMedia('(max-width: 860px)').matches ? 0 : 300;
      w = window.innerWidth - panelW;
    }
    return { w: Math.max(200, w), h: Math.max(200, window.innerHeight - navH) };
  }
  // Ajusta el lienzo y reubica los nodos en proporción
  function ajustarCanvas() {
    var a = areaRizoma();
    if (a.w === p.width && a.h === p.height) return;
    var sx = a.w / (p.width || a.w), sy = a.h / (p.height || a.h);
    p.resizeCanvas(a.w, a.h);
    nCont.concat(nAmb).forEach(function(n) {
      n.x *= sx; n.y *= sy;
      if (n.ax !== undefined) { n.ax *= sx; n.ay *= sy; }
    });
    ajustarDensidad();
  }
  var canvasEl = null;

  p.setup = function() {
    var a0 = areaRizoma();
    var c = p.createCanvas(a0.w, a0.h);
    c.parent('canvas-wrapper');
    p.colorMode(p.RGB);

    // p5.js registra su propio listener 'wheel' en el canvas con preventDefault.
    // Lo reemplazamos con uno pasivo que solo bloquea el scroll cuando estamos en el mapa.
    canvasEl = c.elt;
    canvasEl.addEventListener('wheel', function(e) {
      if (vistaActual !== 'mapa') {
        // Fuera del mapa: propagar el scroll a la vista de página visible
        var vistaVisible = document.querySelector('.vista-pagina.visible');
        if (vistaVisible) vistaVisible.scrollTop += e.deltaY;
      }
    }, { passive: true });

    // Distribución inicial en grilla con jitter (semilla de la distribución por afinidad)
    var nTotal = CONTENIDOS.length;
    var cols = Math.ceil(Math.sqrt(nTotal * p.width / p.height));
    var rows = Math.ceil(nTotal / cols);
    var cellW = (p.width  - 160) / cols;
    var cellH = (p.height - 160) / rows;
    var idx = 0;

    CONTENIDOS.forEach(function(c) {
      var col = idx % cols;
      var row = Math.floor(idx / cols);
      var cx = 80 + cellW * (col + 0.5) + p.random(-cellW * 0.35, cellW * 0.35);
      var cy = 80 + cellH * (row + 0.5) + p.random(-cellH * 0.35, cellH * 0.35);

      // Tamaño según el número de relaciones (grado): de SIZE_MIN a SIZE_MAX
      var g = RED.grado[idx];
      var tG = RED.gMax > RED.gMin ? (g - RED.gMin) / (RED.gMax - RED.gMin) : 0.5;
      var rgbObra = SUB_RGB[c.sub] || categoriaDe(c.tipo).rgb;

      nCont.push({
        cont: c,
        gi: idx,                 // índice en RED
        grado: g,
        x: cx, y: cy,
        size0: SIZE_MIN + (SIZE_MAX - SIZE_MIN) * Math.pow(tG, 0.85),
        size: SIZE_MIN,
        ph: p.random(p.TWO_PI),
        z: p.random(-1, 1),
        rgbObra: rgbObra,                       // color por obra/grupo
        rgbTipo: categoriaDe(c.tipo).rgb,       // color por categoría
        rgb: rgbObra.slice(),                   // color en pantalla (transita entre ambos)
        fv: 1,                                  // 1 = pasa los filtros · 0 = apagado
        hk: 0,                                  // 1 = es el nodo señalado
        depth: 1, foco: 0, hb: 0, dM: 9999, sz: SIZE_MIN,
        wisps: []
      });
      idx++;
    });

    // Nodos ambientales — distribución totalmente aleatoria, son fondo
    for (var i = 0; i < 40; i++) {
      var rgb = AMBIENT_RGB[Math.floor(p.random(AMBIENT_RGB.length))];
      nAmb.push({
        x: p.random(p.width), y: p.random(p.height),
        size: p.random(3.9, 7.8),
        ph: p.random(p.TWO_PI),
        z: p.random(-1, 1),
        rgb: rgb,
        wisps: []
      });
    }
    ajustarDensidad();
    distribuir();
    nodeCountEl.textContent = nCont.length;

    canvasEl.addEventListener('mouseleave', function() { cursorEnLienzo = false; });
    canvasEl.addEventListener('mousemove',  function() { cursorEnLienzo = true; });
  };

  // ── Tamaños ─────────────────────────────────────────────────────
  var SIZE_MIN = 12, SIZE_MAX = 28;   // el cuerpo del nodo mide ≈ 1,6 × size
  var DENS = 1;                       // con muchos archivos, todo se reduce en proporción
  function ajustarDensidad() {
    var N = Math.max(1, nCont.length);
    DENS = p.constrain(Math.sqrt((p.width * p.height) / (N * 24000)), 0.5, 1);
    nCont.forEach(function(n) { n.size = n.size0 * DENS; });
  }

  // ── Distribución por afinidad ───────────────────────────────────
  // Los archivos relacionados quedan cerca (más cerca cuanto más comparten) y
  // todos se repelen para no encimarse. Se calcula una vez; después cada nodo
  // flota alrededor del lugar que le tocó.
  function distribuir() {
    var N = nCont.length;
    if (N < 2) return;
    var W = p.width, H = p.height;
    var mx = Math.min(90, W * 0.12), my = Math.min(80, H * 0.12);
    var L = Math.sqrt(((W - 2 * mx) * (H - 2 * my)) / N);   // separación ideal
    var iter = N > 250 ? 150 : 260;
    var fx = new Float32Array(N), fy = new Float32Array(N);
    var cx = W / 2, cy = H / 2;
    // cuántos resortes tira de cada nodo (para que los muy conectados no colapsen al centro)
    var tiros = new Float32Array(N);
    RED.aristas.forEach(function(e) { tiros[e.a]++; tiros[e.b]++; });
    for (var it = 0; it < iter; it++) {
      var temp = 1 - it / iter;
      for (var q = 0; q < N; q++) { fx[q] = 0; fy[q] = 0; }
      // repulsión
      for (var i = 0; i < N; i++) {
        var a = nCont[i];
        for (var j = i + 1; j < N; j++) {
          var b = nCont[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 0.01) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = dx * dx + dy * dy + 0.01; }
          var r = L * 1.1 + (a.size + b.size) * 0.8;
          if (d2 > r * r * 6.25) continue;
          var d = Math.sqrt(d2);
          var f = Math.min(L * 0.5, (r * r) / d2 * 2.2);
          fx[i] += dx / d * f; fy[i] += dy / d * f;
          fx[j] -= dx / d * f; fy[j] -= dy / d * f;
        }
      }
      // resortes: las conexiones fuertes acercan más
      for (var k = 0; k < RED.aristas.length; k++) {
        var e = RED.aristas[k], na = nCont[e.a], nb = nCont[e.b];
        var ex = nb.x - na.x, ey = nb.y - na.y;
        var ed = Math.sqrt(ex * ex + ey * ey) || 0.01;
        var objetivo = L * (1.9 - 0.9 * e.v) + (na.size + nb.size);
        var ef = (ed - objetivo) * (0.02 + 0.05 * e.v) / Math.sqrt(Math.max(1, Math.max(tiros[e.a], tiros[e.b]) - 2));
        fx[e.a] += ex / ed * ef; fy[e.a] += ey / ed * ef;
        fx[e.b] -= ex / ed * ef; fy[e.b] -= ey / ed * ef;
      }
      // gravedad suave + paso limitado (se enfría) + marco
      var paso = L * 0.45 * temp + 0.4;
      for (var m = 0; m < N; m++) {
        var n = nCont[m];
        fx[m] += (cx - n.x) * 0.0015; fy[m] += (cy - n.y) * 0.0015;
        var mag = Math.sqrt(fx[m] * fx[m] + fy[m] * fy[m]);
        if (mag > paso) { fx[m] *= paso / mag; fy[m] *= paso / mag; }
        n.x = Math.min(W - mx, Math.max(mx, n.x + fx[m]));
        n.y = Math.min(H - my, Math.max(my, n.y + fy[m]));
      }
    }
    // repaso final: separar los que quedaron encimados
    for (var pas = 0; pas < 24; pas++) {
      for (var i2 = 0; i2 < N; i2++) {
        var u = nCont[i2];
        for (var j2 = i2 + 1; j2 < N; j2++) {
          var w = nCont[j2];
          var ox = u.x - w.x, oy = u.y - w.y;
          var sep = (u.size + w.size) * 1.15 + 8;
          var od2 = ox * ox + oy * oy;
          if (od2 >= sep * sep) continue;
          var od = Math.sqrt(od2) || 0.01, emp = (sep - od) * 0.5;
          u.x += ox / od * emp; u.y += oy / od * emp;
          w.x -= ox / od * emp; w.y -= oy / od * emp;
        }
      }
      for (var c2 = 0; c2 < N; c2++) {
        var nn = nCont[c2];
        nn.x = Math.min(W - mx, Math.max(mx, nn.x));
        nn.y = Math.min(H - my, Math.max(my, nn.y));
      }
    }
    nCont.forEach(function(n) { n.ax = undefined; });   // reanclar el flotar en el nuevo lugar
  }

  // Easing tipo v10: la gota sale con impulso y frena cerca del destino
  function easeOutQuint(x) { return 1 - Math.pow(1 - x, 5); }

  function mkWisp(parentSize) {
    // Tamaño y alcance RELATIVOS al nodo madre (no fijos): así las gotas
    // son siempre proporcionales al nodo, no se ven enormes en uno chico
    // ni minúsculas en uno grande.
    var startD = parentSize * p.random(0.35, 0.75);
    var reach  = parentSize * p.random(1.2, 2.4);
    var ang    = p.random(p.TWO_PI);
    return {
      ox: 0, oy: 0,
      tx: p.cos(ang) * reach,
      ty: p.sin(ang) * reach,
      x: 0, y: 0,
      d: startD,
      d0: startD,
      t: 0,
      tEnd: p.floor(p.random(70, 180)),
      dead: false
    };
  }

  function updateWisp(w) {
    w.t++;
    if (w.t < w.tEnd) {
      var n = w.t / w.tEnd;
      var e = easeOutQuint(n);
      w.x = p.lerp(w.ox, w.tx, e);
      w.y = p.lerp(w.oy, w.ty, e);
      // Encoge linealmente — la gota se disuelve sin cambiar de forma
      w.d = p.lerp(w.d0, 0, n);
    } else {
      w.dead = true;
    }
  }

  // Puente metaball entre nodo madre y gota: dos arcos tangentes que se unen
  // formando una "gota" continua. Adaptado de Okazz, idéntico a v10.
  function aetherLinkVerts(x1, y1, d1, x2, y2, d2, dst) {
    var r  = dst / 2;
    var r1 = d1 / 2;
    var r2 = d2 / 2;
    var R1 = r1 + r;
    var R2 = r2 + r;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var d  = p.sqrt(dx*dx + dy*dy);
    if (d > R1 + R2) return false;
    if (d < 0.001) return false;
    var dirX = dx / d;
    var dirY = dy / d;
    var a = (R1*R1 - R2*R2 + d*d) / (2*d);
    var underRoot = R1*R1 - a*a;
    if (underRoot < 0) return false;
    var h = p.sqrt(underRoot);
    var midX = x1 + dirX * a;
    var midY = y1 + dirY * a;
    var perpX = -dirY * h;
    var perpY =  dirX * h;
    var cx1 = midX + perpX, cy1 = midY + perpY;
    var cx2 = midX - perpX, cy2 = midY - perpY;
    if (p.dist(cx1, cy1, cx2, cy2) < r * 2) return false;
    var ang1 = p.atan2(y1 - cy1, x1 - cx1);
    var ang2 = p.atan2(y2 - cy1, x2 - cx1);
    var ang3 = p.atan2(y2 - cy2, x2 - cx2);
    var ang4 = p.atan2(y1 - cy2, x1 - cx2);
    if (ang2 < ang1) ang2 += p.TWO_PI;
    if (ang4 < ang3) ang4 += p.TWO_PI;
    p.beginShape();
    for (var ia = ang1; ia < ang2; ia += p.TWO_PI / 90) {
      p.vertex(cx1 + r * p.cos(ia), cy1 + r * p.sin(ia));
    }
    for (var ib = ang3; ib < ang4; ib += p.TWO_PI / 90) {
      p.vertex(cx2 + r * p.cos(ib), cy2 + r * p.sin(ib));
    }
    p.endShape(p.CLOSE);
    return true;
  }

  p.draw = function() {
    // Background sólido (sin trail) — la lupa ya no deja rastro
    p.background(19, 19, 15);

    // Suavizar el plano focal hacia su target
    focalZ += (focalZTarget - focalZ) * 0.08;

    // Actualizar la posición visual del puntito del indicador
    // focalZ va de -1 (cerca) a 1 (lejos) → top va de 0% a 100%
    if (focalUIFadeFrames > 0) {
      var depthInd = document.getElementById('depth-indicator');
      if (depthInd && depthInd._ball === undefined) {
        depthInd._ball = depthInd.querySelector('::before');
      }
      // como ::before no es accesible vía JS, controlamos su top con CSS var
      if (depthInd) {
        var pct = ((focalZ + 1) / 2) * 100;
        depthInd.style.setProperty('--depth-pct', pct + '%');
      }
      focalUIFadeFrames--;
    }

    // ── FLOTAR PERPETUO (v16) ───────────────────────────────────────
    // Cada nodo flota muy lentamente alrededor de un punto de anclaje, con
    // una deriva basada en ruido Perlin que avanza con el tiempo y NUNCA se
    // detiene (a diferencia del drift v15 que decaía por damping). El efecto
    // es de objetos suspendidos en un medio denso: agua, aire, savia.
    //
    // El anclaje también deriva imperceptiblemente, así que la nube entera
    // respira y se reorganiza con lentitud a lo largo de minutos.
    var marginX = Math.min(90, p.width * 0.12), marginY = Math.min(90, p.height * 0.12);
    var maxX = p.width - marginX, maxY = p.height - marginY;
    var all = nCont.concat(nAmb);
    var tFloat = p.frameCount * 0.0016;   // reloj lento para el flotar
    var tAnchor = p.frameCount * 0.00018; // reloj aún más lento para el anclaje
    for (var i = 0; i < all.length; i++) {
      var n = all[i];

      // Inicializar anclaje y fase la primera vez
      if (n.ax === undefined) {
        n.ax = n.x; n.ay = n.y;
        n.floatPh = p.random(p.TWO_PI);          // fase oscilatoria propia
        n.floatSpd = 0.6 + p.random() * 0.9;     // velocidad de flotar propia
        n.floatAmp = 7 + p.random() * 11;        // amplitud propia (7-18 px)
        n.floatSeed = p.random(1000);            // semilla de ruido propia
      }

      // El anclaje deriva lentísimo por todo el lienzo (ruido muy lento).
      // Mantenido muy bajo: la nube se reorganiza a escala de minutos, no segundos.
      var anx = p.noise(n.floatSeed * 0.07, tAnchor);
      var any = p.noise(n.floatSeed * 0.07 + 50, tAnchor);
      n.ax += (anx - 0.5) * 0.05;
      n.ay += (any - 0.5) * 0.05;

      // Confinar el anclaje al marco (suave, directo)
      if (n.ax < marginX) n.ax += (marginX - n.ax) * 0.02;
      if (n.ax > maxX)    n.ax -= (n.ax - maxX) * 0.02;
      if (n.ay < marginY) n.ay += (marginY - n.ay) * 0.02;
      if (n.ay > maxY)    n.ay -= (n.ay - maxY) * 0.02;

      // Flotar alrededor del anclaje: combinación de oscilación senoidal
      // (respiración regular) + ruido Perlin (deriva orgánica irregular).
      // Las dos juntas dan un movimiento que nunca se siente mecánico ni se detiene.
      var oscX = p.cos(tFloat * n.floatSpd + n.floatPh);
      var oscY = p.sin(tFloat * n.floatSpd * 0.83 + n.floatPh * 1.3);
      var driftX = (p.noise(n.floatSeed + tFloat * 0.5,      100) - 0.5) * 2;
      var driftY = (p.noise(n.floatSeed + tFloat * 0.5 + 30, 200) - 0.5) * 2;

      // Posición = anclaje + flotar. Mezcla 55% oscilación / 45% ruido.
      var offX = (oscX * 0.55 + driftX * 0.45) * n.floatAmp;
      var offY = (oscY * 0.55 + driftY * 0.45) * n.floatAmp;

      n.x = n.ax + offX;
      n.y = n.ay + offY;

      // Red de seguridad
      n.x = p.constrain(n.x, 20, p.width - 20);
      n.y = p.constrain(n.y, 20, p.height - 20);
    }

    // ── PRE-PASE: estado de cada nodo y nodo bajo el cursor ─────────
    var mX = p.mouseX, mY = p.mouseY;
    var colorTipo = !!(window.EXP && EXP.st.color === 'tipo');
    var cand = null, candD = 1e9;
    for (var i = 0; i < nCont.length; i++) {
      var n = nCont[i];
      var pasa = n.cont._visible !== false;
      n.fv += ((pasa ? 1 : 0) - n.fv) * 0.12;
      var obj = colorTipo ? n.rgbTipo : n.rgbObra;
      n.rgb[0] += (obj[0] - n.rgb[0]) * 0.1;
      n.rgb[1] += (obj[1] - n.rgb[1]) * 0.1;
      n.rgb[2] += (obj[2] - n.rgb[2]) * 0.1;
      n.dM = p.dist(n.x, n.y, mX, mY);
      n.foco = smoothstep(RADIO * 2.4, 0, n.dM);          // el hover empieza a actuar antes
      n.hb = smoothstep(RADIO, RADIO * 0.2, n.dM);        // atracción hacia el plano focal
      n.depth = depthFactor(n.z, n.hb);
      n.hk += ((n === hov ? 1 : 0) - n.hk) * 0.2;
      var pls = p.sin(p.frameCount * 0.05 + n.ph);
      n.sz = (n.size + p.map(pls, -1, 1, -0.8, 2) * DENS) * (0.8 + n.depth * 0.55) * (1 + n.hb * 0.18 + n.hk * 0.2);
      if (cursorEnLienzo && pasa && n.depth >= 0.35) {
        var alcance = Math.max(18, n.sz * 0.8 + 8);
        if (n.dM < alcance && n.dM < candD) { candD = n.dM; cand = n; }
      }
    }
    if (vistaActual !== 'mapa') cand = null;
    if (cand !== hov) {
      hov = cand;
      if (hov) { hovRef = hov; mostrarTip(hov); }
      cursorRing.classList.toggle('hover', !!hov);
    }
    hovK += ((hov ? 1 : 0) - hovK) * 0.16;
    if (!hov && hovK < 0.02) { hovK = 0; hovRef = null; }
    ubicarTip();

    // ── CONEXIONES ──────────────────────────────────────────────────
    // Trazo punteado que fluye. Cuanto más comparten dos archivos (e.v):
    // más grueso, más opaco y más rápido. Las débiles quedan tenues y lentas.
    var ctx = p.drawingContext;
    var tinta = [];   // conexiones cerca del cursor: reciben además la nube de tinta
    ctx.save();
    ctx.lineCap = 'round';
    for (var k = 0; k < RED.aristas.length; k++) {
      var e = RED.aristas[k];
      var vivo = !!hovRef && (e.a === hovRef.gi || e.b === hovRef.gi);
      trazo(ctx, e, vivo, tinta);
    }
    // conexiones propias del nodo señalado que no están en el trazado base
    if (hovRef) {
      var extra = RED.porNodo[hovRef.gi];
      for (var x = 0; x < extra.length; x++) if (!extra[x].base) trazo(ctx, extra[x], true, tinta);
    }
    ctx.setLineDash([]);
    ctx.restore();

    // Nube de tinta + viajeras (la textura dibujada del rizoma) en las conexiones
    // que toca la lupa. Se limita a las más cercanas para mantener la fluidez.
    p.noStroke();
    tinta.sort(function(u, w) { return (w.vivo - u.vivo) || (u.d - w.d); });
    var maxTinta = nCont.length <= 80 ? 6 : 3;
    for (var t = 0; t < tinta.length && t < maxTinta; t++) {
      var T = tinta[t];
      p.fill(T.r, T.g, T.bl, T.alfa * 0.45);
      inkStroke(T.a.x, T.a.y, T.b.x, T.b.y, T.e.seed, false);
      p.fill(T.r, T.g, T.bl, T.alfa);
      inkStroke(T.a.x, T.a.y, T.b.x, T.b.y, T.e.seed, true);
      travelers(T.a.x, T.a.y, T.b.x, T.b.y, T.e.seed, T.r, T.g, T.bl, T.alfa, T.e.cur, T.stir);
    }

    // NODOS AMBIENTALES (siempre visibles, suavemente moduladas por profundidad)
    var apagarAmb = 1 - hovK * 0.5;
    for (var i = 0; i < nAmb.length; i++) {
      var n = nAmb[i];
      var dMouse = p.dist(n.x, n.y, mX, mY);
      var foco = smoothstep(RADIO * 2, RADIO * 0.5, dMouse);
      var depth = depthFactor(n.z, foco * 0.5);
      var vis = depth * (0.4 + foco * 0.6) * apagarAmb;
      var pls = p.sin(p.frameCount * 0.04 + n.ph);
      var sz  = (n.size + p.map(pls, -1, 1, -0.6, 1.4)) * (0.7 + depth * 0.5);
      p.noStroke();
      p.fill(n.rgb[0], n.rgb[1], n.rgb[2], 50 * vis);
      p.circle(n.x, n.y, sz * 2.2);
      p.fill(n.rgb[0], n.rgb[1], n.rgb[2], 110 * vis);
      p.circle(n.x, n.y, sz);
      if (foco > 0.1) updateAndDrawWisps(n, sz, n.rgb[0], n.rgb[1], n.rgb[2], vis, false);
    }

    // NODOS DE CONTENIDO
    var pocos = nCont.length <= 80;
    for (var i = 0; i < nCont.length; i++) {
      var n = nCont[i];
      if (n === hov) continue;       // el señalado se dibuja al final, encima
      dibujarNodo(n, pocos);
    }
    if (hov) dibujarNodo(hov, pocos);

    // Rótulos de los archivos conectados con el nodo señalado
    if (hovRef && hovK > 0.05) {
      var vec = RED.vecinos[hovRef.gi];
      p.textAlign(p.LEFT, p.CENTER);
      for (var i = 0; i < nCont.length; i++) {
        var n = nCont[i];
        if (!vec[n.gi] || n.fv < 0.5) continue;
        var lx = n.x + n.sz * 0.8 + 9, ly = n.y;
        var tit = n.cont.titulo.length > 30 ? n.cont.titulo.slice(0, 28) + '…' : n.cont.titulo;
        p.noStroke();
        p.textFont('JetBrains Mono'); p.textSize(9);
        var wId = p.textWidth(n.cont.id);
        p.textFont('Instrument Serif'); p.textSize(14);
        var wTit = p.textWidth(tit);
        p.fill(19, 19, 15, 205 * hovK);
        p.rectMode(p.CORNER);
        p.rect(lx - 5, ly - 11, wId + wTit + 20, 22, 2);
        p.fill(n.rgb[0], n.rgb[1], n.rgb[2], 240 * hovK);
        p.textFont('JetBrains Mono'); p.textSize(9);
        p.text(n.cont.id, lx, ly);
        p.fill(236, 230, 220, 235 * hovK);
        p.textFont('Instrument Serif'); p.textSize(14);
        p.text(tit, lx + wId + 9, ly - 1);
      }
    }

    // NODO SELECCIONADO
    if (selectedNode) {
      var sn = selectedNode;
      var sp3 = p.sin(p.frameCount * 0.07);
      var sr  = sn.sz * 1.1 + p.map(sp3, -1, 1, 4, 10);
      p.noFill();
      p.stroke(sn.rgb[0], sn.rgb[1], sn.rgb[2], 110); p.strokeWeight(0.8);
      p.circle(sn.x, sn.y, sr * 2);
      p.stroke(sn.rgb[0], sn.rgb[1], sn.rgb[2], 45); p.strokeWeight(0.4);
      p.circle(sn.x, sn.y, sr * 3.2);
    }

    drawLupa();
  };

  // ── Nodo señalado con el mouse ──────────────────────────────────
  var hov = null;        // nodo bajo el cursor
  var hovRef = null;     // el último señalado (para desvanecer con suavidad)
  var hovK = 0;          // 0 → 1: cuánto está activo el resalte
  var cursorEnLienzo = false;

  // Una conexión: curva punteada cuyo trazo avanza
  function trazo(ctx, e, vivo, tinta) {
    var a = nCont[e.a], b = nCont[e.b];
    var fa = Math.min(a.fv, b.fv);
    if (fa < 0.03) return;
    var v = e.v;
    var dx = b.x - a.x, dy = b.y - a.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
    var midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
    var dMid = p.dist(midX, midY, p.mouseX, p.mouseY);
    var stir = cursorEnLienzo ? smoothstep(RADIO * 1.8, 0, dMid) : 0;
    var dm = Math.min(a.depth, b.depth);

    var alfa = (0.10 + 0.55 * v) * (0.4 + 0.6 * dm) * (1 + 0.5 * stir);
    if (vivo) alfa = alfa + (Math.max(alfa, 0.62 + 0.38 * v) - alfa) * hovK;
    else      alfa = alfa * (1 - 0.84 * hovK);
    alfa = Math.min(1, alfa) * fa;
    if (alfa < 0.012) return;

    // velocidad del flujo: las fuertes corren, las débiles apenas se mueven
    var vel = (0.10 + v * v * 1.7) * (vivo ? 1 + 0.7 * hovK : 1);
    e.off -= vel * e.dir;

    var r = (a.rgb[0] + b.rgb[0]) / 2, g = (a.rgb[1] + b.rgb[1]) / 2, bl = (a.rgb[2] + b.rgb[2]) / 2;
    if (fa < 0.99) { r += (120 - r) * (1 - fa); g += (118 - g) * (1 - fa); bl += (112 - bl) * (1 - fa); }

    // curva leve que respira
    var comba = (p.noise(e.seed * 0.37, p.frameCount * 0.0022) - 0.5) * d * 0.24;
    var cxp = midX + (-dy / d) * comba, cyp = midY + (dx / d) * comba;

    ctx.strokeStyle = 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (bl | 0) + ',' + alfa.toFixed(3) + ')';
    ctx.lineWidth = (0.7 + v * 2.4) * (0.6 + 0.4 * DENS) * (vivo ? 1 + 0.35 * hovK : 1);
    ctx.setLineDash([2.5 + v * 6.5, 5.5 + (1 - v) * 4]);
    ctx.lineDashOffset = e.off;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(cxp, cyp, b.x, b.y);
    ctx.stroke();

    if ((stir > 0.06 || (vivo && hovK > 0.3)) && fa > 0.5) {
      var cerca = p.map(d, 0, MAX_CON * 1.6, 1, 0.3, true);
      tinta.push({ e: e, a: a, b: b, d: dMid, vivo: vivo ? 1 : 0, stir: stir, r: r, g: g, bl: bl,
                   alfa: (e.cur ? 235 : 185) * dm * (0.35 + 0.65 * v) * cerca * Math.max(stir, vivo ? hovK * 0.7 : 0) });
    }
  }

  function dibujarNodo(n, pocos) {
    var esVecino = !!hovRef && (n === hovRef || RED.vecinos[hovRef.gi][n.gi]);
    var atenuar = (hovRef && !esVecino) ? 1 - 0.72 * hovK : 1;
    var vis = n.depth * (0.55 + n.foco * 0.45) * atenuar * (0.10 + 0.90 * n.fv);
    var r = n.rgb[0], g = n.rgb[1], b = n.rgb[2];
    if (n.fv < 0.99) { r += (120 - r) * (1 - n.fv); g += (118 - g) * (1 - n.fv); b += (112 - b) * (1 - n.fv); }
    var sz = n.sz;
    var ctx = p.drawingContext;

    p.noStroke();
    // Glow solo cerca del cursor (es lo más costoso de dibujar)
    var conGlow = (n.hk > 0.05 || n.hb > (pocos ? 0.05 : 0.5)) && n.fv > 0.5;
    if (conGlow) {
      ctx.shadowBlur = (8 + n.hb * 18 + n.hk * 10) * vis;
      ctx.shadowColor = 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ',' + (0.7 * vis) + ')';
    }
    // Halo
    p.fill(r, g, b, 65 * vis);
    p.circle(n.x, n.y, sz * 3.5);
    // Cuerpo
    p.fill(r, g, b, 240 * vis);
    p.circle(n.x, n.y, sz * 1.6);
    ctx.shadowBlur = 0;
    // Núcleo (siempre presente — es lo que permite localizar el nodo)
    p.fill(236, 230, 220, 240 * n.depth * (0.45 + n.foco * 0.55) * atenuar * n.fv);
    p.circle(n.x, n.y, sz * 0.55);

    if (n.fv > 0.5 && (pocos || n.hb > 0.05)) {
      updateAndDrawWisps(n, sz, r, g, b, vis, n.foco > 0.5);
      ctx.shadowBlur = 0;
    }
  }

  // ── Rótulo del nodo señalado (código + título; la miniatura llega en el Bloque D) ──
  var tipEl = document.getElementById('rz-tip');
  function mostrarTip(n) {
    if (!tipEl) return;
    var c = n.cont, cat = categoriaDe(c.tipo), sub = SUBPROYECTOS[c.sub];
    var esc = window.EXP ? EXP.esc : function(s) { return s; };
    var obra = window.EXP ? EXP.obraCorta(c.sub) : (sub ? sub.titulo : c.sub);
    var mini = (window.EXP && EXP.miniaturaHTML) ? EXP.miniaturaHTML(c) : '';
    tipEl.style.setProperty('--cat', 'rgb(' + cat.rgb.join(',') + ')');
    tipEl.innerHTML = (mini ? '<div class="rz-tip-img">' + mini + '</div>' : '') +
      '<div class="rz-tip-pie"><span class="rz-tip-cod">' + esc(c.id) + '</span>' +
      '<span class="rz-tip-tit">' + esc(c.titulo) + '</span></div>' +
      '<div class="rz-tip-meta">' + esc(cat.nombre) + ' · ' + esc(obra) + '<br>' +
      n.grado + (n.grado === 1 ? ' relación' : ' relaciones') + ' · clic para abrir</div>';
  }
  function ubicarTip() {
    if (!tipEl) return;
    var activo = !!hov && vistaActual === 'mapa';
    tipEl.classList.toggle('on', activo);
    if (!activo) return;
    var w = tipEl.offsetWidth, h = tipEl.offsetHeight;
    var sep = hov.sz * 0.8 + 20;
    var x = hov.x + sep;
    if (x + w > p.width - 12) x = hov.x - sep - w;
    if (x < 8) x = 8;
    var y = p.constrain(hov.y - h * 0.35, 10, Math.max(10, p.height - h - 10));
    tipEl.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
  }

  function updateAndDrawWisps(n, motherSize, r, g, b, zAlp, inFocus) {
    var maxWisps = inFocus ? 3 : 2;
    var emitProb = inFocus ? 0.020 : 0.006;
    if (n.wisps.length < maxWisps && p.random() < emitProb) {
      n.wisps.push(mkWisp(motherSize));
    }
    for (var wi = n.wisps.length - 1; wi >= 0; wi--) {
      updateWisp(n.wisps[wi]);
      if (n.wisps[wi].dead) n.wisps.splice(wi, 1);
    }
    var baseAlp = inFocus ? 220 : 160;
    p.noStroke();
    for (var wj = 0; wj < n.wisps.length; wj++) {
      var w = n.wisps[wj];
      // lifeAlpha: nace con fuerza y se desvanece (la gota deja un rastro
      // pero el cuerpo principal vive). Ajuste suave al inicio y al final.
      var lifeN = w.t / w.tEnd;
      var lifeAlp = lifeN < 0.15
        ? lifeN / 0.15
        : 1 - (lifeN - 0.15) / 0.85;
      var alpha = baseAlp * lifeAlp * zAlp;
      var wx = n.x + w.x, wy = n.y + w.y;
      // dst (grosor del puente metaball): proporcional al wisp, no fijo
      var dst = p.constrain(w.d * 0.6, 1, motherSize * 0.5);
      p.fill(r, g, b, alpha);
      // Puente metaball — usar diámetros reales, no inflar la madre
      aetherLinkVerts(n.x, n.y, motherSize, wx, wy, w.d, dst);
      // Cuerpo de la gota
      p.circle(wx, wy, w.d);
    }
  }

  function drawLupa() {
    var pls2 = p.sin(p.frameCount * 0.05);
    var r2   = RADIO + p.map(pls2, -1, 1, -3, 5);
    var alp2 = p.map(pls2, -1, 1, 25, 60);
    p.noFill();
    p.stroke(236, 230, 220, alp2); p.strokeWeight(0.8);
    p.circle(p.mouseX, p.mouseY, r2 * 2);
    p.stroke(236, 230, 220, alp2 * 0.2); p.strokeWeight(0.3);
    p.circle(p.mouseX, p.mouseY, r2 * 2.4);
  }

  function smoothstep(edge0, edge1, x) {
    x = p.constrain((x - edge0) / (edge1 - edge0), 0, 1);
    return x * x * (3 - 2 * x);
  }

  function fractalNoise(nx, ny, nz) {
    var v = 0;
    v += 1.00 * (p.noise(nx,       ny,       nz)       - 0.5) * 2;
    v += 0.50 * (p.noise(nx * 2,   ny * 2,   nz * 1.3) - 0.5) * 2;
    v += 0.25 * (p.noise(nx * 4,   ny * 4,   nz * 1.7) - 0.5) * 2;
    return v / 1.75;
  }

  // inkStroke: campo de partículas suspendidas que se concentran en torno al eje
  // entre dos nodos. Cada partícula tiene vida propia: aparece, flota con ruido
  // fractal, se disuelve, reaparece en otro punto. El cursor amplifica la deriva.
  // La línea emerge como densidad estadística, no como orden lineal.
  // ── Calibrada al rango de v10 (INK_RANGE=140) aunque MAX_CON sea mayor ──
  // v15: count subido (40-72 → 60-110) y variedad de tamaños expandida
  function inkStroke(x1, y1, x2, y2, seed, withPressure) {
    var INK_RANGE = 140;   // rango de referencia de v10 para la curva de densidad
    var INK_RADIO = 90;    // radio de referencia de v10 para influencia del cursor

    var t2 = p.frameCount * 0.006;
    var dist = p.dist(x1, y1, x2, y2);
    // v15: más partículas (líneas más densas y visibles)
    var count = p.floor(p.map(dist, 0, 200, 60, 110));
    count = p.constrain(count, 60, 110);

    // Amplitud lateral del plasma — siempre activa, se intensifica cerca del cursor
    var ampBase = p.map(dist, 0, INK_RANGE, 22, 11, true);

    // Ancho perpendicular del "campo" (las partículas en una franja, no en línea)
    var fieldWidth = p.map(dist, 0, INK_RANGE, 9, 5, true);

    var dx = x2 - x1, dy = y2 - y1;
    var dLen = p.max(0.001, p.sqrt(dx * dx + dy * dy));
    var ux = dx / dLen, uy = dy / dLen;
    var px_perp = -uy, py_perp = ux;

    for (var k = 0; k < count; k++) {
      // Semilla única por partícula (estable entre frames)
      var pSeed = seed * 17.3 + k * 2.71;

      // ── Cada partícula tiene su propio ritmo de vida (no periodo común) ──
      var lifeRand = p.noise(pSeed * 0.71);
      var lifePeriod = 60 + lifeRand * lifeRand * 220;
      var lifeOffset = p.noise(pSeed * 1.13) * 1000;
      var lifeT = ((p.frameCount + lifeOffset) % lifePeriod) / lifePeriod;

      // Curva de vida asimétrica: aparición rápida, decaimiento lento
      var asymBias = p.noise(pSeed * 2.4) * 0.5 + 0.25;
      var lifeAlpha;
      if (lifeT < asymBias) lifeAlpha = lifeT / asymBias;
      else lifeAlpha = 1 - (lifeT - asymBias) / (1 - asymBias);
      lifeAlpha = lifeAlpha * lifeAlpha * (3 - 2 * lifeAlpha);
      if (lifeAlpha < 0.04) continue;

      // ── Deriva en el eje: cada partícula con su velocidad propia ──
      var driftSpeed = p.map(p.noise(pSeed * 3.7), 0, 1, -0.0015, 0.0015);
      var baseT = p.noise(pSeed) + (p.frameCount * driftSpeed);
      baseT = baseT - p.floor(baseT);
      var axisX = p.lerp(x1, x2, baseT);
      var axisY = p.lerp(y1, y2, baseT);

      // ── Offset perpendicular con drift lento propio ──
      var sideRand = p.noise(pSeed * 1.7, t2 * 0.3);
      var sideOffset = (sideRand - 0.5) * 2 * fieldWidth;

      // ── Ruido fractal: deriva plasmática ──
      var nx_f = fractalNoise(axisX * 0.012 + pSeed,       axisY * 0.012,       t2);
      var ny_f = fractalNoise(axisX * 0.012 + 100 + pSeed, axisY * 0.012 + 100, t2);

      // ── Microjitter de alta frecuencia ──
      var jitterScale = p.noise(pSeed * 5.9) * 1.5;
      var jitterSpeed = 0.04 + p.noise(pSeed * 6.3) * 0.06;
      var jx = (p.noise(pSeed * 7.1 + p.frameCount * jitterSpeed) - 0.5) * jitterScale;
      var jy = (p.noise(pSeed * 7.7 + p.frameCount * jitterSpeed) - 0.5) * jitterScale;

      // ── Modulación por cursor (con radio de v10) ──
      var dMouse = p.dist(axisX, axisY, p.mouseX, p.mouseY);
      var stir = smoothstep(INK_RADIO * 3.5, 0, dMouse);
      var driftAmp = ampBase * (0.35 + stir * 1.6);

      // Posición final
      var fx = axisX + px_perp * sideOffset + nx_f * driftAmp + jx;
      var fy = axisY + py_perp * sideOffset + ny_f * driftAmp + jy;

      // ── Tamaño: distribución sesgada (muchas pequeñas, pocas grandes) ──
      // v15: rango ampliado para mayor variedad visual (0.3-4.1 → 0.3-5.4)
      var sizeRand = p.noise(pSeed * 3.3);
      var intrinsicSize = 0.3 + sizeRand * sizeRand * sizeRand * 5.1;
      var breathSpeed = 0.5 + p.noise(pSeed * 4.5) * 2.5;
      var breathing = 0.7 + p.noise(pSeed * 5.1, t2 * breathSpeed) * 0.6;
      var sz = intrinsicSize * breathing;

      // v15: multiplicador subido (1.4→1.7 difusa, 2.4→2.9 principal)
      if (withPressure) p.circle(fx, fy, sz * 2.9 * lifeAlpha);
      else              p.circle(fx, fy, sz * 1.7 * lifeAlpha);
    }
  }

  /* ══════════════════════════════════════════
     TRAVELERS (v15) — partículas viajeras direccionales
     ──────────────────────────────────────────
     Pequeñas luces que recorren el eje de la conexión con velocidad,
     tamaño y opacidad variables — savia, esporas o luciérnagas
     siguiendo el cauce de la rama. Le da al rizoma sentido de flujo,
     no solo geometría estática.

     - Cada conexión emite 3-5 viajeras (más si es preferente o si el
       cursor está cerca).
     - Cada viajera tiene seed propia → velocidad, tamaño y "luz" únicas.
     - El recorrido es leve-curvo (offset perpendicular con ruido).
     - Algunas viajan en sentido contrario (variedad direccional).
     - Halo + núcleo para que se lean como puntos vivos, no manchas.
  ══════════════════════════════════════════ */
  function travelers(x1, y1, x2, y2, seed, r, g, b, baseAlpha, esPreferente, stirMid) {
    var dist = p.dist(x1, y1, x2, y2);
    if (dist < 30) return;  // conexiones muy cortas no necesitan viajeras

    // Cantidad: 3-5 base, +1-2 si preferente, +1-2 si el cursor está cerca
    var nBase = esPreferente ? 5 : 3;
    var nExtra = p.floor(stirMid * 2.5);
    var n = nBase + nExtra;

    var dx = x2 - x1, dy = y2 - y1;
    var dLen = p.max(0.001, p.sqrt(dx * dx + dy * dy));
    var ux = dx / dLen, uy = dy / dLen;
    var px_perp = -uy, py_perp = ux;

    var t2 = p.frameCount * 0.006;

    for (var k = 0; k < n; k++) {
      // Seed distinta a inkStroke para evitar superposición de patrones
      var tSeed = seed * 23.7 + k * 5.13 + 999;

      // ── Dirección: 70% recorren a→b, 30% recorren b→a (variedad) ──
      var goesForward = p.noise(tSeed * 0.41) > 0.30;

      // ── Velocidad propia: variable amplia (algunas lentas, algunas rápidas) ──
      // 0.0008-0.005 ciclos por frame → recorre la conexión en 200-1250 frames
      var speedRand = p.noise(tSeed * 1.31);
      var speed = 0.0008 + speedRand * speedRand * 0.0042;

      // ── Posición a lo largo del eje [0, 1] con loop ──
      var phase = p.noise(tSeed * 0.83);  // offset inicial único
      var raw = phase + (p.frameCount * speed);
      var t = raw - p.floor(raw);  // [0, 1)
      if (!goesForward) t = 1 - t;

      // ── Vida: las viajeras aparecen y desaparecen suavemente al entrar/salir ──
      // Fade-in en el primer 12% del recorrido, fade-out en el último 12%
      var lifeAlpha;
      if (t < 0.12)       lifeAlpha = t / 0.12;
      else if (t > 0.88)  lifeAlpha = (1 - t) / 0.12;
      else                lifeAlpha = 1;
      lifeAlpha = lifeAlpha * lifeAlpha * (3 - 2 * lifeAlpha);
      if (lifeAlpha < 0.05) continue;

      // ── Posición en el eje (con curvatura leve por ruido perpendicular) ──
      var axisX = p.lerp(x1, x2, t);
      var axisY = p.lerp(y1, y2, t);

      // Curvatura: pequeño desplazamiento perpendicular con ruido lento — la
      // viajera no va recta, serpentea apenas como agua corriendo
      var curveRand = p.noise(tSeed * 2.7, t2 * 0.4 + t * 1.5);
      var curveAmp = p.map(dist, 0, MAX_CON, 3, 7, true);
      var curve = (curveRand - 0.5) * 2 * curveAmp;

      // Microjitter alta frecuencia — pulso vital
      var jSpeed = 0.08 + p.noise(tSeed * 3.4) * 0.08;
      var jx = (p.noise(tSeed * 4.1 + p.frameCount * jSpeed) - 0.5) * 1.2;
      var jy = (p.noise(tSeed * 4.7 + p.frameCount * jSpeed) - 0.5) * 1.2;

      var fx = axisX + px_perp * curve + jx;
      var fy = axisY + py_perp * curve + jy;

      // ── Tamaño: variedad amplia (algunas mínimas, algunas notorias) ──
      // distribución sesgada (mayoría pequeñas, pocas grandes)
      var szRand = p.noise(tSeed * 5.9);
      var coreSize = 1.0 + szRand * szRand * 3.2;  // 1.0 - 4.2 px

      // Pulso de luz: respira con el tiempo + brilla más cerca del cursor
      var breath = 0.75 + p.noise(tSeed * 6.3, t2 * 1.8) * 0.5;
      coreSize *= breath;

      // ── Alpha: base * vida * pulso. Las preferentes brillan más. ──
      var alphaCore = baseAlpha * lifeAlpha * (esPreferente ? 1.5 : 1.15);
      alphaCore = p.constrain(alphaCore, 0, 255);

      // Halo difuso (3x más grande, alpha mucho menor) — sensación de luz
      p.fill(r, g, b, alphaCore * 0.22);
      p.circle(fx, fy, coreSize * 3.4);

      // Núcleo (color saturado)
      p.fill(r, g, b, alphaCore);
      p.circle(fx, fy, coreSize);

      // Punto blanco interno solo en las más grandes y las preferentes —
      // remata la sensación de "luz" en lugar de "mancha de color"
      if (coreSize > 2.4 || esPreferente) {
        p.fill(236, 230, 220, alphaCore * 0.65);
        p.circle(fx, fy, coreSize * 0.45);
      }
    }
  }

  p.mousePressed = function(e) {
    if (vistaActual !== 'mapa') return;
    // solo cuentan los clics sobre el lienzo (no sobre los paneles ni el menú)
    if (e && e.target && e.target !== canvasEl) return;
    // Primero el nodo señalado; si no hay (pantallas táctiles), el más cercano al toque
    var best = null;
    if (hov && p.dist(p.mouseX, p.mouseY, hov.x, hov.y) < Math.max(18, hov.sz * 0.8 + 8)) best = hov;
    if (!best) {
      var bestD = 1e9;
      for (var i = 0; i < nCont.length; i++) {
        var n = nCont[i];
        if (n.cont._visible === false) continue;
        var d = p.dist(p.mouseX, p.mouseY, n.x, n.y);
        var hoverBoost = smoothstep(RADIO, RADIO * 0.2, d);
        if (depthFactor(n.z, hoverBoost) < 0.35) continue;
        if (d < Math.max(40, n.sz * 0.8 + 10) && d < bestD) { bestD = d; best = n; }
      }
    }
    if (best) abrirPanel(best);
    else { panel.classList.remove('open'); selectedNode = null; }
  };

  // Rueda del mouse: mover el plano focal de profundidad
  p.mouseWheel = function(event) {
    if (vistaActual !== 'mapa') return true;  // deja pasar el scroll a la página
    focalZTarget += event.delta * 0.0015;
    focalZTarget = p.constrain(focalZTarget, -1, 1);
    focalUIFadeFrames = 120;  // mostrar el indicador unos 2 segundos
    // mostrar también el indicador del DOM
    var depthInd = document.getElementById('depth-indicator');
    if (depthInd) {
      depthInd.classList.add('visible');
      clearTimeout(p._depthHideTimer);
      p._depthHideTimer = setTimeout(function() { depthInd.classList.remove('visible'); }, 1800);
    }
    return false;  // bloquea scroll del navegador
  };

  p.windowResized = function() { ajustarCanvas(); };
  // Menú ocultado/mostrado, panel plegado/abierto, cambio de vista o entrada desde la portada
  window.addEventListener('nav-toggled', function() { ajustarCanvas(); setTimeout(ajustarCanvas, 480); });
  window.addEventListener('exp-layout', function() { setTimeout(ajustarCanvas, 30); });
  window.addEventListener('app-revealed', function() { setTimeout(ajustarCanvas, 50); });

}, document.getElementById('canvas-wrapper'));

