import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Crown, ChevronRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function Account() {
  // États pour la gestion du profil et des posts (déplacés ici pour être valides)
  const [posts, setPosts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newLine, setNewLine] = useState('');

  const { userData } = useUser();

  // Fonction pour poster une nouvelle ligne
  const handlePost = () => {
    if (!newLine.trim()) return;
    const newPost = {
      id: posts.length + 1,
      author: "You",
      line: newLine,
      score: "New",
      fires: "0"
    };
    setPosts([newPost, ...posts]);
    setNewLine('');
    setShowAdd(false);
  };

  const stats = [
    { label: 'Lines Generated', value: '128', icon: <Zap size={20} className="text-yellow-400" /> },
    { label: 'Success Rate', value: '92%', icon: <Star size={20} className="text-blue-400" /> },
  ];

  return (
    <div className="p-6 bg-black min-h-screen pb-32 text-white">
      {/* Profile Header */}
      <div className="flex flex-col items-center mt-8 mb-10">
        <div className="relative">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
          >
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
               <span className="text-4xl font-black italic">YB</span>
            </div>
          </motion.div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl border-4 border-black">
            <Crown size={16} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-black mt-4 tracking-tight">Yodabe_2901</h2>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-tighter">Certified Rizzlord • Level 14</p>
      </div>

      {/* Rizz Level Bar */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Rizz Experience</span>
          <span className="text-xs font-black text-blue-500">
            {userData ? `${userData.xp || 0} / 3,000 XP` : '0 / 3,000 XP'}
          </span>
        </div>
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5 }}
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/5 p-5 rounded-3xl">
            <div className="mb-3">{stat.icon}</div>
            <div className="text-2xl font-black">{stat.value}</div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        {['Saved Pick-up Lines', 'AI Settings', 'Subscription Plan'].map((item) => (
          <button key={item} className="w-full bg-zinc-900/30 hover:bg-zinc-900 border border-white/5 p-5 rounded-2xl flex justify-between items-center transition-all group">
            <span className="font-bold text-sm text-zinc-300 group-hover:text-white">{item}</span>
            <ChevronRight size={18} className="text-zinc-600 group-hover:text-blue-500" />
          </button>
        ))}
      </div>
    </div>
  );
}