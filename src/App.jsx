import React, { useState, useEffect } from 'react';
import { fetchRizzData } from './services/ai';
import { LayoutDashboard, MessageSquare, BookOpen, Settings, Zap, Search, Clapperboard, User, PlusSquare } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// --- IMPORT DES COMPOSANTS ---
import Home from './components/Home';
import Chat from './components/Chat';
import Library from './components/Library';
import InstantRizz from './components/InstantRizz';

export default function App() {
  // États de l'application
  const [activeTab, setActiveTab] = useState('home');
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isInstantOpen, setIsInstantOpen] = useState(false);

  // Initialisation (Data + LocalStorage)
  useEffect(() => {
    async function init() {
      const data = await fetchRizzData();
      setRizzLibrary(data || []);
      const saved = localStorage.getItem('rizz_favs');
      if (saved) setFavorites(JSON.parse(saved));
    }
    init();
  }, []);

  // Logique des favoris
  const toggleFavorite = (text) => {
    const newFavs = favorites.includes(text) 
      ? favorites.filter(f => f !== text) 
      : [...favorites, text];
    setFavorites(newFavs);
    localStorage.setItem('rizz_favs', JSON.stringify(newFavs));
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden">
      <main className="max-w-md mx-auto h-screen relative overflow-hidden shadow-2xl shadow-blue-500/10">
        
        <AnimatePresence mode="wait">
          {/* PAGE ACCUEIL (Style Instagram) */}
          {activeTab === 'home' && (
            <Home key="home" library={rizzLibrary} />
          )}

          {/* PAGE CHAT (IA + Vision) */}
          {activeTab === 'chat' && (
            <Chat key="chat" onFav={toggleFavorite} favorites={favorites} />
          )}

          {/* PAGE LIBRARY (Database) */}
          {activeTab === 'library' && (
            <Library key="library" library={rizzLibrary} favorites={favorites} onFav={toggleFavorite} />
          )}

          {/* PAGE PROFILE (Placeholder) */}
          {activeTab === 'profile' && (
            <div className="flex items-center justify-center h-full text-zinc-500 font-bold uppercase italic">
              User Profile @yodabe2901
            </div>
          )}
        </AnimatePresence>

        {/* COMPOSANT INSTANT RIZZ (Pop-up Éclair) */}
        <InstantRizz isOpen={isInstantOpen} onClose={() => setIsInstantOpen(false)} />

      </main>

      {/* --- BARRE DE NAVIGATION (Style Instagram) --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black border-t border-white/10 px-6 py-3 flex justify-between items-center z-[100]">
        
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutDashboard size={26}/>} />
        
        <NavBtn active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<Search size={26}/>} />
        
        {/* BOUTON CENTRAL ACTION (L'Éclair Magique) */}
        <button 
          onClick={() => setIsInstantOpen(true)}
          className="p-1 active:scale-75 transition-transform"
        >
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Zap size={22} fill="white" className="text-white" />
          </div>
        </button>

        <NavBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={26}/>} />
        
        <NavBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={26}/>} />
        
      </nav>
    </div>
  );
}

// Composant pour les icônes de la barre Instagram
function NavBtn({ active, onClick, icon }) {
  return (
    <button 
      onClick={onClick} 
      className={`p-2 transition-all duration-200 ${active ? 'text-white scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      {icon}
    </button>
  );
}