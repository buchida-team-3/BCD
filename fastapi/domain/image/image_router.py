from fastapi import APIRouter, HTTPException, File, UploadFile
from typing import List
import os

from domain.image import image_crud, image_schema
from domain.image.image_crud import make_sample_dir, image_process, path_to_database

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from models import Image

DATABASE_URL = "sqlite:///./fastapi.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

router = APIRouter(
    # prefix="/image",
)

start_dir = "../image_process/samples/sample"

@router.post("/group/album/upload")
async def image_upload(files: List[UploadFile] = File(...)):
    results = []
    results_for_db = {}

    num_path, num = make_sample_dir(start_dir)

    for file in files:
        content = await file.read()
        file_path = os.path.join(num_path, file.filename)

        with open(file_path, "wb") as fp:
            fp.write(content)
        
        results.append({"filename": file_path})
    
    results_for_db = {"image_path": num_path, "image_name": file.filename}
    path_to_database(db, image_upload=image_schema.ImageUpload(**results_for_db))

    return results

