#!/bin/bash

# Download faiss-index
mkdir -p ./data/faiss-index
gdown https://drive.usercontent.google.com/download?id=1zwviNjz18WP_irijIWZiRfi5T9AulpzA -O ./data/faiss-index/

# Download keyframe/subframe maps
mkdir -p ./data/config
gdown https://drive.usercontent.google.com/download?id=1yLGLQZ3KMazw2BVbo8a5bP-uiu_b8-sT -O ./data/config/
