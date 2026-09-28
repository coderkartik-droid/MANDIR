"""Read and write the JSON content files in backend/content/.

Atomic writes only: data is written to a temp file first, then moved into
place, so a crashed request can never leave a half-written JSON file.
"""

import json
import os
import tempfile
from pathlib import Path

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"

SECTIONS = [
    "temple",
    "home",
    "contact",
    "festivals",
    "gallery",
    "videos",
    "music",
    "maps",
    "social",
    "images",
    "theme",
    "animations",
]


class SectionNotFoundError(Exception):
    pass


def _section_path(section: str) -> Path:
    if section not in SECTIONS:
        raise SectionNotFoundError(section)
    return CONTENT_DIR / f"{section}.json"


def read_section(section: str) -> dict:
    path = _section_path(section)
    if not path.exists():
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def read_all() -> dict:
    return {section: read_section(section) for section in SECTIONS}


def write_section(section: str, data: dict) -> dict:
    path = _section_path(section)
    path.parent.mkdir(parents=True, exist_ok=True)

    fd, tmp_name = tempfile.mkstemp(dir=str(path.parent), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        os.replace(tmp_name, path)
    except BaseException:
        if os.path.exists(tmp_name):
            os.remove(tmp_name)
        raise
    return data
