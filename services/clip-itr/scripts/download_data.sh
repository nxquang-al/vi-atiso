#!/bin/bash

# Download faiss-index
mkdir -p ./data/faiss-index
gdown https://drive.usercontent.google.com/download?id=1owtKf9imP1H_9-jfTNbIloKPYDrRmw6- -O ./data/faiss-index/
gdown https://drive.usercontent.google.com/download?id=1PbrTb9j3pXqpvXl_47Jh55canFC0lNYW -O ./data/faiss-index/

# Download keyframe/subframe maps
mkdir -p ./data/config
gdown https://drive.usercontent.google.com/download?id=1uj7p5BCHFbsOhCYdzGHrIGWCZ_EyOgvI -O ./data/config/
gdown https://drive.usercontent.google.com/download?id=14EJnqCPREJ_3qhz-gwuUNiRbmQo242wX -O ./data/config/