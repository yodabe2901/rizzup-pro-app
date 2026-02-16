import React, { useState } from 'react';
import { auth, googleProvider, appleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { Chrome, Apple, Mail, Lock, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleGoogle = () => signInWithPopup(auth, googleProvider);
  const handleApple = () => signInWithPopup(auth, appleProvider);

  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { alert("Auth Error: " + err.message); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-sm mx-auto w-full space-y-10"
      >
        {/* LOGO SECTION */}
        <div className="text-center space-y-2">
          <div className="inline-block p-4 bg-blue-600 rounded-[24px] mb-4 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
            <Zap size={32} fill="white" />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Rizz<span className="text-blue-600">.OS</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Neural Dating Engine</p>
        </div>

        {/* SOCIAL METHODS */}
        <div className="grid gap-3">
          <button onClick={handleGoogle} className="w-full bg-white text-black h-14 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3 active:scale-95 transition-all">
            <Chrome size={18} /> Continue with Google
          </button>
          <button onClick={handleApple} className="w-full bg-zinc-900 text-white h-14 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3 border border-white/5 active:scale-95 transition-all">
            <Apple size={18} /> Continue with Apple
          </button>
        </div>

        <div className="relative py-2 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
          <span className="relative bg-black px-4 text-zinc-600 text-[8px] font-black uppercase tracking-widest">Digital ID Access</span>
        </div>

        {/* EMAIL FORM */}
        <form onSubmit={handleEmail} className="space-y-3">
          <div className="bg-zinc-900 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
            <Mail size={18} className="text-zinc-600" />
            <input 
              type="email" placeholder="EMAIL ADDRESS" 
              className="bg-transparent outline-none w-full text-xs font-bold uppercase"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="bg-zinc-900 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
            <Lock size={18} className="text-zinc-600" />
            <input 
              type="password" placeholder="PASSWORD" 
              className="bg-transparent outline-none w-full text-xs font-bold uppercase"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button className="w-full bg-blue-600 h-14 rounded-2xl font-black text-xs uppercase italic flex items-center justify-center gap-2 group">
            {isRegister ? 'Initialize Account' : 'Secure Login'}
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p 
          onClick={() => setIsRegister(!isRegister)}
          className="text-center text-zinc-600 text-[10px] font-black uppercase cursor-pointer hover:text-blue-500 transition-colors"
        >
          {isRegister ? "Already verified? Sign In" : "New operative? Create ID"}
        </p>
      </motion.div>
    </div>
  );
}