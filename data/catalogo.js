/* ══════════════════════════════════════════
   MARAÑAS MUNDO · CATÁLOGO
   Este archivo contiene SOLO datos: obras/grupos, archivos y conexiones.
   La interfaz (index.html) lo lee al cargar; para agregar material nuevo
   se edita aquí, sin tocar la interfaz.

   Campos de cada archivo: id, sub, tipo, titulo, fecha, desc, tags, temas (nichos),
   practicas, estado (apto / sinrevisar), youtubeId o archivo:"youtube:ID",
   cloudinaryFolder, cloudinaryFiles.
   Opcional: thumb → miniatura elegida a mano. Puede ser un nombre de archivo
   de Cloudinary (como los de cloudinaryFiles) o una dirección completa https://…
══════════════════════════════════════════ */

var SUBPROYECTOS = {
  'SUB-01': { titulo:'Gestión · archivo general', tipo:'gestion', rotulo:'Gestión · transversal', grupo:'Coordinación (Nathalie Hernández)',
              desc:'Documentos rectores del proyecto: Plan de Trabajo Inicial, Requerimientos Técnicos y matriz de catalogación. Definen la arquitectura conceptual y técnica del archivo digital.' },
  'SUB-02': { titulo:'De los mundos de plantación a las marañas mundo', tipo:'tronco', rotulo:'OBRA · Dramaturgias del Cuerpo', grupo:'Grupo Dramaturgias del Cuerpo y Escrituras del Espacio · Dir. Álvaro Iván Hernández Rodríguez',
              desc:'Performance en vivo de gran formato. 15 performers entre músicos, actores, bailarines y artistas plásticos. 1h 30 min. 8 nichos somato-poéticos: Respiración, Toque, Encauchamientos, Plantaciones, Abejas, Pájaros, Agua, Enmarañamientos. Registro de video completo y fotos disponibles.' },
  'SUB-03': { titulo:'Enmarañar-Ser', tipo:'rama', rotulo:'OBRA · Arte Danzario', grupo:'Grupo Arte Danzario (PCAD) · Dir. colectiva: Ana Vargas, Diana León, Yina Erazo, Tatán Luna',
              desc:'Videodanza. El ruido, el caos, la ciudad, las ruinas. La búsqueda por conectar de nuevo, consigo misma, con el entorno, con la naturaleza, con las otras. El agua que purifica y limpia. Atravesar el caos y el dolor para elevarse con fuerza y belleza. Volver a tejer la maraña entre nuestros cuerpos y la tierra. Convertirnos en más que humanas. Fotos, videos, making-of y diagramas del proceso de creación.' },
  'SUB-04': { titulo:'Per(r)o mundo', tipo:'rama', rotulo:'OBRA · Aulide', grupo:'Grupo Aulide · Alexánder Llerena · Daniela Botero · Dubián Gallego · Javier Mican · Isabel García · Marcela Ayala · Vicente Bernal',
              desc:'Escritura coral de siete autores que indaga las fronteras de lo humano y lo no-humano. Fotos y videos del proceso de creación, textos y fotos de manuscritos.' },
  'SUB-05': { titulo:'Carne de mis bosques corporados', tipo:'rama', rotulo:'OBRA · Creación Artística', grupo:'Grupo para la Creación Artística · créditos al final del videoperformance',
              desc:'Videoperformance. Registro completo de la obra, fotos detrás de escena y videos. Una experiencia de inmersión y enmarañamiento entre cuerpos, bosques y entidades no humanas.' },
  'SUB-06': { titulo:'Salidas de campo · GRINPLART', tipo:'rama', rotulo:'RAMA · proceso colectivo', grupo:'Transversal a los grupos',
              desc:'Documenta salidas de campo: San Francisco de Sales (27 investigadores · nov 2023), Los Copetones, Villa Rosil. Metodología Integrada centrada en Respiración. Galerías extensas de fotos y videos.' }
};

/* ARCHIVOS: catálogo principal */
var ARCHIVOS = [
  // SUB-01 · Gestión
  { id:'ARC-001', sub:'SUB-01', tipo:'texto', archivo:'Plan de Trabajo Inicial - Matriz de organización del material recopilado.pdf',
    titulo:'Plan de Trabajo Inicial', tam:'0.13 MB', fecha:'2025-11-27',
    desc:'Documento fundacional del catálogo. Define la arquitectura conceptual del archivo y la tipología de contenido. Punto de partida para la cartografía digital del proyecto.',
    tags:['cartografía viva','archivo digital','tipología'], temas:[], practicas:[], estado:'sinrevisar', peso:3 },
  { id:'ARC-002', sub:'SUB-01', tipo:'texto', archivo:'Requerimientos_Tecnicos_Maranas.docx',
    titulo:'Requerimientos Técnicos', tam:'0.03 MB', fecha:'2025-11-25',
    desc:'Especificaciones técnicas de la plataforma digital. Identifica los 4 grupos de investigación participantes y las condiciones de producción del archivo web.',
    tags:['stack tecnológico','infraestructura','4 grupos'], temas:[], practicas:[], estado:'sinrevisar', peso:2 },
  // SUB-02 · Publicación académica
  { id:'ARC-ART-01', sub:'SUB-02', tipo:'texto', archivo:'articulo_maranas.pdf',
    titulo:'Esbozos para un hacer enmarañado · Hernández Rodríguez & Gutiérrez Bermúdez (2025)',
    tam:'~2 MB', fecha:'2025-07-01',
    desc:'Texto fundacional del proyecto. Artículo publicado en Cuadernos de Música, Artes Visuales y Artes Escénicas (Javeriana), Vol. 20(2), pp. 148–165. Propone la maraña como práctica, ideación experimental y método de ideación. doi: 10.11144/javeriana.mavae20-2.pcmh',
    tags:['publicación académica','texto fundacional','maraña','encauchamientos','toque'],
    temas:['plantaciones','enmarañamientos'],
    practicas:['encauchamientos','toque','desbordamientos','sonar','jardinamientos','estudios-con-hojas'],
    estado:'apto', peso:5,
    driveEmbed:'https://drive.google.com/file/d/1jfQdICaJ322KFTcGU5mpV-GqAqxWlaxM/preview',
    icono:'◎ ART' },
  // SUB-02 · Dramaturgias — obra principal
  { id:'ARC-YT-01', sub:'SUB-02', tipo:'video', archivo:'youtube:Tcyzxk4IEl4',
    titulo:'De los mundos de plantación a las marañas mundo · obra completa', tam:'YouTube', fecha:'2025',
    desc:'Registro completo del performance en vivo. 15 performers. 1h 30 min. 8 nichos somato-poéticos. Dirección: Álvaro Iván Hernández Rodríguez. Co-dirección: Regina María Gutiérrez Bermúdez. Música y creación sonora: Hernán Darío Guzmán. Afectografías: María Camila Largo Casallas.',
    tags:['youtube','obra completa','8 nichos','15 performers','Dramaturgias del Cuerpo'],
    temas:['plantaciones','enmarañamientos'],
    practicas:['encauchamientos','sonar','enmarañamientos'],
    estado:'apto', peso:5, youtubeId:'Tcyzxk4IEl4' },
  { id:'ARC-YT-03', sub:'SUB-06', tipo:'video', archivo:'youtube:pendiente',
    titulo:'Cartografías Sur · salidas de campo', tam:'pendiente', fecha:'2025',
    desc:'Video que documenta las salidas de campo al sur: San Francisco de Sales, Los Copetones, Villa Rosil. Registro del proceso colectivo de investigación-creación en territorio.',
    tags:['salidas de campo','territorio','cartografías'],
    temas:['agua','pajaros'],
    practicas:['desbordamientos','sonar'],
    estado:'sinrevisar', peso:3 },
  // SUB-03 · Arte Danzario — Enmarañar-Ser
  { id:'ARC-YT-02', sub:'SUB-03', tipo:'video', archivo:'youtube:2dhOlxuE2nA',
    titulo:'Enmarañar-Ser · videodanza completa', tam:'YouTube', fecha:'2025',
    desc:'Videodanza completa publicada en YouTube. Dirección y creación colectiva: Ana Cecilia Vargas Núñez, Diana Lucía León Bohórquez, Yina Erazo Coral. Música original: Villy Glez. Cámara: Soraya Vargas.',
    tags:['youtube','videodanza','enmarañar-ser'],
    temas:['toque','enmarañamientos'],
    practicas:['toque','jardinamientos'],
    estado:'apto', peso:4, youtubeId:'2dhOlxuE2nA' },
  { id:'ARC-010', sub:'SUB-03', tipo:'texto', archivo:'Marañas guión avances (1).docx',
    titulo:'Guion · Enmarañar-Ser', tam:'—', fecha:'—',
    desc:'Guion de la videodanza estructurado en 16 escenas en 5 bloques temáticos. Locaciones: Hospital San Juan de Dios y San Lucas. Intérpretes: Ana Vargas, Diana León, Yina Erazo, Tatán Luna.',
    tags:['guion','16 escenas','5 bloques','videodanza'],
    temas:['toque','agua'],
    practicas:['toque'],
    estado:'sinrevisar', peso:3 },
  { id:'ARC-011', sub:'SUB-03', tipo:'hoja', archivo:'Tabla de lectura - texto base.xlsx',
    titulo:'Texto base · 18 Árboles · El silencio del salvaje', tam:'—', fecha:'—',
    desc:'«El silencio del salvaje: viaje interior por los laticíferos de la siringa» de Álvaro Hernández, estructurado en 18 Árboles. Lectura coral. Eje metodológico del proyecto y fuente literaria de la videodanza.',
    tags:['texto base','18 árboles','siringa','Álvaro Hernández'],
    temas:['respiracion','plantaciones'],
    practicas:['encauchamientos'],
    estado:'sinrevisar', peso:3 },
  { id:'ARC-012', sub:'SUB-03', tipo:'foto', archivo:'PÓSTER ENMARAÑAR - SER AGOSTO 2025.jpg',
    titulo:'Póster oficial · Enmarañar-Ser', tam:'—', fecha:'2025-08',
    desc:'Póster oficial de la videodanza Enmarañar-Ser. Identidad gráfica del estreno en Teatro Taller de Colombia.',
    tags:['póster','identidad gráfica','estreno','Teatro Taller'],
    temas:['enmarañamientos'],
    practicas:[],
    estado:'sinrevisar', peso:2 },
  { id:'ARC-013', sub:'SUB-03', tipo:'video', archivo:'Enmarañar-Ser_TRAILER FINAL.mp4',
    titulo:'Trailer final · Enmarañar-Ser', tam:'—', fecha:'—',
    desc:'Pieza promocional definitiva de la videodanza. Junto al póster, es la comunicación principal de la obra.',
    tags:['trailer','pieza promocional','videodanza'],
    temas:['toque','enmarañamientos'],
    practicas:['toque'],
    estado:'sinrevisar', peso:3 },
  { id:'SER-ES-01', sub:'SUB-03', tipo:'foto', titulo:'Fotos proceso · Enmarañar-Ser', conteo:'19 fotos', tam:'~30 MB', fecha:'2024-10 a 2025-09',
    desc:'Fotos de proceso, making-off y póster de la videodanza Enmarañar-Ser.',
    temas:['toque','agua'],
    practicas:['toque','jardinamientos'],
    estado:'apto', peso:3,
    esSerie:true, archivo:'[ serie · 19 fotos ]',
    cloudinaryFolder:'enmararanarse_fotos_proce',
    cloudinaryFiles:['enmararanarse_fotos_proce/IMG_20250904_105235','enmararanarse_fotos_proce/POSTER_ENMARANAR_-_SER_AGOSTO_2025','enmararanarse_fotos_proce/WhatsApp_Image_2025-07-03_at_54033_PM','enmararanarse_fotos_proce/WhatsApp_Image_2025-07-03_at_54035_PM','enmararanarse_fotos_proce/WhatsApp_Image_2025-07-03_at_54036_PM','enmararanarse_fotos_proce/Photos-1-001_1/IMG_20241026_154926','enmararanarse_fotos_proce/Photos-1-001_1/IMG_20241026_164928','enmararanarse_fotos_proce/Photos-1-001_1/IMG_20250308_085414','enmararanarse_fotos_proce/Photos-1-001_1/IMG_20250308_085438','enmararanarse_fotos_proce/Photos-1-001_1/IMG_20250308_090322','enmararanarse_fotos_proce/Photos-1-001_1/IMG_20250308_090853','enmararanarse_fotos_proce/Photos-1-001_1/IMG_20250308_090900','enmararanarse_fotos_proce/Photos-1-001_1/IMG_20250308_090918','enmararanarse_fotos_proce/Photos-1-001_1/IMG_20250308_091007','enmararanarse_fotos_proce/Photos-1-001_2/IMG_20241026_090114','enmararanarse_fotos_proce/Photos-1-001_2/IMG_20241026_142501','enmararanarse_fotos_proce/Photos-1-001_2/IMG_20241026_142515','enmararanarse_fotos_proce/Photos-1-001_2/IMG_20241026_165117','enmararanarse_fotos_proce/Photos-1-001_2/Screenshot_2024-10-26-14-03-03-839_comwhatsapp'] },
  { id:'SER-ES-02', sub:'SUB-03', tipo:'video', titulo:'Making-of · Enmarañar-Ser', conteo:'11 videos', tam:'~4 GB', fecha:'2024-10 a 2025-10',
    desc:'Videos del making-of y proceso de creación de la videodanza. Sesiones de ensayo y registro de proceso.',
    temas:['toque','enmarañamientos'],
    practicas:['toque'],
    estado:'sinrevisar', peso:2,
    esSerie:true, archivo:'[ serie · 11 videos ]' },
  { id:'SER-DSCF', sub:'SUB-02', tipo:'foto', titulo:'Fotos obra · Dramaturgias · DSCF', conteo:'71 fotos', tam:'~120 MB', fecha:'2025',
    desc:'Galería profesional de la obra De los mundos de plantación a las marañas mundo. 71 fotografías de alta resolución.',
    temas:['enmarañamientos'],
    practicas:['encauchamientos'],
    estado:'apto', peso:4,
    esSerie:true, archivo:'[ serie · 71 fotos ]',
    cloudinaryFolder:'dramaturgias_fotos_obra',
    cloudinaryFiles:['DSCF3270-Mejorado-NR_aqez5m','DSCF3309-Mejorado-NR_wdhzwc','DSCF3307-Mejorado-NR_qipcwp','DSCF3308-Mejorado-NR_edjhmw','DSCF3420-Mejorado-NR_eh81oj','DSCF3305-Mejorado-NR_pg1pwy','DSCF3356-Mejorado-NR_zbmzho','DSCF3425-Mejorado-NR_tb64kx','DSCF3413-Mejorado-NR_st7f0p','DSCF3342-Mejorado-NR_dm6zpg','DSCF3362-Mejorado-NR_jvoljw','DSCF3359-Mejorado-NR_fhvtln','DSCF3622-Mejorado-NR_fhzzrz','DSCF3379-Mejorado-NR_o0lf5b','DSCF3378-Mejorado-NR_ui3n5t','DSCF3377-Mejorado-NR_ai56k6','DSCF3375_-Mejorado-NR_mf8ptp','DSCF3371-Mejorado-NR_taxe7c','DSCF3369-Mejorado-NR_oxf7dt','DSCF3364-Mejorado-NR_kqtyts','DSCF3382-Mejorado-NR_wzyxfb','DSCF3367-Mejorado-NR_fpqf7z','DSCF3399-Mejorado-NR_yvsqzn','DSCF3656-Mejorado-NR_tzvbel','DSCF3250-Mejorado-NR_dlx5py','DSCF3312-Mejorado-NR_j9a0xk','DSCF3254-Mejorado-NR_yli9xo','DSCF3728-Mejorado-NR_hs9swl','DSCF3328-Mejorado-NR_cwjo5v','DSCF3724-Mejorado-NR_szy0m5','DSCF3610-Mejorado-NR_reinbq','DSCF3625-Mejorado-NR_q07vxq','DSCF3652-Mejorado-NR_dxmd92','DSCF3314-Mejorado-NR_xckj3d','DSCF3318-Mejorado-NR_np2bzd','DSCF3538-Mejorado-NR_k4fr2p','DSCF3393-Mejorado-NR_ibiuag','DSCF3558-Mejorado-NR_lvwsdt','DSCF3397-Mejorado-NR_ohry0w','DSCF3469-Mejorado-NR_u1vn5h','DSCF3277-Mejorado-NR_xucu5z','DSCF3320-Mejorado-NR_zaaebt','DSCF3667-Mejorado-NR_vho5ma','DSCF3467-Mejorado-NR_f5gu9a','DSCF3406-Mejorado-NR_woygrg','DSCF3400-Mejorado-NR_cpzrgr','DSCF3381-Mejorado-NR_lvwf84','DSCF3525-Mejorado-NR_nlhcuy','DSCF3579-Mejorado-NR_lov1qr','DSCF3328_-Mejorado-NR_kzka8t','DSCF3319-Mejorado-NR_gojfcy','DSCF3255-Mejorado-NR_mupcka','DSCF3576-Mejorado-NR_kvyssk','DSCF3283-Mejorado-NR_tbn363','DSCF3593-Mejorado-NR_by5wpy','DSCF3545-Mejorado-NR_pebfcg','DSCF3533-Mejorado-NR_xsstaw','DSCF3551-Mejorado-NR_pn47ry','DSCF3333-Mejorado-NR_nxqlof','DSCF3351-Mejorado-NR_igxbms','DSCF3277_-Mejorado-NR_ll2egz','DSCF3302-Mejorado-NR_jrurhd','DSCF3718-Mejorado-NR_rsguxt','DSCF3344-Mejorado-NR_cp1dd8','DSCF3353-Mejorado-NR_zqzzae','DSCF3355-Mejorado-NR_prgwgp','DSCF3475-Mejorado-NR_f2gmjl','DSCF3597-Mejorado-NR_sgzxcq','DSCF3336-Mejorado-NR_gpt6wj','DSCF3298-Mejorado-NR_lgmubb','DSCF3334-Mejorado-NR_xti9zf'] },
  // SUB-04 · Aulide — Per(r)o mundo
  { id:'ARC-020', sub:'SUB-04', tipo:'texto', archivo:'Cadena JVACD.pdf',
    titulo:'Per(r)o mundo · escritura coral (v.1)', tam:'—', fecha:'—',
    desc:'Escritura coral de siete autores (Alexánder Llerena, Daniela Botero, Dubián Gallego, Javier Mican, Isabel García, Marcela Ayala, Vicente Bernal). Indagación sobre las fronteras de lo humano y lo no-humano.',
    tags:['escritura coral','7 autores','Aulide'],
    temas:['toque','pajaros'],
    practicas:['toque','estudios-con-hojas'],
    estado:'apto', peso:3,
    cloudinaryFolder:'escritura_perro',
    cloudinaryFiles:['escritura_perro/Cadena_JVACD'] },
  { id:'ARC-021', sub:'SUB-04', tipo:'foto', archivo:'Flyer Per(r)o mundo.jpg',
    titulo:'Flyer · Per(r)o mundo', tam:'—', fecha:'—',
    desc:'Pieza gráfica de difusión de la obra Per(r)o mundo.',
    tags:['flyer','difusión','Aulide'],
    temas:['enmarañamientos'],
    practicas:[],
    estado:'sinrevisar', peso:1 },
  { id:'SER-PM-01', sub:'SUB-04', tipo:'foto', titulo:'Fotos proceso · Per(r)o mundo', conteo:'2 fotos', tam:'—', fecha:'—',
    desc:'Fotos y videos detrás de cámara del proceso de creación. Textos y fotos de manuscritos.',
    temas:['toque','pajaros'],
    practicas:['toque'],
    estado:'apto', peso:2,
    esSerie:true, archivo:'[ serie · 2 fotos ]',
    cloudinaryFolder:'perro_mundo',
    cloudinaryFiles:['perro_mundo/Foto_1','perro_mundo/Foto_2'] },
  // SUB-05 · Creación Artística — Carne de mis bosques corporados
  { id:'ARC-030', sub:'SUB-05', tipo:'video', archivo:'youtube:IDmTLHw_Brc',
    titulo:'Carne de mis bosques corporados · videoperformance', tam:'YouTube', fecha:'2025',
    desc:'Videoperformance del Grupo para la Creación Artística. Registro completo de la obra. Los créditos están al final del videoperformance. Una experiencia de inmersión entre cuerpos, bosques y entidades no humanas.',
    tags:['videoperformance','bosques','creación artística','youtube'],
    temas:['encauchamientos','agua','enmarañamientos'],
    practicas:['jardinamientos','desbordamientos'],
    estado:'apto', peso:4, youtubeId:'IDmTLHw_Brc' },
  { id:'SER-CB-01', sub:'SUB-05', tipo:'foto', titulo:'Registro · Carne de mis bosques', conteo:'por inventariar', tam:'—', fecha:'—',
    desc:'Fotos detrás de escena y videos del proceso de creación del videoperformance.',
    temas:['agua','enmarañamientos'],
    practicas:['jardinamientos'],
    estado:'sinrevisar', peso:2,
    esSerie:true, archivo:'[ serie · detrás de escena ]' },
  // SUB-06 · Salidas de campo
  { id:'SER-10', sub:'SUB-06', tipo:'foto', titulo:'GRINPLART · San Francisco de Sales · FOTOS', conteo:'194 fotos', tam:'—', fecha:'2024-11-23 a 2024-11-24',
    desc:'Galería de la salida de campo a San Francisco de Sales. 27 investigadores. Metodología Integrada centrada en Respiración.',
    temas:['respiracion','agua'],
    practicas:['desbordamientos','sonar'],
    estado:'apto', peso:3,
    esSerie:true, archivo:'[ serie · 194 fotos ]',
    cloudinaryFolder:'grinplart/san_francisco',
    cloudinaryFiles:(function(){var a=[];for(var i=1;i<=194;i++)a.push('grinplart/san_francisco/grinplart_sanfrancisco_foto_'+String(i).padStart(4,'0')+'.webp');return a;})() },
  { id:'SER-11', sub:'SUB-06', tipo:'foto', titulo:'GRINPLART · campo · FOTOS', conteo:'151 fotos', tam:'—', fecha:'2024',
    desc:'Fotos de salidas de campo del Grupo para la Creación Artística.',
    temas:['abejas','pajaros'],
    practicas:['jardinamientos','estudios-con-hojas'],
    estado:'sinrevisar', peso:2,
    esSerie:true, archivo:'[ serie · 151 fotos ]',
    cloudinaryFolder:'grinplart/campo',
    cloudinaryFiles:(function(){var a=[];for(var i=1;i<=125;i++)a.push('grinplart/campo/campo_foto_'+String(i).padStart(4,'0')+'.webp');return a;})() },
  { id:'SER-13', sub:'SUB-06', tipo:'foto', titulo:'Los Copetones · fotos', conteo:'65 fotos', tam:'—', fecha:'2024-10-19',
    desc:'Salida de campo a Los Copetones. Registro fotográfico del proceso colectivo de investigación-creación en territorio.',
    temas:['pajaros'],
    practicas:['sonar','estudios-con-hojas'],
    estado:'apto', peso:2,
    esSerie:true, archivo:'[ serie · 65 fotos ]',
    cloudinaryFolder:'grinplart/copetones',
    cloudinaryFiles:['grinplart/copetones/Fotografias_19-10-2024/20241019_112355','grinplart/copetones/Fotografias_19-10-2024/20241019_112403','grinplart/copetones/Fotografias_19-10-2024/20241019_112412','grinplart/copetones/Fotografias_19-10-2024/20241019_112457','grinplart/copetones/Fotografias_19-10-2024/20241019_112501','grinplart/copetones/Fotografias_19-10-2024/20241019_112505','grinplart/copetones/Fotografias_19-10-2024/20241019_112508','grinplart/copetones/Fotografias_19-10-2024/20241019_112522','grinplart/copetones/Fotografias_19-10-2024/20241019_112526','grinplart/copetones/Fotografias_19-10-2024/20241019_112532','grinplart/copetones/Fotografias_19-10-2024/20241019_112541','grinplart/copetones/Fotografias_19-10-2024/20241019_112923','grinplart/copetones/Fotografias_19-10-2024/20241019_112929','grinplart/copetones/Fotografias_19-10-2024/20241019_112941','grinplart/copetones/Fotografias_19-10-2024/20241019_113001','grinplart/copetones/Fotografias_19-10-2024/20241019_113033','grinplart/copetones/Fotografias_19-10-2024/20241019_113036','grinplart/copetones/Fotografias_19-10-2024/20241019_130011','grinplart/copetones/Fotografias_19-10-2024/20241019_130017','grinplart/copetones/Fotografias_19-10-2024/20241019_130022','grinplart/copetones/Fotografias_19-10-2024/20241019_130042','grinplart/copetones/Fotografias_19-10-2024/DSC_0020','grinplart/copetones/Fotografias_19-10-2024/DSC_0021','grinplart/copetones/Fotografias_19-10-2024/DSC_0022','grinplart/copetones/Fotografias_19-10-2024/DSC_0024','grinplart/copetones/Fotografias_19-10-2024/DSC_0025','grinplart/copetones/Fotografias_19-10-2024/DSC_0026','grinplart/copetones/Fotografias_19-10-2024/DSC_0027','grinplart/copetones/Fotografias_19-10-2024/DSC_0028','grinplart/copetones/Fotografias_19-10-2024/DSC_0029','grinplart/copetones/Fotografias_19-10-2024/DSC_0030','grinplart/copetones/Fotografias_19-10-2024/DSC_0031','grinplart/copetones/Fotografias_19-10-2024/DSC_0032','grinplart/copetones/Fotografias_19-10-2024/DSC_0034','grinplart/copetones/Fotografias_19-10-2024/DSC_0035','grinplart/copetones/Fotografias_19-10-2024/DSC_0036','grinplart/copetones/Fotografias_19-10-2024/DSC_0037','grinplart/copetones/Fotografias_19-10-2024/DSC_0038','grinplart/copetones/Fotografias_19-10-2024/DSC_0039','grinplart/copetones/Fotografias_19-10-2024/DSC_0040','grinplart/copetones/Fotografias_19-10-2024/DSC_0041','grinplart/copetones/Fotografias_19-10-2024/DSC_0042','grinplart/copetones/Fotografias_19-10-2024/DSC_0043','grinplart/copetones/Fotografias_19-10-2024/DSC_0044','grinplart/copetones/Fotografias_19-10-2024/DSC_0045','grinplart/copetones/Fotografias_19-10-2024/DSC_0046','grinplart/copetones/Fotografias_19-10-2024/DSC_0047','grinplart/copetones/Fotografias_19-10-2024/DSC_0050','grinplart/copetones/Fotografias_19-10-2024/DSC_0051','grinplart/copetones/Fotografias_19-10-2024/DSC_0054','grinplart/copetones/Fotografias_19-10-2024/DSC_0056','grinplart/copetones/Fotografias_19-10-2024/DSC_0058','grinplart/copetones/Fotografias_19-10-2024/DSC_0059','grinplart/copetones/Fotografias_19-10-2024/DSC_0060','grinplart/copetones/Fotografias_19-10-2024/DSC_0061','grinplart/copetones/Fotografias_19-10-2024/DSC_0062','grinplart/copetones/Fotografias_19-10-2024/DSC_0063','grinplart/copetones/Fotografias_19-10-2024/DSC_0064','grinplart/copetones/Fotografias_19-10-2024/DSC_0065','grinplart/copetones/Fotografias_19-10-2024/DSC_0066','grinplart/copetones/Fotografias_19-10-2024/DSC_0067','grinplart/copetones/Fotografias_19-10-2024/WS__3_','grinplart/copetones/Fotografias_19-10-2024/WS__4_','grinplart/copetones/Fotografias_19-10-2024/WS__5_'] },
  { id:'SER-14', sub:'SUB-06', tipo:'foto', titulo:'Villa Rosil · FOTOS', conteo:'42 fotos', tam:'—', fecha:'—',
    desc:'Salida de campo a Villa Rosil. Fotografías del proceso colectivo de investigación-creación en territorio.',
    temas:['agua','plantaciones'],
    practicas:['jardinamientos','desbordamientos'],
    estado:'apto', peso:2,
    esSerie:true, archivo:'[ serie · 42 fotos ]',
    cloudinaryFolder:'grinplart/villarosil',
    cloudinaryFiles:['grinplart/villarosil/FOTOS/DSC_0075','grinplart/villarosil/FOTOS/DSC_0076','grinplart/villarosil/FOTOS/DSC_0077','grinplart/villarosil/FOTOS/DSC_0078','grinplart/villarosil/FOTOS/DSC_0079','grinplart/villarosil/FOTOS/DSC_0081','grinplart/villarosil/FOTOS/DSC_0082','grinplart/villarosil/FOTOS/DSC_0083','grinplart/villarosil/FOTOS/DSC_0084','grinplart/villarosil/FOTOS/DSC_0086','grinplart/villarosil/FOTOS/DSC_0092','grinplart/villarosil/FOTOS/DSC_0093__1_','grinplart/villarosil/FOTOS/DSC_0093','grinplart/villarosil/FOTOS/DSC_0096','grinplart/villarosil/FOTOS/DSC_0097','grinplart/villarosil/FOTOS/DSC_0098','grinplart/villarosil/FOTOS/DSC_0099','grinplart/villarosil/FOTOS/DSC_0100','grinplart/villarosil/FOTOS/DSC_0101','grinplart/villarosil/FOTOS/DSC_0102','grinplart/villarosil/FOTOS/DSC_0103','grinplart/villarosil/FOTOS/DSC_0104','grinplart/villarosil/FOTOS/DSC_0105','grinplart/villarosil/FOTOS/DSC_0107','grinplart/villarosil/FOTOS/DSC_0108','grinplart/villarosil/FOTOS/DSC_0110','grinplart/villarosil/FOTOS/DSC_0112','grinplart/villarosil/FOTOS/DSC_0113','grinplart/villarosil/FOTOS/DSC_0114','grinplart/villarosil/FOTOS/DSC_0116','grinplart/villarosil/FOTOS/DSC_0117','grinplart/villarosil/FOTOS/DSC_0118','grinplart/villarosil/FOTOS/DSC_0120','grinplart/villarosil/FOTOS/DSC_0121','grinplart/villarosil/FOTOS/DSC_0122','grinplart/villarosil/FOTOS/DSC_0128','grinplart/villarosil/FOTOS/DSC_0131','grinplart/villarosil/FOTOS/DSC_0132','grinplart/villarosil/FOTOS/DSC_0133','grinplart/villarosil/FOTOS/DSC_0134','grinplart/villarosil/FOTOS/DSC_0136','grinplart/villarosil/FOTOS/DSC_0137'] },
  { id:'SER-16', sub:'SUB-02', tipo:'foto', titulo:'FOTO LEMA · «De los mundos de»', conteo:'16 fotos', tam:'~14 MB', fecha:'2025-09-24',
    desc:'Sesión fotográfica profesional. 16 fotos 2K6A7xxx. Documenta el movimiento de los mundos de plantación a las marañas mundo.',
    temas:['plantaciones','enmarañamientos'],
    practicas:['encauchamientos'],
    estado:'apto', peso:2,
    esSerie:true, archivo:'[ serie · 16 fotos ]',
    cloudinaryFolder:'fotolema',
    cloudinaryFiles:['fotolema/2K6A7183','fotolema/2K6A7185','fotolema/2K6A7193','fotolema/2K6A7194','fotolema/2K6A7202','fotolema/2K6A7203','fotolema/2K6A7204','fotolema/2K6A7220','fotolema/2K6A7223','fotolema/2K6A7224','fotolema/2K6A7230','fotolema/2K6A7231','fotolema/2K6A7239','fotolema/2K6A7245','fotolema/2K6A7249','fotolema/2K6A7252'] },

  // SUB-02 · Dramaturgias — nuevos nodos
  { id:'ARC-YT-04', sub:'SUB-02', tipo:'video', archivo:'youtube:Mhwud6X1X0w',
    titulo:'Video 360° · De los mundos de plantación a las marañas mundo', tam:'YouTube', fecha:'2025',
    desc:'Registro inmersivo en video 360° de la obra De los mundos de plantación a las marañas mundo. Experiencia de navegación espacial del performance.',
    tags:['video 360','inmersivo','performance','dramaturgias'],
    temas:['plantaciones','enmarañamientos'],
    practicas:['encauchamientos','sonar'],
    estado:'apto', peso:4, youtubeId:'Mhwud6X1X0w' },

  { id:'SER-DR-01', sub:'SUB-02', tipo:'video', titulo:'Clips · Videos Dramaturgias', conteo:'por inventariar', tam:'—', fecha:'2025',
    desc:'Clips y fragmentos en video de la obra De los mundos de plantación a las marañas mundo. Material de registro y difusión del performance.',
    tags:['clips','video','dramaturgias','performance'],
    temas:['plantaciones','enmarañamientos'],
    practicas:['encauchamientos'],
    estado:'sinrevisar', peso:2,
    esSerie:true, archivo:'[ serie · clips ]' },

  { id:'SER-DR-02', sub:'SUB-02', tipo:'video', titulo:'Entrevistas · Dramaturgias', conteo:'E1–E6', tam:'—', fecha:'2025',
    desc:'Serie de entrevistas con los creadores-investigadores del Grupo Dramaturgias del Cuerpo. 6 entrevistas en video. Pendiente subir a YouTube no listado.',
    tags:['entrevistas','E1-E6','dramaturgias','creadores'],
    temas:['plantaciones','enmarañamientos'],
    practicas:['encauchamientos','toque'],
    estado:'sinrevisar', peso:3,
    esSerie:true, archivo:'[ serie · E1-E6 ]' },

  { id:'SER-DR-03', sub:'SUB-02', tipo:'foto', titulo:'Flyers · Obras del proyecto', conteo:'4 flyers', tam:'—', fecha:'2025',
    desc:'Piezas gráficas de difusión de las obras del proyecto. Flyers de todas las obras de los cuatro grupos.',
    tags:['flyers','difusión','comunicación','todas las obras'],
    temas:['enmarañamientos'],
    practicas:[],
    estado:'apto', peso:1,
    esSerie:true, archivo:'[ serie · flyers ]',
    cloudinaryFolder:'flyers_obras',
    cloudinaryFiles:['flyers_obras/flyer_obra_DRAMATURGIAS_1','flyers_obras/Flyer_obra_CREACIÓN_ARTISTICA_1','flyers_obras/Flyer_obra_AULIDE_1','flyers_obras/Flyer_obra_ARTE_DANZARIO_1'] },

  // SUB-03 · Arte Danzario — nuevos nodos
  { id:'SER-ES-03', sub:'SUB-03', tipo:'texto', titulo:'Textos proceso · Enmarañar-Ser', conteo:'2 documentos', tam:'—', fecha:'—',
    desc:'Textos del proceso de creación de la videodanza Enmarañar-Ser. Guión físico y exploración integral de la investigación-creación en danza.',
    tags:['textos','proceso','escrituras','videodanza'],
    temas:['toque','agua'],
    practicas:['toque','encauchamientos'],
    estado:'apto', peso:2,
    esSerie:true, archivo:'[ serie · textos proceso ]',
    cloudinaryFolder:'textos_enmararanarse',
    cloudinaryFiles:['textos_enmararanarse/Guion_físico','textos_enmararanarse/EXPLORACIÓN_INTEGRAL_DE_LA_INVESTIGACIÓN-CREACION_EN_LA_DANZA_ENFOQUES,_MÉTODOS_Y_PRÁCTICAS_DESDE_EL_GRUPO_DE_INVESTIGACIÓN_DE_ARTE_DANZARIO'] },

  // SUB-04 · Aulide — nuevos nodos
  { id:'SER-PM-02', sub:'SUB-04', tipo:'foto', titulo:'Foros · Per(r)o mundo', conteo:'2 fotos', tam:'—', fecha:'—',
    desc:'Registros fotográficos de foros y conversaciones del proceso de creación de Per(r)o mundo. Memorias de encuentros colectivos.',
    tags:['foros','conversaciones','Per(r)o mundo','Aulide'],
    temas:['toque','pajaros'],
    practicas:['toque','estudios-con-hojas'],
    estado:'apto', peso:2,
    esSerie:true, archivo:'[ serie · foros ]',
    cloudinaryFolder:'foros_perro',
    cloudinaryFiles:['foros_perro/Foto_1','foros_perro/Foto_2'] },

  { id:'SER-PM-03', sub:'SUB-04', tipo:'texto', titulo:'Escritura coral · Per(r)o mundo (archivos adicionales)', conteo:'2 documentos', tam:'—', fecha:'—',
    desc:'Archivos adicionales de escritura del proceso Per(r)o mundo. Versiones, borradores y textos de proceso de los siete autores.',
    tags:['escritura coral','proceso','borradores','Aulide'],
    temas:['toque','pajaros'],
    practicas:['toque','estudios-con-hojas'],
    estado:'apto', peso:2,
    esSerie:true, archivo:'[ serie · escrituras ]',
    cloudinaryFolder:'escritura_perro',
    cloudinaryFiles:['escritura_perro/Cadena_JVACD','escritura_perro/Entrega_Alex-Cecilia-Dubián-Javier_-vicente'] },

  // SUB-05 · Creación Artística — ensayos
  { id:'SER-MA-01', sub:'SUB-05', tipo:'texto', titulo:'Ensayos marañas', conteo:'4 documentos', tam:'—', fecha:'—',
    desc:'Textos ensayísticos surgidos del proceso de investigación-creación. Escrituras reflexivas sobre las marañas y las prácticas emergentes.',
    tags:['ensayos','textos','proceso','marañas'],
    temas:['enmarañamientos','plantaciones'],
    practicas:['encauchamientos','jardinamientos','desbordamientos'],
    estado:'apto', peso:3,
    esSerie:true, archivo:'[ serie · ensayos ]',
    cloudinaryFolder:'ensayos_maranas',
    cloudinaryFiles:['ensayos_maranas/a30cc2a1-9b47-488a-8b1c-9dd488fe02a4','ensayos_maranas/b7f24dc5-3317-4dd8-b198-b07aff745871','ensayos_maranas/bf5f6522-a59a-45be-b813-85f325bd55ef','ensayos_maranas/f9585113-bc99-4a63-93a4-125f79ba0586'] }
];

/* SERIES: vacío — series integradas en ARCHIVOS con esSerie:true */
var SERIES = [];

/* CONEXIONES seleccionadas (visualizadas como puentes preferentes) */
var CONEXIONES_VISUALES = [
  ['ARC-YT-02','ARC-010'],   // videodanza ↔ guion
  ['ARC-YT-02','ARC-011'],   // videodanza ↔ texto base
  ['ARC-YT-02','ARC-012'],   // videodanza ↔ póster
  ['ARC-YT-01','ARC-003'],   // Hernán ↔ obra completa Dramaturgias
  ['ARC-YT-03','SER-10'],    // cartografías ↔ San Francisco fotos
  ['ARC-YT-03','SER-11'],    // cartografías ↔ San Francisco videos
  ['ARC-003','ARC-004'],     // obra ↔ fotos Dramaturgias
  ['ARC-030','SER-CB-01'],   // videoperformance ↔ registro
  ['ARC-020','ARC-021'],     // escritura coral ↔ flyer Per(r)o
  ['ARC-011','ARC-010'],     // texto base ↔ guion
  ['SER-10','SER-11'],       // San Francisco fotos ↔ videos
  ['SER-ES-01','ARC-YT-02'], // fotos Enmarañar ↔ videodanza
  ['ARC-YT-02','ARC-013'],   // videodanza ↔ trailer
];

/* CONEXIONES DETALLADAS para mostrar en el panel */
var CONEXIONES_TEXTO = {
  'ARC-001': [
    { tipo:'rige a', destino:'TODO el catálogo', texto:'Define la metáfora Tronco-Ramas que estructura el catálogo entero.' }
  ],
  'ARC-002': [
    { tipo:'contradice', destino:'prototipo p5.js actual', texto:'Plantea Unity 2022 LTS pero el mapa migró a p5.js / HTML.' }
  ],
  'ARC-012': [
    { tipo:'es fuente de', destino:'ARC-011', texto:'El texto base de Álvaro Hernández (18 Árboles) es la fuente literaria del guion.' }
  ],
  'ARC-013': [
    { tipo:'expande a', destino:'ARC-011', texto:'El Guion físico es la versión técnica detallada: vestuario, sonoridad, planos, órdenes de montaje.' },
    { tipo:'ubica acción en', destino:'HSJ + San Lucas', texto:'Las dos locaciones físicas estructuran el guion de la videodanza.' }
  ],
  'ARC-014': [
    { tipo:'destila tags de', destino:'ARC-013', texto:'Los 6 temas comunes son la síntesis temática del guion.' }
  ],
  'ARC-016': [
    { tipo:'deriva poéticamente', destino:'concepto Maraña', texto:'Maraña → Mar-Araña-Arañar-Maña-Amar. Marresción. Dansiesta.' },
    { tipo:'aporta neologismo', destino:'ARC-017', texto:'Marresción («acción de enmarañar la respiración») conecta directo con la Metodología Integrada centrada en Respiración.' }
  ],
  'ARC-017': [
    { tipo:'documenta', destino:'SER-10 / SER-11', texto:'Reporta la salida de San Francisco 24-26 nov 2023 con 27 investigadores.' },
    { tipo:'propone', destino:'Metodología 4 respiraciones', texto:'Alta clavicular / media torácica / media baja abdominal / baja pélvica. Eje metodológico transversal.' }
  ],
  'ARC-019': [
    { tipo:'marco institucional de', destino:'TODO el proyecto', texto:'Fuente más completa sobre IP, 27 coinvestigadores, 4 grupos institucionales y línea de investigación.' },
    { tipo:'incluye entrevistas a', destino:'Ana Vargas, Dubián Gallego, Violeta García, Angie Rodríguez', texto:'4 entrevistas semiestructuradas — posiblemente ARC-004 a ARC-009.' }
  ],
  'ARC-020': [
    { tipo:'promociona a', destino:'ARC-021 + SUB-03 entera', texto:'Trailer y póster son las piezas de comunicación de la videodanza.' }
  ],
  'ARC-022': [
    { tipo:'detonada por', destino:'video del perro muerto (vacío)', texto:'El video original NO está en la carpeta «Videos usados en la obra» (vacía). Posible huérfano.' }
  ],
  'SER-01': [
    { tipo:'documenta visualmente', destino:'ARC-003', texto:'Las 70+ fotos profesionales son el registro fotográfico curado de la obra.' }
  ],
  'SER-02': [
    { tipo:'fuente cruda de', destino:'ARC-003 / ARC-010', texto:'Los videos MOV/MTS (53 GB) son el banco crudo del que se editaron las versiones definitivas.' }
  ],
  'ARC-027': [
    { tipo:'define esquema de', destino:'este catálogo', texto:'Los campos y listas de tipos/estados de la plantilla original son la base del libro.' }
  ],
  'SER-16': [
    { tipo:'rastro parcial de', destino:'rama «De los Mundos de Plantación»', texto:'El nombre de la subcarpeta apunta a esa rama. Es lo único que la materializa.' }
  ]
};
