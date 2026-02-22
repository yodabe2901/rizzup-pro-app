import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, ShieldCheck } from 'lucide-react';

export default function MasteryBar({ xp = 0 }) {
  const levels = [
    { min: 0, title: "Débutant", icon: <Zap size={14}/>, color: "from-zinc-500 to-zinc-700" },
    { min: 2000, title: "Charmeur", icon: <ShieldCheck size={14}/>, color: "from-blue-500 to-indigo-600" },
    { min: 10000, title: "Rizz Master", icon: <Crown size={14}/>, color: "from-yellow-400 to-orange-600" }
  ];

  const currentLevel = [...levels].reverse().find(l => xp >= l.min) || levels[0];
  const nextLevel = levels.find(l => xp < l.min) || { min: xp + 1000, title: "Max" };
  const progress = Math.min((xp / nextLevel.min) * 100, 100);

  return (
    <div className="bg-zinc-900/60 p-6 rounded-[35px] border border-white/10 backdrop-blur-md shadow-2xl">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl text-blue-400 border border-white/5">
            {currentLevel.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Mastery Status</span>
            <span className="text-xl font-black italic uppercase text-white tracking-tighter">{currentLevel.title}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block">Neural XP</span>
          <span className="text-lg font-black text-white">{xp.toLocaleString()}</span>
        </div>
      </div>

      <div className="h-4 w-full bg-black/50 rounded-full p-1 border border-white/5 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${currentLevel.color} shadow-[0_0_20px_rgba(37,99,235,0.3)]`}
        />
      </div>
    </div>
  );
}