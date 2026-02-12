import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Library({ library, favorites, onFav }) {
  const [view, setView] = useState('all');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-16 h-full overflow-y-auto no-scrollbar pb-40 text-left bg-black">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Library</h2>
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5">
          <button onClick={() => setView('all')} className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${view === 'all' ? 'bg-blue-600' : ''}`}>All</button>
          <button onClick={() => setView('favs')} className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${view === 'favs' ? 'bg-red-600' : ''}`}>Favs</button>
        </div>
      </div>
      <div className="space-y-4">
        {(view === 'all' ? library : favorites).map((item, i) => {
          const text = typeof item === 'string' ? item : Object.values(item)[0];
          return (
            <div key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-[30px] relative group">
              <p className="text-lg font-bold italic text-white">"{text}"</p>
              <button onClick={() => onFav(text)} className="absolute top-4 right-4 transition-colors">
                <Heart size={16} fill={favorites.includes(text) ? "red" : "none"} color={favorites.includes(text) ? "red" : "#3f3f46"} />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}