from functools import lru_cache

import faiss
import pandas as pd


class DatabaseCursor:
    def __init__(self, index_file_path: str, annotations_path: str):
        self._load_index(index_file_path)
        self._load_annotations(annotations_path)

    @lru_cache(maxsize=1)
    def _load_index(self, index_file_path):
        self.index = faiss.read_index(index_file_path)

    @lru_cache(maxsize=1)
    def _load_annotations(self, annotations_path: str):
        self.annotations = pd.read_csv(annotations_path)
        if "index_fn" in self.annotations.columns:
            self.annotations.drop(["index_fn"], axis=1)

    def reformat_outputs(self, video_id, start_time, end_time):
        video_name = video_id.split("-")[0]

        start_hour, start_min, start_sec = start_time.split("-")
        start_hour, start_min, start_sec = (
            int(start_hour),
            int(start_min),
            float(start_sec),
        )
        start_time = 3600.0 * start_hour + 60.0 * start_min + start_sec

        end_hour, end_min, end_sec = end_time.split("-")
        end_hour, end_min, end_sec = int(end_hour), int(end_min), float(end_sec)
        end_time = 3600.0 * end_hour + 60.0 * end_min + end_sec

        return {
            "video": video_name,
            "start_time": start_time,
            "end_time": end_time,
        }

    def kNN_search(self, query_vector: str, topk: int = 10):
        results = []
        distances, ids = self.index.search(query_vector, topk)
        for i in range(len(ids[0])):
            item = self.annotations.iloc[ids[0][i]]
            details = self.reformat_outputs(item["video_id"], item["start_time"], item["end_time"])
            details["distance"] = str(distances[0][i])
            results.append(details)
        return results
