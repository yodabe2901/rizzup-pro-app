import { analyzeCommentSentiment } from '../services/rizzAnalyzer';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Send, X, Flame, ShieldCheck, TrendingUp, 
  MessageSquare, Share2, Award, Zap, Sparkles, 
  Crown, Heart, Globe, User, Info, AlertCircle 
} from 'lucide-react';
import { validateRizz } from '../services/ai';

export default function Discover() {
  // --- ÉTAT DES POSTS (Initialisé avec plus de données) ---
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      text: "Are you a magician? Because whenever I look at you, everyone else disappears.", 
      author: "RizzGod_01", 
      likes: 1254, 
      verified: true,
      category: "Classic",
      timestamp: "2m ago",
      isLiked: false 
    },
    { 
      id: 2, 
      text: "I'm not a photographer, but I can definitely picture us together.", 
      author: "SmoothOperator", 
      likes: 842, 
      verified: false,
      category: "Smooth",
      timestamp: "15m ago",
      isLiked: false 
    },
    { 
      id: 3, 
      text: "Is your name Google? Because you have everything I’m searching for.", 
      author: "TechRizz", 
      likes: 2403, 
      verified: true,
      category: "Funny",
      timestamp: "1h ago",
      isLiked: true 
    }
  ]);

  // --- ÉTATS D'INTERFACE ---
  const [isPosting, setIsPosting] = useState(false);
  const [newRizz, setNewRizz] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Global");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const filters = ["Global", "Trending", "Verified", "Recent"];

  // --- LOGIQUE DES LIKES (Avec animation) ---
  const handleLike = (id) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked 
        };
      }
      return p;
    }));
  };

  // --- PUBLICATION AVEC VALIDATION IA PROFONDE ---
  const handlePublish = async () => {
    if (!newRizz.trim()) return;
    if (newRizz.length < 10) {
      triggerToast("Line is too short for the database.");
      return;
    }
    
    setIsValidating(true);
    try {
      const isValid = await validateRizz(newRizz);
      
      if (isValid) {
        const newPost = {
          id: Date.now(),
          text: newRizz,
          author: "You",
          likes: 0,
          verified: false,
          category: "User Submission",
          timestamp: "Just now",
          isLiked: false
        };
        
        setPosts([newPost, ...posts]);
        setNewRizz("");
        setIsPosting(false);
        triggerToast("Rizz deployed successfully! 🚀");
      } else {
        triggerToast("AI Rejected: Weak Rizz energy detected. ⚠️");
      }
    } catch (error) {
      triggerToast("Kernel Error: AI connection lost.");
    }
    setIsValidating(false);
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-6 bg-black min-h-screen pb-40 text-white font-sans overflow-x-hidden">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 flex justify-between items-start mb-12">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Globe size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Network Feed</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter leading-none">
            DIS<span className="text-zinc-800">COVER</span>
          </h1>
        </motion.div>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPosting(true)}
          className="bg-white text-black p-5 rounded-[2rem] shadow-[0_20px_40px_rgba(255,255,255,0.15)] relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus size={28} strokeWidth={3} className="relative z-10" />
        </motion.button>
      </header>

      {/* --- FILTERS SCROLL --- */}
      <section className="relative z-10 flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
              ${activeFilter === f 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                : 'bg-zinc-900/50 border-white/5 text-zinc-500'}`}
          >
            {f}
          </button>
        ))}
      </section>

      {/* --- LIVE FEED --- */}
      <div className="relative z-10 space-y-8">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.div 
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group hover:border-white/10 transition-all shadow-2xl"
            >
              {/* Card Badge */}
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={80} fill="currentColor" />
              </div>

              {/* Author & Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/5">
                    <User size={18} className="text-zinc-500" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white uppercase tracking-tighter">@{post.author}</span>
                      {post.verified && <ShieldCheck size={14} className="text-blue-500" fill="currentColor" fillOpacity={0.2} />}
                    </div>
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{post.timestamp}</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                   <span className="text-[8px] font-black text-zinc-500 uppercase">{post.category}</span>
                </div>
              </div>
              
              {/* Content */}
              <blockquote className="relative mb-8">
                <Sparkles className="absolute -top-4 -left-4 text-blue-500/20" size={32} />
                <p className="text-3xl font-black italic leading-[1.1] tracking-tight text-white pr-4">
                  "{post.text}"
                </p>
              </blockquote>
              
              {/* Interaction Bar */}
              <div className="flex justify-between items-center border-t border-white/5 pt-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all
                      ${post.isLiked ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                  >
                    <Flame size={20} fill={post.isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                    <span className="font-black text-sm">{post.likes.toLocaleString()}</span>
                  </button>

                  <button className="p-2.5 bg-white/5 text-zinc-600 rounded-2xl hover:text-white transition-colors">
                    <MessageSquare size={20} />
                  </button>
                </div>

                <button className="p-2.5 bg-white/5 text-zinc-600 rounded-2xl hover:text-blue-500 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- MODAL DE PUBLICATION (Ultra-moderne) --- */}
      <AnimatePresence>
        {isPosting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-end sm:items-center justify-center p-4 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-zinc-950 w-full max-w-lg p-10 rounded-[4rem] border border-white/10 shadow-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Award size={150} />
              </div>

              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase">Rizz Submission</h2>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Evaluation by AI Coach v4.0</p>
                </div>
                <button 
                  onClick={() => setIsPosting(false)}
                  className="p-3 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="relative mb-8">
                <textarea 
                  value={newRizz}
                  onChange={(e) => setNewRizz(e.target.value)}
                  placeholder="Type your secret weapon here..."
                  className="w-full bg-black/50 border border-white/5 rounded-[2.5rem] p-8 h-48 outline-none focus:border-blue-600/50 text-xl font-medium transition-all resize-none placeholder:text-zinc-800"
                />
                <div className="absolute bottom-6 right-8 text-[10px] font-black text-zinc-700">
                  {newRizz.length} / 280
                </div>
              </div>

              <div className="flex gap-4 mb-8 bg-blue-600/5 p-4 rounded-3xl border border-blue-500/10">
                <AlertCircle size={20} className="text-blue-500 shrink-0" />
                <p className="text-[10px] leading-relaxed text-zinc-400 font-medium">
                  Your submission will be analyzed for <span className="text-blue-400">creativity</span>, <span className="text-blue-400">length</span>, and <span className="text-blue-400">originality</span>. Weak or offensive content is automatically purged.
                </p>
              </div>
              
              <button 
                onClick={handlePublish}
                disabled={isValidating}
                className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all
                  ${isValidating 
                    ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' 
                    : 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95'}`}
              >
                {isValidating ? (
                  <>
                    <div className="w-5 h-5 border-4 border-zinc-700 border-t-white rounded-full animate-spin" />
                    Checking Bio-Metrics...
                  </>
                ) : (
                  <>
                    Deploy Rizz <Send size={20} strokeWidth={3} />
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <Info size={18} className="text-blue-500" />
            <span className="text-xs font-black uppercase tracking-widest">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER LOGS --- */}
      <footer className="mt-20 opacity-20 flex flex-col items-center gap-4">
        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-white to-transparent" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em]">RizzUp Global Network // Verified Feed</p>
      </footer>

    </div>
  );
}