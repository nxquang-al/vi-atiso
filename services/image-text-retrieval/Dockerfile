FROM python:3.8-slim

RUN apt-get update && \
    apt-get install git gsutil -y && \
    apt clean && \
    rm -rf /var/cache/apt/*

WORKDIR /code

COPY requirements.txt /code/requirements.txt

# PYTHONDONTWRITEBYTECODE=1: Disables the creation of .pyc files (compiled bytecode)
# PYTHONUNBUFFERED=1: Disables buffering of the standard output stream
# PYTHONIOENCODING: specifies the encoding to be used for the standard input, output, and error streams
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

RUN pip install -U pip && \
    pip install --no-cache-dir -r /code/requirements.txt

RUN useradd -m -u 1000 user

USER user

ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

COPY --chown=user . $HOME/app

CMD ["python", "./src/main.py"]