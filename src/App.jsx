import React, { useState, useEffect } from 'react';
import { fetchRizzData } from './services/ai';
import { LayoutDashboard, MessageSquare, BookOpen, Settings, Zap, Search as SearchIcon, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// --- IMPORT DES COMPOSANTS (Architecture modulaire) ---
import Home from './components/Home';
import Chat from './components/Chat';
import Library from './components/Library';
import Search from './components/Search'; // Nouvelle page
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
      try {
        const data = await fetchRizzData();
        setRizzLibrary(data || []);
        const saved = localStorage.getItem('rizz_favs');
        if (saved) setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error("Initialization error:", error);
      }
    }
    init();
  }, []);

  // Gestion des favoris
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
          {/* PAGE : ACCUEIL */}
          {activeTab === 'home' && (
            <Home key="home" library={rizzLibrary} setTab={setActiveTab} />
          )}

          {/* PAGE : RECHERCHE (Search) */}
          {activeTab === 'search' && (
            <Search key="search" library={rizzLibrary} />
          )}

          {/* PAGE : CHAT (IA Terminal) */}
          {activeTab === 'chat' && (
            <Chat key="chat" onFav={toggleFavorite} favorites={favorites} />
          )}

          {/* PAGE : LIBRARY (Database complète) */}
          {activeTab === 'library' && (
            <Library key="library" library={rizzLibrary} favorites={favorites} onFav={toggleFavorite} />
          )}

          {/* PAGE : PROFILE (À venir) */}
          {activeTab === 'profile' && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-700 font-black italic uppercase">
              <p className="text-xl">Profile Section</p>
              <p className="text-[10px] tracking-[0.3em] mt-2">Elite Status: Loading...</p>
            </div>
          )}
        </AnimatePresence>

        {/* COMPOSANT : INSTANT RIZZ (Action centrale Éclair) */}
        <InstantRizz isOpen={isInstantOpen} onClose={() => setIsInstantOpen(false)} />

      </main>

      {/* --- BARRE DE NAVIGATION (Style Minimaliste) --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-[100]">
        
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutDashboard size={24}/>} />
        
        <NavBtn active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<SearchIcon size={24}/>} />
        
        {/* BOUTON ÉCLAIR (Quick Action) */}
        <button 
          onClick={() => setIsInstantOpen(true)}
          className="relative -top-2 active:scale-75 transition-transform"
        >
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/30">
            <Zap size={22} fill="white" className="text-white" />
          </div>
        </button>

        <NavBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={24}/>} />
        
        <NavBtn active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<BookOpen size={24}/>} />
        
      </nav>
    </div>
  );
}

// Composant Interne pour les boutons de Nav
function NavBtn({ active, onClick, icon }) {
  return (
    <button 
      onClick={onClick} 
      className={`p-2 transition-all duration-300 ${active ? 'text-blue-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
    >
      {icon}
    </button>
  );
}