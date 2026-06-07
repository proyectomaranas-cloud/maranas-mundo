from pathlib import Path
from PIL import Image, ImageOps
import argparse

FOTO_EXT = {'.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp'}
WEB_MAX_PX = 1600
THUMB_MAX_PX = 400
WEB_QUALITY = 82
THUMB_QUALITY = 75

def convert_to_webp(src, dest, max_px, quality):
    with Image.open(src) as img:
        img = ImageOps.exif_transpose(img)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        w, h = img.size
        if max(w, h) > max_px:
            if w >= h:
                new_w, new_h = max_px, int(h * max_px / w)
            else:
                new_w, new_h = int(w * max_px / h), max_px
            img = img.resize((new_w, new_h), Image.LANCZOS)
        dest.parent.mkdir(parents=True, exist_ok=True)
        img.save(dest, 'WEBP', quality=quality, method=6)

def process_folder(input_dir, output_dir, thumbs_only=False, dry_run=False):
    files = [f for f in input_dir.iterdir()
             if f.is_file()
             and f.suffix.lower() in FOTO_EXT
             and not f.name.startswith('.')
             and not f.name.startswith('._')]
    if not files:
        print(f'  Sin fotos en {input_dir}')
        return
    print(f'\n-> {input_dir.name}: {len(files)} fotos')
    for src in sorted(files):
        stem = src.stem
        if not thumbs_only:
            dest_web = output_dir / f'{stem}.webp'
            if dry_run:
                print(f'  [DRY] web: {dest_web.name}')
            elif not dest_web.exists():
                convert_to_webp(src, dest_web, WEB_MAX_PX, WEB_QUALITY)
                size_kb = dest_web.stat().st_size // 1024
                print(f'  OK web: {dest_web.name} ({size_kb} KB)')
        thumb_dir = output_dir / 'thumbs'
        dest_thumb = thumb_dir / f'{stem}.webp'
        if dry_run:
            print(f'  [DRY] thumb: {dest_thumb.name}')
        elif not dest_thumb.exists():
            convert_to_webp(src, dest_thumb, THUMB_MAX_PX, THUMB_QUALITY)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--thumbs-only', action='store_true')
    parser.add_argument('--recursive', action='store_true')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    input_dir = Path(args.input)
    output_dir = Path(args.output)
    if args.recursive:
        folders = [d for d in input_dir.rglob('*') if d.is_dir()]
        folders.insert(0, input_dir)
        for folder in folders:
            rel = folder.relative_to(input_dir)
            process_folder(folder, output_dir / rel, args.thumbs_only, args.dry_run)
    else:
        process_folder(input_dir, output_dir, args.thumbs_only, args.dry_run)
    print('\nCompresion completada.')

if __name__ == '__main__':
    main()
