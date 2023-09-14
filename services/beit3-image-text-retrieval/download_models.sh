#!/bin/bash

# Test network connection before download
ping -c 4 8.8.8.8
if [ $? -gt 0 ]
then
    exit 1
fi
# Download processor and beit-3 model from provided urls
wget "https://conversationhub.blob.core.windows.net/beit-share-public/beit3/sentencepiece/beit3.spm?sv=2021-10-04&st=2023-06-08T11%3A16%3A02Z&se=2033-06-09T11%3A16%3A00Z&sr=c&sp=r&sig=N4pfCVmSeq4L4tS8QbrFVsX6f6q844eft8xSuXdxU48%3D" -O ./src/itr/beit3_model/beit3.spm
wget "https://conversationhub.blob.core.windows.net/beit-share-public/beit3/f30k_retrieval/beit3_base_patch16_384_f30k_retrieval.pth?sv=2021-10-04&st=2023-06-08T11%3A16%3A02Z&se=2033-06-09T11%3A16%3A00Z&sr=c&sp=r&sig=N4pfCVmSeq4L4tS8QbrFVsX6f6q844eft8xSuXdxU48%3D" -O ./src/itr/beit3_model/beit3_base_patch16_384_f30k_retrieval.pth