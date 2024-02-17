from fastapi.responses import JSONResponse, FileResponse
from fastapi import APIRouter, HTTPException, File, UploadFile, Depends, BackgroundTasks
from typing import List, Dict
import os, cv2
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

import boto3

from domain.image.theme_dict import theme

router = APIRouter(
    # prefix="/image",
)


start_dir = "../frontend/public/img"
# start_dir = "https://jungle-buchida-s3.s3.ap-northeast-2.amazonaws.com"
remove_dir = "../frontend/public/img_0"


@router.post("/group/album/upload")
async def image_upload(files: List[UploadFile] = File(...), db=Depends(get_db), current_user: User = Depends(get_current_user)):
    results = []
    results_aws = []
    results_image_meta = []
    
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

        # results_aws.append(file_path) # api 테스트용
        results_image_meta.append(get_location_and_date(file_path))


    yolo = image_labeling_yolov8(num_path)
    
    # for item in yolo:
    #     if item['image_name'] in results_yolo:
    #         if item['class_name'] not in results_yolo[item['image_name']]:
    #             results_yolo[item['image_name']].append(item['class_name'])
    #     else:
    #         results_yolo[item['image_name']] = [item['class_name']]

    for item in yolo:
    # 해당 class_name의 테마 찾기
        class_theme = 'None'  # 기본값으로 'Other' 설정
        for theme_key, classes in theme.items():
            if item['class_name'] in classes:
                class_theme = theme_key
                break
        
        # 이미지 이름으로 딕셔너리에 저장, 테마를 리스트로 추가
        if item['image_name'] in results_yolo:
            # 이미 리스트에 테마가 존재하면 추가하지 않음
            if class_theme not in results_yolo[item['image_name']]:
                results_yolo[item['image_name']].append(class_theme)
        else:
            # 이미지 이름이 사전에 없으면 새로운 키로 추가하고 테마를 리스트로 시작
            results_yolo[item['image_name']] = [class_theme]

    results_rgb = rgb_clustering(new_image_path=num_path, folder_path=None, model_path="./kmeans_rgb_model.pkl")

    for i in range((len(results_aws))):
        results_for_db ={
                            "image_path": results_aws[i], 
                            "image_name": results_aws[i].split('/')[-1],
                            "class_name": str(results_yolo.get(results_aws[i].split('/')[-1])),
                            "image_lable_rgb": str(results_rgb[i]['image_label']),
                            "image_meta": ', '.join(map(str, results_image_meta[i]))
                        }
        db_update(db, update_db=ImageUpload(**results_for_db), user=current_user)
    return JSONResponse(content=results)


@router.get("/api/all")
async def get_album(db=Depends(get_db), current_user: User = Depends(get_current_user)):
    image_list = []
    images = db.query(image_crud.Image).filter(
        image_crud.Image.user_id == current_user.id
        ).all()
    
    # 이미지 모델 직렬화
    for image in images:
        image_data = {
            "id": image.id,
            "image_path": image.image_path,
            "image_name": image.image_name,
            "image_lable_rgb": image.image_lable_rgb,
            "user_id": image.user_id,
            "image_edited": image.image_edited,
            "class_name": image.class_name,
            "image_meta": image.image_meta
        }
        image_list.append(image_data)
        
    return JSONResponse(content=image_list)

@router.get("/api/filter")
async def get_album(db=Depends(get_db), current_user: User = Depends(get_current_user)):
    image_list = []
    images = db.query(image_crud.Image).filter(
        (image_crud.Image.user_id == current_user.id) &
        (image_crud.Image.image_lable_rgb==2))
    for i in images:
        image_list.append(i.image_path)
    return JSONResponse(content=image_list)

# @router.get("/api/images")
# def get_image_list(db=Depends(get_db), current_user: User = Depends(get_current_user)):
#     # 이미지 폴더에서 이미지 파일 이름들을 가져옴
#     # start_dir: s3 이미지 경로
#     #TODO: s3 이미지 경로에서 이미지 파일 이름들을 가져오도록 수정
#     # image_files = os.listdir(start_dir)
#     SERVICE_NAME =  "s3"
#     ACCESS_KEY = "AKIAZPY2I4K53QAFMVE7"
#     SECRET_KEY = "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"
#     REGION = "ap-northeast-2"
#     BUCKET_NAME = "jungle-buchida-s3"
    
#     user_image = db.query(image_crud.Image).filter(
#         image_crud.Image.user_id == current_user.id
#         ).all().filter(image_crud.Image.image_path).all()

#     s3 = boto3.client(SERVICE_NAME, aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY, region_name=REGION)
    
#     image_list = []
#     try:
#         image_files = s3.list_objects(Bucket="jungle-buchida-s3")
#         image_files = [i['Key'] for i in user_image['Contents']]
#         for image_file in image_files:
#             image_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{image_file}"
#             image_list.append(image_url)
#         # 여기까지 OK
#         return image_list
#     except Exception as e:
#         print(e)
#         return None #TODO: 500 에러 반환
    
#     return image_files

# @router.get("/api/images")
# def get_image_list(db=Depends(get_db), current_user: User = Depends(get_current_user)):

#     # 이미지 폴더에서 이미지 파일 이름들을 가져옴
#     # start_dir: s3 이미지 경로
#     #TODO: s3 이미지 경로에서 이미지 파일 이름들을 가져오도록 수정
#     # image_files = os.listdir(start_dir)
#     ACCESS_KEY = "AKIAZPY2I4K53QAFMVE7"
#     SECRET_KEY = "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"
#     SERVICE_NAME =  "s3"
#     REGION = "ap-northeast-2"
#     BUCKET_NAME = "jungle-buchida-s3"
    
#     user_image = db.query(image_crud.Image).filter(
#         image_crud.Image.user_id == current_user.id
#         ).all().filter(image_crud.Image.image_path).all()

#     s3 = boto3.client(SERVICE_NAME, aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY, region_name=REGION)
#     response = s3.list_objects_v2(Bucket=BUCKET_NAME)    

#     image_files = [content['Key'] for content in response.get('Contents', []) if content['Key'].startswith('img/')]
#     print(image_files)
#     return image_files
@router.get("/api/images")
def get_image_list():
    # 이미지 폴더에서 이미지 파일 이름들을 가져옴
    image_files = os.listdir(start_dir)
    return image_files

@router.get("/api/images/{image_name}")
def get_image(image_name: str):
    # 이미지 파일 경로 반환
    print(f"{start_dir}/{image_name}")

    return f"./img/{image_name}"

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
            resized_image = image.resize((800, 800))
            
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
async def stitch_images(image_names: ImageNames):
    images = []
    for name in image_names.images:
        print('now image name: ', name)
        filepath = os.path.join(start_dir, name)
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail=f"Image {name} not found")
        image = cv2.imread(filepath)
        if image is None:
            raise HTTPException(status_code=500, detail=f"Failed to load image {name}")
        images.append(image)

    # OpenCV를 사용한 이미지 스티칭
    stitcher = cv2.Stitcher_create()
    (status, stitched) = stitcher.stitch(images)
    
    if status == cv2.Stitcher_OK:
        # 스티칭된 이미지를 임시 파일로 저장
        stitched_filename = "stitched_result.jpg"
        stitched_path = os.path.join(start_dir, stitched_filename)
        cv2.imwrite(stitched_path, stitched)
        
        # 스티칭된 이미지의 경로나 URL 반환
        return f"{start_dir}/{stitched_filename}"

    else:
        raise HTTPException(status_code=500, detail="서로 붙일 수 없는 이미지를 선택했습니다. 다른 이미지를 선택해주세요.")
