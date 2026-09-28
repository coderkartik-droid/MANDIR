"""Content API — read and save the JSON sections."""

from fastapi import APIRouter, Body, HTTPException

from backend.services import json_service
from backend.services.json_service import SectionNotFoundError

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("")
def get_all_content() -> dict:
    return json_service.read_all()


@router.get("/{section}")
def get_section(section: str) -> dict:
    try:
        return json_service.read_section(section)
    except SectionNotFoundError:
        raise HTTPException(status_code=404, detail=f"Unknown section: {section}")


@router.post("/{section}")
def save_section(section: str, data: dict = Body(...)) -> dict:
    if not isinstance(data, dict):
        raise HTTPException(status_code=400, detail="Section content must be a JSON object")
    try:
        saved = json_service.write_section(section, data)
    except SectionNotFoundError:
        raise HTTPException(status_code=404, detail=f"Unknown section: {section}")
    return {"success": True, "section": section, "data": saved}
