/* ══════════════════════════════════════════
   FASE 1 · Qué es · En cifras · Cómo citar · Datos abiertos
   Todo se calcula desde CONTENIDOS / SUBPROYECTOS: al crecer el
   catálogo, las cifras y las descargas se actualizan solas.
══════════════════════════════════════════ */
(function () {
  if (typeof CONTENIDOS === 'undefined' || typeof SUBPROYECTOS === 'undefined') return;

  var TITULO_PROYECTO = 'Prácticas artísticas para una Colombia más-que-humana: de los mundos de plantación a las marañas-mundo';
  var esVid = (typeof esVideo === 'function') ? esVideo : function () { return false; };

  function urlSitio() { return location.origin + location.pathname.replace(/index\.html$/, ''); }
  function hoy() {
    return new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function ytDe(c) {
    if (c.youtubeId) return c.youtubeId;
    var m = /^youtube:([\w-]{6,})$/.exec(c.archivo || '');
    return m ? m[1] : '';
  }

  /* ── Cifras ─────────────────────────────── */
  function calcularCifras() {
    var fotos = 0, videos = 0;
    CONTENIDOS.forEach(function (c) {
      if (ytDe(c)) videos++;
      (c.cloudinaryFiles || []).forEach(function (f) { if (esVid(f)) videos++; else fotos++; });
    });
    return { archivos: CONTENIDOS.length, fotos: fotos, videos: videos };
  }
  var CIFRAS = calcularCifras();

  function animarCifras() {
    document.querySelectorAll('#cifras [data-cifra]').forEach(function (el) {
      var clave = el.dataset.cifra;
      var meta = (clave in CIFRAS) ? CIFRAS[clave] : parseInt(el.textContent, 10) || 0;
      var t0 = performance.now(), dur = 1400;
      (function paso(t) {
        var k = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(meta * (1 - Math.pow(1 - k, 4))).toLocaleString('es-CO');
        if (k < 1) requestAnimationFrame(paso);
      })(t0);
    });
  }

  /* ── Citas ──────────────────────────────── */
  function citaSitioHTML() {
    return 'Hernández Rodríguez, Á. I. (2026). ' +
      '<em>Marañas Mundo: cartografía viva del proyecto «' + TITULO_PROYECTO + '»</em> [Plataforma web]. ' +
      'Universidad Distrital Francisco José de Caldas, Facultad de Artes ASAB. Recuperado el ' + hoy() + ', de ' + esc(urlSitio());
  }
  function autorDe(c) {
    var sub = SUBPROYECTOS[c.sub] || {};
    var g = (sub.grupo || '').split(' · ')[0];
    return /^Grupo/.test(g) ? g : 'Proyecto Marañas Mundo';
  }
  function citaNodoHTML(c) {
    var anio = /^\d{4}/.test(c.fecha || '') ? c.fecha.slice(0, 4) : 's. f.';
    return esc(autorDe(c)) + '. (' + anio + '). <em>' + esc(c.titulo) + '</em> [' + esc(c.tipo) + ', registro ' + esc(c.id) + ']. ' +
      'En <em>Marañas Mundo</em>. Universidad Distrital Francisco José de Caldas. ' + esc(urlSitio());
  }

  function copiar(id, btn) {
    var el = document.getElementById(id);
    if (!el) return;
    var txt = el.innerText.trim();
    var listo = function () {
      var o = btn.textContent; btn.textContent = '✓ copiada'; btn.classList.add('ok');
      setTimeout(function () { btn.textContent = o; btn.classList.remove('ok'); }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(listo, function () { seleccionar(el); });
    } else { seleccionar(el); }
  }
  function seleccionar(el) {
    var r = document.createRange(); r.selectNodeContents(el);
    var s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-copiar]');
    if (b) copiar(b.dataset.copiar, b);
  });

  /* ── Datos abiertos ─────────────────────── */
  function filas() {
    return CONTENIDOS.map(function (c) {
      var sub = SUBPROYECTOS[c.sub] || {};
      var files = c.cloudinaryFiles || [];
      var yt = ytDe(c);
      return {
        id: c.id,
        obra: sub.titulo || c.sub,
        grupo: sub.grupo || '',
        tipo: c.tipo || '',
        titulo: c.titulo || '',
        fecha: c.fecha || '',
        descripcion: c.desc || '',
        etiquetas: (c.tags || []).join(' | '),
        nichos: (c.temas || []).join(' | '),
        practicas: (c.practicas || []).join(' | '),
        estado: c.estado || '',
        youtube: yt ? 'https://www.youtube.com/watch?v=' + yt : '',
        fotos_publicadas: files.filter(function (f) { return !esVid(f); }).length,
        videos_en_galeria: files.filter(function (f) { return esVid(f); }).length,
        carpeta_cloudinary: c.cloudinaryFolder || ''
      };
    });
  }
  function bajar(nombre, contenido, tipo) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    a.download = nombre;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function aCSV(rows) {
    var cols = Object.keys(rows[0] || {});
    var q = function (v) { v = String(v == null ? '' : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    return '﻿' + [cols.join(',')].concat(rows.map(function (r) {
      return cols.map(function (k) { return q(r[k]); }).join(',');
    })).join('\r\n');
  }
  var fecha = new Date().toISOString().slice(0, 10);
  var bCSV = document.getElementById('descargar-csv');
  var bJSON = document.getElementById('descargar-json');
  if (bCSV) bCSV.addEventListener('click', function () {
    bajar('maranas-mundo_catalogo_' + fecha + '.csv', aCSV(filas()), 'text/csv;charset=utf-8');
  });
  if (bJSON) bJSON.addEventListener('click', function () {
    bajar('maranas-mundo_catalogo_' + fecha + '.json', JSON.stringify({
      proyecto: TITULO_PROYECTO,
      plataforma: 'Marañas Mundo',
      institucion: 'Universidad Distrital Francisco José de Caldas · Facultad de Artes ASAB',
      url: urlSitio(),
      generado: new Date().toISOString(),
      registros: filas()
    }, null, 2), 'application/json');
  });
  var nota = document.getElementById('datos-nota');
  if (nota) nota.textContent = CIFRAS.archivos + ' registros · UTF-8 · el CSV abre directo en Excel, Google Sheets o LibreOffice. ' +
    'Para reutilizar imágenes o videos, escribir al equipo del proyecto.';

  /* ── Enganches con la navegación existente ─ */
  var citaSitio = document.getElementById('cita-sitio');
  if (citaSitio) citaSitio.innerHTML = citaSitioHTML();

  if (typeof mostrarVista === 'function') {
    var _mostrarVista = mostrarVista;
    mostrarVista = function (nombre) {
      _mostrarVista.apply(this, arguments);
      if (nombre === 'sobre') setTimeout(animarCifras, 250);
    };
  }
  if (typeof mostrarNodo === 'function') {
    var _mostrarNodo = mostrarNodo;
    mostrarNodo = function (cont) {
      _mostrarNodo.apply(this, arguments);
      var cuerpo = document.getElementById('nodo-cuerpo-extra');
      var previa = document.getElementById('nodo-cita-bloque');
      if (previa) previa.remove();
      if (!cuerpo || !cont) return;
      var bloque = document.createElement('div');
      bloque.className = 'nodo-cita'; bloque.id = 'nodo-cita-bloque';
      bloque.innerHTML = '<div class="publicacion-eyebrow">Cómo citar este archivo</div>' +
        '<div class="cita-caja" id="cita-nodo">' + citaNodoHTML(cont) + '</div>' +
        '<div class="cita-acciones"><button class="btn-fase1" data-copiar="cita-nodo">copiar cita</button></div>';
      cuerpo.parentNode.insertBefore(bloque, cuerpo.nextSibling);
    };
  }

  /* Botones del bloque «Qué es» en el landing */
  document.querySelectorAll('[data-quees]').forEach(function (b) {
    b.addEventListener('click', function () {
      var destino = this.dataset.quees;
      if (typeof window.entrarAlRizoma !== 'function') return;
      if (destino === 'archivo') { window.entrarAlRizoma('archivo'); return; }
      window.entrarAlRizoma('libre');
      if (destino === 'mapa') return;
      setTimeout(function () {
        mostrarVista('sobre');
        if (destino === 'datos') setTimeout(function () {
          var d = document.getElementById('marana-datos');
          if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }, 950);
    });
  });
})();
