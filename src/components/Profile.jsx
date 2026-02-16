import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, Star, Zap, Settings, 
  Share2, Award, Heart, ChevronRight, Trophy,
  Flame, Target, Rocket, Crown
} from 'lucide-react';

export default function Profile({ favorites, library, setTab }) {
  const rizzLevel = Math.floor((favorites?.length * 5) + (library?.length / 10));
  const rank = rizzLevel > 50 ? "Elite Master" : "Rising Legend";

  return (
    <div className="bg-black min-h-screen text-white p-6 pt-16 pb-32 overflow-y-auto no-scrollbar">
      
      {/* --- HEADER PROFILE --- */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-28 h-28 rounded-[40px] bg-gradient-to-tr from-blue-600 to-cyan-400 p-[3px] shadow-2xl shadow-blue-500/20"
          >
            <div className="w-full h-full rounded-[37px] bg-black flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
                alt="Profile"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </motion.div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 border-4 border-black rounded-2xl p-2 text-white shadow-lg">
            <Crown size={16} fill="white" />
          </div>
        </div>
        
        <h2 className="mt-5 text-2xl font-black italic uppercase tracking-tighter">yodabe2901</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="h-[1px] w-4 bg-blue-500/50"></span>
          <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">{rank}</p>
          <span className="h-[1px] w-4 bg-blue-500/50"></span>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatBox label="Level" value={rizzLevel} icon={<Target size={10} className="text-blue-400"/>} />
        <StatBox label="Lines" value={library?.length || 0} icon={<Rocket size={10} className="text-purple-400"/>} />
        <StatBox label="Favs" value={favorites?.length || 0} icon={<Heart size={10} className="text-red-400"/>} />
      </div>

      {/* --- RIZZ PROGRESS BAR --- */}
      <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[35px] mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Trophy size={60} />
        </div>
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Mastery Progress</p>
            <p className="text-xs text-white uppercase font-black italic mt-1">Next: <span className="text-blue-500">Rizz God</span></p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black italic text-blue-500 leading-none">78%</p>
            <p className="text-[8px] font-bold text-zinc-600 uppercase">To Level Up</p>
          </div>
        </div>
        <div className="w-full h-3 bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: "78%" }} 
            transition={{ duration: 2, ease: "circOut" }}
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          />
        </div>
      </div>

      {/* --- BADGES COLLECTED --- */}
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4 ml-2 text-left">Unlocked Badges</p>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           <Badge icon={<Flame size={20}/>} color="from-orange-500 to-red-600" label="Hot" />
           <Badge icon={<Zap size={20}/>} color="from-yellow-400 to-orange-500" label="Fast" />
           <Badge icon={<Shield size={20}/>} color="from-blue-500 to-indigo-600" label="Pro" />
           <Badge icon={<Star size={20}/>} color="from-purple-500 to-pink-600" label="Star" />
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-2 text-left">Collections & System</p>
        
        {/* Favoris */}
        <button 
          onClick={() => setTab('favorites')}
          className="w-full flex items-center justify-between p-6 bg-zinc-900/40 border border-white/5 rounded-[32px] active:scale-[0.97] transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="bg-red-500/20 p-3 rounded-2xl text-red-500">
              <Heart size={22} fill="currentColor" />
            </div>
            <div className="text-left">
               <span className="text-sm font-black uppercase italic text-white block">Saved Punchlines</span>
               <span className="text-[9px] font-bold text-zinc-500 uppercase italic">View your collection</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-zinc-700" />
        </button>

        {/* Settings */}
        <button 
          onClick={() => setTab('settings')}
          className="w-full flex items-center justify-between p-6 bg-zinc-900/40 border border-white/5 rounded-[32px] active:scale-[0.97] transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="bg-zinc-800 p-3 rounded-2xl text-zinc-400">
              <Settings size={22} />
            </div>
            <div className="text-left">
               <span className="text-sm font-black uppercase italic text-white block">App Settings</span>
               <span className="text-[9px] font-bold text-zinc-500 uppercase italic">AI & Account Config</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-zinc-700" />
        </button>

        {/* Achievements */}
        <div className="flex items-center justify-between p-6 bg-zinc-900/40 border border-white/5 rounded-[32px] opacity-60">
          <div className="flex items-center gap-5">
            <div className="bg-yellow-500/20 p-3 rounded-2xl text-yellow-500">
              <Award size={22} />
            </div>
            <div className="text-left">
               <span className="text-sm font-black uppercase italic text-white block">Achievements</span>
               <span className="text-[9px] font-bold text-zinc-500 uppercase italic">12/40 Unlocked</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-yellow-500 uppercase">Coming Soon</span>
        </div>
      </div>

      {/* --- LOGOUT --- */}
      <button className="w-full mt-12 p-6 rounded-[30px] bg-red-500/5 border border-red-500/10 text-red-500/50 text-[10px] font-black uppercase italic tracking-[0.3em] active:scale-95 transition-all">
        Terminate Session
      </button>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-[28px] text-center shadow-inner relative overflow-hidden">
      <div className="absolute top-2 right-2 opacity-30">{icon}</div>
      <p className="text-2xl font-black italic text-white leading-none mb-1 tracking-tighter">{value}</p>
      <p className="text-[8px] font-black uppercase text-zinc-500 tracking-tighter">{label}</p>
    </div>
  );
}

function Badge({ icon, color, label }) {
  return (
    <div className="flex flex-col items-center min-w-[70px]">
      <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${color} p-[2px]`}>
        <div className="w-full h-full rounded-[22px] bg-black flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
      <span className="text-[8px] font-black uppercase mt-2 text-zinc-400 tracking-widest">{label}</span>
    </div>
  );
}