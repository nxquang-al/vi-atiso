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
    CLIP2Video_MODEL_PATH: str = "checkpoints/pytorch_model.bin.2"
    CLIP_MODEL_PATH: str = "checkpoints/ViT-B-32.pt"
    DEVICE: str = "cpu"
    CROSS_MODEl: str = "cross-base"

    # For TDB Block
    TEMPORAL_TYPE: str = "TDB"
    TEMPORAL_PROJ: str = "sigmoid_selfA"
    # For TAB block
    CENTER_TYPE: str = "TAB"
    CENTER_K: int = 5
    CENTER_WEIGHT: float = 0.5
    CENTER_PROJ: str = "TAB_TDB"

    MAX_WORDS: int = 32
    LOCAL_RANK: int = 0
    CROSS_NUMBER_OF_HIDDEN_LAYERS: int = 4

    # FAISS DATABASE SETTINGS
    INDEX_FILE_PATH: str
    ANNOTATIONS_PATH: str

    class Config:
        env_file = ROOT / ".env"


settings = Settings()
