import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Info, 
  Trash2, 
  ChevronRight,
  Sparkles,
  Lock,
  User,
  EyeOff,
  Database,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function Settings({ onBack, user }) {
  const [notifs, setNotifs] = useState(true);
  const [incognito, setIncognito] = useState(false);

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in slide-in-from-right duration-300">
      
      {/* 1. TOP NAVIGATION */}
      <header className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-zinc-900 rounded-2xl border border-white/10 active:scale-90 transition-all">
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-black tracking-tighter uppercase italic">Account Settings</h2>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">ID: {user?.uid?.substring(0, 12)}...</p>
          </div>
        </div>
      </header>

      {/* 2. PERSONAL INFORMATION */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4">Personal</h3>
        <div className="bg-zinc-900/40 rounded-[35px] border border-white/5 overflow-hidden">
          <SettingsItem icon={<User size={22} />} label="Username" value="Rizz Master" />
          <SettingsItem icon={<Lock size={22} />} label="Email" value={user?.email} />
          <SettingsItem icon={<Shield size={22} />} label="Password" value="••••••••" isLast />
        </div>
      </div>

      {/* 3. APP PREFERENCES */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4">Preferences</h3>
        <div className="bg-zinc-900/40 rounded-[35px] border border-white/5 overflow-hidden">
          <SettingsToggle 
            icon={<Bell size={22} />} 
            label="Smart Notifications" 
            desc="AI alerts for best rizz moments"
            enabled={notifs} 
            onToggle={() => setNotifs(!notifs)} 
          />
          <SettingsToggle 
            icon={<EyeOff size={22} />} 
            label="Incognito Mode" 
            desc="Hide my stats from leaderboards"
            enabled={incognito} 
            onToggle={() => setIncognito(!incognito)} 
            isLast
          />
        </div>
      </div>

      {/* 4. CONTENT & DATA */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4">Data & Support</h3>
        <div className="bg-zinc-900/40 rounded-[35px] border border-white/5 overflow-hidden">
          <SettingsItem icon={<Globe size={22} />} label="Language" value="English" />
          <SettingsItem icon={<Database size={22} />} label="Clear Cache" />
          <SettingsItem icon={<HelpCircle size={22} />} label="Help Center" />
          <SettingsItem icon={<ExternalLink size={22} />} label="Privacy Policy" isLast />
        </div>
      </div>

      {/* 5. SUBSCRIPTION STATUS */}
      <div className="px-2">
        <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-6 rounded-[35px] shadow-xl relative overflow-hidden group">
          <Sparkles className="absolute top-[-10px] right-[-10px] w-24 h-24 opacity-20 rotate-12 group-hover:scale-125 transition-transform duration-700" />
          <h4 className="text-lg font-black uppercase italic mb-1">RizzUp Premium</h4>
          <p className="text-[10px] font-bold text-blue-100/70 uppercase tracking-widest mb-4">Unlimited AI Analysis Active</p>
          <button className="w-full py-3 bg-white text-blue-900 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
            Manage Subscription
          </button>
        </div>
      </div>

      {/* 6. DANGER ZONE */}
      <div className="flex flex-col gap-3 mt-4">
        <h3 className="text-[10px] font-black text-red-900 uppercase tracking-[0.3em] ml-4">Danger Zone</h3>
        <button className="flex items-center gap-4 p-6 mx-2 rounded-[35px] bg-red-600/5 border border-red-600/10 text-red-500 active:bg-red-600/20 active:scale-95 transition-all">
          <Trash2 size={22} />
          <div className="flex flex-col items-start">
            <span className="text-sm font-black uppercase tracking-widest">Delete My Data</span>
            <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">Permanent account destruction</span>
          </div>
        </button>
      </div>

      <p className="text-center text-[8px] text-zinc-800 font-bold uppercase tracking-[1em] py-10">
        Build 2026.02.18
      </p>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SettingsItem({ icon, label, value, isLast }) {
  return (
    <button className={`w-full flex items-center justify-between p-6 active:bg-white/5 transition-all ${!isLast ? 'border-b border-white/5' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="text-blue-500">{icon}</div>
        <span className="text-xs font-black uppercase tracking-widest text-zinc-200">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">{value}</span>}
        <ChevronRight size={16} className="text-zinc-800" />
      </div>
    </button>
  );
}

function SettingsToggle({ icon, label, desc, enabled, onToggle, isLast }) {
  return (
    <div className={`flex items-center justify-between p-6 ${!isLast ? 'border-b border-white/5' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="text-blue-500">{icon}</div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-200">{label}</span>
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">{desc}</span>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-14 h-7 rounded-full p-1 transition-all duration-300 relative ${enabled ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-zinc-800'}`}
      >
        <motion.div 
          animate={{ x: enabled ? 28 : 0 }}
          className="w-5 h-5 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}