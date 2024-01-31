import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from domain.image.image_schema import ImageUpload
from models import Image
import subprocess


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


async def image_process(sample_number: int):
    # 현재 스크립트의 디렉토리를 구합니다.
    current_dir = os.path.dirname(__file__)
    
    # 상위 디렉토리로 이동
    current_dir = os.path.dirname(current_dir)
    current_dir = os.path.dirname(current_dir)
    current_dir = os.path.dirname(current_dir)
    print("current_dir:", current_dir)

    # 상위 디렉토리에서 image_process/main.py 경로를 생성합니다.
    script_path = os.path.join(current_dir, "image_process", 'main.py')
    print("script_path:", script_path)
    
    print("sample_number:", sample_number)
    
    # samples/sample_* 폴더에 있는 이미지를 사용하여 main.py를 실행합니다.
    sample_path = os.path.join(current_dir, f'image_process/samples/sample_{sample_number}')
    print("sample_path:", sample_path)
    
    print("path 설정 완료")
    
    # subprocess를 사용하여 main.py를 실행합니다.
    result = subprocess.run(['python3', script_path, '-v', 
                            sample_path], capture_output=True, 
                            text=True)

    print("출력:\n",result.stdout if result.stdout else "(없음)")
    print("오류 메시지:\n",result.stderr if result.stderr else "(없음)")
    print("종료 상태:",result.returncode if result.returncode else "(없음)")
    
    return result


DATABASE_URL = "sqlite:///./fastapi.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def path_to_database(db, image_upload: ImageUpload):
    """
    이미지 경로를 DB에 저장합니다.
    """
    db_image = Image(
        image_name=image_upload.image_name,
        image_path=image_upload.image_path,
    )
    db.add(db_image)
    db.commit()

    