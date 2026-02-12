import React, { useState } from 'react';
import { Search as SearchIcon, Flame, Star, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Search({ library }) {
  const [query, setQuery] = useState("");
  
  // Filtrage de la bibliothèque selon la recherche
  const filteredResults = library.filter(item => {
    const text = typeof item === 'string' ? item : Object.values(item).join(" ");
    return text.toLowerCase().includes(query.toLowerCase());
  });

  const categories = ["Openers", "Comebacks", "Deep Talk", "Funny"];

  return (
    <div className="bg-black min-h-screen text-white p-6 pt-12 pb-24 overflow-y-auto no-scrollbar">
      {/* --- BARRE DE RECHERCHE --- */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-zinc-500" />
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search techniques, vibes, or keywords..."
          className="w-full bg-zinc-900/50 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
        />
      </div>

      {/* --- SUGGESTIONS / CATEGORIES (Si pas de recherche) --- */}
      {query.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 ml-1">Suggested Categories</h3>
          <div className="grid grid-cols-2 gap-3 mb-10">
            {categories.map((cat, i) => (
              <div key={i} className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex items-center gap-3 active:scale-95 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                  <Flame size={14} className="text-blue-500" />
                </div>
                <span className="text-xs font-bold uppercase italic">{cat}</span>
              </div>
            ))}
          </div>

          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 ml-1">Trending Now</h3>
          <div className="space-y-3">
             {[1, 2].map((_, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-white/5">
                 <div className="flex items-center gap-4">
                   <Clock size={16} className="text-zinc-600" />
                   <span className="text-xs font-medium text-zinc-300 italic">"The Golden Ratio Hook"</span>
                 </div>
                 <ArrowRight size={14} className="text-zinc-700" />
               </div>
             ))}
          </div>
        </motion.div>
      )}

      {/* --- RÉSULTATS DE RECHERCHE --- */}
      {query.length > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-blue-500 mb-4 ml-1">{filteredResults.length} Results found</p>
          {filteredResults.map((item, i) => {
            const text = typeof item === 'string' ? item : Object.values(item)[0];
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                key={i} 
                className="p-5 bg-zinc-900 border border-white/5 rounded-3xl"
              >
                <p className="text-sm font-bold italic text-zinc-200">"{text}"</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}