import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Copy, Check, Sparkles } from 'lucide-react';
import { generateRizzResponse } from '../services/ai';

export default function InstantRizz({ isOpen, onClose }) {
  const [line, setLine] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const getQuickLine = async () => {
    setIsLoading(true);
    setCopied(false);
    try {
      // On demande une ligne courte et impactante
      const res = await generateRizzResponse("Give me one legendary, short, high-status opening line or a clever comeback. No context needed, just the line.");
      setLine(res);
    } catch (e) {
      setLine("The Rizz-network is busy. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger une ligne dès l'ouverture
  React.useEffect(() => {
    if (isOpen) getQuickLine();
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(line);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Background flou */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Carte Magique */}
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-blue-500/30 p-8 rounded-[40px] shadow-[0_0_50px_rgba(37,99,235,0.2)] text-center"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40 border-[6px] border-black">
              <Zap size={32} fill="white" className="text-white" />
            </div>

            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>

            <h3 className="mt-6 text-blue-500 font-black italic uppercase tracking-widest text-xs mb-6">Instant Magic</h3>

            <div className="min-h-[100px] flex items-center justify-center">
              {isLoading ? (
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              ) : (
                <p className="text-xl font-bold italic text-white leading-tight">
                  "{line}"
                </p>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={getQuickLine}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={14} /> New
              </button>
              
              <button 
                onClick={copyToClipboard}
                className={`flex-1 ${copied ? 'bg-green-600' : 'bg-blue-600'} p-4 rounded-2xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-2`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}