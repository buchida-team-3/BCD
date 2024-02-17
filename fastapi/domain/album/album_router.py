from fastapi import APIRouter, Depends

from models import Album, AlbumArticle
from domain.album import album_schema
from domain.album import album_crud

from database import get_db

from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/api/album/create")
async def create_album(_album_create: album_schema.AlbumCreate, db: Session = Depends(get_db)):

    album_crud.create_album(db, album_create=_album_create)
    return {"message": "앨범 저장 완료"}


@router.post("/api/album_article/create")
async def create_album_article():
    pass


@router.post("/api/album_article/update")
async def update_album_article():
    pass


