from fastapi.responses import JSONResponse, FileResponse
from fastapi import APIRouter, HTTPException, File, UploadFile, Depends, BackgroundTasks
from typing import List, Dict
import os

from domain.image import image_crud, image_schema
from domain.image.image_crud import make_sample_dir, aws_upload, db_update
from domain.image.clustering_image import image_clustering
from domain.image.clustering_rgb import rgb_clustering

from domain.user.user_router import get_current_user

from models import User
from database import get_db

from sqlalchemy.orm import Session  # Session 클래스 임포트

from pydantic import BaseModel, Field
import aiofiles
from PIL import Image
from io import BytesIO

from rembg import remove
import numpy as np

router = APIRouter(
    # prefix="/image",
)

class ImageNames(BaseModel):
    images: List[str]
start_dir = "../frontend/public/img"
remove_dir = "../frontend/public/img_0"

class OverlayImage(BaseModel):
    url: str = Field(..., alias='imageUrl')
    x: float
    y: float
    width: int
    height: int

class ImageMergeData(BaseModel):
    baseImage: str
    overlayImages: List[OverlayImage] # 예: [{"url": "image_url", "x": 100, "y": 200}, ...]


@router.post("/group/album/upload")
async def image_upload(files: List[UploadFile] = File(...), db=Depends(get_db), current_user: User = Depends(get_current_user)):
    results = []
    results_aws = []
    results_feature = []
    results_rgb = []

    result_for_db = []

    num_path, num = make_sample_dir(start_dir)

    for file in files:
        content = await file.read()
        file_path = os.path.join(num_path, file.filename)

        with open(file_path, "wb") as fp:
            fp.write(content)

        results.append({"filename": file_path, "num": num})
        results_aws.append(aws_upload(file_path, "jungle-buchida-s3", f"{num_path.split('/')[-1]}/{file.filename}"))

    results_feature = image_clustering(new_image_path=num_path, folder_path=None, model_path="./kmeans_model.pkl")
    results_rgb = rgb_clustering(new_image_path=num_path, folder_path=None, model_path="./kmeans_rgb_model.pkl")

    for i in range((len(results_aws))):
        result_for_db = {"image_path": results_aws[i], 
                         "image_name": results_feature[i]['image_name'], 
                         "image_lable_feature": results_feature[i]['image_label'], # feature
                         "image_lable_rgb": results_rgb[i]['image_label']}         # rgb
        db_update(db, update_db=image_schema.ImageUpload(**result_for_db), user=current_user)

    return JSONResponse(content = results)

@router.get("/album")
async def get_album(db=Depends(get_db), current_user: User = Depends(get_current_user)):
    album_list = []
    album = db.query(image_crud.Image).filter(
        image_crud.Image.user_id == current_user.id
        ).all()
    for i in album:
        album_list.append(i.image_path)
    return JSONResponse(content=album_list)

@router.get("/api/images")
def get_image_list():
    # 이미지 폴더에서 이미지 파일 이름들을 가져옴
    image_files = os.listdir(start_dir)
    return image_files

@router.get("/api/images/{image_name}")
def get_image(image_name: str):
    # 이미지 파일 경로 반환
    return f"/img/{image_name}"

@router.post("/remove_background")
async def remove_background(image_names: ImageNames):

    processed_images = []
    for image_name in image_names.images:
        # 이미 처리된 이미지가 있는지 확인
        print('now : ', image_name)
        if os.path.exists(f'{remove_dir}/removed_{image_name}'):
            print(f"Image {image_name} already processed.")
            processed_images.append(f'removed_{image_name}')
            continue  # 이미 처리되었다면 다음 이미지로 넘어감

        try:
            async with aiofiles.open(f'{start_dir}/{image_name}', 'rb') as image:
                input_image = await image.read()
            output_image = remove(input_image)
            
            # 바이트 데이터를 Image 객체로 변환
            image = Image.open(BytesIO(output_image))

            # 이미지 크기 조정
            resized_image = image.resize((100, 100))
            
            # Image 객체를 바이트 데이터로 변환
            buf = BytesIO()
            resized_image.save(buf, format='PNG')  # 저장 포맷을 지정 (원본 이미지의 포맷에 따라 변경 가능)
            resized_image_bytes = buf.getvalue()

            output_image_name = f'removed_{image_name}'
            async with aiofiles.open(f'{remove_dir}/{output_image_name}', 'wb') as image:
                await image.write(resized_image_bytes)
            processed_images.append(output_image_name)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    print('end')
    return processed_images

@router.post("/merge_images")
async def merge_images(data: ImageMergeData):
    base_image = Image.open(data.baseImage)
    base_image_resized = base_image.resize((400, 400))
    for overlay in data.overlayImages:    
        # 각 "처리된 이미지"를 열고, 지정된 위치에 붙입니다.
        overlay_image_path = overlay.url.replace(f'{overlay.url}', f'{remove_dir}/{overlay.url}')
        overlay_image = Image.open(overlay_image_path)

        # 새로운 크기로 이미지 크기 조정
        overlay_image_resized = overlay_image.resize((overlay.width, overlay.height))

        base_image_resized.paste(overlay_image_resized, (int(overlay.x), int(overlay.y)), overlay_image_resized)
    
    # 합성된 이미지를 저장하거나 클라이언트에 직접 반환합니다.
    output_path = f"{start_dir}/overlay_{overlay.url}"
    # if output_path:
    #     cnt = 0
    #     base_image.save(f'{output_path} ({cnt})')
    base_image_resized.save(output_path)
    return {"message": "Image merged successfully", "mergedImagePath": output_path}