import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Star, ArrowRight, MessageSquare } from 'lucide-react';

export default function Home({ library, setTab }) {
  return (
    <div className="bg-black min-h-screen text-white pb-24 overflow-y-auto no-scrollbar px-6">
      
      {/* --- HEADER ÉPURÉ --- */}
      <header className="flex justify-between items-center py-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">
            RizzUP<span className="text-blue-600">.</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Status: Elite</p>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900">
           <Trophy size={18} className="text-blue-500" />
        </div>
      </header>

      {/* --- CARTE "FEATURED" (Type Insta Story focus) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative aspect-[16/10] w-full rounded-[32px] overflow-hidden border border-white/5 mb-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute bottom-6 left-6 z-20">
          <span className="bg-blue-600 text-[9px] font-black uppercase px-3 py-1 rounded-full mb-3 inline-block">Daily Wisdom</span>
          <h2 className="text-2xl font-bold italic leading-tight uppercase">Master the art of <br/> subtle tension.</h2>
        </div>
      </motion.div>

      {/* --- STATS GRID (Design Minimaliste) --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[28px] backdrop-blur-sm">
          <Star size={20} className="text-blue-500 mb-3" />
          <p className="text-2xl font-black italic">{library.length}</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Lines Loaded</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[28px] backdrop-blur-sm">
          <Zap size={20} className="text-blue-500 mb-3" />
          <p className="text-2xl font-black italic">Rank #1</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Global Status</p>
        </div>
      </div>

      {/* --- ACTION CARD --- */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">Quick Actions</h3>
        
        <button 
          onClick={() => setTab('chat')}
          className="w-full bg-white text-black p-5 rounded-[24px] flex justify-between items-center group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-black p-2 rounded-xl text-white">
              <MessageSquare size={18} />
            </div>
            <span className="font-black italic uppercase text-sm">Open AI Terminal</span>
          </div>
          <ArrowRight size={20} />
        </button>

        <div className="w-full bg-zinc-900/80 border border-white/5 p-5 rounded-[24px] flex justify-between items-center opacity-50">
          <div className="flex items-center gap-4">
            <div className="bg-zinc-800 p-2 rounded-xl text-zinc-500">
              <Trophy size={18} />
            </div>
            <span className="font-black italic uppercase text-sm">Rizz Academy</span>
          </div>
          <span className="text-[9px] font-bold uppercase text-blue-500">Locked</span>
        </div>
      </section>

    </div>
  );
}