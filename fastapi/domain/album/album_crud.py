from sqlalchemy.orm import Session
from domain.album.album_schema import AlbumCreate, AlbumArticleCreate
from models import Album, AlbumArticle, User


def create_album(db: Session, album_create: AlbumCreate, user: User):
    """
    앨범 생성 함수
    - db: DB 세션 객체
    - album_create: AlbumCreate 스키마로 정의한 앨범 생성 정보
    """
    db_album = Album(
        album_title=album_create.album_title,
        user = user
    )
    db.add(db_album)
    db.commit()


def create_album_article():
    pass


def update_album_article():
    pass