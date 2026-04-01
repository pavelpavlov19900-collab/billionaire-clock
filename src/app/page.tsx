"use client";
import { useState, useEffect } from 'react';

export default function BillionaireClock() {
  const [data, setData] = useState([]);
  const [selectedHero, setSelectedHero] = useState(null);
  const [salary, setSalary] = useState(2000); // По подразбиране
  const [secondsPassed, setSecondsPassed] = useState(0);

  // Зареждаме данните от нашия автоматизиран JSON
  useEffect(() => {
    fetch('/billionaires.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setSelectedHero(json[0]); // Започваме с първия (напр. Мъск)
      });
  }, []);

  // Стартираме таймера
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsPassed(prev => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [selectedHero]);

  if (!selectedHero) return <div className="text-white bg-black h-screen">Зареждане на империята...</div>;

  const earningsSoFar = (selectedHero.earningsPerSec * secondsPassed).toFixed(2);
  const timeToEarnSalary = (salary / selectedHero.earningsPerSec).toFixed(1);

  return (
    <main className="min-h-screen bg-black text-white font-sans p-6 flex flex-col items-center">
      {/* Спонсорски панел (Идея 3) */}
      <div className="w-full max-w-2xl text-center mb-8 p-2 border border-yellow-600/30 rounded text-xs text-yellow-500">
        ПРЕДОСТАВЕНО ОТ [ТВОЯТ ФИНТЕХ СПОНСОР] • ИНВЕСТИРАЙ КАТО МИЛИАРДЕР
      </div>

      <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-yellow-700 bg-clip-text text-transparent">
        BILLIONAIRE CLOCK
      </h1>

      {/* Настройки на потребителя */}
      <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-800">
        <label className="block text-sm text-zinc-400 mb-2">Твоята месечна заплата (лв):</label>
        <input 
          type="number" 
          value={salary} 
          onChange={(e) => setSalary(Number(e.target.value))}
          className="w-full bg-black border border-zinc-700 p-3 rounded-lg mb-4 focus:border-yellow-500 outline-none"
        />

        <label className="block text-sm text-zinc-400 mb-2">Избери „противник“:</label>
        <select 
          onChange={(e) => {
            setSelectedHero(data.find(h => h.name === e.target.value));
            setSecondsPassed(0);
          }}
          className="w-full bg-black border border-zinc-700 p-3 rounded-lg focus:border-yellow-500 outline-none"
        >
          {data.map(h => <option key={h.name} value={h.name}>{h.name} ({h.type})</option>)}
        </select>
      </div>

      {/* Резултатът (The Hook) */}
      <div className="mt-12 text-center">
        <p className="text-xl text-zinc-400">Откакто отвори страницата, <span className="text-white font-bold">{selectedHero.name}</span> изкара:</p>
        <div className="text-6xl font-mono my-4 text-green-500">${earningsSoFar}</div>
        
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 mt-6">
          <p className="text-lg">Му трябват само <span className="text-yellow-500 font-bold">{timeToEarnSalary} секунди</span>,</p>
          <p className="text-sm text-zinc-500 italic">за да изработи цялата ти месечна заплата.</p>
        </div>
      </div>

      {/* Машини за пари (Идеи 2 & 9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
        <button className="bg-white text-black font-bold p-4 rounded-xl hover:bg-zinc-200 transition">
          👕 Купи тениска с този резултат
        </button>
        <button className="bg-red-600 text-white font-bold p-4 rounded-xl hover:bg-red-700 transition">
          🚀 Кандидатствай за по-добра работа
        </button>
      </div>

      {/* AI Автоматизиран блог линк (Идея 7) */}
      <div className="mt-20 w-full max-w-4xl border-t border-zinc-800 pt-10">
        <h2 className="text-xl mb-4">Интересни истории</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-zinc-900 rounded-lg h-32 opacity-50 italic text-sm">
            Тук AI автоматично ще публикува истории за милиардерите...
          </div>
        </div>
      </div>
    </main>
  );
}
