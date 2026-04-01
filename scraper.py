import requests
import json
import os

# Нашият списък с известни личности за SEO
celebrities = [
    {"name": "Cristiano Ronaldo", "netWorth": 800000000, "source": "Sports", "image": "https://i.imgur.com/8K0p3XN.jpg", "type": "Celebrity"},
    {"name": "Lionel Messi", "netWorth": 600000000, "source": "Sports", "image": "https://i.imgur.com/5V3Xz8x.jpg", "type": "Celebrity"},
    {"name": "Taylor Swift", "netWorth": 1100000000, "source": "Music", "image": "https://i.imgur.com/Qv9X2K3.jpg", "type": "Celebrity"},
    {"name": "Dwayne Johnson", "netWorth": 800000000, "source": "Movies", "image": "https://i.imgur.com/7Lp6m7u.jpg", "type": "Celebrity"},
    {"name": "MrBeast", "netWorth": 500000000, "source": "YouTube", "image": "https://i.imgur.com/3Yn8Tz5.jpg", "type": "Celebrity"},
    {"name": "LeBron James", "netWorth": 1200000000, "source": "Sports", "image": "https://i.imgur.com/2X8p7Xz.jpg", "type": "Celebrity"}
]

def fetch_master_data():
    # Променяме URL-а към по-директен ендпоинт на Forbes
    url = "https://www.forbes.com/forbesapi/org/rtb/display.json?pageNum=1&pageSize=200"
    
    headers = {
        'accept': 'application/json, text/plain, */*',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'referer': 'https://www.forbes.com/real-time-billionaires/',
    }

    try:
        print("🚀 Опит за достъп до Forbes през главния шлюз...")
        response = requests.get(url, headers=headers, timeout=15)
        
        # Проверка дали изобщо сме получили данни
        if response.status_code != 200:
            print(f"❌ Грешка от Forbes: Status Code {response.status_code}")
            return

        data = response.json()
        
        # ТЪРСЕНЕ: Опитваме се да изкопаем списъка от 3 различни нива (Forbes го мести често)
        raw_list = []
        if 'personList' in data and 'personsLists' in data['personList']:
            raw_list = data['personList']['personsLists']
        elif 'personsLists' in data:
            raw_list = data['personsLists']
        elif 'personList' in data:
            raw_list = data['personList']

        master_list = []
        
        # 1. Обработка на реалните милиардери
        if raw_list:
            for person in raw_list:
                net_worth = person.get('finalWorth', 0) * 1000000
                if net_worth < 1000000: continue # Пропускаме ако няма данни
                
                # 7% годишна доходност / секунди в годината
                earnings_per_sec = (net_worth * 0.07) / 31536000
                
                # Поправка на снимките
                img = person.get('squareImage', '')
                if img and not img.startswith('http'):
                    img = "https:" + img
                elif not img:
                    img = "https://i.imgur.com/8K0p3XN.jpg" # Dummy image

                master_list.append({
                    "name": person.get('personName'),
                    "netWorth": net_worth,
                    "earningsPerSec": round(earnings_per_sec, 2),
                    "source": person.get('source'),
                    "image": img,
                    "type": "Billionaire"
                })
        
        print(f"📊 Намерени милиардери от Forbes: {len(master_list)}")

        # 2. Добавяме известните личности (нашият SEO резерв)
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
            
        # Сортираме финално по богатство
        master_list.sort(key=lambda x: x['netWorth'], reverse=True)

        # Записване в public папката
        if not os.path.exists('public'):
            os.makedirs('public')

        with open('public/billionaires.json', 'w', encoding='utf-8') as f:
            json.dump(master_list, f, ensure_ascii=False, indent=4)
            
        print(f"✅ Успех! Общо в базата: {len(master_list)} души.")

    except Exception as e:
        print(f"❌ Критична грешка в скрипта: {e}")

if __name__ == "__main__":
    fetch_master_data()
