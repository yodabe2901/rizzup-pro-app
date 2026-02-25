import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, Crown } from 'lucide-react';

// A dark cyberpunk‑styled progress bar that shows the user's current tier and
// animates smoothly whenever the `currentXP` or `requiredXP` props change.
// The component relies on `framer-motion` for the animation and explicitly
// imports all three icons from `lucide-react` (Zap, Flame, Crown) to avoid
// any ReferenceErrors.
export default function MasteryBar({ currentXP = 0, requiredXP = 1 }) {
  // progress normalized 0‑1
  const progress = Math.min(currentXP / requiredXP, 1);
  const progressPct = Math.round(progress * 100);

  const tiers = [
    { name: 'Beginner', icon: <Zap size={18} />, color: 'from-green-400 to-teal-400' },
    { name: 'Charmer', icon: <Flame size={18} />, color: 'from-pink-500 to-purple-600' },
    { name: 'Rizz Master', icon: <Crown size={18} />, color: 'from-yellow-400 to-orange-500' }
  ];

  // pick tier based on how far along the bar is; last tier wins when at 100%
  const tierIndex = Math.min(Math.floor(progress * tiers.length), tiers.length - 1);
  const currentTier = tiers[tierIndex];

  return (
    <div className="bg-black/80 p-6 rounded-2xl border border-pink-500 shadow-[0_0_25px_rgba(255,0,255,0.4)]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg text-neon-blue border border-white/10">
            {currentTier.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tier</span>
            <span className="text-2xl font-extrabold uppercase text-white tracking-tight">
              {currentTier.name}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
            XP
          </span>
          <span className="text-lg font-bold text-white">
            {currentXP.toLocaleString()} / {requiredXP.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="h-4 w-full bg-gray-900/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${currentTier.color} shadow-[0_0_15px_rgba(0,255,255,0.6)]`}
        />
      </div>
    </div>
  );
}
