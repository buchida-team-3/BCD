from fastapi import APIRouter, Depends

from models import Album, AlbumArticle, User
from domain.album import album_schema
from domain.album import album_crud

from domain.user.user_router import get_current_user

from database import get_db

from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/api/album/create")
async def album_create(_album_create: album_schema.AlbumCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    album_crud.create_album(db, album_create=_album_create, user=current_user)
    return {"message": "앨범 저장 완료"}


@router.post("/api/album_article/create")
async def album_article_create():
    pass


@router.post("/api/album_article/update")
async def album_article_update():
    pass