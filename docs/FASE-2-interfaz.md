# Fase 2 — Rediseño de la interfaz

> Encargo de Nathalie Hernández, 23 nov 2026. Leer antes `CLAUDE.md`.
> Rama: `fase-2-interfaz`. Entregar por bloques, mostrando cada uno en local antes de seguir.

## Idea central

Hoy el rizoma es la puerta principal. Pasa a ser **una de las formas de ver los datos**, no la única.
Marañas se organiza como una plataforma de archivo de investigación con dos entradas claras:
**Entrar al archivo** y **Entrar al rizoma**.

**Referencia de organización:** `https://edulands.eu/oer-search/`. Panel lateral fijo a la izquierda con
buscador, categorías con color que se pueden prender y apagar, y selector de vista (Red · Mapa · Lista).
La visualización ocupa el resto de la pantalla a la derecha. Edulands usa `force-graph` + `d3-force` para la red;
en Marañas **se mantiene p5.js**, porque el rizoma dibujado es parte de la identidad artística.

**Referencia de presentación como proyecto de investigación:** `https://www.hilame.info/` (ya aplicada en la Fase 1).

---

## Bloque A — Portada con dos entradas

- La portada conserva título, video de fondo, texto y la franja «Qué es».
- El botón único «Entrar al rizoma» se reemplaza por **dos botones del mismo peso**:
  **Entrar al archivo** → vista de archivo · **Entrar al rizoma** → vista de red.
- Ajustar los enlaces de la franja «Qué es» para que lleven a las nuevas vistas.

## Bloque B — Estructura «panel izquierdo + visualización derecha»

Una sola pantalla de exploración, compartida por el archivo y el rizoma:

- **Panel izquierdo fijo** (~280–320 px, se puede plegar; en móvil pasa a cajón desplegable):
  - Selector de vista: **Rizoma** · **Archivo** (cuadrícula de miniaturas) · **Lista** (tabla compacta).
    Dejar previsto un hueco para una futura vista **Mapa** geográfico (no construirla ahora).
  - Buscador de texto (título, descripción, etiquetas).
  - **Categorías** por tipo de archivo, con color propio, contador y miniatura (ver Bloque D). Se prenden y apagan.
  - Filtros secundarios plegables: obra/grupo, nicho somato-poético, estado.
  - Contador «X archivos visibles».
- **Visualización a la derecha:** ocupa todo el espacio restante. Los filtros del panel afectan a las tres vistas
  por igual, con un único estado de filtros compartido.
- La navegación superior actual (Proyecto, Método, Grupos, Contacto) se mantiene para las páginas de texto.

## Bloque C — Rizoma más legible y más vivo

- **Nodos más grandes y de tamaño variable según su número de relaciones** (grado: conexiones por etiquetas,
  nichos, prácticas u obra compartidas). Rango claro entre el más chico y el más grande; el mínimo debe ser
  fácil de señalar con el mouse.
- **Conexiones más visibles, en línea punteada y animada** (el trazo «fluye»).
- **Vitalidad desigual:** no todas las conexiones se mueven igual. Más relaciones compartidas entre dos nodos →
  trazo más grueso, más opaco y animación más rápida. Las débiles quedan tenues y lentas.
  Que se sienta que algunas conexiones están más vivas que otras.
- **Al pasar el mouse sobre un nodo:** mostrar con claridad el **nombre del archivo** (código + título), resaltar
  sus conexiones y atenuar el resto. Clic → abre la ficha como hoy.
- Las categorías apagadas en el panel desaparecen o se atenúan en el rizoma.
- Cuidar el rendimiento con cientos de nodos: debe seguir fluido.

## Bloque D — Archivo con miniaturas y categorías visibles

- **Categorías grandes y claras** arriba o en el panel: una tarjeta por tipo de dato (foto, video, texto, audio,
  documento, etc., según los `tipo` reales del catálogo), cada una con **miniatura**, nombre y cantidad.
- **Tarjetas de archivo con miniatura grande** en lugar de las tarjetas solo de texto:
  - Galerías de fotos: primera imagen desde Cloudinary, con transformación de miniatura
    (`c_fill,w_480,h_320,q_auto,f_auto`) para que cargue liviano.
  - Videos de YouTube: `https://img.youtube.com/vi/<ID>/hqdefault.jpg`.
  - Textos/PDF sin imagen: portada diseñada con la tipografía de Marañas (título en itálica + color de la categoría).
  - Carga diferida (`loading="lazy"`) siempre.
- **Estilo de las miniaturas:** Nathalie entregará ejemplos de referencia en `referencias/miniaturas/`.
  **Antes de diseñar las tarjetas, revisar esa carpeta**; si está vacía, preguntar por los ejemplos y avanzar
  mientras tanto con los Bloques A–C.
- **Ficha de cada archivo** (`mostrarNodo`): mostrar también la galería en miniaturas (cuadrícula que abre el visor
  `LB`). Mantener la cita del archivo al final.

## Bloque E — Preparar los datos para crecer (habilita la Fase 3)

- Sacar el catálogo de dentro del HTML a `data/catalogo.json` (o `data/catalogo.js` si es necesario para abrir la
  página con doble clic sin servidor; comprobarlo y elegir).
- Mantener intactos los campos actuales y agregar `thumb` opcional (miniatura elegida a mano).
- Esto deja listo el terreno para subir el disco duro sin tocar la interfaz.

---

## Fuera de esta fase (no hacer ahora)

- **Fase 3 · Disco duro → nube:** subir todo el material nuevo (fotos a Cloudinary, videos largos a YouTube),
  catalogarlo y conectarlo. Ojo con el límite del plan de Cloudinary: estimar el peso antes de subir.
  Existen `scripts/compress_photos.py`, `compress_video.py`, `rename_photos.py` y `upload_cloudinary.py`.
- **Fase 4 · Máquina virtual de la Universidad Distrital** (vía VPN).
- Reactivar la descarga CSV/JSON (solo si Nathalie lo pide).

## Cómo entregar

1. Antes de escribir código: un **plan corto** con orden de trabajo, archivos que se tocan y decisiones técnicas.
   Esperar el visto bueno.
2. Construir **por bloques (A → E)**. Al cerrar cada bloque: commit, prueba en local (escritorio y móvil, consola
   limpia) y decirle a Nathalie qué abrir para verlo.
3. Cuando ella apruebe todo: merge a `main`, `git push origin main` y verificar el sitio público.
