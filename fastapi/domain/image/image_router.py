from fastapi import APIRouter, HTTPException, File, UploadFile
from typing import List
import os

# from domain.image import image_crud, image_schema

router = APIRouter(
    # prefix="/image",
)


# start_dir = "./images/samples"
start_dir = "../image_process/samples/sample"

def make_sample_dir(start_dir):
    num = 1
    while True:
        fname = start_dir + '_' + f"{num:02}"
        if not os.path.exists(fname):
            os.makedirs(fname)
            break
        else:
            num += 1
            continue
    return fname


@router.post("/group/album/upload")
async def image_upload(files: List[UploadFile] = File(...)):
    results = []

    num_path = make_sample_dir(start_dir)

    for file in files:
        content = await file.read()
        file_path = os.path.join(num_path, file.filename)

        with open(file_path, "wb") as fp:
            fp.write(content)

        results.append({"filename": file_path})

    return results
# 요청시 클라에서 토큰을 헤더에 담아서 보내는데 그것을 검증할 부분을 추가해야함