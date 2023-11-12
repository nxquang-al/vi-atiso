#!/bin/bash

# Download faiss-index
mkdir -p ./data/faiss-index
gdown https://drive.usercontent.google.com/download?id=1KFfa6TcmvVms9kxozXSLgzdjhLsb3SJe -O ./data/faiss-index/
gdown https://drive.usercontent.google.com/download?id=1gKyakrHaTcwZvuNZVfXkrCwJRXFYt_6o -O ./data/faiss-index/

# Download keyframe/subframe maps
mkdir -p ./data/config
gdown https://drive.usercontent.google.com/download?id=1uj7p5BCHFbsOhCYdzGHrIGWCZ_EyOgvI -O ./data/config/
gdown https://drive.usercontent.google.com/download?id=14EJnqCPREJ_3qhz-gwuUNiRbmQo242wX -O ./data/config/