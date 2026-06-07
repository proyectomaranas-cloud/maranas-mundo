import cloudinary
import cloudinary.uploader
from pathlib import Path

cloudinary.config(
    cloud_name = "dt6cvonyy",
    api_key = "917678577197966",
    api_secret = "MbCMi_EMFV5hJoVHBM6Yd8Kdo10"
)

FOTOS_DIR = Path(r"C:\Users\nathe\Documents\maranas-mundo\assets\fotos")
CARPETAS = ["enmara", "recorridos", "grinplart/san-francisco", "grinplart/los-copetones"]

for carpeta in CARPETAS:
    folder_path = FOTOS_DIR / carpeta
    webp_files = list(folder_path.glob("*.webp"))
    if not webp_files:
        print(f"Sin WebP en {carpeta}")
        continue
    print(f"\n→ {carpeta}: {len(webp_files)} archivos")
    for f in sorted(webp_files):
        if "thumb" in f.parent.name:
            continue
        public_id = f"maranas/{carpeta.replace('/', '_')}/{f.stem}"
        result = cloudinary.uploader.upload(
            str(f),
            public_id=public_id,
            overwrite=False,
            resource_type="image"
        )
        print(f"  ✓ {f.name} → {result['secure_url']}")

print("\nSubida completada.")
