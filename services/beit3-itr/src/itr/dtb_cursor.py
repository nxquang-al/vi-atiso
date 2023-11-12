import json
from functools import lru_cache

import faiss


class DatabaseCursor:
    def __init__(
        self,
        index_file_path: str,
        index_subframes_file_path: str,
        keyframes_groups_json_path: str,
        subframes_groups_json_path: str,
    ):
        self._load_index(index_file_path, index_subframes_file_path)
        self._load_keyframes_groups_info(keyframes_groups_json_path, subframes_groups_json_path)

    @lru_cache(maxsize=1)
    def _load_index(self, index_file_path, index_subframes_file_path):
        self.index = faiss.read_index(index_file_path)
        index_subframes = faiss.read_index(index_subframes_file_path)
        try:
            self.index.merge_from(index_subframes)
        except:
            raise Exception("dtb_cursos::cannot merge keyframes and subframes index")

    @lru_cache(maxsize=1)
    def _load_keyframes_groups_info(
        self, keyframes_groups_json_path: str, subframes_groups_json_path: str
    ):
        with open(keyframes_groups_json_path) as file:
            keyframes_group_info = json.loads(file.read())
            self.no_keyframes = len(keyframes_group_info)
        with open(subframes_groups_json_path) as file:
            subframes_groups_info = json.loads(file.read())
            self.no_subframes = len(subframes_groups_info)

        self.frames_groups_info = keyframes_group_info
        self.frames_groups_info.extend(subframes_groups_info)
        assert self.index.ntotal == len(
            self.frames_groups_info
        ), "dtb_cursos::Index length and map lenght mismatch"

    def kNN_search(self, query_vector: str, topk: int = 10):
        results = []
        distances, ids = self.index.search(query_vector, topk)
        for i in range(len(ids[0])):
            frame_detail = self.frames_groups_info[ids[0][i]]
            frame_detail["distance"] = str(distances[0][i])
            frame_detail["folder"] = "Keyframes" if ids[0][i] < self.no_keyframes else "Subframes"
            results.append(frame_detail)
        return results
