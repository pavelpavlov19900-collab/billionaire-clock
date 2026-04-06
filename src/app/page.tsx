"use client";
import { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image'; 
import Script from 'next/script'; 

const REALITY_ITEMS = [
  { name: "avocado toasts with organic micro-greens", price: 18 },
  { name: "months of Netflix Premium you barely watch", price: 23 },
  { name: "therapy sessions to cope with capitalism", price: 150 },
  { name: "designer paper clips from Prada", price: 185 },
  { name: "Louis Vuitton yoga mats you'll never sweat on", price: 2400 },
  { name: "Uber rides during a light drizzle (Surge Pricing)", price: 45 },
  { name: "gallons of printer ink (the most expensive liquid on Earth)", price: 12000 },
  { name: "Erewhon smoothies endorsed by Hailey Bieber", price: 20 },
  { name: "Balenciaga trash bags (literally just trash bags)", price: 1790 },
  { name: "Apple Mac Pro wheels (just the four wheels)", price: 699 },
  { name: "seconds of Mark Zuckerberg's personal security detail", price: 700 },
  { name: "Supreme branded bricks", price: 150 },
  { name: "bites of a gold-leaf Wagyu steak at Nusr-Et", price: 100 },
  { name: "Airbnb cleaning fees for a one-night stay", price: 150 },
  { name: "Gucci dog collars for a pet you can't afford", price: 350 },
  { name: "overpriced coffees that ruined your chance to buy a house", price: 7 },
  { name: "square inches of a Manhattan parking spot", price: 200 },
  { name: "hours of private jet parking at Teterboro", price: 500 },
  { name: "Tesla 'Full Self-Driving' subscriptions that still hit cones", price: 199 },
  { name: "Gwyneth Paltrow's 'This Smells Like My Vagina' candles", price: 75 },
  { name: "VIP tickets to a seminar telling you to wake up at 4 AM", price: 5000 },
  { name: "days of survival food kits for the apocalypse", price: 120 },
  { name: "pairs of shoes that look deliberately dirty", price: 600 },
  { name: "limited edition pastel Stanley cups", price: 45 },
  { name: "drops of La Mer anti-aging moisturizer", price: 10 },
  { name: "months of the gym membership you pay but never use", price: 80 },
  { name: "gallons of premium gas in California", price: 6 },
  { name: "vintage Tamagotchis on eBay", price: 120 },
  { name: "bottles of generic hand sanitizer from 2020", price: 20 },
  { name: "minutes of consultation with a top Wall Street lawyer", price: 1500 },
  { name: "single organic strawberries imported from Japan", price: 25 },
  { name: "golden toothpicks used by hedge fund managers", price: 50 },
  { name: "bottles of 'raw' unfiltered alkaline water", price: 12 },
  { name: "tickets to the F1 Paddock Club (practice session only)", price: 8000 },
  { name: "business class flights to a city you don't even want to visit", price: 4500 },
  { name: "Cyberquads for Kids", price: 1900 },
  { name: "bites of a $1,000 golden bagel in NYC", price: 250 }
];

export default function BillionaireClock() {
  const [data, setData] = useState<any[]>([]);
  const [selectedHero, setSelectedHero] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>(null);
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [salary, setSalary] = useState<number>(3000);
  const [age, setAge] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [secondsPassed, setSecondsPassed] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  
  // MODALS STATES
  const [showJobModal, setShowJobModal] = useState(false);
  const [generatedReceiptUrl, setGeneratedReceiptUrl] = useState<string | null>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const [generatedTshirtUrl, setGeneratedTshirtUrl] = useState<string | null>(null);
  const [isGeneratingTshirt, setIsGeneratingTshirt] = useState(false);
  const [userRank, setUserRank] = useState({ name: "MATRIX CITIZEN", color: "text-zinc-500", level: 1 });
  // 🤯 THE REALITY CHECK STATE
  const [currentAbsurdItem, setCurrentAbsurdItem] = useState(REALITY_ITEMS[0]);
  
  // 👕 T-SHIRT DECOY STATE
  const [tshirtSoldOut, setTshirtSoldOut] = useState(false);

  // THE VANITY BILLBOARD
  const [currentVip, setCurrentVip] = useState<string | null>("@YourHandleHere");
  const [showVipModal, setShowVipModal] = useState(false);

  // MILLIONAIRE CALCULATOR (LEAD GEN)
  const [showMillionModal, setShowMillionModal] = useState(false);
  const [milSavings, setMilSavings] = useState<number>(0);
  const [milMonthly, setMilMonthly] = useState<number>(200);
  const [milRoi, setMilRoi] = useState<number>(8); 
  const [yearsToMillion, setYearsToMillion] = useState<string | null>(null);
  const [cutCoffee, setCutCoffee] = useState(false);

  // 🎥 TIKTOK STUDIO MODE
  const [isTiktokMode, setIsTiktokMode] = useState(false);

  // 🎮 THE SPEND GAME STATES
  const [showGameModal, setShowGameModal] = useState(false);
  const [gameBalance, setGameBalance] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [hasRageQuit, setHasRageQuit] = useState(false);

  // ⚡ NEW MACHINE STATES: SABOTAGE, CERTIFICATE, ROAST
  const [isPaused, setIsPaused] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [roastText, setRoastText] = useState<string | null>(null);

  // Musk makes roughly $3200 per second (calculated as ~$100B/year)
  const muskPerSecond = 3200; 

  const GAME_ITEMS = [
    { name: "Coffee", price: 5, icon: "☕" },
    { name: "iPhone 15", price: 1500, icon: "📱" },
    { name: "Rolex", price: 40000, icon: "⌚" },
    { name: "Lambo", price: 400000, icon: "🏎️" },
    { name: "Real Estate (Invest)", price: 500, icon: "🏢", isAffiliate: true },
    { name: "Private Jet", price: 25000000, icon: "🛩️" }
  ];

  const receiptRef = useRef<HTMLDivElement>(null);
  const tshirtRef = useRef<HTMLDivElement>(null);

  // Analytics Tracker & Whale Watch Data Collector
  const trackConversion = (eventName: string, dataObj: any = {}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, dataObj);
    }
    console.log(`📊 [WHALE-WATCH DATA] ${eventName}`, dataObj);
  };

  useEffect(() => {
    setIsClient(true);
    fetch('/billionaires.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setSelectedHero(json[0]); 
        setOpponent(json[1]);
      })
      .catch(err => console.error("Waiting for build..."));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Logic for the Sabotage Pause
      if (!isPaused) {
        setSecondsPassed(prev => prev + 0.1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [selectedHero, opponent, isTiktokMode, isPaused]);

  useEffect(() => {
    if (isTiktokMode) {
      setSecondsPassed(0);
    }
  }, [isTiktokMode]);

  useEffect(() => {
    if (secondsPassed < 15) setUserRank({ name: "MATRIX CITIZEN", color: "text-zinc-500", level: 1 });
    else if (secondsPassed < 45) setUserRank({ name: "EXISTENTIAL CRISIS", color: "text-yellow-500", level: 2 });
    else if (secondsPassed < 90) setUserRank({ name: "SYSTEM GLITCH", color: "text-orange-500", level: 3 });
    else if (secondsPassed < 180) setUserRank({ name: "REBEL OBSERVER", color: "text-red-500", level: 4 });
    else setUserRank({ name: "0.0001% ENLIGHTENED", color: "text-purple-500 animate-pulse", level: 5 });
  }, [secondsPassed]);

  // 👇 НОВИЯТ БЛОК ЗА АБСУРДИТЕ ИДВА ТУК 👇
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * REALITY_ITEMS.length);
    setCurrentAbsurdItem(REALITY_ITEMS[randomIndex]);
  }, [salary]);
  // 👆 КРАЙ НА НОВИЯ БЛОК 👆
  
  useEffect(() => {
    if (Math.floor(secondsPassed) === 10 && !isTiktokMode) {
      const dataPayload = {
        salary_usd: salary,
        age_group: age || "Undisclosed",
        region: country || "Undisclosed",
        interest_target: selectedHero?.name,
      };
      trackConversion('data_profile_synced', dataPayload);
    }
  }, [secondsPassed, salary, age, country, selectedHero, isTiktokMode]);

  useEffect(() => {
    let gameInterval: NodeJS.Timeout;
    if (showGameModal && !hasRageQuit) {
      gameInterval = setInterval(() => {
        setGameBalance(prev => prev + (muskPerSecond / 10)); 
        if (clickCount > 100) {
            setHasRageQuit(true);
        }
      }, 100);
    }
    return () => clearInterval(gameInterval);
  }, [showGameModal, hasRageQuit, clickCount]);

  const handleBuy = (item: any) => {
    if (item.isAffiliate) {
         trackConversion('game_affiliate_clicked');
         alert("Redirecting to Real Estate Investment Platform...");
         return;
    }
    setGameBalance(prev => prev - item.price);
    setClickCount(prev => prev + 1);
    
    // WHALE WATCH DATA CAPTURE
    trackConversion('whale_watch_intent', { 
        item: item.name, 
        price: item.price, 
        user_income: salary 
    });
  };

  const handleSabotage = () => {
    trackConversion('sabotage_triggered');
    alert("In production: This stopping Musk for 1s will cost $0.99 via Stripe!");
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000); 
  };

  const triggerRoast = () => {
    const roasts = [
      `You make in a year what Elon makes in ${timeToEarnAnnual} seconds. Even a vending machine has more cash flow than you.`,
      `At ${age || 'your age'}, Bezos was already dominating retail. You are currently dominating the 'Add to Cart' button for things you can't afford.`,
      `Your annual salary can buy ${absurdDisplay}. That's not a lifestyle, that's a cry for help.`,
      `The Matrix doesn't even need to guard your cell. You've built it yourself with that salary.`,
      `You clicked 'Spend his money' 100 times. If only you clicked 'Build a business' once, we wouldn't be here.`
    ];
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    setRoastText(randomRoast);
    trackConversion('ai_roast_triggered');
  };

  if (!isClient || !data.length || !selectedHero) return null; 

  const moneyFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const heroEarnings = selectedHero.earningsPerSec * secondsPassed;
  const annualSalary = salary * 12;
  const timeToEarnAnnual = (annualSalary / selectedHero.earningsPerSec).toFixed(1);
  const heroMonthlyEarnings = selectedHero.earningsPerSec * 30 * 24 * 60 * 60;
  const opponentEarnings = opponent ? opponent.earningsPerSec * secondsPassed : 0;

  // 🔥 НОВАТА СЛОТ МАШИНА ЗА АБСУРДИ
  const absurdRatio = annualSalary / currentAbsurdItem.price;
  let absurdDisplay = absurdRatio >= 1 
    ? `exactly ${absurdRatio.toFixed(1)} ${currentAbsurdItem.name}`
    : `only ${(absurdRatio * 100).toFixed(2)}% of ${currentAbsurdItem.name}`;

  const inflationBurn = (annualSalary * 0.05 / 31536000) * secondsPassed;

  const handleCalculateMillion = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion('calculated_million_path');
    let months = 0;
    let total = Number(milSavings);
    const r = Number(milRoi) / 100 / 12;
    const actualMonthly = cutCoffee ? Number(milMonthly) + 150 : Number(milMonthly); 

    if (actualMonthly <= 0 && (r <= 0 || total < 1000000)) {
        setYearsToMillion("NEVER");
        return;
    }

    while (total < 1000000 && months < 1200) { 
      total = total * (1 + r) + actualMonthly;
      months++;
    }
    setYearsToMillion(months >= 1200 ? "NEVER" : (months / 12).toFixed(1));
  };

  const generateReceipt = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingReceipt(true);
    trackConversion('click_share_shock');
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, { 
        quality: 1.0, 
        pixelRatio: 2, 
        cacheBust: true, 
        backgroundColor: '#000000' 
      });
      setGeneratedReceiptUrl(dataUrl);
      trackConversion('generated_share_shock_success');
    } catch (e) { alert('Snapshot failed. Try again.'); }
    finally { setIsGeneratingReceipt(false); }
  };

  const generateTshirt = async () => {
    if (!tshirtRef.current) return;
    setIsGeneratingTshirt(true);
    trackConversion('click_wear_anger_tshirt');
    try {
      const dataUrl = await htmlToImage.toPng(tshirtRef.current, { 
        quality: 1.0, 
        pixelRatio: 3, 
        cacheBust: true, 
        backgroundColor: '#09090b' 
      });
      setGeneratedTshirtUrl(dataUrl);
      trackConversion('generated_tshirt_success');
    } catch (e) { alert('Design failed.'); }
    finally { setIsGeneratingTshirt(false); }
  };

  const openVipModal = () => {
    trackConversion('click_vanity_billboard_claim'); 
    setShowVipModal(true);
  };

  const websiteUrl = "richreality.xyz";

 if (isTiktokMode) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans selection:bg-yellow-500 selection:text-black">
         <div className="w-full max-w-[400px] aspect-[9/16] bg-black border border-zinc-800 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-2xl">
            
            {/* 🟩 Top Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-900">
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${Math.min((secondsPassed / 15) * 100, 100)}%` }}></div>
            </div>

            {/* 🔴 Live REC Indicator */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-black text-xs tracking-widest uppercase">REC</span>
            </div>

            {/* 🎯 The Main Hook */}
            <h2 className="text-5xl font-black text-white uppercase mt-10 mb-2 leading-none tracking-tighter">DON'T SCROLL.</h2>
            
            <p className="text-zinc-400 text-lg mb-8 leading-tight">
              In the last <span className="text-white font-bold">{secondsPassed.toFixed(1)}s</span>,<br/>
              <span className="text-yellow-500 font-black">{selectedHero.name}</span> just made:
            </p>
            
            {/* 💰 The Money Printer */}
            <div className="text-6xl md:text-7xl font-mono font-black text-green-400 mb-8 tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]">
              ${moneyFormatter.format(heroEarnings)}
            </div>

            {/* 🤯 The Reality Check (Added inside the video!) */}
            <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-2xl w-full mb-10 text-left">
               <p className="text-red-500 text-[10px] font-black uppercase mb-1 tracking-widest">Your Reality Check</p>
               <p className="text-white text-sm font-light">That buys <span className="font-bold underline">{absurdDisplay}</span>.</p>
            </div>

            {/* 👇 The Call to Action */}
            <div className="absolute bottom-20 bg-white text-black px-8 py-4 rounded-full font-black uppercase text-xl animate-bounce shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              LINK IN BIO 👇
            </div>

            {/* 🚪 Exit Button */}
            <button onClick={() => setIsTiktokMode(false)} className="absolute bottom-6 text-zinc-600 text-[10px] uppercase font-black hover:text-white transition-colors tracking-widest">
              ✕ EXIT STUDIO
            </button>
         </div>
      </main>
    );
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');`}
      </Script>

      <main className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black relative overflow-x-hidden">
        
        <div className="fixed top-[72px] md:top-[88px] left-0 w-full h-1 bg-zinc-900 z-[60]">
          <div className={`h-full transition-all duration-300 ${userRank.color.split(' ')[0].replace('text', 'bg')}`} style={{ width: `${(secondsPassed % 60) * 1.66}%` }}></div>
        </div>

        <header className="w-full p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl fixed top-0 z-50">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase text-yellow-500">BILLIONAIRE CLOCK</h1>
            <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${userRank.color}`}>RANK: {userRank.name}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setIsTiktokMode(true); trackConversion('enter_tiktok_studio'); }} className="px-3 md:px-4 py-2 rounded-full border border-green-500/50 bg-green-500/10 text-green-400 font-black text-[9px] md:text-[10px] tracking-widest uppercase hover:bg-green-500 hover:text-black transition-all">
              🎥 STUDIO
            </button>
            <button onClick={() => { setIsBattleMode(!isBattleMode); setSecondsPassed(0); trackConversion('toggle_battle_mode'); }} className="px-3 md:px-4 py-2 rounded-full border border-white/10 font-bold text-[9px] md:text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">
              {isBattleMode ? '← SINGLE' : '⚔️ BATTLE'}
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto pt-32 pb-20 px-4">
          
          {isBattleMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">
               <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                 <select value={selectedHero.name} onChange={(e) => setSelectedHero(data.find(h => h.name === e.target.value))} className="bg-transparent text-3xl font-black outline-none mb-4 text-yellow-500">
                   {data.map(h => <option key={h.name} value={h.name} className="bg-zinc-900">{h.name}</option>)}
                 </select>
                 <div className="text-5xl font-mono font-black text-green-400 tabular-nums">${moneyFormatter.format(heroEarnings)}</div>
               </div>
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex w-16 h-16 bg-red-600 rounded-full items-center justify-center font-black italic border-4 border-black shadow-xl">VS</div>
               <div className="bg-white/5 border border-red-500/20 rounded-[2.5rem] p-8">
                 <select value={opponent?.name} onChange={(e) => setOpponent(data.find(h => h.name === e.target.value))} className="bg-transparent text-3xl font-black outline-none mb-4 text-red-500">
                   {data.map(h => <option key={h.name} value={h.name} className="bg-zinc-900">{h.name}</option>)}
                 </select>
                 <div className="text-5xl font-mono font-black text-red-400 tabular-nums">${moneyFormatter.format(opponentEarnings)}</div>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-full max-w-xl bg-gradient-to-r from-yellow-900/40 via-yellow-700/50 to-yellow-900/40 border border-yellow-500/30 rounded-2xl p-4 mb-10 shadow-[0_0_30px_rgba(234,179,8,0.2)] backdrop-blur-sm relative flex items-center justify-between gap-4">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 rounded-l-2xl"></div>
                    <div className="flex-1 flex flex-col items-start pl-3 text-left">
                        <p className="text-[10px] text-yellow-300 uppercase tracking-widest font-black mb-1">Peasant of the Day (VIP)</p>
                        <p className="text-xl font-black text-white leading-tight">Currently Crying: <span className="text-yellow-400 font-mono">{currentVip || "@SlotAvailable"}</span></p>
                    </div>
                    <button onClick={openVipModal} className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-md whitespace-nowrap">BUY SLOT ($10)</button>
                </div>

               <div className={`mb-2 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest ${userRank.color}`}>LEVEL {userRank.level} • {userRank.name}</div>
               <div className="text-xs text-red-500/50 font-mono text-center mb-8">Value lost to inflation while here: -${inflationBurn.toFixed(4)}</div>

               <div className="mb-10">
                 <p className="text-lg text-zinc-400 mb-4">While you've been here, <span className="text-white font-bold">{selectedHero.name}</span> made:</p>
                 <h2 className={`text-6xl md:text-9xl font-black text-green-400 font-mono tracking-tighter tabular-nums transition-all ${secondsPassed > 60 && !isPaused ? 'scale-110 drop-shadow-[0_0_30px_rgba(74,222,128,0.4)]' : ''}`}>
                   ${moneyFormatter.format(heroEarnings)}
                 </h2>
                 {isPaused && <div className="text-red-500 font-black uppercase tracking-widest text-sm animate-pulse mt-4">⚠️ SYSTEM SABOTAGE ACTIVE: CLOCK PAUSED ⚠️</div>}
               </div>

               {/* 🔥 NEW: AI ROAST COMPONENT */}
               <div className="mb-8 w-full max-w-2xl">
                    {!roastText ? (
                        <button onClick={triggerRoast} className="w-full py-3 border border-red-500/50 bg-red-500/10 text-red-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-red-500 hover:text-white transition-all">🔥 ROAST MY FINANCIAL REALITY</button>
                    ) : (
                        <div className="p-5 bg-zinc-900 border border-red-600 rounded-2xl animate-bounce-short text-left relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                            <p className="text-red-500 font-mono text-sm italic mb-2 leading-relaxed">" {roastText} "</p>
                            <button onClick={() => setRoastText(null)} className="text-[9px] text-zinc-600 uppercase font-black hover:text-white tracking-widest">Close Matrix Oracle</button>
                        </div>
                    )}
               </div>

               <div className="max-w-2xl w-full bg-gradient-to-b from-zinc-900/50 to-black border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative">
                  <div className="bg-black/60 border border-white/5 rounded-2xl p-6 mb-8 flex flex-col gap-4">
                    <div className="flex flex-col text-left relative">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Your Monthly Salary (USD)</label>
                      <span className="absolute left-4 top-[38px] text-yellow-500 font-black">$</span>
                      <input 
    type="number" 
    value={salary === 0 ? '' : salary} 
    placeholder="0"
    onChange={(e) => {
        const val = e.target.value;
        setSalary(val === '' ? 0 : Number(val));
    }} 
    className="w-full bg-black border border-white/10 text-xl font-black py-3 pl-10 pr-4 rounded-xl focus:border-yellow-500 outline-none" 
/>
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl font-light mb-6">They just made your <span className="text-red-500 font-black underline">ANNUAL</span> salary in <span className="text-white font-black">{timeToEarnAnnual} seconds</span>.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/40 p-4 rounded-xl text-left border border-white/5">
                      <p className="text-[10px] text-zinc-500 uppercase font-black">Your 30 Days:</p>
                      <p className="text-xl font-black">${moneyFormatter.format(salary)}</p>
                    </div>
                    <div className="bg-red-950/20 p-4 rounded-xl text-left border border-red-500/10">
                      <p className="text-[10px] text-red-500/70 uppercase font-black">Their 30 Days:</p>
                      <p className="text-xl font-black text-red-500">${moneyFormatter.format(heroMonthlyEarnings)}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-950/20 p-5 rounded-xl text-left border border-yellow-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                    <p className="text-[10px] text-yellow-500/80 uppercase font-black tracking-widest mb-1">The Reality Check</p>
                    <p className="text-xl font-light text-zinc-300">With your gross <span className="font-bold text-white">annual salary</span>, you can afford {absurdDisplay}.</p>
                  </div>
               </div>

               {/* 🛑 ANTI-SPONSOR BANNER (Copium Deals) */}
               <div className="max-w-2xl w-full bg-gradient-to-r from-red-950 to-black border border-red-900 p-6 rounded-3xl mt-6 flex flex-col md:flex-row items-center justify-between shadow-[0_0_30px_rgba(220,38,38,0.15)] group relative overflow-hidden cursor-pointer" onClick={() => { trackConversion('click_anti_sponsor'); window.open('https://ryanair.com', '_blank'); }}>
                   <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
                   <div className="flex-1 pl-4 text-left z-10">
                       <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded-sm mb-3 inline-block">Reality Check Sponsor</span>
                       <h4 className="text-xl md:text-2xl font-black text-white uppercase leading-tight group-hover:text-red-400 transition-colors">You will never own Bezos' Yacht.</h4>
                       <p className="text-zinc-400 text-sm mt-1">But at least your flight to Rome is €15. Book the peasant-class ticket now.</p>
                   </div>
                   <div className="mt-4 md:mt-0 bg-white text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs z-10 hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">Fly for €15 ✈️</div>
               </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto mt-12 z-10 relative">
            <button onClick={() => { trackConversion('click_million_calculator_banner'); setShowMillionModal(true); }} className="w-full bg-gradient-to-r from-emerald-900 to-green-900 border border-green-500/50 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:scale-[1.02] transition-transform group">
                <div className="text-left mb-4 md:mb-0">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-green-400 transition-colors">When will YOU be a Millionaire?</h3>
                    <p className="text-green-200/70">Stop watching them. Calculate your exact timeline and roadmap to $1,000,000.</p>
                </div>
                <div className="bg-green-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm">Calculate Path 🚀</div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 max-w-6xl mx-auto z-10 relative text-center">
            <button onClick={generateReceipt} className="bg-zinc-900 p-5 rounded-2xl font-black text-sm uppercase border border-white/10 hover:bg-white hover:text-black transition-all">{isGeneratingReceipt ? 'GENERATING...' : 'SHARE MY SHOCK'}</button>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just found out ${selectedHero?.name} makes my ENTIRE annual salary in ${timeToEarnAnnual} seconds. 💀\n\nThat means I can only afford ${absurdDisplay}.\n\nReality check your salary:`)}&url=${encodeURIComponent(`https://${websiteUrl}`)}&hashtags=BillionaireClock,RealityCheck`} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackConversion('click_rage_tweet')}
              className="bg-black text-white p-5 rounded-2xl font-black text-sm uppercase border border-[#1DA1F2]/50 flex items-center justify-center gap-2 hover:bg-[#1DA1F2] hover:text-white transition-all shadow-[0_0_15px_rgba(29,161,242,0.3)]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.95H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              RAGE TWEET
            </a>
          {/* WEAR THE ANGER BUTTON (Modernized) */}
          <button 
            onClick={generateTshirt} 
            className="bg-gradient-to-r from-yellow-700 to-yellow-500 text-black p-5 rounded-2xl font-black text-sm uppercase border border-black group relative overflow-hidden shadow-lg transform hover:scale-[1.03] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-yellow-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              👕 {isGeneratingTshirt ? 'DESIGNING...' : 'WEAR THE ANGER ($29)'}
            </span>
          </button>
            <button onClick={() => { setIsTiktokMode(true); trackConversion('click_viral_studio'); }} className="bg-green-600 p-5 rounded-2xl font-black text-sm uppercase shadow-[0_0_30px_rgba(22,163,74,0.4)] hover:bg-green-500 hover:scale-105 transition-all">🎥 RECORD VIRAL REEL</button>
            <button onClick={() => { trackConversion('start_spend_game'); setShowGameModal(true); setGameBalance(10000); setClickCount(0); setHasRageQuit(false); }} className="bg-purple-600 p-5 rounded-2xl font-black text-sm uppercase shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:bg-purple-500 hover:scale-105 transition-all">🎮 SPEND HIS MONEY</button>
            
            {/* ⚡ NEW: SABOTAGE BUTTON */}
            <button onClick={handleSabotage} className="relative group bg-white text-black p-5 rounded-2xl font-black text-sm uppercase tracking-tighter border-4 border-red-600 hover:bg-red-600 hover:text-white transition-all overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <span className="relative z-10">Stop Elon for 1s ($1)</span>
                <div className="absolute inset-0 bg-red-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>

        {/* 🎯 MILLIONAIRE CALCULATOR MODAL */}
        {showMillionModal && (
          <div className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-4 md:p-6 overflow-y-auto" onClick={() => setShowMillionModal(false)}>
             <div className="bg-zinc-900 border border-green-500/30 p-8 md:p-10 rounded-[3rem] max-w-xl w-full relative my-auto" onClick={e => e.stopPropagation()}>
                <h3 className="text-3xl font-black mb-2 uppercase text-white">Your Path to $1M.</h3>
                <p className="text-zinc-400 mb-8 font-light">The math doesn't lie. Enter your current reality.</p>
                {!yearsToMillion ? (
                    <form onSubmit={handleCalculateMillion} className="space-y-4">
                        <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                            <label className="text-[10px] text-zinc-500 uppercase font-bold">Current Savings ($)</label>
                            <input type="number" onChange={(e) => setMilSavings(Number(e.target.value))} className="w-full bg-transparent text-2xl font-black mt-1 outline-none text-white" placeholder="0" required />
                        </div>
                        <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                            <label className="text-[10px] text-zinc-500 uppercase font-bold">Monthly Contribution ($)</label>
                            <input type="number" onChange={(e) => setMilMonthly(Number(e.target.value))} className="w-full bg-transparent text-2xl font-black mt-1 outline-none text-white" placeholder="200" required />
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 mt-4 cursor-pointer" onClick={() => setCutCoffee(!cutCoffee)}>
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${cutCoffee ? 'bg-green-500 border-green-500' : 'bg-black border-zinc-600'}`}>{cutCoffee && <span className="text-black text-xs font-black">✓</span>}</div>
                            <div className="flex-1"><p className="text-sm font-bold text-white">Cut Starbucks & Netflix</p><p className="text-xs text-zinc-400">Adds $150 to your monthly investment.</p></div>
                        </div>
                        <button type="submit" className="w-full bg-green-500 text-black p-5 rounded-2xl font-black text-lg uppercase tracking-widest mt-6 hover:bg-white transition-colors">Calculate Reality</button>
                    </form>
                ) : (
                    <div className="text-center animate-fade-in">
                        <h2 className="text-6xl font-black text-white font-mono tracking-tighter mb-4">{yearsToMillion === "NEVER" ? "NEVER." : `${yearsToMillion} YRS`}</h2>
                        <div className="flex flex-col gap-3 mt-8">
                            {/* 📜 NEW: REALITY PROOF UPSELL */}
                            <button onClick={() => { setShowCertModal(true); trackConversion('click_cert_upsell'); }} className="w-full bg-yellow-500 text-black p-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white transition-colors">Claim Reality Certificate ($5) 📜</button>
                            <div className="bg-black/50 border border-green-500/20 p-6 rounded-3xl">
                                <h4 className="font-black text-white text-lg mb-2 uppercase">Want to speed this up?</h4>
                                <input type="email" placeholder="YOUR EMAIL" className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl mb-3 outline-none text-center text-white" />
                                <button className="w-full bg-white text-black p-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-colors">Send My Roadmap</button>
                            </div>
                        </div>
                        <button onClick={() => setYearsToMillion(null)} className="mt-6 text-xs text-zinc-600 uppercase font-black hover:text-white">← Recalculate</button>
                    </div>
                )}
                <p className="absolute top-6 right-8 text-zinc-600 font-black cursor-pointer hover:text-white" onClick={() => setShowMillionModal(false)}>✕</p>
             </div>
          </div>
        )}

        {/* 🎮 THE SPEND GAME MODAL */}
        {showGameModal && (
          <div className="fixed inset-0 bg-black/95 z-[400] flex items-center justify-center p-4 md:p-6" onClick={() => setShowGameModal(false)}>
             <div className="bg-zinc-950 border border-purple-500/30 p-8 rounded-[3rem] max-w-2xl w-full text-center relative overflow-hidden" onClick={e => e.stopPropagation()}>
                {!hasRageQuit ? (
                    <>
                        <h3 className="text-2xl font-black text-white uppercase mb-2">Try to bankrupt him.</h3>
                        <p className="text-zinc-500 text-sm mb-6 uppercase tracking-widest font-bold">He makes $3,200 every second.</p>
                        <div className="bg-black border border-white/10 p-6 rounded-3xl mb-8">
                            <p className="text-zinc-500 text-xs font-black uppercase mb-2">Musk's Current Daily Wallet</p>
                            <div className="text-5xl md:text-6xl font-mono font-black text-green-400 tabular-nums">${moneyFormatter.format(gameBalance)}</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {GAME_ITEMS.map((item, idx) => (
                                <button key={idx} onClick={() => handleBuy(item)} className="bg-zinc-900 border border-white/5 p-4 rounded-2xl hover:bg-purple-600 transition-colors flex flex-col items-center justify-center gap-2 active:scale-95">
                                    <span className="text-3xl">{item.icon}</span>
                                    <span className="text-white font-bold text-sm uppercase">{item.name}</span>
                                    <span className="text-zinc-400 font-mono text-xs">-${item.price.toLocaleString()}</span>
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="animate-fade-in py-10">
                        <span className="text-6xl mb-6 block">🤡</span>
                        <h3 className="text-4xl font-black text-white uppercase mb-4 leading-tight">You can't out-click passive income.</h3>
                        <p className="text-zinc-400 text-lg mb-8">Stop playing games and start building leverage.</p>
                        <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-3xl">
                            <input type="email" placeholder="ENTER YOUR EMAIL" className="w-full bg-black border border-white/10 p-4 rounded-xl mb-3 outline-none focus:border-purple-500 text-center text-white font-mono" />
                            <button className="w-full bg-purple-600 text-white p-4 rounded-xl font-black text-sm uppercase hover:bg-white hover:text-black transition-colors">Show me how the 1% do it</button>
                            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I clicked ${clickCount} times trying to bankrupt Elon Musk. He made more money while I was playing. Can you beat my score?`)}&url=${encodeURIComponent(`https://${websiteUrl}`)}`} target="_blank" className="block w-full bg-black text-purple-400 border border-purple-500/50 p-4 rounded-xl font-black text-sm uppercase mt-3 hover:bg-purple-500 hover:text-white transition-colors">Share your defeat</a>
                        </div>
                    </div>
                )}
                <button onClick={() => setShowGameModal(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white font-black text-xl">✕</button>
             </div>
          </div>
        )}

        {/* 📜 NEW: REALITY PROOF MODAL */}
        {showCertModal && (
          <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6" onClick={() => setShowCertModal(false)}>
             <div className="bg-zinc-900 border border-yellow-500/30 p-10 rounded-[3rem] max-w-2xl w-full text-center relative" onClick={e => e.stopPropagation()}>
                <span className="text-yellow-500 font-black text-xs tracking-widest uppercase mb-4 block">Official Enrollment</span>
                <h3 className="text-4xl font-black mb-6 uppercase text-white">Certified Matrix Escaper</h3>
                <p className="text-zinc-400 mb-8 text-lg font-light leading-relaxed">Prove to the world you've seen the truth. Get a high-res digital certificate with your millionaire timeline to share on LinkedIn or Instagram.</p>
                <div className="bg-black/50 p-6 rounded-2xl border border-white/5 mb-8 flex items-center gap-6 text-left">
                    <div className="text-5xl">📜</div>
                    <div>
                        <p className="text-white font-black uppercase text-sm">Digital Asset License</p>
                        <p className="text-zinc-500 text-xs font-mono">Verified path to $1,000,000</p>
                    </div>
                </div>
                <button onClick={() => alert('Redirecting to Stripe: $4.99')} className="w-full bg-yellow-500 p-5 rounded-2xl font-black text-lg uppercase tracking-widest text-black hover:bg-white transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)]">Claim Certificate ($5)</button>
                <p className="mt-6 text-zinc-600 text-[10px] cursor-pointer hover:text-white" onClick={() => setShowCertModal(false)}>I'D RATHER STAY ASLEEP</p>
             </div>
          </div>
        )}

        {/* 🧲 LEAD GEN MODAL */}
        {showJobModal && (
          <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6" onClick={() => setShowJobModal(false)}>
             <div className="bg-zinc-900 border border-red-500/30 p-10 rounded-[3rem] max-w-lg w-full text-center relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-4xl font-black mb-4 uppercase">ESCAPE THE MATRIX.</h3>
                <p className="text-zinc-400 mb-8 text-lg font-light">The 1% automated their wealth while you watched this clock. Get the free blueprint.</p>
                <form onSubmit={(e) => { e.preventDefault(); trackConversion('lead_captured_success'); alert('Sequence Activated!'); setShowJobModal(false); }}>
                  <input type="email" required placeholder="YOUR BEST EMAIL" className="w-full bg-black border border-white/10 p-5 rounded-2xl mb-4 outline-none focus:border-red-500 text-center text-white" />
                  <button type="submit" className="w-full bg-red-600 p-5 rounded-2xl font-black text-lg uppercase tracking-widest text-white">SHOW ME THE WAY</button>
                </form>
             </div>
          </div>
        )}

        {/* 👑 THE VANITY BILLBOARD MODAL */}
        {showVipModal && (
          <div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-6" onClick={() => setShowVipModal(false)}>
             <div className="bg-zinc-900 border border-yellow-500/50 p-10 rounded-[3rem] max-w-lg w-full text-center relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
                <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">The Vanity Billboard</h3>
                <p className="text-zinc-400 mb-8 text-lg font-light leading-relaxed">Promote your business to thousands. Your handle stays live for 24 hours. Pure sueta, 0% grind.</p>
                <div className="bg-black border border-white/10 p-5 rounded-2xl mb-8 flex items-center gap-4 text-left">
                    <span className="text-4xl">👑</span>
                    <div>
                        <p className="text-sm text-zinc-500 font-mono">Current VIP Slot Cost:</p>
                        <p className="text-3xl font-black text-white">$10.00 / DAY</p>
                    </div>
                </div>
                <button onClick={() => alert('Stripe Checkout...')} className="w-full bg-yellow-500 text-black p-5 rounded-xl font-black text-lg uppercase tracking-widest shadow-lg hover:bg-white transition text-black">SECURE SLOT NOW 💳</button>
             </div>
          </div>
        )}

     {/* 📲 RECEIPT PREVIEW */}
        {generatedReceiptUrl && (
          <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-6" onClick={() => setGeneratedReceiptUrl(null)}>
             <div className="bg-zinc-900 p-4 rounded-[2rem] border border-white/10 max-w-sm w-full flex flex-col" onClick={e => e.stopPropagation()}>
                <img src={generatedReceiptUrl} className="rounded-xl shadow-2xl mb-6" alt="Shock Report" />
                <a href={generatedReceiptUrl} download="ShockResult.png" className="w-full bg-yellow-500 text-black p-4 rounded-xl font-black text-center uppercase tracking-widest hover:bg-white transition-all">DOWNLOAD & SHARE</a>
             </div>
          </div>
        )}

     {/* 👕 T-SHIRT SHOP MODAL - IMPROVED UI */}
        {generatedTshirtUrl && (
          <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-6" onClick={() => setGeneratedTshirtUrl(null)}>
             <div className="bg-zinc-950 p-8 rounded-[3rem] border border-white/10 max-w-4xl w-full flex flex-col md:flex-row gap-10" onClick={e => e.stopPropagation()}>
                
                {/* Real T-Shirt Mockup Area */}
                <div className="flex-1 bg-zinc-900 rounded-2xl p-10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#333_0%,_#000_100%)] opacity-30"></div>
                  
                  {/* Fallback до истинска интеграция на мокапи */}
                  <div className="relative w-full h-[400px] flex items-center justify-center">
                      <div className="absolute inset-0 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-zinc-600 text-sm font-light">
                          [ Real Mockup will go here ]
                      </div>
                      {/* Dynamic design overlay */}
                      <img src={generatedTshirtUrl} className="w-2/3 h-auto drop-shadow-2xl relative z-10" alt="Generated T-shirt" />
                  </div>
                  
                </div>
                
                <div className="flex-1 flex flex-col justify-center text-left">
                  <span className="text-red-500 font-black text-xs tracking-widest mb-2 uppercase">Custom Capitalism Apparel</span>
                  <h3 className="text-4xl font-black mb-6 uppercase text-white">OWN YOUR PAIN</h3>
                  <p className="text-zinc-500 mb-8 leading-relaxed">High-quality 100% heavy cotton. Featuring your real-time stats versus {selectedHero?.name || "Them"}. Ships worldwide.</p>
                  <div className="text-4xl font-black mb-8 text-white">$29.99</div>
                  
                  {/* Fake Checkout / Sold Out Decoy */}
                  {!tshirtSoldOut ? (
                    <button onClick={() => setTshirtSoldOut(true)} className="bg-white text-black p-5 rounded-xl font-black text-xl hover:bg-yellow-500 transition-all uppercase tracking-tighter shadow-xl">
                      SECURE CHECKOUT
                    </button>
                  ) : (
                    <div className="bg-red-950/20 border border-red-500/50 p-5 rounded-2xl animate-fade-in">
                      <p className="text-red-500 font-black uppercase text-sm mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        SOLD OUT DUE TO VIRAL DEMAND
                      </p>
                      <p className="text-zinc-400 text-xs mb-4">The Matrix works hard, but our printing press broke. Join the VIP restock list.</p>
                      <div className="flex gap-2">
                        <input type="email" placeholder="ENTER EMAIL..." className="w-full bg-black border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-red-500 text-white" />
                        <button onClick={() => alert('Email saved to waiting list! (Backend connection pending)')} className="bg-red-600 text-white px-5 py-3 rounded-xl font-black text-sm hover:bg-white hover:text-black transition-all">
                          NOTIFY
                        </button>
                      </div>
                    </div>
                  )}
                 </div>
             </div>
          </div>
        )} 
        {/* Invisible Generators */}
        <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
          
          {/* 🧾 New Shock Report 2.0 (Improved Design) */}
          <div ref={receiptRef} className="w-[400px] bg-black p-10 flex flex-col items-center border border-yellow-500/20 text-white selection:bg-yellow-500 selection:text-black">
            <h2 className="text-2xl font-black text-yellow-500 mb-4 uppercase tracking-tighter">SHOCK REPORT</h2>
            <div className="w-full border-t border-dashed border-white/20 pt-6 text-center">
              <p className="text-zinc-400 text-[10px] mb-1 font-bold">Did you know?</p>
              <p className="text-red-500 font-black text-2xl uppercase leading-none mb-1">{selectedHero.name}</p>
              <p className="text-zinc-200 text-sm mb-3">just earned your</p>
              <p className="text-white font-black text-2xl uppercase leading-none mb-4 underline">ENTIRE YEARLY SALARY</p>
              <p className="text-zinc-200 text-sm mb-2">in:</p>
              <p className="text-7xl font-black font-mono text-white mb-2 leading-none tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{timeToEarnAnnual}s</p>
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-2">(While you were reading this)</p>
            </div>
            <div className="mt-10 bg-yellow-500 text-black px-6 py-2 font-black text-xl tracking-tighter uppercase">{websiteUrl}</div>
          </div>
          
         {/* 👕 T-Shirt Template (Invisible for generation) */}
        <div ref={tshirtRef} className="w-[1000px] h-[1000px] p-20 flex flex-col items-center justify-center bg-transparent text-white">
          {/* Dynamic number */}
          <p className="text-[20rem] font-black text-white leading-none tracking-tighter">{timeToEarnAnnual}s</p>
          {/* Slogan */}
          <p className="text-5xl font-black text-white uppercase tracking-widest mt-10 leading-tight">AND ALL I GOT WAS THIS T-SHIRT. #RAGETWEET</p>
          {/* URL */}
          <p className="text-3xl font-black text-zinc-700 mt-10 tracking-[0.5em] uppercase">{websiteUrl}</p>
        </div>
        </div>
      </main>
    </>
  );
}
