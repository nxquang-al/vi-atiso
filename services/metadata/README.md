# Image-text Retrieval

## Configurations
Create a .env. You can make a copy from my prepared .env.example
```bash
cp .env.example .env
```

Export `PYTHONPATH` to import `itr` module from code
```bash
export PYTHONPATH="$PWD/src/itr"
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
**Note:** The API will run at `http://localhost:8000`
## Easy install with Docker
Build Docker image
```bash
docker build -t image-text-retrieval .
```
Start API
```bash
docker run -it -p 8000:8000 image-text-retrieval
```
**Note:** The API will run at `http://localhost:8000`
