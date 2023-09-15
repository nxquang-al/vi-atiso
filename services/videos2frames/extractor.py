from google.cloud import storage
import os
from concurrent import futures
import argparse

def download_public_file(bucket_name, source_blob_name, destination_file_name):
    """Downloads a public blob from the bucket."""

    storage_client = storage.Client.create_anonymous_client()

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

    print(
        "Downloaded public blob {} from bucket {} to {}.".format(
            source_blob_name, bucket.name, destination_file_name
        )
    )

def list_blobs(bucket_name, folder):
    mp4_list = []
    """Lists all the blobs in the bucket."""
    storage_client = storage.Client.create_anonymous_client()
    blobs = storage_client.list_blobs(bucket_name, prefix=folder)
    for blob in blobs: 
        mp4_list.append(blob.name)
    return mp4_list

def extract_frames(video_name, folder_video, folder_frame):
    video_name = video_name.split('.')[0]
    if os.path.exists(folder_frame):
        os.system('rm -rf ' + folder_frame + '/*')
        os.system('rm -rf ' + folder_frame)
    os.makedirs(folder_frame)
    cmd = 'ffmpeg -i %s %s/%s_%s.jpg' % (folder_video, folder_frame, video_name, '%08d')
    os.system(cmd)
    cmd = 'gsutil -m cp -r -n Frames gs://thangtd1'
    os.system(cmd)
    if os.path.exists(folder_frame):
        os.system('rm -rf ' + folder_frame + '/*')
        os.system('rm -rf ' + folder_frame)
        os.system('rm -rf ' + folder_video)

def process(line):
    print(line)
    mp4_name, folder_video, folder_frame = line
    print(mp4_name)
    download_public_file('thangtd1', mp4_name, folder_video)
    extract_frames(mp4_name.split("/")[1], folder_video, folder_frame)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Get frames from video')
    parser.add_argument('--Videos', type=str, default='Videos', help='input directory of videos')
    parser.add_argument('--Frames', type=str, default='Frames', help='output directory of frames')
    args = parser.parse_args()

    mp4_list = list_blobs('thangtd1', 'Video')
    lines = [(mp4, 
              os.path.join(args.Videos, mp4.split("/")[1]), 
              os.path.join(args.Frames, mp4.split(".")[0].split("/")[1])) for mp4 in mp4_list]

    for line in lines[9:].reverse():
        process(line)

    
