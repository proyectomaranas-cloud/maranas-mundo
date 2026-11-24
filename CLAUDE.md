# Marañas Mundo — contexto del proyecto

Plataforma web de **Marañas Mundo**, cartografía viva del proyecto de investigación-creación
*«Prácticas artísticas para una Colombia más-que-humana: de los mundos de plantación a las marañas-mundo»*
(Universidad Distrital Francisco José de Caldas · Facultad de Artes ASAB).

- **Investigador principal:** Álvaro Iván Hernández Rodríguez.
- **Cartografía digital y dirección de la plataforma:** Nathalie Hernández, con quien trabajas.
- 30 creadores-investigadores · 4 grupos · 4 obras · 8 nichos somato-poéticos.
- La interlocutora es artista visual y directora creativa, **no programadora**. Habla en español, explica en
  lenguaje claro, decide tú lo técnico y pregúntale solo lo curatorial o lo irreversible.

## Dónde vive

| Qué | Dónde |
|---|---|
| Repositorio | `github.com/proyectomaranas-cloud/maranas-mundo` (rama `main` = sitio publicado) |
| Sitio público | `proyectomaranas-cloud.github.io/maranas-mundo` (GitHub Pages, se actualiza al hacer push a `main`) |
| Carpeta local | `C:\Users\nathe\maranas-mundo` |
| Medios | Cloudinary, cuenta `dt6cvonyy` (fotos `.webp`/`.jpg`); videos largos en YouTube |
| Destino final | Máquina virtual de la Universidad Distrital (vía VPN). Es la **última** fase; no tocar todavía |

## Arquitectura actual (nov 2026, tras la Fase 2)

Sin build. p5.js 1.9.4 por CDN. La página abre con doble clic (`file://`) y en GitHub Pages.

| Archivo | Qué contiene |
|---|---|
| `index.html` | Solo el HTML: portada (`#landing`), menú, panel del explorador (`#exp`), vistas y visor |
| `data/catalogo.js` | **Los datos**: `SUBPROYECTOS`, `ARCHIVOS`, `CONEXIONES_VISUALES`, `CONEXIONES_TEXTO`. Aquí se agrega material |
| `css/maranas.css` | Estilos originales e identidad (variables en `:root`) |
| `css/explorar.css` | Estilos de la Fase 2: portada, panel, archivo, lista, miniaturas, móvil |
| `js/landing.js` | Portada y transición (`entrarAlRizoma(destino)`, `volverAlInicio()`) |
| `js/app.js` | `CATEGORIAS`, `CONTENIDOS`, `mostrarVista`, `mostrarNodo`, `renderGaleria`, `calcularRed` y el sketch p5 del rizoma |
| `js/explorar.js` | Objeto `EXP`: estado único de filtros, panel izquierdo, vistas Archivo y Lista, miniaturas |
| `js/lightbox.js` | Visor de fotos `LB` |
| `js/fase1.js` | Cifras, citas y (desactivada) descarga de datos |

- Registros (`ARCHIVOS` → `CONTENIDOS`, se omite `SUB-01`): `id`, `sub`, `tipo`, `titulo`, `fecha`, `desc`, `tags`,
  `temas` (nichos), `practicas`, `estado` (`apto` / `sinrevisar`), `youtubeId` o `archivo: 'youtube:ID'`,
  `cloudinaryFolder`, `cloudinaryFiles`, y `thumb` opcional (miniatura elegida a mano).
- Vistas: portada → `mostrarVista(nombre)` con `mapa` (rizoma), `archivo` (cuadrícula o lista según `EXP.st.modo`),
  `sobre` (Proyecto), `metodo`, `grupos`, `contacto`, `nodo` (ficha, vía `mostrarNodo(cont)`).
- **Explorador:** el panel `#exp` se muestra en `mapa` y `archivo`. Los filtros viven en `EXP.st`; `EXP.aplicar()`
  marca `c._visible` en cada registro y el rizoma lo lee. Categorías (color por `tipo`) en `CATEGORIAS` de `js/app.js`.
- **Rizoma:** `calcularRed()` puntúa lo que comparten dos archivos (etiqueta, nicho, práctica u obra = 1; conexión
  curada = 3). Grado → tamaño del nodo; fuerza → grosor, opacidad y velocidad del trazo punteado.
- Visor de fotos: objeto global `LB` (lightbox). Helper `esVideo(archivo)`.
- Cursor personalizado: el sitio usa `cursor: none` + `#cursor-ring`; los elementos nuevos deben respetarlo.
- Paleta e identidad: variables CSS en `:root` (`--ocre`, `--willow`, `--verde-luz`, `--crema`, `--blanco`,
  `--text-mid`, `--text-dim`, `--line`, `--line-strong`, fuentes `--font-italic` y `--font-mono`).
  Fondo oscuro, títulos en itálica serif, rótulos en mono espaciada. **Esta identidad se conserva.**
- Móvil (≤ 860 px): menú compacto y panel como cajón desplegable.

## Ya hecho — no romper

- **Fase 1 (publicada):** franja «Qué es» en la portada (`#quees`), «Marañas en cifras» (`#cifras`, se calcula
  desde `CONTENIDOS`), «Cómo citar» del sitio (`#cita-sitio`, autor: solo Álvaro) y cita por cada nodo
  (`#nodo-cita-bloque`). Bloque de JS marcado `FASE 1` al final del archivo; envuelve `mostrarVista` y `mostrarNodo`.
- **Descarga de datos CSV/JSON: DESACTIVADA a propósito** hasta que el investigador principal la apruebe.
  El código está en el script FASE 1; no volver a poner los botones sin que Nathalie lo pida.
- Corrección del `<script>` mal cerrado del lightbox (antes rompía `LB`, el scroll en páginas y el video).
- **Fase 2 (rama `fase-2-interfaz`, pendiente de aprobación de Nathalie; no publicada):** portada con dos entradas,
  explorador con panel izquierdo, rizoma por relaciones, archivo con miniaturas, lista y catálogo en `data/catalogo.js`.
  La vista **Mapa** geográfico está prevista en el selector, deshabilitada.

## Reglas de trabajo

1. **Rama por fase** (`fase-2-interfaz`, etc.). Nunca trabajar directo en `main`.
2. **Commits pequeños y descriptivos en español**, uno por bloque funcional.
3. **Probar antes de mostrar:** abrir la página, revisar la consola sin errores, probar a 1440 px y 390 px (móvil),
   verificar que rizoma, archivo, fichas, visor de fotos y citas siguen funcionando.
4. **Publicar = merge a `main` + `git push origin main`**, solo cuando Nathalie apruebe lo que vio en local.
   Después del push, verificar el sitio público (GitHub Pages tarda 1–5 min; recargar con Ctrl+F5).
5. Sin herramientas de build (nada de npm/webpack/React). HTML + CSS + JS plano, librerías por CDN si hacen falta.
   Se permite dividir `index.html` en `css/`, `js/` y `data/` si mejora el mantenimiento; avisar antes.
6. Diseñar todo para **cientos de registros**, no 29: el disco duro con el material nuevo se sube en la fase 3.
7. No inventar contenidos (textos, autorías, fechas, créditos). Si falta un dato, dejar un marcador visible y preguntar.
8. Respetar la estética propia de Marañas: de las referencias se toman **patrones de organización e interacción**,
   no su apariencia.
