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

from .dtb_cursor import DatabaseCursor
from .vlm_model import VisionLanguageModel

import numpy as np
import csv
import json

# cred = credentials.Certificate(settings.POLICY_FILE_PATH)
# app = firebase_admin.initialize_app(cred, {'storageBucket': 'cnc-designs.appspot.com'}, name='storage')
# bucket = storage.bucket(app=app)

client = storage.Client()
bucket = client.bucket('thangtd1')

class Item(BaseModel):
    query_text: str
    topk: int


router = APIRouter()


vectordb_cursor = None
vlm_model = None


def init_vectordb(**kargs):
    # Singleton pattern
    global vectordb_cursor
    if vectordb_cursor is None:
        vectordb_cursor = DatabaseCursor(**kargs)


def init_model(**kargs):
    # Singleton
    global vlm_model
    if vlm_model is None:
        vlm_model = VisionLanguageModel(**kargs)


@router.post("/retrieval/image-text")
async def retrieve(item: Item) -> JSONResponse:
    try:
        query_vector = vlm_model.get_embedding(input=item.query_text)
        search_results = vectordb_cursor.kNN_search(query_vector, item.topk)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "Search error"},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "success", "details": search_results},
    )

@router.get("/{video}/metadata")
async def get_length(video: str = Path(..., description = "Video id")) -> JSONResponse:
    path_file = "metadata/" + video + ".json"
    blob = bucket.blob(path_file)

    metadata = {}

    with blob.open('r') as f:
        metadata = json.load(f)

    return JSONResponse(status_code = status.HTTP_200_OK, content = metadata)


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
