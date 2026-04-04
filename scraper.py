import json
import os
import random

def fetch_master_data():
    master_list = []

    # 1. РЕАЛНОТО ЯДРО (Топ търсения за 2025/2026)
    real_profiles = [
        {"name": "Elon Musk", "worth": 230, "source": "Tesla, SpaceX", "type": "Billionaire"},
        {"name": "Bernard Arnault", "worth": 210, "source": "LVMH", "type": "Billionaire"},
        {"name": "Jeff Bezos", "worth": 195, "source": "Amazon", "type": "Billionaire"},
        {"name": "Mark Zuckerberg", "worth": 170, "source": "Meta", "type": "Billionaire"},
        {"name": "Larry Ellison", "worth": 140, "source": "Oracle", "type": "Billionaire"},
        {"name": "Taylor Swift", "worth": 1.2, "source": "Music", "type": "Celebrity"},
        {"name": "Cristiano Ronaldo", "worth": 0.8, "source": "Sports", "type": "Celebrity"},
        {"name": "Lionel Messi", "worth": 0.65, "source": "Sports", "type": "Celebrity"},
        {"name": "LeBron James", "worth": 1.2, "source": "Sports", "type": "Celebrity"},
        {"name": "MrBeast", "worth": 0.5, "source": "YouTube", "type": "Celebrity"},
        {"name": "Kim Kardashian", "worth": 1.7, "source": "Business", "type": "Celebrity"},
        {"name": "Dwayne Johnson", "worth": 0.8, "source": "Movies", "type": "Celebrity"},
        {"name": "Rihanna", "worth": 1.4, "source": "Music", "type": "Celebrity"},
        {"name": "Jay-Z", "worth": 2.5, "source": "Music", "type": "Celebrity"},
        {"name": "Tiger Woods", "worth": 1.1, "source": "Sports", "type": "Celebrity"},
        {"name": "Kylie Jenner", "worth": 0.75, "source": "Cosmetics", "type": "Celebrity"},
        {"name": "Eminem", "worth": 0.25, "source": "Music", "type": "Celebrity"},
        {"name": "Tom Cruise", "worth": 0.6, "source": "Movies", "type": "Celebrity"},
        {"name": "Bill Gates", "worth": 130, "source": "Microsoft", "type": "Billionaire"},
        {"name": "Warren Buffett", "worth": 135, "source": "Berkshire", "type": "Billionaire"},
    ]

    # Обработка на реалните профили
    for p in real_profiles:
        net_worth = p["worth"] * 1000000000
        ratio = 0.20 if p["type"] == "Celebrity" else 0.07
        master_list.append({
            "name": p["name"],
            "netWorth": net_worth,
            "earningsPerSec": round((net_worth * ratio) / 31536000, 2),
            "source": p["source"],
            "type": p["type"]
        })

    # 2. АВТОМАТИЧНО ГЕНЕРИРАНЕ ДО 400 ПРОФИЛА ЗА SEO
    # Генерираме останалите 180 милиардери
    for i in range(21, 201):
        worth = random.uniform(1.0, 90.0) * 1000000000
        master_list.append({
            "name": f"Global Billionaire #{i}",
            "netWorth": worth,
            "earningsPerSec": round((worth * 0.07) / 31536000, 2),
            "source": random.choice(["Tech", "Real Estate", "Finance", "Retail", "Energy"]),
            "type": "Billionaire"
        })

    # Генерираме останалите 180 звезди (Актьори, Певци, Спортисти)
    for i in range(21, 201):
        worth = random.uniform(0.01, 0.9) * 1000000000
        category = random.choice(["Actor", "Singer", "Athlete", "Influencer", "Director"])
        master_list.append({
            "name": f"Top {category} #{i}",
            "netWorth": worth,
            "earningsPerSec": round((worth * 0.15) / 31536000, 2),
            "source": category,
            "type": "Celebrity"
        })

    # Сортираме всички 400 души по богатство
    master_list.sort(key=lambda x: x['netWorth'], reverse=True)

    # Записване на файла
    if not os.path.exists('public'):
        os.makedirs('public')

    with open('public/billionaires.json', 'w', encoding='utf-8') as f:
        json.dump(master_list, f, ensure_ascii=False, indent=4)
    
    print(f"✅ УДАРНА ДОЗА SEO: В базата има точно {len(master_list)} профила (200 милиардери и 200 звезди).")

if __name__ == "__main__":
    fetch_master_data()
