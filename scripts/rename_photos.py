#!/usr/bin/env python3
import os, re, shutil, argparse
from pathlib import Path

FOTO_EXT = {'.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'}
VIDEO_EXT = {'.mp4', '.mov', '.mts', '.avi', '.mkv'}

SERIES_CONFIG = {
    'obra':                   {'prefix': 'obra_foto',        'tipo': 'foto'},
    'enmara':                 {'prefix': 'enmara_foto',      'tipo': 'foto'},
    'enmara_posters':         {'prefix': 'enmara',           'tipo': 'poster'},
    'perro':                  {'prefix': 'perro_foto',       'tipo': 'foto'},
    'grinplart_sanfrancisco': {'prefix': 'grinplart_sanfrancisco_foto', 'tipo': 'foto'},
    'grinplart_loscopetones': {'prefix': 'grinplart_loscopetones_foto', 'tipo': 'foto'},
    'grinplart_villarosil':   {'prefix': 'grinplart_villarosil_foto',   'tipo': 'foto'},
    'lema':                   {'prefix': 'lema_foto',        'tipo': 'foto'},
    'obra_video':             {'prefix': 'obra',             'tipo': 'video'},
    'enmara_video':           {'prefix': 'enmara_video',     'tipo': 'video'},
    'grinplart_video':        {'prefix': 'grinplart_sanfrancisco_video', 'tipo': 'video'},
    'campo':                  {'prefix': 'campo_foto',       'tipo': 'foto'},
    'recorridos':             {'prefix': 'recorridos_foto',  'tipo': 'foto'},
}

def sort_key(path):
    match = re.search(r'DSCF(\d+)', path.name, re.IGNORECASE)
    if match:
        return (0, int(match.group(1)))
    match_ts = re.search(r'(\d{8})_(\d{6})', path.name)
    if match_ts:
        return (1, int(match_ts.group(1) + match_ts.group(2)))
    match_img = re.search(r'IMG_(\d+)', path.name, re.IGNORECASE)
    if match_img:
        return (2, int(match_img.group(1)))
    return (3, path.name)

def get_files(input_dir, tipo):
    ext_set = FOTO_EXT if tipo in ('foto', 'poster') else VIDEO_EXT
    files = [f for f in input_dir.iterdir()
             if f.is_file()
             and f.suffix.lower() in ext_set
             and not f.name.startswith('.')
             and not f.name.startswith('._')]
    files.sort(key=sort_key)
    return files

def execute(pairs, dry_run, move=False):
    action = 'MOVE' if move else 'COPY'
    ok = skip = 0
    for src, dest in pairs:
        if dry_run:
            print(f'  [DRY] {src.name}  ->  {dest.name}')
        else:
            if dest.exists():
                skip += 1
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(src), str(dest)) if move else shutil.copy2(str(src), str(dest))
            print(f'  [{action}] {src.name}  ->  {dest.name}')
            ok += 1
    if not dry_run:
        print(f'\n OK: {ok} archivos, {skip} omitidos.')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--serie', required=True, choices=list(SERIES_CONFIG.keys()))
    parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--move', action='store_true')
    args = parser.parse_args()

    config = SERIES_CONFIG[args.serie]
    input_dir = Path(args.input)
    output_dir = Path(args.output)

    files = get_files(input_dir, config['tipo'])
    print(f'\nSerie: {args.serie} | Archivos encontrados: {len(files)}')
    print(f'Destino: {output_dir}\n')

    pairs = [(src, output_dir / f"{config['prefix']}_{i:04d}{src.suffix.lower()}")
             for i, src in enumerate(files, 1)]

    if args.dry_run:
        print('-- DRY RUN --')
    execute(pairs, args.dry_run, args.move)

    if not args.dry_run:
        report = output_dir / '_rename_log.csv'
        with open(report, 'w', encoding='utf-8') as f:
            f.write('nombre_original,nombre_web\n')
            for src, dest in pairs:
                f.write(f'"{src.name}","{dest.name}"\n')
        print(f'-> Log: {report}')

if __name__ == '__main__':
    main()
