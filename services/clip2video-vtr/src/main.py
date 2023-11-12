import torch
import os
from config import settings
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from vtr.router import init_model, init_vectordb
from vtr.router import router as router
from vtr.utils.config import get_args
from pathlib import Path

CWD = Path(__file__).parent

app = FastAPI(title="[CLIP2Video] Text-to-video Retrieval API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_headers=settings.CORS_HEADERS,
    allow_credentials=True,
    allow_methods=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Get the original 'detail' list of errors
    details = exc.errors()
    error_details = []

    for error in details:
        error_details.append({"error": f"{error['msg']} {str(error['loc'])}"})
    return JSONResponse(content={"message": error_details})


@app.on_event("startup")
async def startup_event():
    init_vectordb(
        index_file_path=settings.INDEX_FILE_PATH,
        annotations_path=settings.ANNOTATIONS_PATH,
    )
    device = (
        "cuda" if settings.DEVICE == "cuda" and torch.cuda.is_available() else "cpu"
    )
    task_config = get_args()
    task_config.__dict__["temporal_type"] = settings.TEMPORAL_TYPE
    task_config.__dict__["temporal_proj"] = settings.TEMPORAL_PROJ
    task_config.__dict__["center_type"] = settings.CENTER_TYPE
    task_config.__dict__["centerK"] = settings.CENTER_K
    task_config.__dict__["center_weight"] = settings.CENTER_WEIGHT
    task_config.__dict__["center_proj"] = settings.CENTER_PROJ
    task_config.__dict__["local_rank"] = settings.LOCAL_RANK
    task_config.__dict__["cross_model"] = settings.CROSS_MODEl
    task_config.__dict__[
        "cross_number_hidden_layers"
    ] = settings.CROSS_NUMBER_OF_HIDDEN_LAYERS
    task_config.__dict__["clip_path"] = os.path.join(CWD, settings.CLIP_MODEL_PATH)
    task_config.__dict__["max_words"] = 32
    init_model(
        checkpoint_path=os.path.join(CWD, settings.CLIP2Video_MODEL_PATH),
        device=settings.DEVICE,
        task_config=task_config,
    )


@app.get("/", include_in_schema=False)
async def root() -> None:
    return RedirectResponse("/docs")


@app.get("/health", status_code=status.HTTP_200_OK, tags=["health"])
async def perform_healthcheck() -> None:
    return JSONResponse(content={"message": "success"})


app.include_router(router)


# # Start API
# if __name__ == "__main__":
#     import uvicorn

#     uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
