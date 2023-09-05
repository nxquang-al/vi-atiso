# Using BEiT-3 to get text-vision embedding

## For text embedding
1. Create file ```test_model.py``` inside folder ```itr```.
2. Using the code follow:
```
from beit3_model import Beit3Model

if __name__ == '__main__':
    vlm = Beit3Model(device='cpu')
    
    print(vlm.get_embedding('A man who loves a girl.').shape)
```

## For image embedding
1. Create file ```test_model.py``` inside folder ```itr```.
2. Using the code follow:
```
from beit3_model import Beit3Model
from torchvision.datasets.folder import default_loader

if __name__ == '__main__':
    loader = default_loader
    image = loader('./path/to/your/image.jpg')

    vlm = Beit3Model(device='cpu')
    print(vlm.get_embedding(image).shape)
```