import sys
import os
import json
from nltk.corpus import wordnet as wn
import time
from PIL import Image, ImageDraw
from google.cloud import storage
from http.server import BaseHTTPRequestHandler, HTTPServer    

class Trie:
    def __init__(self):
        self.root = dict()
    
    def insert(self, hypernym_path, directory, score):
        current_node = self.root
        for synset in hypernym_path:
            if str(synset) not in current_node:
                current_node[str(synset)] = dict()
            current_node = current_node[str(synset)]
        if 'directory' not in current_node:
            current_node['directory'] = dict()
        if directory not in current_node['directory']:
            current_node['directory'][directory] = score
    
    def find(self, synset):
        current_node = self.root
        hypernym_path = synset.hypernym_paths()[0]
        for synset in hypernym_path:
            if str(synset) not in current_node:
                return None
            current_node = current_node[str(synset)]
        return current_node
    
    def find_all(self, node):
        if node is None:
            return dict()
        if 'directory' not in node:
            thisNodeValue = dict()
        else:
            thisNodeValue = node['directory']
        for key in node:
            if key == 'directory':
                continue
            childNodeValue = self.find_all(node[key])
            for directory, score in childNodeValue.items():
                if directory not in thisNodeValue:
                    thisNodeValue[directory] = score
                else:
                    thisNodeValue[directory] += score
        return thisNodeValue
                
trie = Trie()
    
def load_data():
    print("Load data")
    if os.path.exists('trie.json'):
        print("File exists, loading...")
        trie.root = json.load(open('trie.json'))
        return
    print("Khong push folder objects 5gb len dau, het cuu")
    exit(0)
    
def query(words):
    if os.path.exists(f'results/{"_".join(words)}'):
        return
    results = dict()
    first = True
    for word in words:
        synsets = wn.synsets(word, pos='n')
        if len(synsets) == 0:
            print(f"Can't find synset for {word}")
            return []
        synset = synsets[0]
        node = trie.find(synset)
        if node is None:
            print(f"Can't find {word}")
            return []
        partial_result = trie.find_all(node)
        if first:
            results = partial_result
            first = False
        else:
            remove = []
            for directory in results:
                if directory not in partial_result:
                    remove.append(directory)
            for directory in remove:
                results.pop(directory)
            for directory, score in partial_result.items():
                if directory in results:
                    results[directory] += score
    results = [(directory, score) for directory, score in results.items()]
    results.sort(key=lambda x: x[1], reverse=True)
    if len(results) > 10:
        results = results[:10]
    return results

def show_results(words, results):
    if len(results) == 0:
        print("No results")
        return
    print(results)
    client = storage.Client()
    bucket = client.get_bucket('thangtd1')
    if not os.path.exists('results'):
        os.mkdir('results')
    words = "_".join(words)
    os.mkdir(f'results/{words}')
    for result in results:
        filedir, _ = result
        folder, number = filedir.split()
        with open(f"results/{words}/{folder}_{number}.jpg", 'wb') as file:
            data = bucket.blob(f"Keyframes/{folder}/{number}.jpg").download_as_string()
            file.write(data)

if __name__ == "__main__":
    st = time.time()
    load_data()
    ed = time.time()
    print("Data load time: ", (ed - st) * 10**3, "ms")
    if len(sys.argv) == 1:
        print("CLI mode")
        while True:
            print("Enter words: ")
            words = input()
            words = words.split(',')
            words = [word.strip() for word in words]
            if words[0] == 'exit':
                break
            words = sorted(words)
            results = query(words)
            show_results(words, results)
    else:
        print("HTTP Server mode")
        print("Chua lam gi het")
        
                
            