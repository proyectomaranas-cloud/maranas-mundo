/* ══════════════════════════════════════════
   LANDING + TRANSICIÓN  (script independiente, previo a p5)
   No depende del sketch p5: si p5 fallara, el landing y la
   navegación siguen funcionando.
══════════════════════════════════════════ */
(function() {
  var landingEl = document.getElementById('landing');
  var appEl     = document.getElementById('app');

  function revelarApp() {
    appEl.style.display = 'block';
    // Avisar a quien escuche (el sketch p5) que la app ya es visible,
    // para que recalcule el tamaño del canvas.
    window.dispatchEvent(new Event('app-revealed'));
  }

  window.entrarAlRizoma = function(destino) {
    if (!landingEl) return;
    landingEl.classList.add('fade-out');
    revelarApp();  // mostrar la app bajo el landing durante el fundido

    setTimeout(function() {
      landingEl.style.display = 'none';
      // landing-video y landing-overlay son position:fixed — escapan del padre oculto
      var lv = document.getElementById('landing-video');
      var lo = document.getElementById('landing-overlay');
      if (lv) lv.style.display = 'none';
      if (lo) lo.style.display = 'none';
      if (window._landingRAF) cancelAnimationFrame(window._landingRAF);

      // Navegar al destino. mostrarVista puede no existir aún si p5 falló;
      // se protege con typeof.
      if (typeof mostrarVista === 'function') {
        if (destino === 'temas' || destino === 'archivo' || destino === 'tronco') {
        mostrarVista('archivo');
      } else {
        mostrarVista('mapa');
      }
      }
    }, 900);  // coincide con el fundido CSS
  };

  window.volverAlInicio = function() {
    if (!landingEl) return;
    landingEl.style.display = 'block';
    void landingEl.offsetWidth;  // reflow para reactivar la transición
    landingEl.classList.remove('fade-out');
    appEl.style.display = 'none';
    iniciarLandingCanvas();
  };

  // ── Listeners de portales y botones ──
  document.querySelectorAll('.portal').forEach(function(portal) {
    portal.addEventListener('click', function() {
      window.entrarAlRizoma(this.dataset.portal);
    });
  });
  var btnDirecto = document.getElementById('entrar-directo');
  if (btnDirecto) btnDirecto.addEventListener('click', function() { window.entrarAlRizoma('libre'); });
  var btnInicio = document.getElementById('btn-inicio');
  if (btnInicio) btnInicio.addEventListener('click', function() { window.volverAlInicio(); });

  /* ── Canvas atmosférico del landing (vanilla, sin p5) ── */
  window.iniciarLandingCanvas = function() {
    var cv = document.getElementById('landing-canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var W, H, parts;
    var PAL = [[47,191,113],[237,125,58],[229,181,59],[140,216,103],[157,151,138]];

    function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    parts = [];
    var n = Math.min(70, Math.floor(W * H / 26000));
    for (var i = 0; i < n; i++) {
      var col = PAL[Math.floor(Math.random() * PAL.length)];
      var r = Math.random();
      var px = Math.random() * W, py = Math.random() * H;
      parts.push({
        ax: px, ay: py, x: px, y: py,
        size: 0.6 + r * r * r * 3.4,
        col: col,
        ph: Math.random() * Math.PI * 2,
        spd: 0.15 + Math.random() * 0.4,
        amp: 8 + Math.random() * 22,
        baseAlpha: 0.12 + Math.random() * 0.35
      });
    }

    var t = 0;
    function frame() {
      t += 0.004;
      ctx.clearRect(0, 0, W, H);
      // líneas tenues entre partículas cercanas
      for (var i = 0; i < parts.length; i++) {
        var a = parts[i];
        for (var j = i + 1; j < parts.length; j++) {
          var b = parts[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dd = Math.sqrt(dx*dx + dy*dy);
          if (dd < 150) {
            ctx.strokeStyle = 'rgba(' + a.col[0] + ',' + a.col[1] + ',' + a.col[2] + ',' + ((1 - dd/150) * 0.10) + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // partículas
      for (var k = 0; k < parts.length; k++) {
        var pt = parts[k];
        pt.x = pt.ax + Math.cos(t * pt.spd + pt.ph) * pt.amp;
        pt.y = pt.ay + Math.sin(t * pt.spd * 0.8 + pt.ph * 1.4) * pt.amp;
        var alpha = pt.baseAlpha * (0.7 + Math.sin(t * 2 + pt.ph) * 0.3);
        ctx.fillStyle = 'rgba(' + pt.col[0] + ',' + pt.col[1] + ',' + pt.col[2] + ',' + (alpha * 0.25) + ')';
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(' + pt.col[0] + ',' + pt.col[1] + ',' + pt.col[2] + ',' + alpha + ')';
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill();
      }
      window._landingRAF = requestAnimationFrame(frame);
    }
    if (window._landingRAF) cancelAnimationFrame(window._landingRAF);
    frame();
  };
  window.iniciarLandingCanvas();
})();
