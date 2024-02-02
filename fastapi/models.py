"""
모델 클래스를 정의하는 파일
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# database.py에서 정의한 Base 클래스를 상속받아서 모델 클래스를 정의
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False) # 중복 불가 -> 오류 예외 처리 필요(user_crud.py)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False) # 중복 불가 -> 오류 예외 처리 필요(user_crud.py)
    
    # image_id = Column(Integer, ForeignKey("images.id"))
    # images = relationship("Image", back_populates="user") # ?
        
class Image(Base):
    __tablename__ = "images"
    
    id = Column(Integer, primary_key=True)
    image_path = Column(String, nullable=False)
    image_name = Column(String, nullable=False)
    
    # user_id = Column(Integer, ForeignKey("users.id"))
    # user = relationship("User", back_populates="images") # ?
