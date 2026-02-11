import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Camera, Users, MessageSquare, User, Send, X, Flame, Sparkles, 
  RefreshCw, Settings, BookOpen, Zap, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient('https://njfuqcrtcfhkivzcgreb.supabase.co', 'sb_publishable_JXkhQVQqlM2CWqc9Q7xDxA_oVT2v1-1');

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [showCamera, setShowCamera] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 2000);
  }, []);

  if (!isLoaded) return <SplashScreen />;

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      <main className="max-w-md mx-auto h-screen overflow-y-auto pb-32 hide-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && <RizzAIChat key="chat" />}
          {activeTab === 'feed' && <CommunityFeed key="feed" onOpenScanner={() => setShowCamera(true)} />}
          {activeTab === 'academy' && <AcademyPage key="academy" />}
          {activeTab === 'settings' && <SettingsPage key="settings" />}
        </AnimatePresence>
      </main>

      <AnimatePresence>{showCamera && <RizzCamera onClose={() => setShowCamera(false)} />}</AnimatePresence>

      {/* Navigation RizzUp */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-[30px] p-2 flex justify-between items-center z-50 shadow-2xl">
        <NavBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={20}/>} label="AI Chat" />
        <NavBtn active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={<Users size={20}/>} label="Feed" />
        <NavBtn active={activeTab === 'academy'} onClick={() => setActiveTab('academy')} icon={<BookOpen size={20}/>} label="Academy" />
        <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20}/>} label="Profil" />
      </nav>
    </div>
  );
}

// --- 1. CHAT AVEC L'IA (RETOUR EN FORCE) ---
function RizzAIChat() {
  const [messages, setMessages] = useState([{ role: 'ai', text: "Yo ! Je suis ton coach RizzUp. Envoie-moi une situation, je te donne la punchline." }]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulation IA
    setTimeout(() => {
      setMessages([...newMessages, { role: 'ai', text: "Pas mal, mais essaie ça : 'Est-ce que tu as un double des clés ? Parce que tu viens de t'installer dans ma tête sans permission.'" }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <h1 className="text-3xl font-black italic mb-6 pt-6">RIZZUP AI</h1>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pt-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${m.role === 'ai' ? 'bg-zinc-800 rounded-bl-none' : 'bg-blue-600 rounded-br-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 bg-zinc-900 p-2 rounded-2xl border border-white/10 mb-20">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Décris la situation..." className="bg-transparent flex-1 p-2 outline-none" />
        <button onClick={handleSend} className="bg-white text-black p-3 rounded-xl"><Send size={18}/></button>
      </div>
    </div>
  );
}

// --- 2. COMMUNITY FEED ---
function CommunityFeed({ onOpenScanner }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    supabase.from('posts').select('*').order('created_at', { ascending: false }).then(({data}) => setPosts(data || []));
  }, []);

  return (
    <div className="p-6 pt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black italic uppercase">Social</h2>
        <button onClick={onOpenScanner} className="bg-blue-600 p-4 rounded-2xl"><Camera size={24}/></button>
      </div>
      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="bg-zinc-900/50 p-5 rounded-[25px] border border-white/5">
            <p className="text-blue-500 text-[10px] font-black mb-1">@{p.username}</p>
            <p className="text-lg">"{p.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- AUTRES PAGES (À REMPLIR DEMAIN) ---
function AcademyPage() { return <div className="p-8 pt-20 font-black text-2xl italic text-center text-zinc-700 underline">SECTION ACADEMY EN COURS...</div>; }
function SettingsPage() { return <div className="p-8 pt-20 font-black text-2xl italic text-center text-zinc-700 underline">PROFIL RIZZUP PRO v1.0</div>; }

function SplashScreen() {
  return <div className="bg-black h-screen flex flex-col items-center justify-center">
    <Zap size={60} className="text-blue-600 animate-bounce fill-current" />
    <h1 className="text-4xl font-black italic mt-4 tracking-tighter uppercase">RizzUp Pro</h1>
  </div>;
}

function RizzCamera({ onClose }) {
  return <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
    <div className="w-64 h-64 border-4 border-dashed border-blue-500 rounded-full animate-spin" />
    <p className="mt-8 font-black italic text-blue-500">CAMERA ENGINE READY</p>
    <button onClick={onClose} className="absolute top-10 right-8 bg-white text-black p-4 rounded-full"><X/></button>
  </div>;
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white' : 'text-zinc-600'}`}>
      {icon}
      <span className="text-[9px] font-black uppercase mt-1">{label}</span>
    </button>
  );
}