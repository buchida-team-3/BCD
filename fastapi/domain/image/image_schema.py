"""
이미지 스키마
"""
import datetime

from pydantic import BaseModel, Field
from typing import List

class ImageUpload(BaseModel):
    # id: int
    # user_id: int
    image_path: str
    image_name: str
    # image_lable_feature: int
    image_lable_rgb: int
    class_name: str
    
class ImageNames(BaseModel):
    pass

class OverlayImage(BaseModel):
    pass

class ImageMergeData(BaseModel):
    pass
