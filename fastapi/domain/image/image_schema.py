"""
이미지 스키마
"""
import datetime

from pydantic import BaseModel

class ImageUpload(BaseModel):
    # id: int
    # user_id: int
    image_path: str
    image_name: str
    image_lable_feature: int
    image_lable_rgb: int
    
