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
  Share2,
  Gem,
  Shield,
  ZapOff,
  Fingerprint,
  Activity,
  Trophy,
  Sparkles,
  Bell,
  Lock,
  Smartphone,
  Info
} from 'lucide-react';

export default function Profile({ user, userData, setTab, onLogout }) {
  // --- LOGIQUE DE CALCUL AVANCÉE ---
  const level = userData?.level || 1;
  const xp = userData?.xp || 0;
  const xpToNextLevel = level * 1000;
  const progress = Math.min((xp / xpToNextLevel) * 100, 100);

  // --- CONFIGURATION DES STATS PRINCIPALES ---
  const mainStats = [
    { label: 'Total XP', value: xp.toLocaleString(), icon: <Zap size={22} />, color: 'text-blue-500', shadow: 'shadow-blue-500/20' },
    { label: 'Rank', value: level > 10 ? 'Elite' : 'Rookie', icon: <Crown size={22} />, color: 'text-yellow-500', shadow: 'shadow-yellow-500/20' },
    { label: 'Streak', value: '7 Days', icon: <Flame size={22} />, color: 'text-orange-500', shadow: 'shadow-orange-500/20' }
  ];

  // --- CONFIGURATION DES STATS SECONDAIRES ---
  const secondaryStats = [
    { label: 'Saved', value: userData?.favs?.length || 0, icon: <Heart size={16} />, color: 'text-pink-500' },
    { label: 'Analyzed', value: '124', icon: <Target size={16} />, color: 'text-emerald-500' },
    { label: 'Shared', value: '12', icon: <Share2 size={16} />, color: 'text-cyan-500' },
    { label: 'Aura', value: '+850', icon: <Sparkles size={16} />, color: 'text-purple-500' }
  ];

  // --- STRUCTURE DES MENUS ---
  const menuGroups = [
    {
      groupTitle: "Social & Library",
      items: [
        { id: 'favorites', title: "Favorite Library", sub: "Your curated pick-up lines", icon: <Heart size={20} />, color: "text-pink-500", badge: userData?.favs?.length },
        { id: 'history', title: "Rizz History", sub: "Review past interactions", icon: <Clock size={20} />, color: "text-blue-400" },
        { id: 'analytics', title: "Performance", sub: "Detailed rizz statistics", icon: <TrendingUp size={20} />, color: "text-emerald-400" }
      ]
    },
    {
      groupTitle: "System & Security",
      items: [
        { id: 'settings', title: "App Settings", sub: "Preferences and UI", icon: <SettingsIcon size={20} />, color: "text-zinc-400" },
        { id: 'security', title: "Account Security", sub: "Privacy and biometrics", icon: <ShieldCheck size={20} />, color: "text-blue-500" },
        { id: 'premium', title: "Pro Subscription", sub: "Manage your RizzUp Pro", icon: <Gem size={20} />, color: "text-yellow-500", label: "Active" }
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8 pb-40 pt-4 px-4 w-full max-w-2xl mx-auto overflow-y-auto no-scrollbar"
    >
      
      {/* 1. HERO SECTION: IDENTITY CARD */}
      <section className="relative overflow-hidden bg-zinc-900/60 p-8 rounded-[45px] border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-10 -right-10 opacity-5">
          <Fingerprint size={240} className="text-white" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Avatar Container */}
          <div className="relative group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 bg-gradient-to-tr from-blue-600 via-transparent to-cyan-400 rounded-full opacity-40 blur-sm"
            ></motion.div>
            <div className="w-32 h-32 bg-zinc-950 rounded-full flex items-center justify-center border-4 border-zinc-900 shadow-2xl relative overflow-hidden">
              <User size={60} color="white" fill="white" className="mt-4 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            </div>
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute bottom-1 right-1 bg-yellow-500 p-2.5 rounded-full border-4 border-zinc-950 shadow-xl"
            >
              <Crown size={20} color="black" fill="black" />
            </motion.div>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">
                {userData?.username || 'Rizzler Elite'}
              </h2>
              <div className="bg-blue-500/20 p-1 rounded-full border border-blue-500/30">
                <ShieldCheck size={14} className="text-blue-500" />
              </div>
            </div>
            <p className="text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase mb-5 opacity-60">
              {user?.email || 'authenticated@rizzup.io'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest text-white shadow-lg shadow-blue-600/20">
                <Gem size={12} /> Pro Member
              </span>
              <span className="px-4 py-1.5 bg-zinc-800 text-[10px] font-black rounded-full uppercase tracking-widest text-zinc-400 border border-white/5">
                Level {level}
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESS OS INTERFACE */}
        <div className="mt-10 bg-black/40 p-6 rounded-[30px] border border-white/5 backdrop-blur-md">
          <div className="flex justify-between items-end mb-4 px-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Current Aura</span>
              <span className="text-xl font-black text-blue-500 italic leading-none">Level {level}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-zinc-600 uppercase block">XP Progression</span>
              <span className="text-sm font-black text-white tracking-tighter">{xp.toLocaleString()} <span className="text-zinc-500">/ {xpToNextLevel.toLocaleString()}</span></span>
            </div>
          </div>
          <div className="h-4 w-full bg-zinc-950 rounded-full border border-white/5 overflow-hidden p-0.5 relative">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 rounded-full relative"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-3 opacity-30">
             {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 bg-white rounded-full" />)}
          </div>
        </div>
      </section>

      {/* 2. ADVANCED STATS GRID */}
      <section className="grid grid-cols-3 gap-4">
        {mainStats.map((stat, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.95 }}
            className={`bg-zinc-900/40 p-5 rounded-[32px] border border-white/5 flex flex-col items-center justify-center gap-2 text-center shadow-xl ${stat.shadow}`}
          >
            <div className={`${stat.color} p-3 bg-white/5 rounded-2xl`}>{stat.icon}</div>
            <span className="text-2xl font-black tracking-tighter text-white">{stat.value}</span>
            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* 3. MINI METRICS SLIDER */}
      <section className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {secondaryStats.map((s, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 bg-zinc-900/20 border border-white/5 rounded-2xl min-w-fit">
            <div className={`${s.color} opacity-80`}>{s.icon}</div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white">{s.value}</span>
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{s.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* 4. ACHIEVEMENTS SYSTEM */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <Trophy size={14} className="text-yellow-500" /> Mastery Badges
          </h3>
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">View All</span>
        </div>
        <div className="grid grid-cols-4 gap-3 px-2">
          {[
            { icon: <Flame size={20} />, label: "Hot Streak", active: true },
            { icon: <Target size={20} />, label: "Deadeye", active: true },
            { icon: <Shield size={20} />, label: "Old Guard", active: false },
            { icon: <Crown size={20} />, label: "King", active: false },
          ].map((badge, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className={`aspect-square rounded-3xl border flex flex-col items-center justify-center gap-1 transition-all
                ${badge.active 
                  ? 'bg-zinc-800/40 border-yellow-500/20 text-yellow-500 shadow-lg shadow-yellow-500/5' 
                  : 'bg-zinc-900/10 border-white/5 text-zinc-800 grayscale'
                }`}
            >
              {badge.icon}
              <span className="text-[7px] font-black uppercase text-center leading-none">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. DYNAMIC MENU GROUPS */}
      {menuGroups.map((group, gIndex) => (
        <section key={gIndex} className="flex flex-col gap-3">
          <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-6 mt-2">
            {group.groupTitle}
          </h3>
          <div className="bg-zinc-900/30 rounded-[40px] border border-white/5 overflow-hidden backdrop-blur-md">
            {group.items.map((item, i, arr) => (
              <button 
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between p-6 active:bg-white/5 transition-all group
                  ${i !== arr.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`${item.color} p-3.5 bg-white/5 rounded-2xl group-active:scale-90 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[14px] font-black uppercase tracking-tight text-zinc-100">{item.title}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{item.sub}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.badge && (
                    <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-full shadow-lg shadow-blue-600/20">
                      {item.badge}
                    </span>
                  )}
                  {item.label && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded-md border border-emerald-500/20 uppercase">
                      {item.label}
                    </span>
                  )}
                  <ChevronRight size={18} className="text-zinc-800 group-hover:text-zinc-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* 6. SYSTEM INFO & LOGOUT */}
      <section className="mt-4 px-2 space-y-6">
        <div className="flex items-center justify-center gap-6 opacity-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white" />
          <Fingerprint size={20} className="text-white" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white" />
        </div>

        <motion.button 
          onClick={onLogout}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between p-6 rounded-[35px] bg-red-600/5 border border-red-600/10 active:bg-red-600/20 transition-all group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
            <ZapOff size={60} className="text-red-500" />
          </div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-red-600/10 p-3 rounded-2xl text-red-500">
              <LogOut size={24} />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-base font-black uppercase tracking-[0.1em] text-red-500 leading-none mb-1">Terminate Session</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-900/60">Local cache will be cleared</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-red-900/40" />
        </motion.button>

        <div className="flex flex-col items-center gap-3 pb-10">
          <div className="flex gap-4 opacity-30 text-white">
            <Smartphone size={14} />
            <Activity size={14} />
            <Shield size={14} />
          </div>
          <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.6em] text-center">
            RizzUp Kernel v6.5.0 <span className="text-zinc-800">//</span> Stable Build
          </p>
        </div>
      </section>

    </motion.div>
  );
}