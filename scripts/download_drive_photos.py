import urllib.request
import re
import os
import json
import time

urls = [
    ('folder_botb1', 'https://drive.google.com/drive/folders/17GatWSNAWZ7Onf2b59yLYXOvB0meENmU?usp=sharing'),
    ('folder_botb2', 'https://drive.google.com/drive/folders/1PZZMzDLtPhXuuAgEE-Bsn6rq2LkAWPoQ?usp=sharing')
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

all_files = {}

for folder_key, url in urls:
    print(f"Fetching {folder_key}...")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    
    # Pattern looks like:
    # aria-label="<filename> Image Shared" ... ssk='5:auSv138:<fileId>-0-16'
    # or aria-label="<filename>" and nearby ssk
    matches = re.findall(r'aria-label="([A-Za-z0-9_\-\. ]+\.(?:jpg|jpeg|png))[^"]*"[^>]*ssk=[\'"][^\'"]*?:([a-zA-Z0-9_-]{25,})[^\'"]*[\'"]', html, re.I)
    print(f"Found {len(matches)} matches via regex 1 in {folder_key}")
    
    # If not enough, search all ssk with fileId and aria-label nearby
    if len(matches) < 10:
        matches2 = re.findall(r'aria-label="([^"]+\.JPG)[^"]*"[\s\S]{1,300}?ssk=[\'"][^\'"]*?:([a-zA-Z0-9_-]{25,})', html)
        print(f"Found {len(matches2)} matches via regex 2")
        matches = matches2

    for filename, file_id in matches:
        all_files[filename] = {
            'filename': filename,
            'id': file_id,
            'folder': folder_key
        }

print(f"Total unique files discovered: {len(all_files)}")

# Save mapping
os.makedirs('public/assets/events', exist_ok=True)
with open('public/assets/events/manifest.json', 'w') as f:
    json.dump(all_files, f, indent=2)

print("Manifest saved to public/assets/events/manifest.json")
