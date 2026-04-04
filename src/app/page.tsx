"use client";
import { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image'; 

// БАЗА ДАННИ: Индекс на Абсурда (На Английски)
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
  const [generatedReceiptUrl, setGeneratedReceiptUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const receiptRef = useRef<HTMLDivElement>(null);

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

  // ПАРАЛЕЛНИЯТ СВЯТ (Добавката от бележката ти)
  const heroMonthlyEarnings = selectedHero.earningsPerSec * 30 * 24 * 60 * 60;
  const formattedHeroMonthly = moneyFormatter.format(heroMonthlyEarnings);

  // Математиката на АБСУРДА
  const absurdItem = ABSURD_ITEMS[selectedHero.name] || ABSURD_ITEMS["DEFAULT"];
  const absurdRatio = annualSalary / absurdItem.price;
  let absurdDisplay = "";
  
  if (absurdRatio >= 1) {
    absurdDisplay = `exactly ${absurdRatio.toFixed(1)} units of ${absurdItem.name}`;
  } else {
    absurdDisplay = `only ${(absurdRatio * 100).toFixed(4)}% of ${absurdItem.name}`;
  }

  const generateReceipt = async () => {
    if (!receiptRef.current) return;
    setIsGenerating(true);
    setGeneratedReceiptUrl(null);
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });
      setGeneratedReceiptUrl(dataUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Could not generate the sharing image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-yellow-500">
                <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

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
            
            {/* НОВИЯТ БЛОК: ПАРАЛЕЛНИЯТ СВЯТ (Режим Заплата) */}
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

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-3xl mx-auto z-10">
          <button 
            onClick={generateReceipt}
            disabled={isGenerating}
            className={`group relative w-full flex items-center justify-center gap-3 py-5 px-6 border-2 border-white/10 text-lg font-black rounded-2xl text-white bg-black hover:bg-white hover:text-black hover:scale-[1.02] transition-all duration-300 shadow-2xl ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl group-hover:animate-bounce">📲</span>
            {isGenerating ? 'GENERATING PROOF...' : 'SHARE MY PAIN'}
          </button>
          <button className="group relative w-full flex items-center justify-center gap-3 py-5 px-6 border-2 border-transparent text-lg font-black rounded-2xl text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
            <span className="text-2xl group-hover:-translate-y-1 transition-transform">🚀</span>
            I NEED A BETTER JOB
          </button>
        </div>

      </div>

      {/* СКРИТАТА КАСОВА БЕЛЕЖКА (Без промяна, готова за експорт) */}
      <div style={{ position: 'absolute', top: '-2000px', left: '-2000px' }}>
        <div 
          ref={receiptRef}
          className="w-[400px] bg-black p-8 font-sans flex flex-col items-center"
          style={{ backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)' }}
        >
          <div className="w-full text-center border-b border-dashed border-white/20 pb-4 mb-4">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">REAL-TIME SHOCK B/R</h2>
            <p className="text-xs text-zinc-500 font-mono">{websiteUrl}</p>
          </div>

          <div className="w-full text-center my-4 bg-zinc-900 px-4 py-3 rounded-xl border border-white/5">
            <p className="text-sm text-zinc-400 uppercase tracking-widest">TOTAL ANNUAL GRIND (USD):</p>
            <p className="text-3xl font-black text-white">${moneyFormatter.format(annualSalary)}</p>
          </div>

          <div className="my-2 text-white/30 text-2xl">↓</div>

          <div className="w-full text-center my-4 bg-white/5 px-4 py-4 rounded-xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <p className="text-sm text-red-400 uppercase tracking-widest leading-tight">
              {selectedHero.name} made this in:
            </p>
            <p className="text-6xl font-black font-mono tracking-tighter text-red-500 tabular-nums">
              {timeToEarnAnnual}
            </p>
            <p className="text-3xl font-bold text-red-500/90 leading-tight">
              SECONDS
            </p>
          </div>

          <div className="w-full text-center mt-4 border-t border-dashed border-white/20 pt-6">
            <p className="text-lg text-zinc-200 leading-tight font-bold">
              I GRINDED ALL YEAR. THEY BREATHED.
            </p>
            <p className="text-sm text-zinc-400 italic mt-2 mb-6">SEE YOUR TIME AT:</p>
            
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg text-xl font-black tracking-tighter inline-block shadow-xl">
              {websiteUrl.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* МОДАЛ ЗА ПРЕГЛЕД (Без промяна) */}
      {generatedReceiptUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6" onClick={() => setGeneratedReceiptUrl(null)}>
          <div className="absolute top-6 right-6 text-3xl cursor-pointer text-white/70 hover:text-white">✕</div>
          
          <div className="bg-zinc-950 border border-white/10 p-4 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-yellow-500 mb-6 uppercase tracking-widest text-center">YOUR PROOF OF PAIN IS READY!</h3>
            <img src={generatedReceiptUrl} alt="Receipt" className="rounded-xl border border-white/10 mb-6 shadow-lg max-h-[60vh] object-contain" />
            <p className="text-sm text-zinc-400 mb-4 text-center font-mono">Download & Share to TikTok/X/IG</p>
            <a 
              href={generatedReceiptUrl} 
              download={`${selectedHero.name.replace(' ', '_')}_Shock.png`}
              className="w-full text-center bg-yellow-500 text-black font-black p-4 rounded-xl hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(234,179,8,0.5)]"
            >
              DOWNLOAD SHOCK
            </a>
          </div>
        </div>
      )}

    </main>
  );
}
