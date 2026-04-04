"use client";
import { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image'; 

// БАЗА ДАННИ: Индекс на Абсурда
const ABSURD_ITEMS: Record<string, { name: string, price: number }> = {
  "Elon Musk": { name: "the left tire of a Cybertruck", price: 2500 },
  "Jeff Bezos": { name: "the door handle of his superyacht", price: 15000 },
  "Bernard Arnault": { name: "one strap of a limited edition Louis Vuitton bag", price: 8500 },
  "Mark Zuckerberg": { name: "1 square meter of his Hawaii bunker", price: 12000 },
  "Bill Gates": { name: "an acre of the farmland he secretly buys", price: 15000 },
  "Cristiano Ronaldo": { name: "a golden thread from his left boot", price: 3000 },
  "Taylor Swift": { name: "3 seconds of fuel for her private jet", price: 1200 },
  "LeBron James": { name: "one session in his cryochamber", price: 1500 },
  "DEFAULT": { name: "a gold-plated toothpick", price: 800 }
};

export default function BillionaireClock() {
  const [data, setData] = useState<any[]>([]);
  const [selectedHero, setSelectedHero] = useState<any>(null);
  const [salary, setSalary] = useState<number>(3000);
  const [secondsPassed, setSecondsPassed] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  
  // State за "Касовата бележка" (Social Share)
  const [generatedReceiptUrl, setGeneratedReceiptUrl] = useState<string | null>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // State за "Тениската" (E-commerce)
  const [generatedTshirtUrl, setGeneratedTshirtUrl] = useState<string | null>(null);
  const [isGeneratingTshirt, setIsGeneratingTshirt] = useState(false);
  const tshirtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    fetch('/billionaires.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setSelectedHero(json[0]); 
      })
      .catch(err => console.error("Waiting for data build..."));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsPassed(prev => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [selectedHero]);

  if (!isClient) return null; 

  if (!data.length || !selectedHero) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <div className="text-yellow-500 text-2xl font-black uppercase tracking-widest animate-pulse">
          Loading Empire...
        </div>
      </div>
    );
  }

  // Математиката на шока
  const rawEarnings = selectedHero.earningsPerSec * secondsPassed;
  const moneyFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedEarnings = moneyFormatter.format(rawEarnings);
  
  const annualSalary = salary * 12;
  const timeToEarnMonthly = (salary / selectedHero.earningsPerSec).toFixed(2);
  const timeToEarnAnnual = (annualSalary / selectedHero.earningsPerSec).toFixed(1);

  const heroMonthlyEarnings = selectedHero.earningsPerSec * 30 * 24 * 60 * 60;
  const formattedHeroMonthly = moneyFormatter.format(heroMonthlyEarnings);

  const absurdItem = ABSURD_ITEMS[selectedHero.name] || ABSURD_ITEMS["DEFAULT"];
  const absurdRatio = annualSalary / absurdItem.price;
  let absurdDisplay = absurdRatio >= 1 
    ? `exactly ${absurdRatio.toFixed(1)} units of ${absurdItem.name}`
    : `only ${(absurdRatio * 100).toFixed(4)}% of ${absurdItem.name}`;

  // Генератор за Социални мрежи
  const generateReceipt = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingReceipt(true);
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, { quality: 1.0, pixelRatio: 2 });
      setGeneratedReceiptUrl(dataUrl);
    } catch (error) {
      alert('Could not generate the sharing image.');
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  // Генератор за Тениската (Прозрачен PNG за печат)
  const generateTshirtDesign = async () => {
    if (!tshirtRef.current) return;
    setIsGeneratingTshirt(true);
    try {
      // Искаме прозрачен фон за печат
      const dataUrl = await htmlToImage.toPng(tshirtRef.current, { 
        quality: 1.0, 
        pixelRatio: 3, // Много високо качество за печат
        backgroundColor: 'transparent' 
      });
      setGeneratedTshirtUrl(dataUrl);
    } catch (error) {
      alert('Could not generate T-shirt design.');
    } finally {
      setIsGeneratingTshirt(false);
    }
  };

  // Симулация на Checkout към Printful/Stripe
  const handleCheckout = () => {
    // Тук в бъдеще ще извикаме Next.js API route, който ще прати dataUrl към Printful
    alert("In production, this will redirect to Stripe Checkout and auto-fulfill via Printful API!");
  };

  const websiteUrl = "billionaireclock.com";

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white font-sans selection:bg-yellow-500 selection:text-black relative">
      
      <header className="w-full p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl fixed top-0 z-50">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
          Billionaire Clock
        </h1>
        <div className="text-xs md:text-sm font-mono text-zinc-400 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          LIVE
        </div>
      </header>

      <div className="max-w-5xl mx-auto pt-32 pb-20 px-4 flex flex-col items-center">
        
        {/* Контролен Панел */}
        <div className="w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-6 md:p-10 shadow-2xl mb-12 flex flex-col md:flex-row gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex-1 z-10">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Your Monthly Salary</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-500 font-bold text-xl">$</span>
              <input 
                type="number" 
                value={salary} 
                onChange={(e) => setSalary(Number(e.target.value) || 0)}
                className="w-full bg-black/50 border border-white/10 text-2xl font-black py-5 pl-12 pr-5 rounded-2xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex-1 z-10">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Compare with a Titan</label>
            <div className="relative">
              <select 
                onChange={(e) => {
                  setSelectedHero(data.find(h => h.name === e.target.value));
                  setSecondsPassed(0);
                }}
                className="w-full bg-black/50 border border-white/10 text-xl font-bold py-5 px-5 rounded-2xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all appearance-none cursor-pointer text-white"
              >
                {data.map(h => (
                  <option key={h.name} value={h.name} className="bg-zinc-900">
                    {h.name} • {h.type === 'Billionaire' ? 'Billionaire' : 'Celebrity'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Жив Брояч & Паралелен Свят */}
        <div className="text-center w-full relative z-10">
          <div className="inline-block bg-zinc-900/50 border border-white/5 rounded-full px-6 py-2 mb-6 backdrop-blur-sm">
            <p className="text-lg md:text-xl text-zinc-300 font-medium">
              While you've been here (<span className="text-yellow-500 font-mono">{secondsPassed.toFixed(1)}s</span>), <span className="text-white font-black">{selectedHero.name}</span> made:
            </p>
          </div>
          
          <div className="text-6xl md:text-8xl lg:text-[9rem] leading-none font-black font-mono tracking-tighter text-green-400 drop-shadow-[0_0_40px_rgba(74,222,128,0.3)] my-6 tabular-nums">
            ${formattedEarnings}
          </div>

          <div className="inline-block bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-3xl px-8 md:px-12 py-8 mt-8 shadow-2xl max-w-2xl w-full">
            <p className="text-2xl md:text-3xl font-light text-zinc-200 mb-4 leading-tight">
              They just made your <span className="font-black text-red-500 underline decoration-red-500/50">ANNUAL</span> salary in exactly <span className="font-black text-white bg-red-600 px-3 py-1 rounded-lg shadow-lg">{timeToEarnAnnual} seconds</span>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mb-6">
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 text-left">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">In 30 Days You Make:</p>
                <p className="text-2xl font-black text-white">${moneyFormatter.format(salary)}</p>
              </div>
              <div className="bg-red-950/40 border border-red-500/20 rounded-2xl p-5 text-left">
                <p className="text-xs text-red-500/70 uppercase tracking-widest mb-1">In 30 Days They Make:</p>
                <p className="text-2xl font-black text-red-500">${formattedHeroMonthly}</p>
              </div>
            </div>
            
            <div className="bg-black/60 rounded-xl p-6 border border-dashed border-white/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
              <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-2">Absurdity Index</p>
              <p className="text-lg text-zinc-300">
                With your ANNUAL salary you can afford <span className="font-black text-white">{absurdDisplay}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Монетизация & Споделяне */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-3xl mx-auto z-10">
          <button 
            onClick={generateReceipt}
            disabled={isGeneratingReceipt}
            className={`group relative w-full flex items-center justify-center gap-3 py-5 px-6 border-2 border-white/10 text-lg font-black rounded-2xl text-white bg-black hover:bg-white hover:text-black hover:scale-[1.02] transition-all duration-300 shadow-2xl ${isGeneratingReceipt ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl group-hover:animate-bounce">📲</span>
            {isGeneratingReceipt ? 'GENERATING PROOF...' : 'SHARE MY PAIN'}
          </button>
          
          {/* НОВИЯТ БУТОН ЗА Е-COMMERCE */}
          <button 
            onClick={generateTshirtDesign}
            disabled={isGeneratingTshirt}
            className={`group relative w-full flex items-center justify-center gap-3 py-5 px-6 border-2 border-transparent text-lg font-black rounded-2xl text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.4)] ${isGeneratingTshirt ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl group-hover:-translate-y-1 transition-transform">👕</span>
            {isGeneratingTshirt ? 'DESIGNING APPAREL...' : 'WEAR YOUR ANGER ($29)'}
          </button>
        </div>

      </div>

      {/* ----------------------------------------------------------------------------------- */}
      {/* 1. СКРИТА КАСОВА БЕЛЕЖКА ЗА СОЦИАЛНИ МРЕЖИ (Черен фон) */}
      <div style={{ position: 'absolute', top: '-4000px', left: '-4000px' }}>
        <div ref={receiptRef} className="w-[400px] bg-black p-8 font-sans flex flex-col items-center" style={{ backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)' }}>
          <div className="w-full text-center border-b border-dashed border-white/20 pb-4 mb-4">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">REAL-TIME SHOCK B/R</h2>
            <p className="text-xs text-zinc-500 font-mono">{websiteUrl}</p>
          </div>
          <div className="w-full text-center my-4 bg-zinc-900 px-4 py-3 rounded-xl border border-white/5">
            <p className="text-sm text-zinc-400 uppercase tracking-widest">TOTAL ANNUAL GRIND (USD):</p>
            <p className="text-3xl font-black text-white">${moneyFormatter.format(annualSalary)}</p>
          </div>
          <div className="w-full text-center my-4 bg-white/5 px-4 py-4 rounded-xl border border-red-500/20">
            <p className="text-sm text-red-400 uppercase tracking-widest leading-tight">{selectedHero.name} made this in:</p>
            <p className="text-6xl font-black font-mono tracking-tighter text-red-500 tabular-nums">{timeToEarnAnnual}</p>
            <p className="text-3xl font-bold text-red-500/90 leading-tight">SECONDS</p>
          </div>
          <div className="w-full text-center mt-4 border-t border-dashed border-white/20 pt-6">
            <p className="text-lg text-zinc-200 leading-tight font-bold">I GRINDED ALL YEAR. THEY BREATHED.</p>
            <div className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg text-xl font-black tracking-tighter inline-block shadow-xl">{websiteUrl.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------------------- */}
      {/* 2. НОВО: СКРИТ ДИЗАЙН ЗА ТЕНИСКА (Прозрачен фон, само типография) */}
      <div style={{ position: 'absolute', top: '-8000px', left: '-8000px' }}>
        {/* Голям размер за добро качество на печат */}
        <div ref={tshirtRef} className="w-[800px] p-8 font-sans flex flex-col items-center justify-center bg-transparent">
          <div className="text-center w-full">
            <p className="text-5xl font-black text-white tracking-widest uppercase mb-4 opacity-90">
              I WORKED 160 HOURS FOR MY SALARY.
            </p>
            <div className="w-full h-2 bg-red-600 my-6"></div>
            <p className="text-6xl font-black text-red-500 uppercase tracking-tighter mb-4 drop-shadow-xl">
              {selectedHero.name.toUpperCase()} MADE IT IN
            </p>
            <p className="text-[9rem] font-mono font-black text-white leading-none tabular-nums drop-shadow-2xl">
              {timeToEarnAnnual}s
            </p>
            <p className="text-2xl font-bold text-zinc-400 uppercase tracking-[0.5em] mt-8">
              {websiteUrl}
            </p>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------------------- */}
      {/* МОДАЛ ЗА КАСОВАТА БЕЛЕЖКА (Без промяна) */}
      {generatedReceiptUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6" onClick={() => setGeneratedReceiptUrl(null)}>
          <div className="absolute top-6 right-6 text-3xl cursor-pointer text-white/70 hover:text-white">✕</div>
          <div className="bg-zinc-950 border border-white/10 p-4 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-yellow-500 mb-6 uppercase tracking-widest text-center">YOUR PROOF OF PAIN IS READY!</h3>
            <img src={generatedReceiptUrl} alt="Receipt" className="rounded-xl border border-white/10 mb-6 shadow-lg max-h-[60vh] object-contain" />
            <a href={generatedReceiptUrl} download={`${selectedHero.name.replace(' ', '_')}_Shock.png`} className="w-full text-center bg-yellow-500 text-black font-black p-4 rounded-xl hover:bg-yellow-400 transition">DOWNLOAD SHOCK</a>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------------------- */}
      {/* НОВО: МОДАЛ ЗА E-COMMERCE МАГАЗИНА */}
      {generatedTshirtUrl && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex flex-col md:flex-row items-center justify-center p-6 gap-8" onClick={() => setGeneratedTshirtUrl(null)}>
          <div className="absolute top-6 right-6 text-3xl cursor-pointer text-white/70 hover:text-white z-50">✕</div>
          
          {/* Визуална симулация на черна тениска */}
          <div className="relative w-full max-w-md aspect-[3/4] bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Тук нормално би седяла реална снимка на празна тениска, симулираме го с градиент */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-600 via-zinc-900 to-black"></div>
            
            {/* Нашият генериран PNG поставен върху "тениската" */}
            <img src={generatedTshirtUrl} alt="T-shirt Design" className="relative z-10 w-2/3 h-auto drop-shadow-2xl" />
          </div>

          <div className="bg-zinc-950 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">Limited Edition</span>
            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">The "Capitalism" Tee</h3>
            <p className="text-zinc-400 mb-6">Wear your custom reality check. High-quality heavy cotton. Ships worldwide.</p>
            
            <div className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-black text-white">$29.99</span>
              <span className="text-lg text-zinc-500 line-through mb-1">$45.00</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full text-center bg-white text-black font-black p-5 rounded-xl hover:bg-zinc-200 transition text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              SECURE CHECKOUT 💳
            </button>
            <p className="text-xs text-zinc-600 text-center mt-4 uppercase tracking-widest">Powered by Stripe & Printful API</p>
          </div>
        </div>
      )}

    </main>
  );
}
