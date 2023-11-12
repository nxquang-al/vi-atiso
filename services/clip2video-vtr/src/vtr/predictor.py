import os
from typing import Dict, Union

import numpy as np
import torch
from PIL import Image
from vtr.modules.modeling import CLIP2Video
from vtr.modules.tokenization_clip import SimpleTokenizer as ClipTokenizer

# from utils.config import get_args


class TextPreprocessor:
    def __init__(
        self,
        tokenizer,
        max_words: int = 30,
    ):
        self.max_words = max_words

        # start and end token
        self.SPECIAL_TOKEN = {
            "CLS_TOKEN": "<|startoftext|>",
            "SEP_TOKEN": "<|endoftext|>",
            "MASK_TOKEN": "[MASK]",
            "UNK_TOKEN": "[UNK]",
            "PAD_TOKEN": "[PAD]",
        }

        self.tokenizer = tokenizer

    def preprocess(self, input: str):
        words = self.tokenizer.tokenize(input)

        # add CLS token
        words = [self.SPECIAL_TOKEN["CLS_TOKEN"]] + words
        total_length_with_CLS = self.max_words - 1
        if len(words) > total_length_with_CLS:
            words = words[:total_length_with_CLS]

        # add END token
        words = words + [self.SPECIAL_TOKEN["SEP_TOKEN"]]
        input_ids = self.tokenizer.convert_tokens_to_ids(words)

        # add zeros for feature of the same length
        input_mask = [1] * len(input_ids)
        segment_ids = [0] * len(input_ids)
        while len(input_ids) < self.max_words:
            input_ids.append(0)
            input_mask.append(0)
            segment_ids.append(0)

        # ensure the length of feature to be equal with max words
        assert len(input_ids) == self.max_words
        assert len(input_mask) == self.max_words
        assert len(segment_ids) == self.max_words
        pairs_text = np.array(input_ids)
        pairs_mask = np.array(input_mask)
        pairs_segment = np.array(segment_ids)
        return pairs_text, pairs_mask, pairs_segment


class CLIP2VideoModel:
    def __init__(self, checkpoint_path: str, device: str = "cpu", task_config: Dict = {}):
        self._load_model(checkpoint_path, device, task_config)
        self.device = device

    # @lru_cache(maxsize=1)
    def _load_model(self, checkpoint_path, device: str = "cpu", task_config: Dict = {}):
        # resume model if pre-trained model exist.
        if os.path.exists(checkpoint_path):
            model_state_dict = torch.load(checkpoint_path, map_location=device)
        else:
            model_state_dict = None
            raise Exception("Invalid Model Checkpoint")

        # Prepare model
        self.model = CLIP2Video.from_pretrained(
            task_config.cross_model,
            cache_dir=None,
            state_dict=model_state_dict,
            task_config=task_config,
        )
        self.model.to(device)
        self.preprocessor = TextPreprocessor(tokenizer=ClipTokenizer())

    def get_embedding(self, input: Union[str, Image.Image]):
        if isinstance(input, str):
            pairs_text, pairs_mask, pairs_segment = self.preprocessor.preprocess(input)
            input_ids = torch.tensor(
                pairs_text[np.newaxis, ...], dtype=torch.long, device=self.device
            )
            input_mask = torch.tensor(
                pairs_mask[np.newaxis, ...], dtype=torch.long, device=self.device
            )
            segment_ids = torch.tensor(
                pairs_segment[np.newaxis, ...], dtype=torch.long, device=self.device
            )
            sequence_output = self.model.get_sequence_output(input_ids, segment_ids, input_mask)
            text_features = self.model.extract_text_features(sequence_output, input_mask)
            return text_features.cpu().detach().numpy()
        else:
            raise ValueError("Invalid Input Type")
