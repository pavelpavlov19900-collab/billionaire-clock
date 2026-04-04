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
  const [salary, setSalary] = useState<number>(3000);
  const [secondsPassed, setSecondsPassed] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  
  // States for Social Receipt
  const [generatedReceiptUrl, setGeneratedReceiptUrl] = useState<string | null>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // States for T-shirt Store
  const [generatedTshirtUrl, setGeneratedTshirtUrl] = useState<string | null>(null);
  const [isGeneratingTshirt, setIsGeneratingTshirt] = useState(false);
  const tshirtRef = useRef<HTMLDivElement>(null);

  // НОВО: States for Lead Generation Funnel
  const [showJobModal, setShowJobModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

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

  const rawEarnings = selectedHero.earningsPerSec * secondsPassed;
  const moneyFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedEarnings = moneyFormatter.format(rawEarnings);
  
  const annualSalary = salary * 12;
  const timeToEarnAnnual = (annualSalary / selectedHero.earningsPerSec).toFixed(1);
  const heroMonthlyEarnings = selectedHero.earningsPerSec * 30 * 24 * 60 * 60;
  const formattedHeroMonthly = moneyFormatter.format(heroMonthlyEarnings);

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
    } catch (error) {
      alert('Could not generate the sharing image.');
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  const generateTshirtDesign = async () => {
    if (!tshirtRef.current) return;
    setIsGeneratingTshirt(true);
    try {
      const dataUrl = await htmlToImage.toPng(tshirtRef.current, { quality: 1.0, pixelRatio: 3, backgroundColor: 'transparent' });
      setGeneratedTshirtUrl(dataUrl);
    } catch (error) {
      alert('Could not generate T-shirt design.');
    } finally {
      setIsGeneratingTshirt(false);
    }
  };

  const handleCheckout = () => {
    alert("In production, this will redirect to Stripe Checkout and auto-fulfill via Printful API!");
  };

  // НОВО: Функция за събиране на имейли
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    
    setIsSubmittingEmail(true);
    // Тук ще сложим API call към Mailchimp/Klaviyo
    setTimeout(() => {
      setIsSubmittingEmail(false);
      setEmailSuccess(true);
      setEmailInput("");
      // След 3 секунди затваряме модала автоматично
      setTimeout(() => {
        setShowJobModal(false);
        setEmailSuccess(false);
      }, 3000);
    }, 1500);
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

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-5xl mx-auto z-10">
          <button 
            onClick={generateReceipt}
            disabled={isGeneratingReceipt}
            className={`group relative w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-white/10 text-sm md:text-base font-black rounded-2xl text-white bg-black hover:bg-white hover:text-black transition-all duration-300 shadow-2xl ${isGeneratingReceipt ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-xl group-hover:animate-bounce">📲</span>
            {isGeneratingReceipt ? 'GENERATING...' : 'SHARE MY PAIN'}
          </button>
          
          <button 
            onClick={generateTshirtDesign}
            disabled={isGeneratingTshirt}
            className={`group relative w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-transparent text-sm md:text-base font-black rounded-2xl text-white bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-2xl ${isGeneratingTshirt ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-xl group-hover:-translate-y-1 transition-transform">👕</span>
            {isGeneratingTshirt ? 'DESIGNING...' : 'BUY THE T-SHIRT ($29)'}
          </button>

          {/* НОВО: Бутонът за отваряне на Lead Funnel */}
          <button 
            onClick={() => setShowJobModal(true)}
            className="group relative w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-transparent text-sm md:text-base font-black rounded-2xl text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
          >
            <span className="text-xl group-hover:rotate-12 transition-transform">🚀</span>
            I NEED A BETTER JOB
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------------------- */}
      {/* НОВО: МОДАЛ ЗА СЪБИРАНЕ НА ИМЕЙЛИ (Lead Generation) */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center p-6" onClick={() => setShowJobModal(false)}>
          <div className="absolute top-6 right-6 text-3xl cursor-pointer text-white/70 hover:text-white z-50">✕</div>
          
          <div className="bg-gradient-to-b from-zinc-900 to-black border border-red-500/30 p-8 md:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(220,38,38,0.15)] max-w-lg w-full flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-yellow-500"></div>
            
            {!emailSuccess ? (
              <>
                <span className="bg-red-500/20 text-red-500 text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full w-fit mb-6 border border-red-500/50">
                  Escape The Matrix
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  The 1% Don't Trade <span className="text-red-500">Time</span> For <span className="text-green-500">Money</span>.
                </h3>
                <p className="text-zinc-400 mb-8 text-lg font-light leading-relaxed">
                  While you were looking at this screen, new wealth was created automatically. Want to know exactly how they build scalable, automated systems? Enter your email to get our free blueprint.
                </p>
                
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 w-full">
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your best email..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-black border border-white/20 text-xl font-medium py-4 px-6 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-zinc-600"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmittingEmail}
                    className={`w-full text-center bg-red-600 text-white font-black p-5 rounded-xl hover:bg-red-500 transition-all text-xl uppercase tracking-wider ${isSubmittingEmail ? 'opacity-70 cursor-wait' : 'shadow-[0_0_20px_rgba(220,38,38,0.4)]'}`}
                  >
                    {isSubmittingEmail ? 'SECURELY SENDING...' : 'SHOW ME HOW TO ESCAPE'}
                  </button>
                </form>
                <p className="text-xs text-zinc-600 text-center mt-6 font-mono uppercase">100% Free. Unsubscribe anytime.</p>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-10">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <span className="text-5xl">🎯</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-4">Welcome to the 1%.</h3>
                <p className="text-zinc-400 text-lg">Check your inbox. Your blueprint for automated wealth is waiting.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ОСТАНАЛИТЕ СКРИТИ ЕЛЕМЕНТИ (Receipt/Tshirt Generation) ОСТАВАТ ТУК */}
      {/* За краткост на кода в чата ги запазваме същите като в предната стъпка */}
      <div style={{ position: 'absolute', top: '-4000px', left: '-4000px' }}><div ref={receiptRef}>...</div></div>
      <div style={{ position: 'absolute', top: '-8000px', left: '-8000px' }}><div ref={tshirtRef}>...</div></div>
      
    </main>
  );
}
