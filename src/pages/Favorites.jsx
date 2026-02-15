import React from 'react';
import { Heart, Copy, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Favorites({ favorites, onFav }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-full bg-black p-6 pt-12">
      <h2 className="text-2xl font-black italic uppercase text-blue-500 mb-6">Saved Rizz</h2>
      
      {favorites.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
          <Heart size={48} className="mb-4 opacity-20" />
          <p>No rizz saved yet. Go to chat!</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pb-24 no-scrollbar">
          {favorites.map((rizz, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              key={index} className="bg-zinc-900 border border-white/10 p-4 rounded-2xl relative"
            >
              <p className="text-zinc-200 text-sm italic mb-4">"{rizz}"</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => copyToClipboard(rizz)} className="text-zinc-500 hover:text-white">
                  <Copy size={18} />
                </button>
                <button onClick={() => onFav(rizz)} className="text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}