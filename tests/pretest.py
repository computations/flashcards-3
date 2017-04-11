#!/usr/bin/python3

import os
import requests

#files to dl, and locations

test_files = [
    ('https://upload.wikimedia.org/wikipedia/commons/7/7d/American_Sign_Language_ASL.svg',
        'tests/server_tests/test_content/test_1.svg'),
    ('https://upload.wikimedia.org/wikipedia/commons/transcoded/c/cb/Creative_Commons_Music_License_Explained.webm/Creative_Commons_Music_License_Explained.webm.160p.webm',
        'tests/server_tests/test_content/test_2.webm')
]

for s, d in test_files:
    if not os.path.exists(d):
        print("getting test content: " + d)
        if not os.path.exists('/'.join(os.path.split(d)[:-1])):
            os.makedirs(d)
        with open(d, 'w') as dest_file:
            dest_file.write(requests.get(s).text);

