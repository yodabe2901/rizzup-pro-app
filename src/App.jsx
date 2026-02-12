import React, { useState, useEffect } from 'react';
import { fetchRizzData, generateRizzResponse } from './services/ai';
import { createClient } from '@supabase/supabase-js';
import { 
  MessageSquare, Users, BookOpen, Settings, 
  LayoutDashboard, Send, Zap, Trophy, X, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Configuration Supabase
const supabase = createClient(
  'https://njfuqcrtcfhkivzcgreb.supabase.co', 
  'sb_publishable_JXkhQVQqlM2CWqc9Q7xDxA_oVT2v1-1'
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // CHARGEMENT INITIAL DES DONNÉES DU SHEETS
  useEffect(() => {
    async function initApp() {
      try {
        const data = await fetchRizzData();
        setRizzLibrary(data || []);
      } catch (error) {
        console.error("Erreur Sheets:", error);
      } finally {
        setIsLoaded(true);
      }
    }
    initApp();
  }, []);

  if (!isLoaded) {
    return (
      <div className="bg-black h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-blue-500 font-black italic animate-pulse text-xl uppercase tracking-widest">
          RizzUp Pro Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden">
      <main className="max-w-md mx-auto h-screen overflow-y-auto pb-32 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeDashboard key="home" stats={{count: rizzLibrary.length}} setTab={setActiveTab} />}
          {activeTab === 'chat' && <RizzAIChat key="chat" />}
          {activeTab === 'academy' && <AcademyPage key="academy" library={rizzLibrary} />}
          {activeTab === 'feed' && <div className="p-12 text-center text-zinc-600 font-black italic pt-32 uppercase">Social Feed Coming Soon</div>}
          {activeTab === 'settings' && <div className="p-12 text-center text-zinc-600 font-black italic pt-32 uppercase">Profile Settings</div>}
        </AnimatePresence>
      </main>

      {/* Barre de Navigation Matrix */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[420px] bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[30px] p-2 flex justify-between items-center z-50 shadow-2xl">
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutDashboard size={18}/>} label="Home" />
        <NavBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={18}/>} label="IA Chat" />
        <NavBtn active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={<Users size={18}/>} label="Social" />
        <NavBtn active={activeTab === 'academy'} onClick={() => setActiveTab('academy')} icon={<BookOpen size={18}/>} label="Academy" />
        <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18}/>} label="Profil" />
      </nav>
    </div>
  );
}

// --- COMPOSANT : HOME DASHBOARD ---
function HomeDashboard({ stats, setTab }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 pt-12">
      <header className="mb-10">
        <h1 className="text-4xl font-black italic text-blue-500 uppercase tracking-tighter">Dashboard</h1>
        <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase">Intelligence Active</p>
      </header>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[35px] shadow-lg shadow-blue-900/20">
          <Trophy size={32} className="mb-4 text-yellow-300" />
          <h3 className="text-3xl font-black italic uppercase leading-none mb-2">{stats.count} Techniques</h3>
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Connectées via ton Sheets</p>
        </div>
      </div>

      <button onClick={() => setTab('chat')} className="w-full bg-zinc-900 border border-white/10 p-6 rounded-[30px] flex justify-between items-center hover:bg-zinc-800 transition-all">
        <div className="text-left">
          <h3 className="font-black italic uppercase text-lg">Lancer l'IA</h3>
          <p className="text-zinc-500 text-xs uppercase font-bold">Boostée par le Backend</p>
        </div>
        <ArrowRight className="text-blue-500" />
      </button>
    </motion.div>
  );
}

// --- COMPOSANT : RIZZ AI CHAT ---
function RizzAIChat() {
  const [messages, setMessages] = useState([{ role: 'ai', text: "Salut ! Je suis ton coach RizzUp. Je connais toutes les techniques de ton Sheets. Que veux-tu savoir ?" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await generateRizzResponse(userText);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Erreur de connexion avec l'IA." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 pb-40">
      <div className="flex-1 overflow-y-auto pt-10 space-y-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-[25px] text-sm ${m.role === 'ai' ? 'bg-zinc-900 border border-white/10' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-zinc-600 text-[10px] font-bold uppercase animate-pulse">L'IA réfléchit...</div>}
      </div>
      <div className="mt-4 flex gap-2 bg-zinc-900 border border-white/10 p-2 rounded-2xl">
        <input 
          value={input} 
          onChange={(e)=>setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pose une question..." 
          className="bg-transparent flex-1 p-3 outline-none text-sm" 
        />
        <button onClick={handleSend} className="bg-blue-600 p-3 rounded-xl"><Send size={20}/></button>
      </div>
    </div>
  );
}

// --- COMPOSANT : ACADEMY ---
function AcademyPage({ library }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-12">
      <h1 className="text-3xl font-black italic mb-2 uppercase tracking-tighter">Academy</h1>
      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8">Apprends tes propres techniques</p>
      
      <div className="space-y-4">
        {library.length > 0 ? library.map((item, i) => (
          <div key={i} className="bg-zinc-900/50 p-6 rounded-[30px] border border-white/5">
            <span className="text-blue-500 text-[9px] font-black uppercase tracking-widest">Technique #{i+1}</span>
            <p className="text-lg font-bold italic mt-1 text-white">"{item.RizzLine}"</p>
          </div>
        )) : (
          <div className="text-zinc-700 text-center pt-20 font-black italic uppercase">Aucune donnée dans le Sheets</div>
        )}
      </div>
    </motion.div>
  );
}

// --- BOUTON DE NAVIGATION ---
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center p-3 rounded-[20px] transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-zinc-600'}`}>
      {icon}
      <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">{label}</span>
    </button>
  );
}
