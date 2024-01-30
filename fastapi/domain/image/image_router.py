from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from typing import List
import os

from domain.image import image_crud, image_schema
from domain.image.image_crud import make_sample_dir
from domain.image.image_crud import recording_image

from database import get_db

from models import Image

router = APIRouter(
    # prefix="/image",
)

start_dir = "../image_process/samples/sample"

@router.post("/group/album/upload")
async def image_upload(files: List[UploadFile] = File(...), 
                       image_upload: image_schema.ImageUpload = None,
                       db=Depends(get_db)):    
    results = []

    num_path = make_sample_dir(start_dir)

    for file in files:
        content = await file.read()
        file_path = os.path.join(num_path, file.filename)

        with open(file_path, "wb") as fp:
            fp.write(content)

        # TODO: DB에 저장 -> user_id, image_path, image_name, id
        # TODO: user_id는 현재 로그인한 사용자의 id를 사용해야 함
        # TODO: id는 auto increment로 설정해야 함
        
        # db에 저장
        recording_image(image_upload, db)
        
        results.append({"filename": file_path})
    
    return results
# 요청시 클라에서 토큰을 헤더에 담아서 보내는데 그것을 검증할 부분을 추가해야함