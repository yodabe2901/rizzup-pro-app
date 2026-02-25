import React, { useState } from 'react';
import { Trophy, Medal, Search, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

// Simple leaderboard component that accepts an array of user objects
// with { username, xp } and displays them ordered by XP. Top three are
// decorated with special icons. The entire list and items have a
// glassmorphism look (dark frosted glass).

export default function Leaderboard({ users = [] }) {
  const [filter, setFilter] = useState('');

  const filtered = users
    .filter((u) => u.username.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.xp - a.xp);

  const getIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown size={18} className="text-yellow-400" />;
      case 1:
        return <Trophy size={18} className="text-blue-400" />;
      case 2:
        return <Medal size={18} className="text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-black/60 backdrop-blur-md rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black uppercase text-white flex items-center gap-2">
          <Trophy /> Leaderboard
        </h2>
        <div className="relative">
          <Search size={20} className="text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full bg-white/10 text-white placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      <ul className="space-y-2">
        {filtered.map((u, idx) => (
          <motion.li
            key={u.username}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-xl"
          >
            <div className="flex items-center gap-3">
              {getIcon(idx)}
              <span className="font-bold text-white">{u.username}</span>
            </div>
            <span className="text-white font-mono">{u.xp.toLocaleString()} XP</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
