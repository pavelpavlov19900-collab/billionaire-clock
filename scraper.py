import requests
import json
import os

def fetch_master_data():
    master_list = []

    # 1. СТРАТЕГИЯ: КОМБИНИРАН СПИСЪК (Celebs & Top Billionaires)
    # Тук добавяме "твърдо" ядро от хора, които винаги ще присъстват.
    # Можеш лесно да копираш и добавяш още редове тук.
    base_data = [
        {"name": "Elon Musk", "worth": 210, "source": "Tesla, SpaceX", "type": "Billionaire"},
        {"name": "Jeff Bezos", "worth": 195, "source": "Amazon", "type": "Billionaire"},
        {"name": "Bernard Arnault", "worth": 233, "source": "LVMH", "type": "Billionaire"},
        {"name": "Mark Zuckerberg", "worth": 177, "source": "Meta", "type": "Billionaire"},
        {"name": "Larry Ellison", "worth": 141, "source": "Oracle", "type": "Billionaire"},
        {"name": "Warren Buffett", "worth": 133, "source": "Berkshire Hathaway", "type": "Billionaire"},
        {"name": "Bill Gates", "worth": 128, "source": "Microsoft", "type": "Billionaire"},
        {"name": "Steve Ballmer", "worth": 121, "source": "Microsoft", "type": "Billionaire"},
        {"name": "Larry Page", "worth": 114, "source": "Google", "type": "Billionaire"},
        {"name": "Sergey Brin", "worth": 110, "source": "Google", "type": "Billionaire"},
        {"name": "Mukesh Ambani", "worth": 116, "source": "Diversified", "type": "Billionaire"},
        {"name": "Michael Bloomberg", "worth": 106, "source": "Bloomberg LP", "type": "Billionaire"},
        {"name": "Amancio Ortega", "worth": 103, "source": "Zara", "type": "Billionaire"},
        {"name": "Carlos Slim Helu", "worth": 102, "source": "Telecom", "type": "Billionaire"},
        {"name": "Francoise Bettencourt Meyers", "worth": 99, "source": "L'Oreal", "type": "Billionaire"},
        {"name": "Cristiano Ronaldo", "worth": 0.8, "source": "Sports", "type": "Celebrity"},
        {"name": "Lionel Messi", "worth": 0.6, "source": "Sports", "type": "Celebrity"},
        {"name": "Kylian Mbappé", "worth": 0.18, "source": "Sports", "type": "Celebrity"},
        {"name": "Neymar Jr", "worth": 0.25, "source": "Sports", "type": "Celebrity"},
        {"name": "Taylor Swift", "worth": 1.1, "source": "Music", "type": "Celebrity"},
        {"name": "Beyoncé", "worth": 0.8, "source": "Music", "type": "Celebrity"},
        {"name": "MrBeast", "worth": 0.5, "source": "YouTube", "type": "Celebrity"},
        {"name": "The Rock", "worth": 0.8, "source": "Movies", "type": "Celebrity"},
        {"name": "LeBron James", "worth": 1.2, "source": "Sports", "type": "Celebrity"},
        {"name": "Tiger Woods", "worth": 1.1, "source": "Golf", "type": "Celebrity"},
        {"name": "Kim Kardashian", "worth": 1.7, "source": "Business", "type": "Celebrity"},
        {"name": "Rihanna", "worth": 1.4, "source": "Music/Beauty", "type": "Celebrity"},
    ]

    # 2. АВТОМАТИЧНО ГЕНЕРИРАНЕ НА ОЩЕ 180 "ИЗМИСЛЕНИ" МИЛИАРДЕРИ (За количество)
    # Докато намерим по-добро API, ще напълним списъка с реалистични данни,
    # за да имаме SEO обем.
    for i in range(1, 180):
        master_list.append({
            "name": f"Billionaire Index #{i+20}",
            "netWorth": (200 - i) * 1000000000, # Намаляващо богатство
            "earningsPerSec": round(((200 - i) * 1000000000 * 0.07) / 31536000, 2),
            "source": "Investments",
            "image": "https://i.imgur.com/8K0p3XN.jpg",
            "type": "Billionaire"
        })

    # 3. ДОБАВЯНЕ НА РЕАЛНИТЕ ОТ НАШИЯ СПИСЪК
    for p in base_data:
        net_worth = p["worth"] * 1000000000
        # Коефициент на печалба: 7% за милиардери, 15% за спортисти (те харчат/печелят по-бързо)
        ratio = 0.15 if p["type"] == "Celebrity" else 0.07
        
        master_list.append({
            "name": p["name"],
            "netWorth": net_worth,
            "earningsPerSec": round((net_worth * ratio) / 31536000, 2),
            "source": p["source"],
            "image": "https://i.imgur.com/8K0p3XN.jpg", # Тук ще сложим реални линкове после
            "type": p["type"]
        })

    # Сортиране
    master_list.sort(key=lambda x: x['netWorth'], reverse=True)

    # Записване
    if not os.path.exists('public'):
        os.makedirs('public')

    with open('public/billionaires.json', 'w', encoding='utf-8') as f:
        json.dump(master_list, f, ensure_ascii=False, indent=4)
    
    print(f"✅ Готово! В базата има {len(master_list)} профила.")

if __name__ == "__main__":
    fetch_master_data()
