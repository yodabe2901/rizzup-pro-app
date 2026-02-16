import React, { useState } from 'react';
import { 
  Shield, 
  Trash2, 
  Bell, 
  LogOut, 
  ChevronRight, 
  Smartphone, 
  Database, 
  Info,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings({ version, onToggleZap, zapVisible }) {
  const [clearing, setClearing] = useState(false);
  const [showDone, setShowDone] = useState(false);

  const clearCache = () => {
    setClearing(true);
    setTimeout(() => {
      localStorage.clear();
      setClearing(false);
      setShowDone(true);
      setTimeout(() => setShowDone(false), 2000);
      window.location.reload(); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-40">
      {/* HEADER */}
      <header className="pt-10 mb-10">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">System<span className="text-blue-600">.Config</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Rizzup Pro OS v{version}</p>
      </header>

      <div className="space-y-8">
        
        {/* SECTION: PRÉFÉRENCES */}
        <section>
          <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-4">Preferences</h3>
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><Bell size={18}/></div>
                <span className="text-sm font-bold">Zap Quick-Action</span>
              </div>
              <button 
                onClick={onToggleZap}
                className={`w-12 h-6 rounded-full transition-all relative ${zapVisible ? 'bg-blue-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${zapVisible ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: STORAGE & CLOUD */}
        <section>
          <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-4">Cloud & Storage</h3>
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
            <button onClick={clearCache} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
                  {clearing ? <Database size={18} className="animate-spin" /> : <Trash2 size={18}/>}
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold block">Clear Local Cache</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Wipe local data & reload</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-700" />
            </button>
          </div>
        </section>

        {/* SECTION: LÉGAL & INFO */}
        <section>
          <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-4">About</h3>
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-white/5">
              <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400"><Shield size={18}/></div>
              <span className="text-sm font-bold">Privacy Policy</span>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400"><Info size={18}/></div>
              <div className="text-left">
                <span className="text-sm font-bold block">Rizzup Pro Engine</span>
                <span className="text-[10px] text-zinc-500 uppercase italic">Powered by Groq Llama-3</span>
              </div>
            </div>
          </div>
        </section>

        <button className="w-full p-4 bg-zinc-900 border border-red-500/20 rounded-3xl flex items-center justify-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* MODAL DE RÉUSSITE */}
      <AnimatePresence>
        {showDone && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-[200] p-10 bg-black/80 backdrop-blur-sm"
          >
            <div className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 mb-4">
                <CheckCircle size={32} />
              </div>
              <h4 className="text-xl font-black italic uppercase">System Reset</h4>
              <p className="text-zinc-500 text-xs mt-2">All local data wiped successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}