import torch
import os
from config import settings
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from itr.router import init_model, init_vectordb
from itr.router import router as router
from pathlib import Path

app = FastAPI(title="[BeiT-3] Text-to-image Retrieval API")

SERVICE_ROOT = Path(__file__).parent.parent


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
        index_file_path=os.path.join(SERVICE_ROOT, settings.INDEX_FILE_PATH),
        index_subframes_file_path=os.path.join(
            SERVICE_ROOT, settings.INDEX_SUBFRAMES_FILE_PATH
        ),
        keyframes_groups_json_path=settings.KEYFRAMES_GROUPS_JSON_PATH,
        subframes_groups_json_path=settings.SUBFRAMES_GROUPS_JSON_PATH,
    )
    device = (
        "cuda" if settings.DEVICE == "cuda" and torch.cuda.is_available() else "cpu"
    )
    init_model(device=device)


@app.get("/", include_in_schema=False)
async def root() -> None:
    return RedirectResponse("/docs")


@app.get("/health", status_code=status.HTTP_200_OK, tags=["health"])
async def perform_healthcheck() -> None:
    return JSONResponse(content={"message": "success"})


app.include_router(router)


# Start API
# if __name__ == "__main__":
#     print(os.listdir(os.path.join(SERVICE_ROOT, "data/faiss-index/")))
#     import uvicorn

#     uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
