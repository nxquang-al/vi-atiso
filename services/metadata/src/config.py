from pathlib import Path

from pydantic_settings import BaseSettings

FILE = Path(__file__)
ROOT = FILE.parent.parent


class Settings(BaseSettings):
    # API SETTINGS
    HOST: str
    PORT: int
    CORS_ORIGINS: list
    CORS_HEADERS: list

    # MODEL SETTINGS
    MODEL_NAME: str = "ViT-B/32"
    DEVICE: str = "cpu"

    POLICY_FILE_PATH: str

    class Config:
        env_file = ROOT / ".env"


settings = Settings()
