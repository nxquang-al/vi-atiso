import os
import shutil
import sys

import pandas as pd

INPUT_FILE = sys.argv[1]

xl_file = pd.ExcelFile(INPUT_FILE)

OUTPUT_FILE = 'submission'

os.makedirs(OUTPUT_FILE, exist_ok=True)
count = 1

for sheet_name in xl_file.sheet_names:
    answers = xl_file.parse(sheet_name)
    if str(count) in sheet_name:
        filename = OUTPUT_FILE + '/' + 'query-p3-' + str(count) + '.csv'
        answers.to_csv(filename, index=False)
        count += 1
    else:
        print(sheet_name)

shutil.make_archive(OUTPUT_FILE, 'zip', OUTPUT_FILE)
