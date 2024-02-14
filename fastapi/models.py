"""
모델 클래스를 정의하는 파일
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

# database.py에서 정의한 Base 클래스를 상속받아서 모델 클래스를 정의
class User(Base):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False) # 중복 불가 -> 오류 예외 처리 필요(user_crud.py)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False) # 중복 불가 -> 오류 예외 처리 필요(user_crud.py)


class Image(Base):
    __tablename__ = "image"
    
    id = Column(Integer, primary_key=True)
    image_path = Column(String, nullable=False)
    image_name = Column(String, nullable=False)
    # image_lable_feature = Column(Integer, nullable=True)
    image_lable_rgb = Column(Integer, nullable=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", backref="image")
    image_edited = Column(Boolean, default=False)
    class_name = Column(String, nullable=True)

# class Detection(Base):
#     __tablename__ = "detection"

#     id = Column(Integer, primary_key=True)
#     image_id = Column(Integer, ForeignKey("image.id"))
#     image = relationship("Image", backref="detection")
#     json_data = Column("data", JSON)