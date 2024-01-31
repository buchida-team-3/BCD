import os
from sqlalchemy.orm import Session
from domain.image.image_schema import ImageUpload
from models import Image
import subprocess
from pathlib import Path

def make_sample_dir(start_dir):
    num = 1
    while True:
        fname = start_dir + '_' + f"{num:02}" # f"{num:02}": 문자열 포맷팅, 2자리 숫자로 표현
        if not os.path.exists(fname):
            os.makedirs(fname)
            break
        else:
            num += 1
            continue
    return fname, f'{num:02}'

def recording_image(db: Session, image_upload: ImageUpload):
    image_record = Image(
                id=image_upload.id,
                user_id=image_upload.user_id,
                image_name=image_upload.filename, 
                image_path=image_upload.file_path)
    
    db.add(image_record)    
    db.commit()

async def image_process(sample_number: int):
    
    # 현재 스크립트의 디렉토리를 구함
    current_dir = Path(__file__).resolve().parent

    # 상위 디렉토리로 3번 이동
    current_dir = current_dir.parent.parent.parent

    # 상위 디렉토리에서 image_process/main.py 경로를 생성
    script_path = current_dir / "image_process" / "main.py"

    # samples/sample_* 폴더에 있는 이미지를 사용하여 main.py를 실행합니다.
    sample_path = current_dir / f"image_process/samples/sample_{sample_number}"
    
    # subprocess를 사용하여 main.py를 실행
    result = subprocess.run(['python3', script_path, '-v', 
                            sample_path], capture_output=True, 
                            text=True)
    
    print("result.stderr:\n", result.stderr if result.stderr else "(없음)")
    
    return result

