import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, Star, Zap, Settings, 
  Share2, Award, Heart, ChevronRight, Trophy 
} from 'lucide-react';

export default function Profile({ favorites, library, setTab }) {
  // --- LOGIQUE DE LEVELING (Ton code original) ---
  const rizzLevel = Math.floor((favorites?.length * 5) + (library?.length / 10));
  const rank = rizzLevel > 50 ? "Elite Master" : "Rising Legend";

  return (
    <div className="bg-black min-h-screen text-white p-6 pt-16 pb-32 overflow-y-auto no-scrollbar">
      
      {/* --- HEADER PROFILE (Design Original) --- */}
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
          <div className="absolute -bottom-2 -right-2 bg-blue-600 border-4 border-black rounded-full p-1.5 text-white shadow-lg">
            <Shield size={14} fill="white" />
          </div>
        </div>
        
        <h2 className="mt-4 text-xl font-black italic uppercase tracking-tighter italic">yodabe2901</h2>
        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">{rank}</p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatBox label="Level" value={rizzLevel} />
        <StatBox label="Lines" value={library?.length || 0} />
        <StatBox label="Favs" value={favorites?.length || 0} />
      </div>

      {/* --- RIZZ PROGRESS BAR (Full Detail) --- */}
      <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[32px] mb-8">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest text-left">Mastery Progress</p>
            <p className="text-[9px] text-zinc-600 uppercase font-bold text-left">Next Rank: Rizz God</p>
          </div>
          <p className="text-xs font-bold italic text-blue-500">78%</p>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: "78%" }} 
            transition={{ duration: 2, ease: "circOut" }}
            className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"
          />
        </div>
      </div>

      {/* --- NOUVEAU : BOUTON FAVORIS (Style Premium) --- */}
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3 ml-2 text-left">Collections</p>
        <button 
          onClick={() => setTab('favorites')}
          className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-blue-600/20 to-transparent border border-blue-500/20 rounded-[28px] active:scale-[0.97] transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="text-white bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <Heart size={20} fill="white" />
            </div>
            <div className="text-left">
               <span className="text-sm font-black uppercase italic text-white block tracking-tight">Saved Punchlines</span>
               <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter italic">Accéder à tes favoris</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-blue-500/50 mr-2" />
        </button>
      </div>

      {/* --- ACTION LIST (Ton design original) --- */}
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-2 text-left">Account Management</p>
        
        <ProfileAction icon={<Award size={18}/>} label="Achievements" detail="12 Unlocked" />
        <ProfileAction icon={<Share2 size={18}/>} label="Share Profile" detail="Get Rizz Points" />
        <ProfileAction icon={<Settings size={18}/>} label="Settings" detail="Privacy & AI Prefs" />
      </div>

      {/* --- LOGOUT --- */}
      <button className="w-full mt-10 p-5 rounded-[24px] bg-zinc-900/30 border border-red-500/20 text-red-500 text-[10px] font-black uppercase italic tracking-[0.2em] active:scale-95 transition-all">
        Terminate Session
      </button>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-[24px] text-center shadow-inner">
      <p className="text-xl font-black italic text-white leading-none mb-1">{value}</p>
      <p className="text-[8px] font-black uppercase text-zinc-500 tracking-tighter">{label}</p>
    </div>
  );
}

function ProfileAction({ icon, label, detail }) {
  return (
    <div className="flex items-center justify-between p-5 bg-zinc-900/30 border border-white/5 rounded-[26px] active:scale-[0.98] transition-all cursor-pointer hover:border-white/10 group">
      <div className="flex items-center gap-4">
        <div className="text-blue-500 group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-xs font-bold uppercase italic tracking-tight">{label}</span>
      </div>
      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{detail}</span>
    </div>
  );
}