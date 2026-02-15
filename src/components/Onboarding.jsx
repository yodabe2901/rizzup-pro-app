import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding({ onComplete }) {
  const steps = [
    { t: "RIZZMASTER AI", d: "L'IA qui transforme tes messages en feu.", c: "text-blue-500" },
    { t: "SCREENSHOT", d: "Envoie une capture d'écran, on te donne la réponse parfaite.", c: "text-white" },
    { t: "STRATÉGIE", d: "Apprends pourquoi ça marche, pas juste quoi dire.", c: "text-white" }
  ];
  const [current, setCurrent] = useState(0);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-8 text-center">
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <h1 className={`text-4xl font-black italic uppercase mb-4 ${steps[current].c}`}>{steps[current].t}</h1>
          <p className="text-zinc-400 text-lg">{steps[current].d}</p>
        </motion.div>
      </AnimatePresence>
      
      <button 
        onClick={() => current < steps.length - 1 ? setCurrent(c => c + 1) : onComplete()}
        className="mt-12 bg-blue-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest"
      >
        {current === steps.length - 1 ? "Start" : "Next"}
      </button>
    </div>
  );
}