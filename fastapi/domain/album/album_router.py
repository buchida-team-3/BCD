from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from models import Album, AlbumArticle, User

from domain.album import album_schema
from domain.album import album_crud

from domain.image import image_schema
from domain.image import image_crud

from domain.user.user_router import get_current_user

from database import get_db

from sqlalchemy.orm import Session

from typing import List

router = APIRouter()


@router.post("/api/album/create")
async def album_create(_album_create: album_schema.AlbumCreate, 
                       db=Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    album_crud.create_album(db, album_create=_album_create, user=current_user)


@router.get("/api/album/data")
async def get_album(album_title: str,
                    db=Depends(get_db), 
                    current_user: User = Depends(get_current_user)):
    print("앨범조회요청받음")
    album_crud.get_album(db, album_title=album_title)
    return {"message": "앨범 조회 완료"}
    