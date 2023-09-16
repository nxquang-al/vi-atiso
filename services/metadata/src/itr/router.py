from fastapi import APIRouter, status, Response, Path
from fastapi.responses import JSONResponse,StreamingResponse
from pydantic import BaseModel
# from google.cloud import storage
from config import settings
import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

from google.cloud import storage

import numpy as np
import csv
import json
import os

# cred = credentials.Certificate(settings.POLICY_FILE_PATH)
# app = firebase_admin.initialize_app(cred, {'storageBucket': 'cnc-designs.appspot.com'}, name='storage')
# bucket = storage.bucket(app=app)

client = storage.Client()
bucket = client.bucket('thangtd1')

router = APIRouter()

@router.get("/{video}/metadata")
async def get_length(video: str = Path(..., description = "Video id")) -> JSONResponse:
    try:
    
        path_file = "metadata/" + video + ".json"
        blob = bucket.blob(path_file)

        metadata = {}

        with blob.open('r') as f:
            metadata = json.load(f)

    except Exception:
        return JSONResponse(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR, content= {"message"  : "err"})

    return JSONResponse(status_code = status.HTTP_200_OK, content = metadata)

@router.get("/{video}/frames/list")
async def get_list_frames(video: str = Path(..., description = "Video list of frames")) -> JSONResponse:
    path_file = "Frames/" + video
    print(path_file)
    list_keyframes = []

    for blob in client.list_blobs('thangtd1', prefix=path_file):
        frame_name = os.path.basename(str(blob.name))
        frame_idx = frame_name.split("_")[2].rsplit('.', maxsplit=1)[0]
        start_time = int(frame_idx) * 25
        end_time = (int(frame_idx) +1) * 25 

        list_keyframes.append([str(blob.name), start_time, end_time])

    return JSONResponse(
        status_code=status.HTTP_200_OK, 
        content = {"list_frames": list_keyframes})


@router.get("/{video}/keyframes/list")
async def get_list_keyframes(
    video: str = Path(..., description= "Video list of keyframes")
) -> JSONResponse:
    path_file = "Keyframes/" + video
    list_keyframes = []
    meta_data = []

    path_meta_file = "map-keyframes/" + video + ".csv"

    blob = bucket.blob(path_meta_file)
    with blob.open('r') as f:
        reader = csv.reader(f)
        meta_data = list(reader)
        # print(meta_data[0])
        meta_data = np.array(meta_data[1:])


    for blob in client.list_blobs('thangtd1', prefix=path_file):
      list_keyframes.append([str(blob.name)])

    list_keyframes = np.array(list_keyframes)

    list_keyframes = np.append(list_keyframes,meta_data,axis=1)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content = {"list_keyframes": list_keyframes.tolist()})

@router.get("/stream_video/{bucket_name}/{video_blob_name}")
async def stream_video(
    bucket_name: str = Path(..., description="GCS Bucket Name"),
    video_blob_name: str = Path(..., description="Path to Video in Bucket"),
    response: Response = None
) -> JSONResponse:

    path_file = "Video/" + video_blob_name

    # blob = bucket.blob(path_file)

    # url = blob.generate_signed_url(
         # This URL is valid for 15 minutes
        #  expiration=datetime.timedelta(minutes=15),
         # Allow GET requests using this URL.
        #  method='GET'
        # )
    
    # print(url)

    # return JSONResponse(status_code=status.HTTP_200_OK, content = {"url" : url})

    # if not blob.exists():
    #     return StreamingResponse(
    #         content_generator([b"Video not found"]), media_type="text/plain"
    #     )

    # # Stream the video in chunks
    # def content_generator():
    #     for chunk in blob.download_as_bytes(start=0, end=blob.size, raw_download=True):
    #         yield chunk

    # return StreamingResponse(content_generator(), media_type="video/mp4")
