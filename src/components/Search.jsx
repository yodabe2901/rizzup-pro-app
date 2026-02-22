import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search as SearchIcon, 
  Flame, 
  Star, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  History, 
  Filter, 
  X, 
  Sparkles, 
  Compass, 
  Hash, 
  Bookmark,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Search({ library = [] }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchHistory, setSearchHistory] = useState([
    "Alpha Openers",
    "How to rizz a goth girl",
    "Sigma comebacks"
  ]);

  const categories = [
    { name: "Openers", icon: <Zap size={14} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Comebacks", icon: <ShieldCheck size={14} />, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Deep Talk", icon: <Star size={14} />, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { name: "Funny", icon: <Flame size={14} />, color: "text-orange-500", bg: "bg-orange-500/10" }
  ];

  const trends = [
    { title: "The Golden Ratio Hook", type: "Viral", views: "12.4k" },
    { title: "Delayed Response Method", type: "Classic", views: "8.2k" },
    { title: "Push & Pull Paradox", type: "Advanced", views: "15.9k" }
  ];

  // --- LOGIQUE DE RECHERCHE FILTRÉE ---
  const filteredResults = useMemo(() => {
    return library.filter(item => {
      const text = typeof item === 'string' ? item : Object.values(item).join(" ");
      const matchesQuery = text.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategory === "All" || text.toLowerCase().includes(activeCategory.toLowerCase());
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory, library]);

  const clearSearch = () => setQuery("");

  return (
    <div className="bg-black min-h-screen text-white p-6 pt-12 pb-32 overflow-y-auto no-scrollbar">
      
      {/* --- HEADER & TITRE --- */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
          Global <span className="text-blue-600">Search</span>
        </h1>
        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-2">
          Database Kernel v6.5.0 // Discovery Mode
        </p>
      </motion.div>

      {/* --- BARRE DE RECHERCHE AVANCÉE --- */}
      <div className="relative mb-10 group">
        <motion.div 
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          className={`relative z-10 flex items-center bg-zinc-900/40 border ${isFocused ? 'border-blue-600/50 shadow-[0_0_20px_rgba(37,99,235,0.1)]' : 'border-white/5'} rounded-3xl p-1 transition-all duration-500 backdrop-blur-xl`}
        >
          <div className="pl-4 pr-2">
            <SearchIcon size={20} className={isFocused ? "text-blue-500" : "text-zinc-600"} />
          </div>
          <input 
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search techniques, vibes, or keywords..."
            className="w-full bg-transparent py-4 pr-12 outline-none text-sm font-bold placeholder:text-zinc-700 placeholder:uppercase placeholder:tracking-widest"
          />
          <AnimatePresence>
            {query.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={clearSearch}
                className="absolute right-4 p-1 bg-zinc-800 rounded-full text-zinc-400"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Glow effect décoratif */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[30px] opacity-0 group-hover:opacity-5 blur transition-opacity pointer-events-none" />
      </div>

      {/* --- ETAT PAR DÉFAUT (Pas de recherche) --- */}
      {query.length === 0 && (
        <div className="space-y-12">
          
          {/* 1. Catégories Quick-Access */}
          <section>
            <div className="flex justify-between items-end mb-6 px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                <Compass size={14} /> Filter Categories
              </h3>
              <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">See Matrix</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <motion.div 
                  key={i} 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`relative overflow-hidden p-5 rounded-[30px] border transition-all cursor-pointer group
                    ${activeCategory === cat.name ? 'bg-blue-600 border-blue-500' : 'bg-zinc-900/40 border-white/5'}`}
                >
                  <div className={`mb-3 p-2 rounded-xl w-fit ${activeCategory === cat.name ? 'bg-white/20' : cat.bg}`}>
                    {React.cloneElement(cat.icon, { className: activeCategory === cat.name ? "text-white" : cat.color })}
                  </div>
                  <span className={`text-xs font-black uppercase italic ${activeCategory === cat.name ? 'text-white' : 'text-zinc-300'}`}>
                    {cat.name}
                  </span>
                  <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:scale-110 transition-transform">
                    {React.cloneElement(cat.icon, { size: 60 })}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 2. Recent Searches */}
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 ml-1 flex items-center gap-2">
              <History size={14} /> Recent Analytics
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 border border-white/5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer group">
                  <Clock size={12} className="text-zinc-700 group-hover:text-blue-500" />
                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-200">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Trending List */}
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 ml-1 flex items-center gap-2">
              <TrendingUp size={14} className="text-orange-500" /> Hot Interactions
            </h3>
            <div className="space-y-3">
              {trends.map((trend, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-5 bg-zinc-900/30 rounded-[28px] border border-white/5 hover:bg-zinc-900/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black rounded-2xl border border-white/5 flex items-center justify-center text-orange-500">
                      <Hash size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black italic text-zinc-100">{trend.title}</span>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[8px] font-black uppercase tracking-tighter text-blue-500">{trend.type}</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-700">• {trend.views} Analyzed</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-800" />
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* --- RÉSULTATS DE RECHERCHE --- */}
      {query.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">
              Found {filteredResults.length} Database entries
            </p>
            <Filter size={14} className="text-zinc-700" />
          </div>

          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, i) => {
                const text = typeof item === 'string' ? item : Object.values(item)[0];
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="group relative p-6 bg-zinc-900/60 border border-white/5 rounded-[35px] hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex flex-col gap-4">
                      <p className="text-sm font-bold italic text-zinc-200 leading-relaxed">"{text}"</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-2">
                           <span className="px-3 py-1 bg-black/40 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-500 border border-white/5 flex items-center gap-1">
                             <Sparkles size={8} /> Synergy: 98%
                           </span>
                        </div>
                        <div className="flex gap-3">
                          <button className="p-2 bg-zinc-800 rounded-xl text-zinc-400 active:scale-90 transition-transform">
                            <Bookmark size={16} />
                          </button>
                          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all">
                            Use <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                  <X size={24} className="text-zinc-700" />
                </div>
                <h4 className="text-sm font-black uppercase text-zinc-500 tracking-tighter">No Rizz Found</h4>
                <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mt-2">Try different parameters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FOOTER LOGS --- */}
      <footer className="mt-10 opacity-20 flex flex-col items-center gap-4">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white to-transparent" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-center">
          Encrypted Search Protocol // RizzUp Matrix
        </p>
      </footer>
    </div>
  );
}