import requests
import json
import os

# Списък с известни личности за SEO
celebrities = [
    {"name": "Cristiano Ronaldo", "netWorth": 800000000, "source": "Sports", "image": "https://i.imgur.com/8K0p3XN.jpg", "type": "Celebrity"},
    {"name": "Lionel Messi", "netWorth": 600000000, "source": "Sports", "image": "https://i.imgur.com/5V3Xz8x.jpg", "type": "Celebrity"},
    {"name": "Taylor Swift", "netWorth": 1100000000, "source": "Music", "image": "https://i.imgur.com/Qv9X2K3.jpg", "type": "Celebrity"},
    {"name": "Dwayne Johnson", "netWorth": 800000000, "source": "Movies", "image": "https://i.imgur.com/7Lp6m7u.jpg", "type": "Celebrity"},
    {"name": "MrBeast", "netWorth": 500000000, "source": "YouTube", "image": "https://i.imgur.com/3Yn8Tz5.jpg", "type": "Celebrity"},
    {"name": "LeBron James", "netWorth": 1200000000, "source": "Sports", "image": "https://i.imgur.com/2X8p7Xz.jpg", "type": "Celebrity"}
]

def fetch_master_data():
    # Опитваме с алтернативен, по-директен URL на Forbes
    url = "https://www.forbes.com/forbesapi/org/rtb/display.json?pageNum=1&pageSize=200"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.forbes.com/real-time-billionaires/'
    }

    try:
        print("🔍 Стартирам агресивно теглене...")
        response = requests.get(url, headers=headers, timeout=20)
        
        if response.status_code != 200:
            print(f"⚠️ Forbes отказа достъп (Status {response.status_code}). Пробвам Plan D...")
            return

        data = response.json()
        
        # Динамично търсене на данните в JSON структурата
        raw_list = []
        if 'personList' in data:
            # Понякога е в ['personList']['personsLists'], понякога директно в ['personList']
            content = data['personList']
            raw_list = content.get('personsLists', content if isinstance(content, list) else [])
        elif 'personsLists' in data:
            raw_list = data['personsLists']

        master_list = []
        
        # 1. Обработка на милиардерите
        for person in raw_list:
            name = person.get('personName') or person.get('name')
            worth = person.get('finalWorth') or person.get('worth')
            
            if name and worth:
                net_worth = worth * 1000000
                earnings_per_sec = (net_worth * 0.07) / 31536000
                
                img = person.get('squareImage', '')
                if img and not img.startswith('http'): img = "https:" + img
                
                master_list.append({
                    "name": name,
                    "netWorth": net_worth,
                    "earningsPerSec": round(earnings_per_sec, 2),
                    "source": person.get('source', 'Business'),
                    "image": img or "https://i.imgur.com/8K0p3XN.jpg",
                    "type": "Billionaire"
                })
        
        print(f"📊 Намерени в Forbes: {len(master_list)}")

        # 2. Добавяме известните личности
        for celeb in celebrities:
            c_net_worth = celeb['netWorth']
            c_earnings_per_sec = (c_net_worth * 0.12) / 31536000 
            master_list.append({
                "name": celeb['name'],
                "netWorth": c_net_worth,
                "earningsPerSec": round(c_earnings_per_sec, 2),
                "source": celeb['source'],
                "image": celeb['image'],
                "type": celeb['type']
            })
            
        master_list.sort(key=lambda x: x['netWorth'], reverse=True)

        if not os.path.exists('public'):
            os.makedirs('public')

        with open('public/billionaires.json', 'w', encoding='utf-8') as f:
            json.dump(master_list, f, ensure_ascii=False, indent=4)
            
        print(f"✅ Успех! Общо в базата: {len(master_list)} души.")

    except Exception as e:
        print(f"❌ Грешка: {e}")

if __name__ == "__main__":
    fetch_master_data()
