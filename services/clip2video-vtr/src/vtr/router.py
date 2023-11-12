from fastapi import APIRouter, File, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .predictor import CLIP2VideoModel
from .dtb_cursor import DatabaseCursor


class Item(BaseModel):
    query_text: str
    topk: int


router = APIRouter()

vectordb_cursor = None
model = None


def init_vectordb(**kargs):
    # Singleton pattern
    global vectordb_cursor
    if vectordb_cursor is None:
        vectordb_cursor = DatabaseCursor(**kargs)


def init_model(checkpoint_path: str, device: str, task_config: dict):
    # Singleton
    global model
    if model is None:
        model = CLIP2VideoModel(checkpoint_path, device, task_config)


@router.post("/retrieval")
async def retrieve(item: Item) -> JSONResponse:
    try:
        query_vector = model.get_embedding(input=item.query_text)
        search_results = vectordb_cursor.kNN_search(query_vector, max(item.topk, 1))
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "Search error"},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "success", "details": search_results},
    )
