/* ── Lightbox global ── */
var LB = {
  files: [], folder: '', index: 0,
  el: null, img: null, counter: null, loading: null,

  init: function() {
    this.el      = document.getElementById('lightbox');
    this.img     = document.getElementById('lightbox-img');
    this.counter = document.getElementById('lightbox-counter');
    this.loading = document.getElementById('lightbox-loading');

    document.getElementById('lightbox-close').onclick = function() { LB.close(); };
    document.getElementById('lightbox-prev').onclick  = function() { LB.nav(-1); };
    document.getElementById('lightbox-next').onclick  = function() { LB.nav(1); };
    this.el.addEventListener('click', function(e) {
      if (e.target === LB.el) LB.close();
    });
    document.addEventListener('keydown', function(e) {
      if (!LB.el.classList.contains('open')) return;
      if (e.key === 'ArrowLeft')  LB.nav(-1);
      if (e.key === 'ArrowRight') LB.nav(1);
      if (e.key === 'Escape')     LB.close();
    });
  },

  open: function(folder, files, index) {
    this.folder = folder;
    this.files  = files;
    this.index  = index;
    this.el.classList.add('open');
    this.show();
  },

  show: function() {
    var fname = this.files[this.index];
    var url = 'https://res.cloudinary.com/dt6cvonyy/image/upload/q_auto/' + fname;
    this.img.style.opacity = '0';
    this.loading.style.display = 'block';
    this.img.onload = function() {
      LB.img.style.opacity = '1';
      LB.loading.style.display = 'none';
    };
    this.img.src = url;
    this.counter.textContent = (this.index + 1) + ' / ' + this.files.length;
  },

  nav: function(dir) {
    this.index = (this.index + dir + this.files.length) % this.files.length;
    this.show();
  },

  close: function() {
    this.el.classList.remove('open');
    this.img.src = '';
  }
};
LB.init();

// Reenviar scroll de rueda a la vista visible cuando no estamos en el mapa.
// p5.js escucha wheel en window con preventDefault, así que capturamos
// en la fase de captura (useCapture=true) para llegar antes que p5.
window.addEventListener('wheel', function(e) {
  // Si el landing está visible, dejarlo scrollear normalmente
  var landing = document.getElementById('landing');
  if (landing && !landing.classList.contains('fade-out') && landing.style.display !== 'none') {
    landing.scrollTop += e.deltaY;
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  // En el mapa sin landing: p5 maneja el wheel
  if (vistaActual === 'mapa') return;
  // En vistas de página: reenviar scroll al elemento visible
  var vista = document.querySelector('.vista-pagina.visible');
  if (vista) {
    vista.scrollTop += e.deltaY;
    e.preventDefault();
    e.stopPropagation();
  }
}, { passive: false, capture: true });
