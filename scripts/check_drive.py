import urllib.request
import re
import json

urls = [
    ('Folder 1', 'https://drive.google.com/drive/folders/17GatWSNAWZ7Onf2b59yLYXOvB0meENmU?usp=sharing'),
    ('Folder 2', 'https://drive.google.com/drive/folders/1PZZMzDLtPhXuuAgEE-Bsn6rq2LkAWPoQ?usp=sharing')
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for name, url in urls:
    print(f'=== {name} ===')
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract filenames
            matches = re.findall(r'\["([A-Za-z0-9_\-\. ]+\.(?:jpg|jpeg|png|webp|svg|pdf))"', html, re.I)
            print(f"Filenames found ({len(matches)}):", set(matches))
            # Also extract file IDs if possible
            # pattern for drive files: ["<fileId>","<name>"]
            file_entries = re.findall(r'\["([a-zA-Z0-9_-]{25,})","([^"]+\.(?:jpg|jpeg|png|webp|svg))"', html)
            print(f"Entries with IDs ({len(file_entries)}):", file_entries[:10])
    except Exception as e:
        print('Error:', e)
