"""Media API — upload images / audio / video and delete media files."""

from fastapi import APIRouter, File, HTTPException, Query, UploadFile

from backend.services import media_service
from backend.services.media_service import MediaNotFoundError

router = APIRouter(prefix="/api", tags=["media"])


@router.post("/upload/image")
async def upload_image(file: UploadFile = File(...)) -> dict:
    result = await media_service.save_upload("image", file)
    return {"success": True, "file": result}


@router.post("/upload/audio")
async def upload_audio(file: UploadFile = File(...)) -> dict:
    result = await media_service.save_upload("audio", file)
    return {"success": True, "file": result}


@router.post("/upload/video")
async def upload_video(file: UploadFile = File(...)) -> dict:
    result = await media_service.save_upload("video", file)
    return {"success": True, "file": result}


@router.delete("/media")
def delete_media(path: str = Query(..., description="Media path, e.g. media/images/123_photo.jpg")) -> dict:
    try:
        result = media_service.delete_media(path)
    except MediaNotFoundError:
        raise HTTPException(status_code=404, detail=f"Media file not found: {path}")
    return {"success": True, **result}
