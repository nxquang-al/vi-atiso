import torch
from config import settings
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from itr.router import init_model, init_vectordb
from itr.router import router as router

import os

os.environ['KMP_DUPLICATE_LIB_OK']='True'


app = FastAPI(title="Text-to-image Retrieval API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
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
        keyframes_groups_json_path=settings.KEYFRAMES_GROUPS_JSON_PATH,
    )
    device = "cuda" if settings.DEVICE == "cuda" and torch.cuda.is_available() else "cpu"
    init_model(model_name=settings.MODEL_NAME, device=device)


@app.get("/", include_in_schema=False)
async def root() -> None:
    return RedirectResponse("/docs")


@app.get("/health", status_code=status.HTTP_200_OK, tags=["health"])
async def perform_healthcheck() -> None:
    return JSONResponse(content={"message": "success"})


app.include_router(router)


# Start API
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
