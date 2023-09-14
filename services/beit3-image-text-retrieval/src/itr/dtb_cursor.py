import json
from functools import lru_cache

import faiss


class DatabaseCursor:
    def __init__(self, index_file_path: str, keyframes_groups_json_path: str):
        self._load_index(index_file_path)
        self._load_keyframes_groups_info(keyframes_groups_json_path)

    @lru_cache(maxsize=1)
    def _load_index(self, index_file_path):
        self.index = faiss.read_index(index_file_path)

    @lru_cache(maxsize=1)
    def _load_keyframes_groups_info(self, keyframes_groups_json_path: str):
        with open(keyframes_groups_json_path) as file:
            self.keyframes_group_info = json.loads(file.read())

    def kNN_search(self, query_vector: str, topk: int = 10):
        results = []
        distances, ids = self.index.search(query_vector, topk)
        for i in range(len(ids[0])):
            frame_detail = self.keyframes_group_info[ids[0][i]]
            frame_detail["distance"] = str(distances[0][i])
            results.append(frame_detail)
        return results
