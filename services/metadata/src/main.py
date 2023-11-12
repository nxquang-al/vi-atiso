import os
from pathlib import Path

from config import settings
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from itr.router import router as router

import os

os.environ['KMP_DUPLICATE_LIB_OK']='True'


app = FastAPI(title="Metadata API")

SERVICE_ROOT = Path(__file__).parent.parent


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
    pass


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
