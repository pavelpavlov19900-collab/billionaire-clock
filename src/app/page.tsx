"use client";
import { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image'; 

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
  const [opponent, setOpponent] = useState<any>(null);
  const [isBattleMode, setIsBattleMode] = useState(false);
  
  // ОСНОВНИ ДАННИ + НОВИ ПОЛЕТА ЗА DATA BROKERAGE
  const [salary, setSalary] = useState<number>(3000);
  const [age, setAge] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  
  const [secondsPassed, setSecondsPassed] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  
  const [showJobModal, setShowJobModal] = useState(false);
  const [generatedReceiptUrl, setGeneratedReceiptUrl] = useState<string | null>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const [generatedTshirtUrl, setGeneratedTshirtUrl] = useState<string | null>(null);
  const [isGeneratingTshirt, setIsGeneratingTshirt] = useState(false);
  const [userRank, setUserRank] = useState({ name: "MATRIX CITIZEN", color: "text-zinc-500", level: 1 });

  const receiptRef = useRef<HTMLDivElement>(null);
  const tshirtRef = useRef<HTMLDivElement>(null);

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
      setSecondsPassed(prev => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [selectedHero, opponent]);

  // ГЕЙМИФИКАЦИЯ (Рангове)
  useEffect(() => {
    if (secondsPassed < 15) setUserRank({ name: "MATRIX CITIZEN", color: "text-zinc-500", level: 1 });
    else if (secondsPassed < 45) setUserRank({ name: "EXISTENTIAL CRISIS", color: "text-yellow-500", level: 2 });
    else if (secondsPassed < 90) setUserRank({ name: "SYSTEM GLITCH", color: "text-orange-500", level: 3 });
    else if (secondsPassed < 180) setUserRank({ name: "REBEL OBSERVER", color: "text-red-500", level: 4 });
    else setUserRank({ name: "0.0001% ENLIGHTENED", color: "text-purple-500 animate-pulse", level: 5 });
  }, [secondsPassed]);

  // 📈 НОВО: DATA BROKERAGE SILENT SYNC
  useEffect(() => {
    // Когато потребителят навърти 10 секунди (достатъчно време за ангажираност),
    // ние тихо "изпращаме" неговия анонимен профил към нашата база.
    if (Math.floor(secondsPassed) === 10) {
      const dataPayload = {
        timestamp: new Date().toISOString(),
        salary_usd: salary,
        age_group: age || "Undisclosed",
        region: country || "Undisclosed",
        interest_target: selectedHero?.name,
        session_duration_sec: secondsPassed
      };
      // В реална среда тук се прави fetch('/api/analytics', { method: 'POST', body: ... })
      console.log("🔒 [DATA VAULT SYNC] Anonymous financial profile stored:", dataPayload);
    }
  }, [secondsPassed, salary, age, country, selectedHero]);

  if (!isClient || !data.length || !selectedHero) return null; 

  const moneyFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const heroEarnings = selectedHero.earningsPerSec * secondsPassed;
  const annualSalary = salary * 12;
  const timeToEarnAnnual = (annualSalary / selectedHero.earningsPerSec).toFixed(1);
  const heroMonthlyEarnings = selectedHero.earningsPerSec * 30 * 24 * 60 * 60;
  const opponentEarnings = opponent ? opponent.earningsPerSec * secondsPassed : 0;

  const absurdItem = ABSURD_ITEMS[selectedHero.name] || ABSURD_ITEMS["DEFAULT"];
  const absurdRatio = annualSalary / absurdItem.price;
  let absurdDisplay = absurdRatio >= 1 
    ? `exactly ${absurdRatio.toFixed(1)} units of ${absurdItem.name}`
    : `only ${(absurdRatio * 100).toFixed(4)}% of ${absurdItem.name}`;

  const generateReceipt = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingReceipt(true);
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, { quality: 1.0, pixelRatio: 2 });
      setGeneratedReceiptUrl(dataUrl);
    } catch (e) { alert('Receipt failed.'); }
    finally { setIsGeneratingReceipt(false); }
  };

  const generateTshirt = async () => {
    if (!tshirtRef.current) return;
    setIsGeneratingTshirt(true);
    try {
      const dataUrl = await htmlToImage.toPng(tshirtRef.current, { quality: 1.0, pixelRatio: 3, backgroundColor: 'transparent' });
      setGeneratedTshirtUrl(dataUrl);
    } catch (e) { alert('T-shirt failed.'); }
    finally { setIsGeneratingTshirt(false); }
  };

  const websiteUrl = "billionaireclock.com";

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black relative overflow-x-hidden">
      
      <div className="fixed top-[72px] md:top-[88px] left-0 w-full h-1 bg-zinc-900 z-[60]">
        <div className={`h-full transition-all duration-300 ${userRank.color.split(' ')[0].replace('text', 'bg')}`} style={{ width: `${(secondsPassed % 60) * 1.66}%` }}></div>
      </div>

      <header className="w-full p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl fixed top-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase text-yellow-500">BILLIONAIRE CLOCK</h1>
          <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${userRank.color}`}>RANK: {userRank.name}</span>
        </div>
        <button onClick={() => { setIsBattleMode(!isBattleMode); setSecondsPassed(0); }} className="px-4 py-2 rounded-full border border-white/10 font-bold text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">
          {isBattleMode ? '← SINGLE' : '⚔️ BATTLE'}
        </button>
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
          <div className="flex flex-col items-center text-center">
             <div className={`mb-4 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest ${userRank.color}`}>
                LEVEL {userRank.level} • {userRank.name}
             </div>
             
             <div className="mb-10">
               <p className="text-lg text-zinc-400 mb-4">While you've been here, <span className="text-white font-bold">{selectedHero.name}</span> made:</p>
               <h2 className={`text-6xl md:text-9xl font-black text-green-400 font-mono tracking-tighter tabular-nums transition-all ${secondsPassed > 60 ? 'scale-110 drop-shadow-[0_0_30px_rgba(74,222,128,0.4)]' : ''}`}>
                 ${moneyFormatter.format(heroEarnings)}
               </h2>
             </div>

             <div className="max-w-2xl w-full bg-gradient-to-b from-zinc-900/50 to-black border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
                
                {/* 📊 НОВО: БЛОК С ДАННИ И ДЕМОГРАФИЯ (Data Brokerage Inputs) */}
                <div className="bg-black/60 border border-white/5 rounded-2xl p-6 mb-8 flex flex-col gap-4">
                  <div className="flex flex-col text-left relative">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Your Monthly Salary (USD)</label>
                    <span className="absolute left-4 top-[38px] text-yellow-500 font-black">$</span>
                    <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value) || 0)} className="w-full bg-black border border-white/10 text-xl font-black py-3 pl-10 pr-4 rounded-xl focus:border-yellow-500 outline-none" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col w-1/2 text-left">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Age <span className="text-zinc-600 font-light">(Opt)</span></label>
                      <input type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-black border border-white/10 text-sm font-medium py-3 px-4 rounded-xl focus:border-white/30 outline-none" />
                    </div>
                    <div className="flex flex-col w-1/2 text-left">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Region <span className="text-zinc-600 font-light">(Opt)</span></label>
                      <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-black border border-white/10 text-sm font-medium py-3 px-4 rounded-xl focus:border-white/30 outline-none appearance-none cursor-pointer">
                        <option value="">Select...</option>
                        <option value="US">North America</option>
                        <option value="EU">Europe</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="ASIA">Asia</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <p className="text-xl md:text-2xl font-light mb-6 border-t border-white/5 pt-8">
                   They just made your <span className="text-red-500 font-black underline">ANNUAL</span> salary in <span className="text-white font-black">{timeToEarnAnnual} seconds</span>.
                </p>
                
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

                <div className="bg-yellow-500/5 border border-dashed border-yellow-500/20 p-6 rounded-2xl">
                  <p className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-2 italic">Absurdity Index:</p>
                  <p className="text-zinc-300">With your ANNUAL salary, you can afford <span className="text-white font-bold">{absurdDisplay}</span>.</p>
                </div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-5xl mx-auto">
          <button onClick={generateReceipt} className="bg-zinc-900 p-5 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-white hover:text-black transition-all">
            {isGeneratingReceipt ? 'GENERATING...' : 'SHARE MY SHOCK'}
          </button>
          <button onClick={generateTshirt} className="bg-zinc-900 p-5 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-yellow-500 hover:text-black transition-all">
            {isGeneratingTshirt ? 'DESIGNING...' : 'WEAR THE ANGER ($29)'}
          </button>
          <button onClick={() => setShowJobModal(true)} className="bg-red-600 p-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:bg-red-500 hover:scale-105 transition-all">
            I NEED A BETTER JOB
          </button>
        </div>

      </div>

      {showJobModal && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6">
           <div className="bg-zinc-900 border border-red-500/30 p-10 rounded-[3rem] max-w-lg w-full text-center relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Level {userRank.level} Reach</div>
              <h3 className="text-4xl font-black mb-4">ESCAPE THE MATRIX.</h3>
              <p className="text-zinc-400 mb-8 text-lg font-light">The 1% automated their wealth while you watched this clock. Get the free blueprint to scale your life.</p>
              <input type="email" placeholder="YOUR EMAIL" className="w-full bg-black border border-white/10 p-5 rounded-2xl mb-4 outline-none focus:border-red-500 font-mono text-center" />
              <button className="w-full bg-red-600 p-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg">SHOW ME THE WAY</button>
              <p className="mt-6 text-zinc-600 text-xs cursor-pointer hover:text-white" onClick={() => setShowJobModal(false)}>CLOSE</p>
           </div>
        </div>
      )}

      {generatedReceiptUrl && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6" onClick={() => setGeneratedReceiptUrl(null)}>
           <div className="bg-zinc-900 p-4 rounded-[2rem] border border-white/10 max-w-sm w-full flex flex-col" onClick={e => e.stopPropagation()}>
              <h4 className="text-center font-black text-yellow-500 mb-4 uppercase tracking-widest">RANK ATTAINED: {userRank.name}</h4>
              <img src={generatedReceiptUrl} className="rounded-xl shadow-2xl mb-6" />
              <a href={generatedReceiptUrl} download="ShockResult.png" className="w-full bg-yellow-500 text-black p-4 rounded-xl font-black text-center uppercase tracking-widest">DOWNLOAD & SHARE</a>
           </div>
        </div>
      )}

      {generatedTshirtUrl && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6" onClick={() => setGeneratedTshirtUrl(null)}>
           <div className="bg-zinc-950 p-8 rounded-[3rem] border border-white/10 max-w-4xl w-full flex flex-col md:flex-row gap-10" onClick={e => e.stopPropagation()}>
              <div className="flex-1 bg-zinc-900 rounded-2xl p-10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#333_0%,_#000_100%)] opacity-30"></div>
                <img src={generatedTshirtUrl} className="w-2/3 h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-red-500 font-black text-xs tracking-widest mb-2 uppercase">Custom Reality Check Tee</span>
                <h3 className="text-4xl font-black mb-6 uppercase">OWN YOUR PAIN</h3>
                <p className="text-zinc-500 mb-8 leading-relaxed">High-quality 100% heavy cotton. Featuring your real-time stats versus {selectedHero.name}.</p>
                <div className="text-4xl font-black mb-8">$29.99 <span className="text-sm text-zinc-600 line-through font-normal">$45.00</span></div>
                <button className="bg-white text-black p-5 rounded-xl font-black text-xl hover:bg-yellow-500 transition-all uppercase tracking-tighter">SECURE CHECKOUT</button>
              </div>
           </div>
        </div>
      )}

      <div style={{ position: 'absolute', top: '-5000px' }}>
        <div ref={receiptRef} className="w-[400px] bg-black p-10 flex flex-col items-center">
          <h2 className="text-2xl font-black text-yellow-500 mb-4 uppercase">SHOCK REPORT</h2>
          <div className="w-full bg-zinc-900 p-4 rounded-xl text-center mb-6">
            <p className="text-[10px] text-zinc-500 font-black">YOUR ANNUAL SALARY</p>
            <p className="text-2xl font-black text-white">${moneyFormatter.format(annualSalary)}</p>
          </div>
          <div className="w-full border-t border-dashed border-white/20 pt-6 text-center">
            <p className="text-red-500 font-black text-xs uppercase mb-2">{selectedHero.name} MADE IT IN:</p>
            <p className="text-7xl font-black font-mono text-white mb-2">{timeToEarnAnnual}s</p>
            <p className="text-zinc-500 text-[10px] uppercase font-black">RANK: {userRank.name}</p>
          </div>
          <div className="mt-10 bg-yellow-500 text-black px-6 py-2 font-black text-xl">{websiteUrl.toUpperCase()}</div>
        </div>

        <div ref={tshirtRef} className="w-[1000px] p-20 flex flex-col items-center bg-transparent">
          <p className="text-5xl font-black text-white mb-6 uppercase tracking-widest">I WORKED A WHOLE YEAR FOR THIS.</p>
          <div className="w-full h-4 bg-red-600 mb-6"></div>
          <p className="text-6xl font-black text-red-500 uppercase mb-4">{selectedHero.name.toUpperCase()} MADE MY SALARY IN</p>
          <p className="text-[15rem] font-black text-white leading-none">{timeToEarnAnnual}s</p>
          <p className="text-4xl font-black text-white uppercase tracking-widest mt-6">AND ALL I GOT WAS THIS T-SHIRT. #GRIND</p>
          <p className="text-3xl font-black text-zinc-500 mt-10 tracking-[0.5em] uppercase">{websiteUrl}</p>
        </div>
      </div>

    </main>
  );
}
