# Image-text Retrieval

## Configurations
Create a .env. You can make a copy from my prepared .env.example
```bash
cp .env.example .env
```
## Run locally
Create conda environment, note that python version should be `3.8`
```bash
conda create -n venv-image-text-retrieval python=3.8 -y
conda activate venv-image-text-retrieval
```
Install required packages
```bash
pip install -r requirements.txt --no-cache-dir
```
Start API
```bash
python src/main.py
```

## Easy install with Docker
Build Docker image
```bash
docker build -t image-text-retrieval .
```
Start API
```bash
docker run -it -p 8000:8000 image-text-retrieval
```

