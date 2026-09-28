"""Lightweight JSON-file backend for Shree Baba Sidhnath Mandir.

No database. No ORM. No CMS. Content lives in backend/content/*.json
and uploaded media lives in backend/media/{images,audio,video}/.
"""

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routers import content, media
from backend.services.media_service import MEDIA_DIR

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR.parent / "dist"

DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]


def get_cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "")
    origins = [o.strip() for o in raw.split(",") if o.strip()]
    return origins or DEFAULT_ORIGINS


def create_app() -> FastAPI:
    app = FastAPI(
        title="Mandir Content API",
        description="JSON-file content and media API for the temple website.",
        version="2.0.0",
        docs_url="/api/docs" if os.getenv("ENVIRONMENT", "production") != "production" else None,
        redoc_url=None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_cors_origins(),
        allow_credentials=False,
        allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(content.router)
    app.include_router(media.router)

    @app.get("/api/health", tags=["health"])
    def health() -> dict:
        return {
            "status": "ok",
            "service": "mandir-content-api",
            "environment": os.getenv("ENVIRONMENT", "development"),
        }

    # Uploaded media is served at /api/media/<subfolder>/<file>
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    app.mount("/api/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")

    # Production: serve the built React app (npm run build → dist/) from the
    # same origin so no CORS or extra service is needed on Render.
    if DIST_DIR.is_dir():
        app.mount("/", StaticFiles(directory=str(DIST_DIR), html=True), name="frontend")

    return app


app = create_app()
