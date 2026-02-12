import React, { useState, useEffect, useRef } from 'react';
import { fetchRizzData, generateRizzResponse } from './services/ai';
import { 
  MessageSquare, Users, BookOpen, Settings, 
  LayoutDashboard, Send, Zap, Trophy, X, ArrowRight, Bot, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function initApp() {
      try {
        const data = await fetchRizzData();
        setRizzLibrary(data || []);
      } catch (error) { console.error(error); }
      finally { setIsLoaded(true); }
    }
    initApp();
  }, []);

  if (!isLoaded) return (
    <div className="bg-black h-screen flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h1 className="text-blue-500 font-black italic animate-pulse text-2xl uppercase tracking-[0.2em]">RizzUp Engine</h1>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans overflow-hidden">
      <main className="max-w-md mx-auto h-screen relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeDashboard key="home" stats={{count: rizzLibrary.length}} setTab={setActiveTab} />}
          {activeTab === 'chat' && <RizzAIChat key="chat" />}
          {activeTab === 'academy' && <AcademyPage key="academy" library={rizzLibrary} />}
          {activeTab === 'feed' && <ComingSoon title="Social Feed" />}
          {activeTab === 'settings' && <ComingSoon title="Paramètres" />}
        </AnimatePresence>
      </main>

      {/* Barre de Navigation Premium */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex justify-between items-center z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutDashboard size={20}/>} label="Home" />
        <NavBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={20}/>} label="IA Chat" />
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40 -mt-10 border-4 border-black">
            <Zap size={24} fill="white" />
        </div>
        <NavBtn active={activeTab === 'academy'} onClick={() => setActiveTab('academy')} icon={<BookOpen size={20}/>} label="Academy" />
        <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20}/>} label="Profil" />
      </nav>
    </div>
  );
}

// --- CHAT IA AVEC AUTO-SCROLL ---
function RizzAIChat() {
  const [messages, setMessages] = useState([{ role: 'ai', text: "Salut ! Je suis ton coach RizzUp. Je connais toutes les techniques de ton Sheets. Que veux-tu savoir ?" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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
      setMessages(prev => [...prev, { role: 'ai', text: "Erreur de connexion..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="p-6 pt-12 border-b border-white/5 bg-black/50 backdrop-blur-md z-10">
        <h2 className="text-xl font-black italic uppercase text-blue-500">Rizz AI Coach</h2>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Llama 3.3 Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pt-4 pb-40">
        {messages.map((m, i) => (
          <motion.div initial={{ opacity: 0, x: m.role === 'ai' ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} key={i} 
            className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} items-end gap-2`}>
            {m.role === 'ai' && <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10"><Bot size={16} className="text-blue-500"/></div>}
            <div className={`max-w-[80%] p-4 rounded-[22px] text-sm leading-relaxed shadow-xl ${m.role === 'ai' ? 'bg-zinc-900 border border-white/10 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
              {m.text}
            </div>
            {m.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center border border-blue-400/30"><User size={16}/></div>}
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-2 p-4 bg-zinc-900/50 w-20 rounded-full justify-center animate-pulse">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full delay-75"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full delay-150"></div>
          </div>
        )}
      </div>

      <div className="absolute bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
        <div className="flex gap-2 bg-zinc-900/90 border border-white/10 p-2 rounded-[24px] backdrop-blur-xl shadow-2xl">
          <input 
            value={input} onChange={(e)=>setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écris ton message..." 
            className="bg-transparent flex-1 p-3 outline-none text-sm placeholder:text-zinc-600 font-medium" 
          />
          <button onClick={handleSend} className="bg-blue-600 text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/30">
            <Send size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD ---
function HomeDashboard({ stats, setTab }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-16 h-full overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-4xl font-black italic text-white uppercase leading-none">RizzUp<span className="text-blue-600 underline">Pro</span></h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Niveau : Alpha 1.0</p>
        </div>
        <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
            <Trophy size={20} className="text-yellow-500" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-8 rounded-[40px] mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform underline"><Zap size={100} /></div>
        <h3 className="text-4xl font-black italic mb-2">{stats.count}</h3>
        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Lignes de Rizz chargées</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="XP" val="1.2k" />
        <StatCard label="Rank" val="#12" />
      </div>

      <button onClick={() => setTab('chat')} className="w-full bg-white text-black p-6 rounded-[30px] flex justify-between items-center font-black italic uppercase group hover:bg-blue-600 transition-all hover:text-white">
        <span>Ouvrir le terminal IA</span>
        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
      </button>
    </motion.div>
  );
}

function AcademyPage({ library }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-16 h-full overflow-y-auto no-scrollbar pb-40">
      <h2 className="text-3xl font-black italic uppercase mb-8 border-l-4 border-blue-600 pl-4">Academy</h2>
      <div className="space-y-4">
        {library.map((item, i) => (
          <div key={i} className="bg-zinc-900 border border-white/5 p-6 rounded-[28px] hover:border-blue-500/50 transition-colors">
            <div className="flex justify-between mb-2">
                <span className="text-blue-600 text-[10px] font-black uppercase tracking-tighter">Technique #{i+1}</span>
            </div>
            <p className="text-lg font-bold italic">"{Object.values(item)[0]}"</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StatCard({ label, val }) {
    return (
        <div className="bg-zinc-900 border border-white/5 p-5 rounded-[28px]">
            <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">{label}</p>
            <p className="text-xl font-black italic">{val}</p>
        </div>
    )
}

function ComingSoon({ title }) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/10 opacity-20"><Zap size={40}/></div>
            <h2 className="text-2xl font-black italic uppercase text-zinc-700">{title}</h2>
            <p className="text-zinc-800 text-[10px] font-bold uppercase mt-2">Module en cours de déploiement</p>
        </div>
    )
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center p-3 rounded-[24px] transition-all duration-500 ${active ? 'text-white' : 'text-zinc-500 opacity-50'}`}>
      {icon}
      <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">{label}</span>
    </button>
  );
}
