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

## Arquitectura actual (nov 2026)

- **Un solo archivo `index.html`** (~4.100 líneas): CSS + HTML + JS, sin build. p5.js 1.9.4 por CDN.
- Datos dentro del script: `SUBPROYECTOS` (obras/grupos) y `CONTENIDOS` (29 registros: `id`, `sub`, `tipo`,
  `titulo`, `fecha`, `desc`, `tags`, `temas` (nichos), `practicas`, `estado` (`apto` / `sinrevisar`),
  `youtubeId` o `archivo: 'youtube:ID'`, `cloudinaryFolder`, `cloudinaryFiles`).
- Vistas: portada (`#landing`, con video de fondo) → `mostrarVista(nombre)` con `mapa` (rizoma p5),
  `sobre` (Proyecto), `metodo`, `archivo`, `grupos`, `contacto`, `nodo` (ficha, vía `mostrarNodo(cont)`).
- Visor de fotos: objeto global `LB` (lightbox). Helper `esVideo(archivo)`.
- Cursor personalizado: el sitio usa `cursor: none` + `#cursor-ring`; los elementos nuevos deben respetarlo.
- Paleta e identidad: variables CSS en `:root` (`--ocre`, `--willow`, `--verde-luz`, `--crema`, `--blanco`,
  `--text-mid`, `--text-dim`, `--line`, `--line-strong`, fuentes `--font-italic` y `--font-mono`).
  Fondo oscuro, títulos en itálica serif, rótulos en mono espaciada. **Esta identidad se conserva.**

## Ya hecho — no romper

- **Fase 1 (publicada):** franja «Qué es» en la portada (`#quees`), «Marañas en cifras» (`#cifras`, se calcula
  desde `CONTENIDOS`), «Cómo citar» del sitio (`#cita-sitio`, autor: solo Álvaro) y cita por cada nodo
  (`#nodo-cita-bloque`). Bloque de JS marcado `FASE 1` al final del archivo; envuelve `mostrarVista` y `mostrarNodo`.
- **Descarga de datos CSV/JSON: DESACTIVADA a propósito** hasta que el investigador principal la apruebe.
  El código está en el script FASE 1; no volver a poner los botones sin que Nathalie lo pida.
- Corrección del `<script>` mal cerrado del lightbox (antes rompía `LB`, el scroll en páginas y el video).

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
