from fastapi.responses import JSONResponse, FileResponse
from fastapi import APIRouter, HTTPException, File, UploadFile, Depends, BackgroundTasks
from typing import List, Dict
import os
import subprocess

from domain.image import image_crud
from domain.image.image_schema import ImageUpload, ImageNames, OverlayImage, ImageMergeData
from domain.image.image_crud import make_sample_dir, aws_upload, db_update

# from domain.image.clustering_image import image_clustering
from domain.image.get_location_and_date import get_location_and_date
from domain.image.image_labeling_yolov8 import image_labeling_yolov8
from domain.image.image_labeling_resnet50 import image_labeling_resnet50
from domain.image.clustering_rgb import rgb_clustering

from domain.user.user_router import get_current_user

from models import User
from database import get_db

from sqlalchemy.orm import Session  # Session 클래스 임포트
import aiofiles
from PIL import Image
from io import BytesIO

from rembg import remove
import numpy as np

router = APIRouter(
    # prefix="/image",
)


start_dir = "../frontend/public/img"
remove_dir = "../frontend/public/img_0"


@router.post("/group/album/upload")
async def image_upload(files: List[UploadFile] = File(...), db=Depends(get_db), current_user: User = Depends(get_current_user)):
    results = []
    results_aws = []
    yolo = []
    results_yolo = {}
    results_rgb = []
    results_for_db = []

    num_path, num = make_sample_dir(start_dir)

    for file in files:
        content = await file.read()
        file_path = os.path.join(num_path, file.filename)

        with open(file_path, "wb") as fp:
            fp.write(content)

        results.append({"filename": file_path, "num": num})
        results_aws.append(aws_upload(file_path, "jungle-buchida-s3", f"{num_path.split('/')[-1]}/{file.filename}"))
        print(get_location_and_date(file_path))

    yolo = image_labeling_yolov8(num_path)
    for item in yolo:
        if item['image_name'] in results_yolo:
            if item['class_name'] not in results_yolo[item['image_name']]:
                results_yolo[item['image_name']].append(item['class_name'])
        else:
            results_yolo[item['image_name']] = [item['class_name']]

    results_rgb = rgb_clustering(new_image_path=num_path, folder_path=None, model_path="./kmeans_rgb_model.pkl")

    for i in range((len(results_aws))):
        results_for_db ={
                            "image_path": results_aws[i], 
                            "image_name": results_aws[i].split('/')[-1],
                            "class_name": str(results_yolo.get(results_aws[i].split('/')[-1])),
                            "image_lable_rgb": results_rgb[i]['image_label'],
                        }         
    
        # print(results_for_db)    
        db_update(db, update_db=ImageUpload(**results_for_db), user=current_user)
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

@router.post("/stitch_images")
async def stitch_images():
    # main.py 스크립트가 위치한 경로
    script_path = "./image_process/main.py"
    
    # 스크립트 실행에 필요한 커맨드라인 인자
    # 예: 이미지가 저장된 디렉토리 경로
    images_directory = start_dir + '/results'
    print('=========================pass========================')
    # subprocess.run()을 사용하여 main.py 실행
    # `subprocess.run(args, ...)`: args는 실행할 명령을 나타내는 문자열이나 리스트입니다.
    result = subprocess.run(["python", script_path, images_directory], capture_output=True, text=True)
    
    if result.returncode == 0:
        # 스크립트 실행 성공
        print("Success:", result.stdout)    
    else:
        # 스크립트 실행 실패
        print("Error:", result.stderr)
    
    # 결과 반환 (예시)
    return {"message": "Image stitching completed", "output": result.stdout}