/* ══════════════════════════════════════════
   Los datos del catálogo (SUBPROYECTOS, ARCHIVOS, CONEXIONES_*)
   viven en data/catalogo.js
══════════════════════════════════════════ */

// ─── Paleta de nodos · sincronizada con sistema editorial del landing ─────
// Tonos saturados (no apagados) para que las conexiones promedien colores vivos
var TIPO_RGB = {
  texto:    [168, 163, 165],  
  video:    [ 47, 191, 113],  // verde
  foto:     [237, 125,  58],  
  dibujo:   [229, 181,  59],  // Amarillo dorado
  bitacora: [237, 125,  58],  
  hoja:     [242, 204, 107],  // Amarillo claro
  plantilla:[156, 152, 154]   
};

// Color base por subproyecto (grupo) — prevalece sobre TIPO_RGB en el rizoma
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
    return;
  }

  // Fuera del mapa: pausar p5 completamente y bloquear su canvas
  document.getElementById('canvas-wrapper').style.pointerEvents = 'none';
  document.querySelector('nav').classList.add('nav--pagina');
  document.getElementById('nav-toggle').classList.add('nav--pagina');
  if (typeof sketch !== 'undefined' && sketch.noLoop) sketch.noLoop();
  document.getElementById('sello-institucional').style.display = 'none';

  if (nombre === 'archivo') poblarArchivoPorRama();

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
  btn.addEventListener('click', function() { mostrarVista('mapa'); });
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

/* ══════════════════════════════════════════
   ARCHIVO: GRID POR RAMA + FILTROS
══════════════════════════════════════════ */
var filtroRamaActivo = 'todos';
var filtroTemaActivo = 'todos';
var filtroPracticaActivo = 'todos';

function poblarArchivoPorRama() {
  var cont = document.getElementById('archivo-por-rama');
  cont.innerHTML = '';
  var ordenRamas = ['SUB-02','SUB-03','SUB-04','SUB-05','SUB-06'];
  ordenRamas.forEach(function(subId) {
    var sub = SUBPROYECTOS[subId];
    var items = CONTENIDOS.filter(function(c) { return c.sub === subId; });
    if (items.length === 0) return;

    var bloque = document.createElement('div');
    bloque.className = 'rama-bloque';
    bloque.dataset.rama = subId;

    bloque.innerHTML = '' +
      '<div class="rama-header">' +
        '<span class="rama-id">' + subId + '</span>' +
        '<span class="rama-tipo-tag tipo-' + sub.tipo + '">' + sub.rotulo + '</span>' +
        '<h2 class="rama-titulo">' + sub.titulo + '</h2>' +
        '<div class="rama-meta">' +
          '<span><strong>Grupo:</strong> ' + sub.grupo + '</span>' +
          '<span><strong>Archivos catalogados:</strong> ' + items.length + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="rama-desc">' + sub.desc + '</div>' +
      '<div class="archivos-grid" data-grid-rama="' + subId + '"></div>';

    cont.appendChild(bloque);

    var grid = bloque.querySelector('.archivos-grid');
    items.forEach(function(c) {
      var tagsHTML = (c.tags || []).slice(0,4).map(function(t) {
        return '<span class="card-tag">#' + t + '</span>';
      }).join('');
      var temasHTML = (c.temas || []).map(function(t) {
        return '<span class="card-tag tema">·' + t + '</span>';
      }).join('');
      var estadoCls = c.estado === 'apto' ? 'estado-apto' : 'estado-sinrevisar';

      var card = document.createElement('div');
      card.className = 'archivo-card' + (c.esSerie ? ' is-serie' : '');
      card.dataset.id = c.id;
      card.dataset.tipo = c.tipo;
      card.dataset.temas = (c.temas || []).join(',');
      card.dataset.practicas = (c.practicas || []).join(',');

      card.innerHTML = '' +
        '<div class="card-header">' +
          '<span class="card-id">' + c.id + '</span>' +
          '<span class="card-tipo tipo-' + c.tipo + '">' + c.tipo + '</span>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
          '<div style="font-family:var(--font-italic);font-size:17px;color:var(--crema);line-height:1.35;margin-bottom:8px;">' + c.titulo + '</div>' +
          (c.esSerie ? '<div class="card-serie-meta">serie · ' + c.conteo + (c.tam && c.tam !== '—' ? ' · ' + c.tam : '') + '</div>' : '') +
          '<div class="card-archivo">' + c.archivo + '</div>' +
        '</div>' +
        '<div class="card-desc">' + c.desc + '</div>' +
        '<div class="card-tags">' + tagsHTML + temasHTML + '<span class="estado-badge ' + estadoCls + '">' + (c.estado || '') + '</span></div>';

      card.addEventListener('click', function() { mostrarNodo(c); });
      grid.appendChild(card);
    });
  });
  aplicarFiltros();
}

function aplicarFiltros() {
  var totalVisible = 0;
  document.querySelectorAll('.rama-bloque').forEach(function(b) {
    var rama = b.dataset.rama;
    var ramaOk = filtroRamaActivo === 'todos' || filtroRamaActivo === rama;
    var visiblesEnBloque = 0;
    b.querySelectorAll('.archivo-card').forEach(function(card) {
      var temas = (card.dataset.temas || '').split(',').filter(Boolean);
      var practicas = (card.dataset.practicas || '').split(',').filter(Boolean);
      var temaOk = filtroTemaActivo === 'todos' || temas.indexOf(filtroTemaActivo) !== -1;
      var practicaOk = filtroPracticaActivo === 'todos' || practicas.indexOf(filtroPracticaActivo) !== -1;
      var visible = ramaOk && temaOk && practicaOk;
      card.classList.toggle('hidden', !visible);
      if (visible) visiblesEnBloque++;
    });
    b.classList.toggle('hidden', !ramaOk || visiblesEnBloque === 0);
    if (ramaOk) totalVisible += visiblesEnBloque;
  });
  document.getElementById('conteo-num').textContent = totalVisible;
}

document.getElementById('filtros-rama').addEventListener('click', function(e) {
  if (!e.target.classList.contains('filtro-btn')) return;
  document.querySelectorAll('#filtros-rama .filtro-btn').forEach(function(b) { b.classList.remove('active'); });
  e.target.classList.add('active');
  filtroRamaActivo = e.target.dataset.filtroRama;
  aplicarFiltros();
});
document.getElementById('filtros-tema').addEventListener('click', function(e) {
  if (!e.target.classList.contains('filtro-btn')) return;
  document.querySelectorAll('#filtros-tema .filtro-btn').forEach(function(b) { b.classList.remove('active'); });
  e.target.classList.add('active');
  filtroTemaActivo = e.target.dataset.filtroTema;
  aplicarFiltros();
});
document.getElementById('archivo-por-rama').addEventListener('click', function(e) {
  var btn = e.target.closest('.card-mapa-btn');
  if (btn) {
    e.stopPropagation();
    irAlMapaDesdeArchivo(btn.dataset.nodeId);
  }
});

document.getElementById('filtros-practica').addEventListener('click', function(e) {
  if (!e.target.classList.contains('filtro-btn')) return;
  document.querySelectorAll('#filtros-practica .filtro-btn').forEach(function(b) { b.classList.remove('active'); });
  e.target.classList.add('active');
  filtroPracticaActivo = e.target.dataset.filtroPractica;
  aplicarFiltros();
});

// ── Navegación cruzada: mapa ↔ archivo ────────────────────────────
// Desde el panel del mapa → ir a la tarjeta en el archivo
function irAlArchivoDesdeMapa() {
  var nodeId = document.getElementById('panel-btn-archivo').dataset.nodeId;
  // Asegurar que el archivo se pueble antes de buscar la tarjeta
  mostrarVista('archivo');
  // Esperar a que poblarArchivoPorRama termine y el DOM esté listo
  var intentos = 0;
  function buscarTarjeta() {
    var card = document.querySelector('.archivo-card[data-id="' + nodeId + '"]');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.outline = '2px solid rgba(242,204,107,0.8)';
      setTimeout(function() {
        card.style.outline = '';
        card.style.transition = 'outline 0.6s';
      }, 2000);
    } else if (intentos++ < 10) {
      setTimeout(buscarTarjeta, 150);
    }
  }
  setTimeout(buscarTarjeta, 200);
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

  p.setup = function() {
    var c = p.createCanvas(window.innerWidth, window.innerHeight - navH);
    c.parent('canvas-wrapper');
    p.colorMode(p.RGB);

    // p5.js registra su propio listener 'wheel' en el canvas con preventDefault.
    // Lo reemplazamos con uno pasivo que solo bloquea el scroll cuando estamos en el mapa.
    var canvasEl = c.elt;
    canvasEl.addEventListener('wheel', function(e) {
      if (vistaActual !== 'mapa') {
        // Fuera del mapa: propagar el scroll a la vista de página visible
        var vistaVisible = document.querySelector('.vista-pagina.visible');
        if (vistaVisible) vistaVisible.scrollTop += e.deltaY;
      }
    }, { passive: true });

    // Distribución inicial en grilla con jitter: garantiza que los nodos
    // nazcan dispersos por todo el canvas, no agrupados por azar.
    var nTotal = CONTENIDOS.length;
    var cols = Math.ceil(Math.sqrt(nTotal * p.width / p.height));
    var rows = Math.ceil(nTotal / cols);
    var cellW = (p.width  - 160) / cols;
    var cellH = (p.height - 160) / rows;
    var idx = 0;

    CONTENIDOS.forEach(function(c) {
      // Color por grupo (SUB) — con fallback a tipo si no hay mapeo de grupo
      var rgb = SUB_RGB[c.sub] || TIPO_RGB[c.tipo] || [120,120,120];
      var col = idx % cols;
      var row = Math.floor(idx / cols);
      // Centro de la celda + jitter aleatorio dentro de ella
      var cx = 80 + cellW * (col + 0.5) + p.random(-cellW * 0.35, cellW * 0.35);
      var cy = 80 + cellH * (row + 0.5) + p.random(-cellH * 0.35, cellH * 0.35);
      idx++;

      nCont.push({
        cont: c,
        x: cx,
        y: cy,
        vx: p.random(-0.3, 0.3),  // velocidad inicial leve para que se asienten orgánicamente
        vy: p.random(-0.3, 0.3),
        // +30% sobre v14: bases 8→10.4 (serie) y 6→7.8 (archivo), multiplicador peso 1.5→1.95
        size: c.esSerie ? 10.4 + (c.peso || 1) * 1.95 : 7.8 + (c.peso || 1) * 1.95,
        ph: p.random(p.TWO_PI),
        z: p.random(-1, 1),
        rgb: rgb,
        wisps: []
      });
    });

    // Nodos ambientales — distribución totalmente aleatoria, son fondo
    for (var i = 0; i < 40; i++) {
      var rgb = AMBIENT_RGB[Math.floor(p.random(AMBIENT_RGB.length))];
      nAmb.push({
        x: p.random(p.width), y: p.random(p.height),
        vx: p.random(-0.3, 0.3), vy: p.random(-0.3, 0.3),
        // +30% sobre v14: rango 3-6 → 3.9-7.8
        size: p.random(3.9, 7.8),
        ph: p.random(p.TWO_PI),
        z: p.random(-1, 1),
        rgb: rgb,
        wisps: []
      });
    }
    nodeCountEl.textContent = nCont.length;
  };

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
    var marginX = 90, marginY = 90;
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

    // CONEXIONES inkstroke (triple capa: nube difusa + nube principal + partículas viajeras)
    // v16: optimización para escalar al doble de nodos — se descarta el nodo `a`
    // temprano si está demasiado lejos del cursor, evitando el bucle interno entero.
    // El radio de corte contempla MAX_CON para no perder conexiones válidas.
    p.noStroke();
    var cutoff = RADIO * 1.8 + MAX_CON;  // margen para que ningún par válido se pierda
    for (var i = 0; i < nCont.length; i++) {
      var a = nCont[i];
      // Descarte temprano: si `a` está más lejos que cutoff del cursor, ninguna
      // de sus conexiones tendrá su punto medio dentro del radio de la lupa.
      if (p.dist(a.x, a.y, p.mouseX, p.mouseY) > cutoff) continue;
      for (var j = i + 1; j < nCont.length; j++) {
        var b = nCont[j];
        var d = p.dist(a.x, a.y, b.x, b.y);
        if (d > MAX_CON) continue;

        var midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
        var dMouse = p.dist(midX, midY, p.mouseX, p.mouseY);
        if (dMouse > RADIO * 1.8) continue;

        // Boost individual de cada nodo por cercanía al cursor
        var hoverA = smoothstep(RADIO, RADIO * 0.2, p.dist(a.x, a.y, p.mouseX, p.mouseY));
        var hoverB = smoothstep(RADIO, RADIO * 0.2, p.dist(b.x, b.y, p.mouseX, p.mouseY));
        var depthA = depthFactor(a.z, hoverA);
        var depthB = depthFactor(b.z, hoverB);
        var depthMin = Math.min(depthA, depthB);
        if (depthMin < 0.2) continue;

        // Conexión "reforzada" si está en CONEXIONES_VISUALES
        var esPreferente = false;
        for (var k = 0; k < CONEXIONES_VISUALES.length; k++) {
          var par = CONEXIONES_VISUALES[k];
          if ((par[0] === a.cont.id && par[1] === b.cont.id) ||
              (par[0] === b.cont.id && par[1] === a.cont.id)) {
            esPreferente = true; break;
          }
        }

        var avgR = (a.rgb[0] + b.rgb[0]) / 2;
        var avgG = (a.rgb[1] + b.rgb[1]) / 2;
        var avgB = (a.rgb[2] + b.rgb[2]) / 2;
        // Atenuación por distancia entre los nodos (más cerca = más densa, como v10)
        var distAlp = p.map(d, 0, MAX_CON, 1.0, 0.0);
        // v15: alpha base subida (130→185 / 180→235) para conexiones más visibles
        var alph = (esPreferente ? 235 : 185) * depthMin * distAlp;
        var seed = i * 31 + j * 17;

        // CAPA 1: nube difusa de partículas pequeñas (fondo) — opacidad subida (0.35→0.45)
        p.fill(avgR, avgG, avgB, alph * 0.45);
        inkStroke(a.x, a.y, b.x, b.y, seed, false);

        // CAPA 2: nube principal — partículas más grandes y sólidas (0.95→1.0)
        p.fill(avgR, avgG, avgB, alph * 1.0);
        inkStroke(a.x, a.y, b.x, b.y, seed, true);

        // CAPA 3 (v15): partículas viajeras direccionales
        // Pequeñas luces que recorren el eje de la conexión — como savia,
        // esporas o luciérnagas siguiendo el cauce. Cada conexión tiene
        // un puñado con velocidades, tamaños y opacidades distintas.
        // Más visibles si es preferente o si el cursor está cerca.
        var stirMid = smoothstep(RADIO * 1.8, 0, dMouse);
        travelers(a.x, a.y, b.x, b.y, seed, avgR, avgG, avgB,
                  alph, esPreferente, stirMid);
      }
    }

    // NODOS AMBIENTALES (siempre visibles, suavemente moduladas por profundidad)
    for (var i = 0; i < nAmb.length; i++) {
      var n = nAmb[i];
      var dMouse = p.dist(n.x, n.y, p.mouseX, p.mouseY);
      var foco = smoothstep(RADIO * 2, RADIO * 0.5, dMouse);
      // los ambientales reciben un boost suave con el cursor cerca
      var depth = depthFactor(n.z, foco * 0.5);
      var vis = depth * (0.4 + foco * 0.6);
      var pls = p.sin(p.frameCount * 0.04 + n.ph);
      var sz  = (n.size + p.map(pls, -1, 1, -0.6, 1.4)) * (0.7 + depth * 0.5);
      p.noStroke();
      p.fill(n.rgb[0], n.rgb[1], n.rgb[2], 50 * vis);
      p.circle(n.x, n.y, sz * 2.2);
      p.fill(n.rgb[0], n.rgb[1], n.rgb[2], 110 * vis);
      p.circle(n.x, n.y, sz);
      if (foco > 0.1) updateAndDrawWisps(n, sz, n.rgb[0], n.rgb[1], n.rgb[2], vis, false);
    }

    // NODOS DE CONTENIDO (siempre visibles · hover atrae profundidad + agranda)
    for (var i = 0; i < nCont.length; i++) {
      var n = nCont[i];
      var dMouse = p.dist(n.x, n.y, p.mouseX, p.mouseY);
      // foco extendido para que el hover empiece a actuar antes
      var foco = smoothstep(RADIO * 2.4, 0, dMouse);
      // hoverBoost: cuán fuertemente el cursor "atrae" este nodo al plano focal.
      // Solo se activa cuando el cursor está bien cerca (< RADIO).
      var hoverBoost = smoothstep(RADIO, RADIO * 0.2, dMouse);
      // n.z efectivo: si el cursor está encima, el nodo "se acerca" virtualmente
      var depth = depthFactor(n.z, hoverBoost);

      var pls = p.sin(p.frameCount * 0.05 + n.ph);
      // tamaño escala con profundidad (80%→130%) y con hover (extra +25% si está encima)
      var depthScale = 0.8 + depth * 0.55;
      var hoverScale = 1 + hoverBoost * 0.35;  // hasta 35% más grande con hover
      var sz  = (n.size + p.map(pls, -1, 1, -0.8, 2)) * depthScale * hoverScale;

      // visibilidad: piso 40% por profundidad, hasta 100% con cursor encima
      var vis = depth * (0.55 + foco * 0.45);

      p.noStroke();

      // Glow: shadowBlur escalado por visibilidad y hover
      var glowIntensity = (8 + hoverBoost * 18) * vis;
      p.drawingContext.shadowBlur = glowIntensity;
      p.drawingContext.shadowColor = 'rgba(' + n.rgb[0] + ',' + n.rgb[1] + ',' + n.rgb[2] + ',' + (0.7 * vis) + ')';

      // Halo (alpha subido: 38→65 para más presencia)
      p.fill(n.rgb[0], n.rgb[1], n.rgb[2], 65 * vis);
      p.circle(n.x, n.y, sz * 3.5);
      // Cuerpo (alpha subido: 210→240)
      p.fill(n.rgb[0], n.rgb[1], n.rgb[2], 240 * vis);
      p.circle(n.x, n.y, sz * 1.6);

      // Apagar glow antes del núcleo para que no se contamine
      p.drawingContext.shadowBlur = 0;

      // Núcleo (siempre presente — es lo que permite localizar el nodo)
      p.fill(236, 230, 220, 240 * depth * (0.45 + foco * 0.55));
      p.circle(n.x, n.y, sz * 0.55);

      updateAndDrawWisps(n, sz, n.rgb[0], n.rgb[1], n.rgb[2], vis, foco > 0.5);
      p.drawingContext.shadowBlur = 0;  // reset definitivo después de wisps

      // Etiqueta cerca del cursor
      if (dMouse < RADIO * 0.9) {
        var labelAlp = smoothstep(RADIO * 0.9, RADIO * 0.3, dMouse);
        // Doble glifo para series, simple para archivos
        p.fill(19, 19, 15, 225 * labelAlp);
        p.rectMode(p.CENTER);
        var glyph = n.cont.icono;
        var labelW = 20 + (glyph.length - 1) * 7;
        p.rect(n.x + 22, n.y - 14, labelW, 18, 3);
        p.noFill();
        p.stroke(n.rgb[0], n.rgb[1], n.rgb[2], 140 * labelAlp);
        p.strokeWeight(0.7);
        p.rect(n.x + 22, n.y - 14, labelW, 18, 3);
        p.noStroke();
        p.fill(n.rgb[0], n.rgb[1], n.rgb[2], 230 * labelAlp);
        p.textFont('JetBrains Mono');
        p.textSize(10);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(glyph, n.x + 22, n.y - 13);

        // ID + título compacto
        if (labelAlp > 0.5) {
          p.fill(236, 230, 220, 200 * (labelAlp - 0.5) * 2);
          p.textSize(9);
          p.textAlign(p.LEFT, p.CENTER);
          p.text(n.cont.id, n.x + 36, n.y - 14);

          p.fill(232, 227, 213, 180 * (labelAlp - 0.5) * 2);
          p.textFont('Instrument Serif');
          p.textSize(12);
          var maxT = n.cont.titulo.length > 32 ? n.cont.titulo.slice(0,30) + '…' : n.cont.titulo;
          p.text(maxT, n.x + 36, n.y);
        }
      }
    }

    // NODO SELECCIONADO
    if (selectedNode) {
      var sn = selectedNode;
      var sp3 = p.sin(p.frameCount * 0.07);
      var sr  = sn.size * 1.7 + p.map(sp3, -1, 1, 4, 10);
      var zFs = p.map(sn.z, -1, 1, 0.45, 1.3);
      p.noFill();
      p.stroke(sn.rgb[0], sn.rgb[1], sn.rgb[2], 90); p.strokeWeight(0.8);
      p.circle(sn.x, sn.y, sr * 2 * zFs);
      p.stroke(sn.rgb[0], sn.rgb[1], sn.rgb[2], 40); p.strokeWeight(0.4);
      p.circle(sn.x, sn.y, sr * 3.2 * zFs);
    }

    drawLupa();
  };

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

  p.mousePressed = function() {
    if (vistaActual !== 'mapa') return;
    if (mouseAbsX > window.innerWidth - 460 && panel.classList.contains('open')) return;
    var best = null, bestD = 65;  // +30% sobre v14 (50→65) para click confortable con nodos más grandes
    for (var i = 0; i < nCont.length; i++) {
      var n = nCont[i];
      var d = p.dist(p.mouseX, p.mouseY, n.x, n.y);
      // Hover boost: nodos atraídos por el cursor son clickeables aunque estén lejos
      var hoverBoost = smoothstep(RADIO, RADIO * 0.2, d);
      if (depthFactor(n.z, hoverBoost) < 0.35) continue;
      if (d < RADIO && d < bestD) { bestD = d; best = n; }
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

  p.windowResized = function() {
    var newH = window.innerHeight - navH;
    var prevW = p.width, prevH = p.height;
    p.resizeCanvas(window.innerWidth, newH);
    // Remapar nodos proporcionalmente al nuevo canvas
    var scaleX = p.width  / (prevW || p.width);
    var scaleY = p.height / (prevH || p.height);
    nCont.forEach(function(n) { n.x *= scaleX; n.y *= scaleY; });
    nAmb.forEach(function(n)  { n.x *= scaleX; n.y *= scaleY; });
  };

  // Redistribución animada al toggle del nav
  window.addEventListener('nav-toggled', function(e) {
    navH = e.detail.navH;
    var newH = window.innerHeight - navH;
    var prevW = p.width, prevH = p.height;
    p.resizeCanvas(window.innerWidth, newH);
    var scaleX = p.width  / (prevW || p.width);
    var scaleY = p.height / (prevH || p.height);

    // Mover nodos hacia sus posiciones remapeadas con impulso suave
    nCont.forEach(function(n) {
      var tx = n.x * scaleX;
      var ty = n.y * scaleY;
      // Velocidad proporcional a la distancia de destino — arriba/abajo según expansión
      n.vx += (tx - n.x) * 0.04;
      n.vy += (ty - n.y) * 0.04;
      n.x = tx;
      n.y = ty;
    });
    nAmb.forEach(function(n) {
      var tx = n.x * scaleX;
      var ty = n.y * scaleY;
      n.x = tx;
      n.y = ty;
    });
  });

  // Cuando el landing revela la app, el canvas pudo haberse creado con
  // dimensiones incorrectas (la app estaba en display:none). Recalcular.
  window.addEventListener('app-revealed', function() {
    setTimeout(function() {
      p.resizeCanvas(window.innerWidth, window.innerHeight - navH);
    }, 50);
  });

}, document.getElementById('canvas-wrapper'));

