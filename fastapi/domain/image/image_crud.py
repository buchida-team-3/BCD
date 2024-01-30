from sqlalchemy.orm import Session
from domain.image.image_schema import UserCreate
import os
from models import Image

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

def recording_image(db: Session, image_upload: UserCreate):
    image_record = Image(
                id=image_upload.id,
                user_id=image_upload.user_id,
                image_name=image_upload.filename, 
                image_path=image_upload.file_path)
    
    db.add(image_record)    
    db.commit()
