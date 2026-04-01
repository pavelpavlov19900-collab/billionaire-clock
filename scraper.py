import requests
import json
import os

# Списък с известни личности (Celebrity Seed Data)
# Можеш да добавяш колкото искаш тук. Нетното състояние е в долари.
celebrities = [
    {"name": "Cristiano Ronaldo", "netWorth": 800000000, "source": "Sports", "image": "https://img.link/ronaldo.jpg"},
    {"name": "Lionel Messi", "netWorth": 600000000, "source": "Sports", "image": "https://img.link/messi.jpg"},
    {"name": "Taylor Swift", "netWorth": 1100000000, "source": "Music", "image": "https://img.link/taylor.jpg"},
    {"name": "Dwayne Johnson", "netWorth": 800000000, "source": "Movies", "image": "https://img.link/therock.jpg"},
    {"name": "MrBeast", "netWorth": 500000000, "source": "YouTube", "image": "https://img.link/mrbeast.jpg"}
]

def fetch_master_data():
    # 1. Взимаме ТОП 200 от Forbes
    url = "https://www.forbes.com/forbesapi/org/rtb/display.json?pageNum=1&pageSize=200"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        master_list = []
        
        # Обработка на милиардерите
        for person in data.get('personList', {}).get('personsLists', []):
            net_worth = person.get('finalWorth', 0) * 1000000
            earnings_per_sec = (net_worth * 0.07) / 31536000
            
            master_list.append({
                "name": person.get('personName'),
                "netWorth": net_worth,
                "earningsPerSec": round(earnings_per_sec, 2),
                "source": person.get('source'),
                "image": person.get('squareImage'),
                "type": "Billionaire"
            })
            
        # 2. Добавяме известните личности към списъка
        for celeb in celebrities:
            c_net_worth = celeb['netWorth']
            # При спортистите и актьорите често доходът е по-висок спрямо активите им
            c_earnings_per_sec = (c_net_worth * 0.12) / 31536000 # Примерно 12% доходност
            
            master_list.append({
                "name": celeb['name'],
                "netWorth": c_net_worth,
                "earningsPerSec": round(c_earnings_per_sec, 2),
                "source": celeb['source'],
                "image": celeb['image'],
                "type": "Celebrity"
            })
            
        # Сортираме по богатство (от най-богатите надолу)
        master_list.sort(key=lambda x: x['netWorth'], reverse=True)

        with open('billionaires.json', 'w', encoding='utf-8') as f:
            json.dump(master_list, f, ensure_ascii=False, indent=4)
            
        print(f"✅ Успешно генериран списък с {len(master_list)} души!")

    except Exception as e:
        print(f"❌ Грешка: {e}")

if __name__ == "__main__":
    fetch_master_data()
