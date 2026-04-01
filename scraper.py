import requests
import json
import os

# Списък с известни личности (нашият "златен" списък за SEO)
celebrities = [
    {"name": "Cristiano Ronaldo", "netWorth": 800000000, "source": "Sports", "image": "https://i.imgur.com/8K0p3XN.jpg", "type": "Celebrity"},
    {"name": "Lionel Messi", "netWorth": 600000000, "source": "Sports", "image": "https://i.imgur.com/5V3Xz8x.jpg", "type": "Celebrity"},
    {"name": "Taylor Swift", "netWorth": 1100000000, "source": "Music", "image": "https://i.imgur.com/Qv9X2K3.jpg", "type": "Celebrity"},
    {"name": "Dwayne Johnson", "netWorth": 800000000, "source": "Movies", "image": "https://i.imgur.com/7Lp6m7u.jpg", "type": "Celebrity"},
    {"name": "MrBeast", "netWorth": 500000000, "source": "YouTube", "image": "https://i.imgur.com/3Yn8Tz5.jpg", "type": "Celebrity"},
    {"name": "LeBron James", "netWorth": 1200000000, "source": "Sports", "image": "https://i.imgur.com/2X8p7Xz.jpg", "type": "Celebrity"}
]

def fetch_master_data():
    # Използваме основния URL на Forbes, който е най-стабилен
    url = "https://www.forbes.com/forbesapi/org/rtb/display.json?pageNum=1&pageSize=200"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        print("🚀 Стартирам теглене на данни от Forbes...")
        response = requests.get(url, headers=headers)
        data = response.json()
        
        # Опитваме се да намерим списъка с хора по различни пътища (Forbes ги мени)
        raw_list = data.get('personList', {}).get('personsLists', [])
        if not raw_list:
            raw_list = data.get('personsLists', [])
            
        master_list = []
        
        # 1. Обработка на реалните милиардери
        for person in raw_list:
            # Изчисляваме всичко в долари
            net_worth = person.get('finalWorth', 0) * 1000000
            if net_worth == 0: continue
            
            # 7% годишна доходност / секунди в годината
            earnings_per_sec = (net_worth * 0.07) / 31536000
            
            master_list.append({
                "name": person.get('personName'),
                "netWorth": net_worth,
                "earningsPerSec": round(earnings_per_sec, 2),
                "source": person.get('source'),
                "image": person.get('squareImage', '').replace('http://', 'https://'),
                "type": "Billionaire"
            })
            
        print(f"📊 Намерени милиардери: {len(master_list)}")

        # 2. Добавяме известните личности
        for celeb in celebrities:
            c_net_worth = celeb['netWorth']
            # Спортистите правят повече пари спрямо кеша си (слагаме 12%)
            c_earnings_per_sec = (c_net_worth * 0.12) / 31536000 
            
            master_list.append({
                "name": celeb['name'],
                "netWorth": c_net_worth,
                "earningsPerSec": round(c_earnings_per_sec, 2),
                "source": celeb['source'],
                "image": celeb['image'],
                "type": celeb['type']
            })
            
        # Сортираме финално по богатство
        master_list.sort(key=lambda x: x['netWorth'], reverse=True)

        # Подсигуряваме папката и записа
        if not os.path.exists('public'):
            os.makedirs('public')

        with open('public/billionaires.json', 'w', encoding='utf-8') as f:
            json.dump(master_list, f, ensure_ascii=False, indent=4)
            
        print(f"✅ Успех! Общо в списъка: {len(master_list)} души.")

    except Exception as e:
        print(f"❌ Грешка при скрипта: {e}")

if __name__ == "__main__":
    fetch_master_data()
