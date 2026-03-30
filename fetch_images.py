import urllib.request
import urllib.parse
import re
import os

queries = {
  "xiaolongbao.png": "대림동 린궁즈멘관 만두",
  "lamb_leg.png": "대림동 줘마양다리구이 구이",
  "mapo_tofu.png": "대림동 기와집 마파두부",
  "maratang.png": "대림동 봉선마라탕",
  "hotpot.png": "대림동 홍중샤브샤브",
  "dosakmyeon.png": "대림동 뤄웨이도삭면",
  "beef_soup.png": "대림동 고향소탕집",
  "yanbian_sundae.png": "대림 중앙시장 연변순대",
  "lamb_skewers.png": "대림동 원조강뚝 양꼬치",
  "cold_noodle.png": "대림동 대식대 냉면구이"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for filename, query in queries.items():
    print(f"Searching for {query}...")
    url = f"https://images.search.yahoo.com/search/images?p={urllib.parse.quote(query)}"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
            # Find the image thumbnail from bing image cache
            match = re.search(r"src='(https://tse\d\.mm\.bing\.net/th\?id=[^']+)'", html)
            if match:
                img_url = match.group(1)
                print(f"Downloading {img_url} to {filename}")
                img_req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(img_req) as img_resp:
                    with open(f"public/{filename}", 'wb') as out_f:
                        out_f.write(img_resp.read())
            else:
                print("No image found.")
    except Exception as e:
        print(f"Failed {filename}: {e}")
