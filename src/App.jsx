import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Camera, Users, Search, User, Send, X, Flame, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONNEXION SUPABASE ---
const supabase = createClient(
  'https://njfuqcrtcfhkivzcgreb.supabase.co', 
  'sb_publishable_JXkhQVQqlM2CWqc9Q7xDxA_oVT2v1-1'
);

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showCamera, setShowCamera] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-blue-500/30">
      {/* Contenu Principal */}
      <main className="max-w-md mx-auto pb-32">
        {activeTab === 'feed' && <CommunityFeed onOpenScanner={() => setShowCamera(true)} />}
        {activeTab === 'discover' && <div className="p-12 text-center text-zinc-600 mt-20">Recherche de nouveaux Rizz... 🔍</div>}
        {activeTab === 'account' && <div className="p-12 text-center text-zinc-600 mt-20">Ton Profil Rizzlord 👑</div>}
      </main>

      {/* Caméra Overlay (Le Lourd) */}
      <AnimatePresence>
        {showCamera && <RizzCamera onClose={() => setShowCamera(false)} />}
      </AnimatePresence>

      {/* Barre de Navigation stylée */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[35px] p-2 flex justify-around items-center shadow-2xl z-40">
        <NavBtn active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} icon={<Search size={24}/>} label="Explore" />
        <NavBtn active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={<Users size={24}/>} label="Feed" />
        <NavBtn active={activeTab === 'account'} onClick={() => setActiveTab('account')} icon={<User size={24}/>} label="Profil" />
      </nav>
    </div>
  );
}

// --- COMPOSANT : FLUX DE LA COMMUNAUTÉ ---
function CommunityFeed({ onOpenScanner }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    // Ecoute en temps réel des nouveaux posts
    const subscription = supabase.channel('posts').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, fetchPosts).subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  }

  async function handleSend() {
    if (!text.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('posts').insert([{ username: 'Rizzler_' + Math.floor(Math.random()*1000), content: text }]);
    if (error) alert("Erreur: " + error.message);
    setText("");
    setLoading(false);
    fetchPosts();
  }

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent uppercase">Rizz Gram</h1>
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Community Feed</p>
        </div>
        <button onClick={onOpenScanner} className="bg-white text-black p-4 rounded-2xl active:scale-90 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <Camera size={24} strokeWidth={2.5} />
        </button>
      </header>

      {/* Input de post ultra-moderne */}
      <div className="mb-10 bg-zinc-900/50 border border-white/10 p-3 rounded-[24px] flex gap-3 focus-within:border-blue-500/50 transition-colors">
        <input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Balance ton meilleur Rizz..." 
          className="bg-transparent flex-1 outline-none text-sm px-2"
        />
        <button onClick={handleSend} disabled={loading} className="bg-blue-600 p-3 rounded-xl disabled:opacity-50">
          <Send size={18} />
        </button>
      </div>

      {/* Liste des posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            key={post.id} 
            className="bg-zinc-900/30 border border-white/5 p-5 rounded-[30px]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
              <span className="text-sm font-black text-zinc-300 tracking-tight">{post.username}</span>
            </div>
            <p className="text-lg font-medium leading-relaxed mb-4">"{post.content}"</p>
            <div className="flex gap-4 text-zinc-600">
               <button className="flex items-center gap-1 text-xs font-bold"><Flame size={16}/> 12</button>
               <button className="flex items-center gap-1 text-xs font-bold"><MessageCircle size={16}/> Répondre</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- COMPOSANT : CAMÉRA SCANNER (Le Lourd) ---
function RizzCamera({ onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        alert("Caméra bloquée ou non disponible");
        onClose();
      }
    }
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[100] flex flex-col">
      <button onClick={onClose} className="absolute top-10 right-8 z-[110] bg-white/10 p-4 rounded-full backdrop-blur-md"><X/></button>
      
      <div className="relative h-full w-full flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
        
        {/* Overlay de scan */}
        <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-blue-500/50 rounded-full animate-pulse relative">
            <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        <div className="absolute bottom-20 w-full text-center px-10">
          <h2 className="text-2xl font-black italic text-blue-500 mb-2 drop-shadow-lg">RIZZ SCANNER V1.0</h2>
          <p className="text-white/70 text-sm font-bold uppercase tracking-[0.2em]">Analyse du sujet en cours...</p>
        </div>
      </div>
    </motion.div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center p-3 rounded-3xl transition-all ${active ? 'bg-blue-600/10 text-blue-500' : 'text-zinc-600'}`}>
      {icon}
      <span className={`text-[9px] font-black uppercase mt-1 tracking-widest ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
  );
}