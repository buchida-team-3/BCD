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
    return JSONResponse(content={"message": "앨범이 생성되었습니다."})


@router.get("/api/album/data")
async def album_get(album_title: str,
                    db=Depends(get_db), 
                    current_user: User = Depends(get_current_user)):
    result = album_crud.get_album(db, album_title=album_title, user=current_user)
    return JSONResponse(content=result)


@router.get("/api/album/list")
async def album_list_get(db=Depends(get_db),
                         current_user: User = Depends(get_current_user)):
    pass
     
    
    