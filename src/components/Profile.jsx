import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Star, Zap, Settings, Share2, Award } from 'lucide-react';

export default function Profile({ favorites, library }) {
  // Calculer un "Rizz Level" fictif basé sur l'activité
  const rizzLevel = Math.floor((favorites.length * 5) + (library.length / 10));
  const rank = rizzLevel > 50 ? "Elite Master" : "Rising Legend";

  return (
    <div className="bg-black min-h-screen text-white p-6 pt-16 pb-24 overflow-y-auto no-scrollbar">
      
      {/* --- HEADER PROFILE --- */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-[35px] bg-gradient-to-tr from-blue-600 to-purple-600 p-[3px] shadow-2xl shadow-blue-500/20">
            <div className="w-full h-full rounded-[32px] bg-black flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
                alt="Profile"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 border-4 border-black rounded-full p-1.5 text-white">
            <Shield size={14} fill="white" />
          </div>
        </div>
        
        <h2 className="mt-4 text-xl font-black italic uppercase tracking-tighter">yodabe2901</h2>
        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">{rank}</p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatBox label="Level" value={rizzLevel} />
        <StatBox label="Lines" value={library.length} />
        <StatBox label="Favs" value={favorites.length} />
      </div>

      {/* --- RIZZ PROGRESS BAR --- */}
      <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[32px] mb-8">
        <div className="flex justify-between items-end mb-3">
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Mastery Progress</p>
          <p className="text-xs font-bold italic text-blue-500">78%</p>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: 1 }}
            className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
          />
        </div>
      </div>

      {/* --- ACTION LIST --- */}
      <div className="space-y-3">
        <ProfileAction icon={<Star size={18}/>} label="Achievements" detail="12 Unlocked" />
        <ProfileAction icon={<Share2 size={18}/>} label="Share Profile" detail="Get Rizz Points" />
        <ProfileAction icon={<Settings size={18}/>} label="Settings" detail="Privacy & AI Prefs" />
      </div>

      {/* --- LOGOUT BUTTON --- */}
      <button className="w-full mt-10 p-5 rounded-[24px] bg-zinc-900/30 border border-red-500/20 text-red-500 text-xs font-black uppercase italic tracking-widest active:scale-95 transition-all">
        Terminate Session
      </button>
    </div>
  );
}

// Sous-composants pour garder le code propre
function StatBox({ label, value }) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl text-center">
      <p className="text-lg font-black italic text-white">{value}</p>
      <p className="text-[8px] font-bold uppercase text-zinc-500 tracking-tighter">{label}</p>
    </div>
  );
}

function ProfileAction({ icon, label, detail }) {
  return (
    <div className="flex items-center justify-between p-5 bg-zinc-900/30 border border-white/5 rounded-[24px] active:scale-[0.98] transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="text-blue-500">{icon}</div>
        <span className="text-xs font-bold uppercase italic">{label}</span>
      </div>
      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{detail}</span>
    </div>
  );
}