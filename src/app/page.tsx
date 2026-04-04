"use client";
import { useState, useEffect } from 'react';

export default function BillionaireClock() {
  const [data, setData] = useState<any[]>([]);
  const [selectedHero, setSelectedHero] = useState<any>(null);
  const [salary, setSalary] = useState<number>(2000);
  const [secondsPassed, setSecondsPassed] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  // Зареждане на данните (Client-side hydration)
  useEffect(() => {
    setIsClient(true);
    fetch('/billionaires.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setSelectedHero(json[0]); 
      })
      .catch(err => console.error("Чакаме първия билд на данните..."));
  }, []);

  // Моторът на таймера
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsPassed(prev => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [selectedHero]);

  // Предпазваме от грешки при зареждане
  if (!isClient) return null; 

  // Екран за първоначално зареждане
  if (!data.length || !selectedHero) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <div className="text-yellow-500 text-2xl font-black uppercase tracking-widest animate-pulse">
          Зареждане на данните...
        </div>
      </div>
    );
  }

  // Математиката
  const earningsSoFar = (selectedHero.earningsPerSec * secondsPassed).toFixed(2);
  const timeToEarnSalary = (salary / selectedHero.earningsPerSec).toFixed(2);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* Навигация / Header */}
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
        
        {/* Контролен Панел (Glassmorphism) */}
        <div className="w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-6 md:p-10 shadow-2xl mb-12 flex flex-col md:flex-row gap-8 relative overflow-hidden">
          {/* Декоративен светещ ефект */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-500/5 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="flex-1 z-10">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Твоята месечна заплата</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-500 font-bold text-xl">BGN</span>
              <input 
                type="number" 
                value={salary} 
                onChange={(e) => setSalary(Number(e.target.value) || 0)}
                className="w-full bg-black/50 border border-white/10 text-2xl font-black py-5 pl-20 pr-5 rounded-2xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex-1 z-10">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Сравни се с титан</label>
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
                    {h.name} • {h.type === 'Billionaire' ? 'Милиардер' : 'Звезда'}
                  </option>
                ))}
              </select>
              {/* Custom стрелка за падащото меню */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-yellow-500">
                <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Куката (The Hook): Динамичният дисплей */}
        <div className="text-center w-full relative z-10">
          <div className="inline-block bg-zinc-900/50 border border-white/5 rounded-full px-6 py-2 mb-6 backdrop-blur-sm">
            <p className="text-lg md:text-xl text-zinc-300 font-medium">
              Докато си тук, <span className="text-white font-black">{selectedHero.name}</span> изкара:
            </p>
          </div>
          
          {/* Броячът на парите - ОГРОМЕН и светещ */}
          <div className="text-6xl md:text-8xl lg:text-[10rem] leading-none font-black font-mono tracking-tighter text-green-400 drop-shadow-[0_0_40px_rgba(74,222,128,0.3)] my-6 tabular-nums">
            ${earningsSoFar}
          </div>

          {/* Психологическият удар */}
          <div className="inline-block bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl px-8 md:px-12 py-8 mt-8 shadow-2xl">
            <p className="text-2xl md:text-4xl font-light text-zinc-200 mb-2">
              Му трябват точно <span className="font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">{timeToEarnSalary} секунди</span>
            </p>
            <p className="text-sm md:text-base text-zinc-400 font-mono uppercase tracking-widest">
              за да изработи твоята месечна заплата
            </p>
          </div>
        </div>

        {/* Бутони за Монетизация */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 max-w-3xl mx-auto z-10">
          <button className="group relative w-full flex items-center justify-center gap-3 py-5 px-6 border-2 border-white/10 text-lg font-black rounded-2xl text-white bg-black hover:bg-white hover:text-black hover:scale-[1.02] transition-all duration-300 shadow-2xl">
            <span className="text-2xl group-hover:animate-bounce">👕</span>
            ПОРЪЧАЙ НА ТЕНИСКА
          </button>
          <button className="group relative w-full flex items-center justify-center gap-3 py-5 px-6 border-2 border-transparent text-lg font-black rounded-2xl text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
            <span className="text-2xl group-hover:-translate-y-1 transition-transform">🚀</span>
            ИСКАМ ПО-ВИСОКА ЗАПЛАТА
          </button>
        </div>

      </div>
    </main>
  );
}
