#!/usr/bin/env python3
"""
compress_video.py — Marañas Mundo
Comprime videos para revisión/backup antes de subir a YouTube.
Requiere: ffmpeg instalado en el sistema (brew install ffmpeg / apt install ffmpeg)

Uso:
  python compress_video.py --input ./obra_completa_original.mp4 --output ./obra_video_completa.mp4
  python compress_video.py --input ./E1.mp4 --output ./obra_entrevista_01.mp4 --preset entrevista
  python compress_video.py --input ./carpeta_videos --output ./videos_web --batch
"""

import subprocess
import argparse
import json
from pathlib import Path

VIDEO_EXT = {'.mp4', '.mov', '.mts', '.avi', '.mkv'}

PRESETS = {
    'obra': {
        # Obra completa — alta calidad, 1080p
        'crf': 22,
        'scale': 'scale=-2:1080',
        'audio_bitrate': '192k',
        'desc': 'Obra principal — alta calidad 1080p'
    },
    'entrevista': {
        # Entrevistas — menos movimiento, más compresión
        'crf': 26,
        'scale': 'scale=-2:1080',
        'audio_bitrate': '128k',
        'desc': 'Entrevistas — calidad media 1080p'
    },
    'trailer': {
        # Trailer — calidad alta, posiblemente corto
        'crf': 20,
        'scale': 'scale=-2:1080',
        'audio_bitrate': '192k',
        'desc': 'Trailer — alta calidad 1080p'
    },
    'making': {
        # Making-off — más compresión
        'crf': 28,
        'scale': 'scale=-2:720',
        'audio_bitrate': '128k',
        'desc': 'Making-off — calidad media 720p'
    },
    'campo': {
        # Videos de campo (WhatsApp, etc.) — compresión fuerte
        'crf': 30,
        'scale': 'scale=-2:720',
        'audio_bitrate': '96k',
        'desc': 'Videos de campo — compresión fuerte 720p'
    }
}

def get_duration(path: Path) -> str:
    """Obtiene duración del video con ffprobe."""
    try:
        result = subprocess.run([
            'ffprobe', '-v', 'quiet', '-print_format', 'json',
            '-show_format', str(path)
        ], capture_output=True, text=True)
        data = json.loads(result.stdout)
        secs = float(data['format']['duration'])
        m, s = divmod(int(secs), 60)
        h, m = divmod(m, 60)
        return f"{h:02d}:{m:02d}:{s:02d}"
    except Exception:
        return "desconocida"

def compress(src: Path, dest: Path, preset_name: str, dry_run: bool = False):
    preset = PRESETS[preset_name]
    print(f"\n→ {src.name}")
    print(f"  Preset: {preset['desc']}")
    print(f"  Duración: {get_duration(src)}")

    cmd = [
        'ffmpeg', '-i', str(src),
        '-vcodec', 'libx264',
        '-crf', str(preset['crf']),
        '-preset', 'medium',
        '-vf', preset['scale'],
        '-acodec', 'aac',
        '-b:a', preset['audio_bitrate'],
        '-movflags', '+faststart',  # streaming web optimizado
        '-y',  # overwrite
        str(dest)
    ]

    if dry_run:
        print(f"  [DRY] ffmpeg cmd: {' '.join(cmd)}")
        return

    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"  Comprimiendo → {dest.name} ...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        orig_mb = src.stat().st_size / 1024 / 1024
        dest_mb = dest.stat().st_size / 1024 / 1024
        ratio = (1 - dest_mb / orig_mb) * 100
        print(f"  ✓ {orig_mb:.1f} MB → {dest_mb:.1f} MB (−{ratio:.0f}%)")
    else:
        print(f"  ✗ Error: {result.stderr[-500:]}")

def main():
    parser = argparse.ArgumentParser(description='Comprime videos para Marañas Mundo')
    parser.add_argument('--input', required=True, help='Archivo o carpeta de entrada')
    parser.add_argument('--output', required=True, help='Archivo o carpeta de salida')
    parser.add_argument('--preset', default='obra',
                        choices=list(PRESETS.keys()),
                        help='Preset de compresión')
    parser.add_argument('--batch', action='store_true',
                        help='Procesar carpeta completa')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()

    if args.batch:
        input_dir = Path(args.input)
        output_dir = Path(args.output)
        files = [f for f in input_dir.iterdir()
                 if f.is_file() and f.suffix.lower() in VIDEO_EXT]
        for f in sorted(files):
            out = output_dir / (f.stem + '_web.mp4')
            compress(f, out, args.preset, args.dry_run)
    else:
        compress(Path(args.input), Path(args.output), args.preset, args.dry_run)

if __name__ == '__main__':
    main()
