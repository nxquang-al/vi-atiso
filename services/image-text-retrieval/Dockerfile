FROM python:3.8-slim

RUN apt-get update && \
    apt-get install git gsutil -y && \
    apt clean && \
    rm -rf /var/cache/apt/*

# PYTHONDONTWRITEBYTECODE=1: Disables the creation of .pyc files (compiled bytecode)
# PYTHONUNBUFFERED=1: Disables buffering of the standard output stream
# PYTHONIOENCODING: specifies the encoding to be used for the standard input, output, and error streams
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

COPY requirements.txt /tmp/requirements.txt

RUN pip install -U pip && \
    pip install --no-cache-dir -r /tmp/requirements.txt

COPY . /proj

WORKDIR /proj

# Download index from Cloud Storage
RUN mkdir ./data/faiss-index && \
    gsutil -m cp "gs://thangtd1/faiss-index/index_beit3_L01_to_L20.faiss" ./data/faiss-index/

# Download models and store them in src/itr/beit3_model/
RUN chmod +x download_models.sh && \
    download_models.sh

CMD python ./src/main.py