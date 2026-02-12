import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, PlusSquare, Search, Clapperboard, User } from 'lucide-react';

export default function Home({ library }) {
  // On simule des stories à partir de ta bibliothèque ou de profils fictifs
  const stories = [
    { id: 1, user: "Your story", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", plus: true },
    { id: 2, user: "jaded.ele...", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { id: 3, user: "pia.in.a.pod", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop" },
    { id: 4, user: "lil_wyatt838", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  ];

  return (
    <div className="bg-black min-h-screen text-white pb-20 overflow-y-auto no-scrollbar">
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center px-4 py-3 sticky top-0 bg-black z-50 border-b border-white/5">
        <h1 className="text-2xl font-serif italic font-bold tracking-tight">Instagram</h1>
        <div className="flex gap-5 items-center">
          <Heart size={24} />
          <div className="relative">
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
          </div>
        </div>
      </header>

      {/* --- STORIES --- */}
      <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar border-b border-white/5">
        {stories.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1 min-w-[75px]">
            <div className={`p-[2px] rounded-full ${s.plus ? '' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
              <div className="p-[2px] bg-black rounded-full relative">
                <img src={s.img} className="w-16 h-16 rounded-full object-cover border border-white/10" alt={s.user} />
                {s.plus && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-2 border-black p-0.5">
                    <PlusSquare size={12} fill="white" />
                  </div>
                )}
              </div>
            </div>
            <span className="text-[11px] text-zinc-400 truncate w-full text-center">{s.user}</span>
          </div>
        ))}
      </div>

      {/* --- FEED (Publications) --- */}
      <div className="mt-2">
        {/* Exemple de Post (On peut boucler sur ton Library ici) */}
        <div className="mb-8">
          <div className="flex justify-between items-center px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
                <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=50&h=50&fit=crop" className="w-full h-full rounded-full border border-black" />
              </div>
              <span className="text-xs font-bold">heaven.is.nevaeh</span>
            </div>
            <MoreHorizontal size={18} />
          </div>

          {/* L'image principale (inspirée de ta capture) */}
          <div className="aspect-square bg-zinc-900 relative">
             <img 
               src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop" 
               className="w-full h-full object-cover" 
               alt="Post content"
             />
          </div>

          {/* Interactions */}
          <div className="px-3 py-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-4">
                <Heart size={24} className="hover:text-red-500 cursor-pointer" />
                <MessageCircle size={24} />
                <Send size={24} />
              </div>
              <Bookmark size={24} />
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-bold">Liked by kyia_kayaks and others</p>
              <p className="text-xs">
                <span className="font-bold mr-2">heaven.is.nevaeh</span>
                Your favorite duo 💕
              </p>
              <p className="text-[10px] text-zinc-500 uppercase mt-2">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}