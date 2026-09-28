"""Store, serve and delete uploaded media files under backend/media/.

Security rules:
  • Only whitelisted extensions per media kind are accepted.
  • Filenames are sanitized and prefixed with a timestamp to avoid collisions.
  • Deletes are resolved and verified to stay inside MEDIA_DIR (no traversal).
"""

import re
import time
from pathlib import Path

from fastapi import HTTPException, UploadFile

MEDIA_DIR = Path(__file__).resolve().parent.parent / "media"

MEDIA_KINDS = {
    "image": {"folder": "images", "extensions": {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}},
    "audio": {"folder": "audio", "extensions": {".mp3"}},
    "video": {"folder": "video", "extensions": {".mp4"}},
}

MAX_UPLOAD_MB = 100


class MediaNotFoundError(Exception):
    pass


def _safe_name(filename: str) -> str:
    name = Path(filename or "upload").name
    name = re.sub(r"[^A-Za-z0-9._-]", "_", name)
    return name.strip("._") or "upload"


async def save_upload(kind: str, file: UploadFile) -> dict:
    if kind not in MEDIA_KINDS:
        raise HTTPException(status_code=400, detail=f"Unknown media kind: {kind}")

    spec = MEDIA_KINDS[kind]
    filename = _safe_name(file.filename or "")
    ext = Path(filename).suffix.lower()
    if ext not in spec["extensions"]:
        allowed = ", ".join(sorted(spec["extensions"]))
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext or 'unknown'}' for {kind}. Allowed: {allowed}",
        )

    folder = MEDIA_DIR / spec["folder"]
    folder.mkdir(parents=True, exist_ok=True)

    stem = Path(filename).stem.lower()[:60] or "upload"
    stored_name = f"{int(time.time())}_{stem}{ext}"
    dest = folder / stored_name

    max_bytes = MAX_UPLOAD_MB * 1024 * 1024
    written = 0
    try:
        with open(dest, "wb") as out:
            while chunk := await file.read(1024 * 1024):
                written += len(chunk)
                if written > max_bytes:
                    raise HTTPException(
                        status_code=413,
                        detail=f"File exceeds the {MAX_UPLOAD_MB} MB upload limit",
                    )
                out.write(chunk)
    except HTTPException:
        dest.unlink(missing_ok=True)
        raise

    relative = f"media/{spec['folder']}/{stored_name}"
    return {
        "name": stored_name,
        "originalName": Path(filename).name,
        "path": relative,
        "url": f"/api/{relative}",
        "size": written,
        "kind": kind,
    }


def resolve_media_path(path: str) -> Path:
    """Resolve a client-supplied media path to a real file inside MEDIA_DIR."""
    clean = (path or "").strip().lstrip("/")
    if clean.startswith("api/media/"):
        clean = clean[len("api/media/"):]
    elif clean.startswith("media/"):
        clean = clean[len("media/"):]

    target = (MEDIA_DIR / clean).resolve()
    if not str(target).startswith(str(MEDIA_DIR.resolve())):
        raise HTTPException(status_code=400, detail="Invalid media path")
    return target


def delete_media(path: str) -> dict:
    target = resolve_media_path(path)
    if not target.is_file():
        raise MediaNotFoundError(path)
    target.unlink()
    relative = target.relative_to(MEDIA_DIR).as_posix()
    return {"deleted": f"media/{relative}"}
