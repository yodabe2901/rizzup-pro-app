import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Edit3, 
  Award, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Flame, 
  Star, 
  Share2, 
  ChevronRight, 
  TrendingUp, 
  Target, 
  Activity,
  User,
  LogOut,
  Bell,
  Lock,
  Eye,
  Hash
} from 'lucide-react';

// IMPORTATION DU COMPOSANT DE PROGRESSION
import MasteryBar from '../components/MasteryBar';

export default function Profile({ userData = {} }) {
  // --- ÉTATS LOCAUX ---
  const [activeTab, setActiveTab] = useState("Showcase");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Simulation de données si userData est vide
  const user = {
    username: userData.username || "RizzMaster_99",
    xp: userData.xp || 4250,
    bio: userData.bio || "Crafting the perfect lines. Sigma mindset. ⚡",
    verified: userData.verified || true,
    stats: {
      posts: 24,
      followers: "1.2k",
      successRate: "94%"
    }
  };

  const tabs = ["Showcase", "Badges", "Analytics"];

  // --- COMPOSANT INTERNE : BADGE D'ACHIEVEMENT ---
  const AchievementBadge = ({ icon, title, desc, color }) => (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-zinc-900/80 border border-white/5 p-4 rounded-[2rem] flex flex-col items-center text-center gap-2"
    >
      <div className={`p-3 rounded-2xl bg-${color}-500/20 text-${color}-500 shadow-lg`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-tighter text-white">{title}</span>
      <p className="text-[8px] font-medium text-zinc-500 leading-tight uppercase tracking-widest">{desc}</p>
    </motion.div>
  );

  return (
    <div className="bg-black min-h-screen text-white pb-32 overflow-x-hidden">
      
      {/* --- HEADER ACTIONS --- */}
      <div className="p-6 flex justify-between items-center relative z-20">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 text-zinc-400"
        >
          <LogOut size={18} />
        </motion.button>
        <div className="flex gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 text-zinc-400"
          >
            <Bell size={18} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSettingsOpen(true)}
            className="p-4 bg-blue-600 rounded-2xl border border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            <Settings size={18} />
          </motion.button>
        </div>
      </div>

      {/* --- PROFILE HERO SECTION --- */}
      <section className="px-6 pt-2 pb-10 flex flex-col items-center relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
        
        {/* Avatar avec Ring de Grade */}
        <div className="relative mb-6">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-dashed border-blue-500/30 rounded-full"
          />
          <div className="w-32 h-32 rounded-[3rem] bg-zinc-900 border-4 border-black shadow-2xl flex items-center justify-center relative z-10 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />
             <User size={60} className="text-zinc-700" />
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-2xl border-4 border-black z-20 shadow-xl">
            <ShieldCheck size={18} className="text-white" />
          </div>
        </div>

        {/* Name & Bio */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">@{user.username}</h2>
            {user.verified && <Crown size={20} className="text-yellow-500" fill="currentColor" fillOpacity={0.2} />}
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] max-w-xs leading-relaxed">
            {user.bio}
          </p>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-3 gap-1 w-full max-w-md bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-2 backdrop-blur-md">
          {[
            { label: "Posts", val: user.stats.posts, icon: <Hash size={10}/> },
            { label: "Flow", val: user.stats.followers, icon: <TrendingUp size={10}/> },
            { label: "Success", val: user.stats.successRate, icon: <Target size={10}/> }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center py-4 px-2 rounded-3xl hover:bg-white/5 transition-colors">
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                {stat.icon} {stat.label}
              </span>
              <span className="text-lg font-black italic tracking-tighter">{stat.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- ÉTAPE 4 : LA BARRE DE MASTERY --- */}
      <section className="px-6 mb-10">
        <MasteryBar xp={user.xp} />
      </section>

      {/* --- TABS SYSTEM --- */}
      <section className="px-6">
        <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1.5 rounded-full border border-white/5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                ${activeTab === t ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* --- CONTENU DYNAMIQUE DES TABS --- */}
        <AnimatePresence mode="wait">
          {activeTab === "Showcase" && (
            <motion.div 
              key="showcase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Pinned Techniques</h3>
                <Edit3 size={14} className="text-zinc-800" />
              </div>
              
              {[1, 2].map((_, i) => (
                <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] relative group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-blue-600/10 text-blue-500 text-[8px] font-black uppercase rounded-lg">High Synergy</span>
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                  </div>
                  <p className="text-sm font-bold italic text-zinc-200">
                    "I usually go for 10s, but I’ll settle for an 11 today."
                  </p>
                  <div className="mt-4 flex gap-4 text-zinc-600">
                     <div className="flex items-center gap-1 text-[10px] font-black"><Flame size={12}/> 412</div>
                     <div className="flex items-center gap-1 text-[10px] font-black"><Share2 size={12}/> 89</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "Badges" && (
            <motion.div 
              key="badges"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-2 gap-4"
            >
              <AchievementBadge color="orange" icon={<Flame size={20}/>} title="On Fire" desc="10 Post Streak" />
              <AchievementBadge color="purple" icon={<Crown size={20}/>} title="Elite" desc="Verified Rizzler" />
              <AchievementBadge color="blue" icon={<Zap size={20}/>} title="Neural" desc="50 AI Validations" />
              <AchievementBadge color="green" icon={<ShieldCheck size={20}/>} title="Alpha" desc="Top 1% Global" />
            </motion.div>
          )}

          {activeTab === "Analytics" && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/40 border border-white/5 p-8 rounded-[3rem]"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-500">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black italic uppercase">Rizz Graph</h4>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Performance last 30 days</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Confidence Score", val: 88 },
                  { label: "Social Impact", val: 72 },
                  { label: "Originality", val: 95 }
                ].map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span className="text-zinc-400">{bar.label}</span>
                      <span className="text-blue-500">{bar.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.val}%` }}
                        className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- FOOTER INFO --- */}
      <footer className="mt-20 px-10 text-center opacity-20">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] leading-relaxed">
          Security Protocol v6.2 // Profile Encrypted // User ID: {Date.now().toString().slice(-8)}
        </p>
      </footer>

      {/* --- MODAL SETTINGS (EXTENSIBLE) --- */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] p-6 backdrop-blur-xl"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Settings</h2>
              <X onClick={() => setIsSettingsOpen(false)} className="text-zinc-500" />
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Account Security", icon: <Lock size={18}/> },
                { label: "Privacy Mode", icon: <Eye size={18}/> },
                { label: "Edit Profile", icon: <Edit3 size={18}/> }
              ].map((opt, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-zinc-900/50 border border-white/5 rounded-[2rem]">
                  <div className="flex items-center gap-4 text-zinc-300 font-bold uppercase text-xs tracking-widest">
                    {opt.icon} {opt.label}
                  </div>
                  <ChevronRight size={18} className="text-zinc-700" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Composant X interne rapide pour fermer la modal
const X = ({ onClick, className }) => (
  <button onClick={onClick} className={className}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  </button>
);