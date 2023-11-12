from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .dtb_cursor import DatabaseCursor
from .vlm_model import VisionLanguageModel


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


@router.post("/retrieval")
async def retrieve(item: Item) -> JSONResponse:
    try:
        query_vector = vlm_model.get_embedding(input=item.query_text)
        search_results = vectordb_cursor.kNN_search(query_vector, item.topk)
    except:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "Search error"},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "success", "details": search_results},
    )
