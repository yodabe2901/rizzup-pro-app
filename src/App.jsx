import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Camera, Users, Search, User, Send, X, Flame, Sparkles, 
  RefreshCw, Settings, Shield, Bell, Zap, BookOpen, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient('https://njfuqcrtcfhkivzcgreb.supabase.co', 'sb_publishable_JXkhQVQqlM2CWqc9Q7xDxA_oVT2v1-1');

// --- DATABASE IA PAR CATÉGORIES ---
const RIZZ_DATA = {
  romantic: ["T'as pas un plan ? Je me suis perdu dans tes yeux.", "Tu es le 10 que je cherchais."],
  funny: ["Ton père est un voleur ? Parce qu'il a volé mon coeur.", "Je suis pas photographe, mais je nous imagine bien."],
  dark: ["Je ne crois pas au coup de foudre, mais pour toi je ferai une exception.", "On parie que tu vas me dire non ?"],
};

export default function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [showCamera, setShowCamera] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 2500); // Splash screen de 2.5s
  }, []);

  if (!isLoaded) return <SplashScreen />;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden">
      <main className="max-w-md mx-auto h-screen overflow-y-auto pb-32 hide-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'discover' && <RizzAI key="ai" />}
          {activeTab === 'feed' && <CommunityFeed key="feed" onOpenScanner={() => setShowCamera(true)} />}
          {activeTab === 'academy' && <RizzAcademy key="academy" />}
          {activeTab === 'account' && <ProfileSettings key="profile" />}
        </AnimatePresence>
      </main>

      <AnimatePresence>{showCamera && <RizzCamera onClose={() => setShowCamera(false)} />}</AnimatePresence>

      {/* Barre de Navigation Giga-App */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[30px] p-2 flex justify-between items-center shadow-2xl z-50">
        <NavBtn active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} icon={<Sparkles size={20}/>} label="IA" />
        <NavBtn active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={<Users size={20}/>} label="Feed" />
        <NavBtn active={activeTab === 'academy'} onClick={() => setActiveTab('academy')} icon={<BookOpen size={20}/>} label="Academy" />
        <NavBtn active={activeTab === 'account'} onClick={() => setActiveTab('account')} icon={<Settings size={20}/>} label="Settings" />
      </nav>
    </div>
  );
}

// --- 0. SPLASH SCREEN ---
function SplashScreen() {
  return (
    <div className="bg-black h-screen flex flex-col items-center justify-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="w-24 h-24 bg-blue-600 rounded-[30%] rotate-12 flex items-center justify-center shadow-[0_0_80px_rgba(37,99,235,0.5)]">
          <Zap size={50} className="text-white -rotate-12 fill-current" />
        </div>
      </motion.div>
      <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-3xl font-black italic tracking-tighter uppercase">RizzUp Pro</motion.h1>
      <div className="mt-4 flex gap-1">
        {[0,1,2].map(i => <motion.div key={i} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-2 h-2 bg-blue-500 rounded-full" />)}
      </div>
    </div>
  );
}

// --- 1. RIZZ AI (IA AMÉLIORÉE) ---
function RizzAI() {
  const [rizz, setRizz] = useState("Choisis un style et génère...");
  const [category, setCategory] = useState('romantic');

  const generate = () => {
    const list = RIZZ_DATA[category];
    setRizz(list[Math.floor(Math.random() * list.length)]);
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 pt-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black italic tracking-tighter">LABO IA</h1>
        <div className="bg-zinc-900 px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-blue-400">V4.2 PRO</div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['romantic', 'funny', 'dark'].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2 rounded-2xl text-xs font-bold uppercase transition-all ${category === cat ? 'bg-blue-600' : 'bg-zinc-900 text-zinc-500'}`}>{cat}</button>
        ))}
      </div>
      
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-10 rounded-[40px] mb-8 min-h-[250px] flex flex-col justify-center items-center text-center shadow-inner">
        <Sparkles className="text-blue-500 mb-6 opacity-30" size={40} />
        <p className="text-2xl font-semibold leading-tight italic">"{rizz}"</p>
      </div>

      <button onClick={generate} className="w-full bg-white text-black font-black py-6 rounded-[25px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-white/5">
        <RefreshCw size={22} /> GÉNÉRER LE RIZZ
      </button>
    </motion.div>
  );
}

// --- 2. COMMUNITY FEED ---
function CommunityFeed({ onOpenScanner }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => { fetchPosts(); }, []);
  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Live Feed</h2>
        <button onClick={onOpenScanner} className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-600/30 active:scale-90"><Camera size={24}/></button>
      </div>
      
      <div className="flex gap-3 mb-10 bg-zinc-900/80 p-3 rounded-3xl border border-white/5">
        <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Partage ton succès..." className="bg-transparent flex-1 p-2 outline-none text-sm" />
        <button onClick={async () => {
          await supabase.from('posts').insert([{ username: 'Rizzler', content: text }]);
          setText(""); fetchPosts();
        }} className="bg-white text-black p-3 rounded-2xl"><Send size={18}/></button>
      </div>

      <div className="space-y-6">
        {posts.map(p => (
          <div key={p.id} className="bg-zinc-900/30 border border-white/5 p-6 rounded-[35px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-500" />
              <span className="text-[10px] font-black uppercase text-zinc-500">{p.username}</span>
            </div>
            <p className="text-lg font-medium">"{p.content}"</p>
            <div className="flex gap-4 mt-4 opacity-30 text-xs font-bold uppercase"><span className="flex items-center gap-1"><Flame size={14}/> 12</span><span className="flex items-center gap-1"><Star size={14}/> Save</span></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- 3. RIZZ ACADEMY (NOUVELLE PAGE) ---
function RizzAcademy() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 pt-12">
      <h1 className="text-4xl font-black italic mb-8 uppercase tracking-tighter">Academy</h1>
      <div className="space-y-4">
        <AcademyCard title="Le Contact Visuel" desc="La règle des 3 secondes pour hypnotiser." color="bg-blue-600" />
        <AcademyCard title="Le Body Language" desc="Comment s'asseoir pour dominer l'espace." color="bg-purple-600" />
        <AcademyCard title="L'Humour Noir" desc="Prendre des risques sans se faire ban." color="bg-zinc-800" />
      </div>
    </motion.div>
  );
}

function AcademyCard({ title, desc, color }) {
  return (
    <div className={`${color} p-6 rounded-[30px] shadow-lg`}>
      <h3 className="font-black text-xl mb-1 uppercase italic">{title}</h3>
      <p className="text-white/70 text-sm italic">{desc}</p>
    </div>
  );
}

// --- 4. PROFILE & SETTINGS (NOUVELLE PAGE) ---
function ProfileSettings() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 pt-12">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-[35%] bg-zinc-800 border-2 border-blue-500 p-1">
          <div className="w-full h-full rounded-[30%] bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky')] bg-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-black italic uppercase">Rizzlord #001</h2>
          <p className="text-blue-500 text-xs font-bold tracking-widest uppercase">Membre Premium</p>
        </div>
      </div>

      <div className="space-y-3">
        <SettingItem icon={<Bell size={20}/>} label="Notifications" />
        <SettingItem icon={<Shield size={20}/>} label="Confidentialité" />
        <SettingItem icon={<User size={20}/>} label="Modifier le profil" />
        <div className="pt-8 opacity-20 text-[10px] text-center font-black uppercase tracking-[0.5em]">RizzUp Pro v4.2.0 - 2026</div>
      </div>
    </motion.div>
  );
}

function SettingItem({ icon, label }) {
  return (
    <div className="flex items-center justify-between bg-zinc-900/50 p-5 rounded-2xl border border-white/5">
      <div className="flex items-center gap-4">{icon} <span className="font-bold text-sm uppercase">{label}</span></div>
      <div className="w-10 h-5 bg-zinc-800 rounded-full border border-white/10" />
    </div>
  );
}

// --- MODULE CAMÉRA (SCANNER) ---
function RizzCamera({ onClose }) {
  const videoRef = useRef(null);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }).then(s => { if(videoRef.current) videoRef.current.srcObject = s; });
    return () => videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
  }, []);
  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="absolute h-full w-full object-cover opacity-80" />
      <div className="relative w-64 h-64 border-2 border-blue-500 rounded-full animate-pulse flex items-center justify-center text-blue-500 font-black italic">SCANNING...</div>
      <button onClick={onClose} className="absolute top-10 right-8 bg-white text-black p-4 rounded-full"><X/></button>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center p-3 rounded-[20px] transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-zinc-600 opacity-60'}`}>
      {icon}
      <span className={`text-[8px] font-black uppercase mt-1 tracking-tighter ${active ? 'block' : 'hidden'}`}>{label}</span>
    </button>
  );
}