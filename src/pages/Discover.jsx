import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, X, Flame, ShieldCheck, TrendingUp } from 'lucide-react';
import { validateRizz } from '../services/ai';

export default function Discover() {
  const [posts, setPosts] = useState([
    { id: 1, text: "Are you a magician? Because whenever I look at you, everyone else disappears.", author: "RizzGod_01", likes: 42, verified: true },
    { id: 2, text: "I'm not a photographer, but I can definitely picture us together.", author: "SmoothOperator", likes: 28, verified: false }
  ]);
  const [isPosting, setIsPosting] = useState(false);
  const [newRizz, setNewRizz] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Gestion des Likes
  const handleLike = (id) => {
    setPosts(posts.map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  // Publication avec Validation IA
  const handlePublish = async () => {
    if (!newRizz.trim()) return;
    
    setIsValidating(true);
    const isValid = await validateRizz(newRizz);
    
    if (isValid) {
      const newPost = {
        id: Date.now(),
        text: newRizz,
        author: "You",
        likes: 0,
        verified: false
      };
      setPosts([newPost, ...posts]);
      setNewRizz("");
      setIsPosting(false);
    } else {
      alert("⚠️ Your Rizz is too weak or too short! The AI Coach rejected it.");
    }
    setIsValidating(false);
  };

  return (
    <div className="p-6 bg-black min-h-screen pb-32 text-white font-sans">
      {/* Header Statistique */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Feed</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter">DISCOVER</h1>
        </div>
        <button 
          onClick={() => setIsPosting(true)}
          className="bg-white text-black p-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-90 transition-transform"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      {/* Feed des utilisateurs */}
      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden group"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">@{post.author}</span>
                {post.verified && <ShieldCheck size={12} className="text-blue-500" />}
              </div>
              
              <p className="text-2xl font-black italic leading-tight mb-6">"{post.text}"</p>
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-orange-500/10 px-4 py-2 rounded-full transition-colors group"
                >
                  <Flame size={18} className="text-zinc-600 group-hover:text-orange-500 transition-colors" fill="currentColor" />
                  <span className="font-black text-sm">{post.likes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal de Publication */}
      <AnimatePresence>
        {isPosting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div 
              initial={{ y: 50 }} animate={{ y: 0 }}
              className="bg-zinc-900 w-full max-w-md p-8 rounded-[3rem] border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black italic">DROP YOUR LINE</h2>
                <X onClick={() => setIsPosting(false)} className="text-zinc-500 cursor-pointer" />
              </div>
              
              <textarea 
                value={newRizz}
                onChange={(e) => setNewRizz(e.target.value)}
                placeholder="What's your secret weapon?"
                className="w-full bg-black border border-white/5 rounded-[2rem] p-6 mb-6 h-40 outline-none focus:border-blue-500 text-lg font-medium transition-all"
              />
              
              <button 
                onClick={handlePublish}
                disabled={isValidating}
                className={`w-full py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all ${
                  isValidating ? 'bg-zinc-800 text-zinc-500' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                }`}
              >
                {isValidating ? "AI IS CHECKING..." : "PUBLISH TO FEED"}
                {!isValidating && <Send size={20} />}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}