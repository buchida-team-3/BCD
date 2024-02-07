from fastapi.responses import JSONResponse
from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from typing import List
import os

from domain.image import image_crud, image_schema
from domain.image.image_crud import make_sample_dir, aws_upload, db_update
from domain.image.clustering_image import image_clustering
from domain.image.clustering_rgb import rgb_clustering

from domain.user.user_router import get_current_user

from models import User
from database import get_db

from sqlalchemy.orm import Session  # Session 클래스 임포트

router = APIRouter(
    # prefix="/image",
)

start_dir = "../frontend/public/img"

@router.post("/group/album/upload")
async def image_upload(files: List[UploadFile] = File(...), db=Depends(get_db), current_user: User = Depends(get_current_user)):
    results = []
    results_aws = []
    results_clustering = []

    num_path, num = make_sample_dir(start_dir)
    cnt = 1
    for file in files:
        content = await file.read()
        file_path = os.path.join(num_path, f"img_{cnt}.jpg")

        cnt += 1

        with open(file_path, "wb") as fp:
            fp.write(content)

        results.append({"filename": file_path, "num": num})
        results_aws.append(aws_upload(file_path, "jungle-buchida-s3", f"{num_path.split('/')[-1]}/img_{cnt-1}.jpg"))

    results_clustering = image_clustering(new_image_path=num_path, folder_path=None, model_path="./kmeans_model.pkl")

    for i in range((len(results_aws))):
        result_for_db = {"image_path": results_aws[i], "image_name": results_clustering[i]['image_name'], "image_lable": results_clustering[i]['image_label']}
        db_update(db, update_db=image_schema.ImageUpload(**result_for_db), user=current_user)

    return JSONResponse(content = results)

# @router.get("/album")
# async def get_album(db=Depends(get_db), current_user: User = Depends(get_current_user)):
#     album_list = []
#     album = db.query(image_crud.Image).filter(
#         image_crud.Image.user_id == current_user.id
#         ).all()
#     for i in album:
#         album_list.append(i.image_path)
#     return JSONResponse(content=album_list)

@router.get("/album")
async def get_album(db: Session = Depends(get_db)):
    album_list = []
    album = db.query(image_crud.Image).all()  # 모든 이미지를 조회
    for i in album:
        album_list.append(i.image_path)
    return JSONResponse(content=album_list)

@router.get("/group/album/images")
async def get_images():
    image_list = []
    for root, dirs, files in os.walk(start_dir):
        for file in files:
            if file.endswith(".jpg"):
                image_list.append(os.path.join(root, file))

    return JSONResponse(content=image_list)

