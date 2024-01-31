"""
이미지 스키마
"""
from pydantic import BaseModel

class ImageUpload(BaseModel):
    # id: int
    # user_id: int
    image_name: str
    image_path: str

    
