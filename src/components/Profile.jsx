import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings as SettingsIcon, 
  Heart, 
  Zap, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  Award, 
  Flame, 
  Crown, 
  Target, 
  Star,
  Clock,
  TrendingUp,
  Share2
} from 'lucide-react';

export default function Profile({ user, userData, setTab, onLogout }) {
  // --- PROGRESS CALCULATION ---
  const level = userData?.level || 1;
  const xp = userData?.xp || 0;
  const xpToNextLevel = level * 1000;
  const progress = Math.min((xp / xpToNextLevel) * 100, 100);

  // --- STATS CONFIGURATION ---
  const stats = [
    { label: 'Total XP', value: xp.toLocaleString(), icon: <Zap size={20} />, color: 'text-blue-500' },
    { label: 'Rank', value: level > 10 ? 'Elite' : 'Rookie', icon: <Crown size={20} />, color: 'text-yellow-500' },
    { label: 'Streak', value: '7 Days', icon: <Flame size={20} />, color: 'text-orange-500' }
  ];

  const secondaryStats = [
    { label: 'Saved', value: userData?.favs?.length || 0, icon: <Heart size={16} /> },
    { label: 'Analyzed', value: '124', icon: <Target size={16} /> },
    { label: 'Shared', value: '12', icon: <Share2 size={16} /> }
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* 1. HERO SECTION: USER IDENTITY */}
      <section className="relative overflow-hidden bg-zinc-900/40 p-6 rounded-[35px] border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={120} fill="currentColor" className="text-blue-600" />
        </div>
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center border-4 border-black shadow-xl">
              <User size={45} color="white" fill="white" />
            </div>
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 bg-yellow-500 p-2 rounded-full border-4 border-black"
            >
              <Crown size={16} color="black" fill="black" />
            </motion.div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">
              {userData?.username || 'Rizz Master'}
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
              {user?.email || 'Premium Member'}
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-600 text-[9px] font-black rounded-full uppercase tracking-widest">Pro Player</span>
              <span className="px-3 py-1 bg-zinc-800 text-[9px] font-black rounded-full uppercase tracking-widest text-zinc-400">Lv.{level}</span>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between items-end px-1">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Level Progress</span>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-3 w-full bg-black/40 rounded-full border border-white/5 overflow-hidden p-0.5">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            />
          </div>
        </div>
      </section>

      {/* 2. STATS GRID: DATA INSIGHTS */}
      <section className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} whileTap={{ scale: 0.95 }}
            className="bg-zinc-900/40 p-4 rounded-[28px] border border-white/5 flex flex-col items-center justify-center gap-1 text-center"
          >
            <div className={stat.color}>{stat.icon}</div>
            <span className="text-xl font-black tracking-tighter">{stat.value}</span>
            <span className="text-[7px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* 3. ACHIEVEMENT PREVIEW */}
      <section className="flex flex-col gap-3">
        <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4 flex items-center gap-2">
          <Award size={14} /> My Badges
        </h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-1">
          {[1, 2, 3, 4].map((badge) => (
            <div key={badge} className="min-w-[70px] h-[70px] bg-zinc-900/60 rounded-2xl border border-white/5 flex items-center justify-center text-zinc-700 grayscale hover:grayscale-0 transition-all active:scale-90">
              <Star size={24} fill="currentColor" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. NAVIGATION ACTIONS */}
      <section className="flex flex-col gap-2">
        <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4 mb-1">Application</h3>
        
        <MenuAction 
          icon={<Heart size={22} />} 
          title="Favorite Library" 
          sub="View your saved rizz"
          badge={userData?.favs?.length || 0}
          onClick={() => setTab('favorites')} 
        />
        
        <MenuAction 
          icon={<TrendingUp size={22} />} 
          title="Rizz Analytics" 
          sub="Performance tracking"
          onClick={() => {}} 
        />

        <MenuAction 
          icon={<SettingsIcon size={22} />} 
          title="Global Settings" 
          sub="App configuration"
          onClick={() => setTab('settings')} 
        />
      </section>

      {/* 5. LOGOUT SECTION */}
      <section className="px-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-5 rounded-[30px] bg-red-600/10 border border-red-600/20 active:bg-red-600/20 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-red-600/20 p-2 rounded-xl text-red-500 group-active:scale-110 transition-transform">
              <LogOut size={22} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-black uppercase tracking-widest text-red-500">Sign Out</span>
              <span className="text-[8px] font-bold uppercase tracking-tighter text-red-900">End current session</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-red-900" />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col items-center gap-2 mt-4 opacity-40">
        <div className="flex gap-4">
          <Clock size={12} />
          <p className="text-[8px] font-black uppercase tracking-[0.4em]">Engine v6.5.0-STABLE</p>
        </div>
      </footer>
    </div>
  );
}

// --- REUSABLE MENU COMPONENT ---

function MenuAction({ icon, title, sub, badge, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-between p-5 rounded-[30px] bg-zinc-900/30 border border-white/5 active:bg-zinc-900/60 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="text-blue-500 group-active:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-[13px] font-black uppercase tracking-tight text-zinc-100">{title}</span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">{sub}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {badge !== undefined && (
          <span className="px-2 py-0.5 bg-blue-600/10 text-blue-500 text-[9px] font-black rounded-lg border border-blue-500/20">
            {badge}
          </span>
        )}
        <ChevronRight size={18} className="text-zinc-800" />
      </div>
    </button>
  );
}