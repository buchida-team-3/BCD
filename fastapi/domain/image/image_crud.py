from sqlalchemy.orm import Session
from domain.image.image_schema import ImageUpload
from models import Image, User

import os
import boto3


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
    return fname, f'{num:02}'


def aws_upload(input, bucket, output):
    SERVICE_NAME =  "s3"
    ACCESS_KEY = "AKIAZPY2I4K53QAFMVE7"
    SECRET_KEY = "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"
    REGION = "ap-northeast-2"
    BUCKET_NAME = "jungle-buchida-s3"

    s3 = boto3.client(SERVICE_NAME, aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY, region_name=REGION)

    try:
        s3.upload_file(input, bucket, output, ExtraArgs={'ContentType': 'image/jpeg'})
    except Exception as e:
        print(e)
        return None
    
    image_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{output}"
    
    return image_url


def db_update(db: Session, update_db: ImageUpload, user: User):
    db_image = Image(
            image_path = update_db.image_path,
            image_name = update_db.image_name,
            image_lable = update_db.image_lable,
            user = user
            )
    db.add(db_image)
    db.commit()    
    

