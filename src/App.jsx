import React, { useState, useEffect } from 'react';
import { fetchRizzData } from './services/ai';
import { LayoutDashboard, MessageSquare, BookOpen, Settings, Zap, Search as SearchIcon, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// --- IMPORT DES COMPOSANTS (Architecture modulaire) ---
import Home from './components/Home';
import Chat from './components/Chat';
import Library from './components/Library';
import Search from './components/Search';
import Profile from './components/Profile'; // La dernière pièce du puzzle
import InstantRizz from './components/InstantRizz';

export default function App() {
  // États globaux
  const [activeTab, setActiveTab] = useState('home');
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isInstantOpen, setIsInstantOpen] = useState(false);

  // Initialisation des données
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

  // Gestion des favoris (accessible partout)
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

          {/* PAGE : RECHERCHE */}
          {activeTab === 'search' && (
            <Search key="search" library={rizzLibrary} />
          )}

          {/* PAGE : CHAT (L'IA avec Vision) */}
          {activeTab === 'chat' && (
            <Chat key="chat" onFav={toggleFavorite} favorites={favorites} />
          )}

          {/* PAGE : LIBRARY */}
          {activeTab === 'library' && (
            <Library key="library" library={rizzLibrary} favorites={favorites} onFav={toggleFavorite} />
          )}

          {/* PAGE : PROFILE (Nouveau) */}
          {activeTab === 'profile' && (
            <Profile key="profile" favorites={favorites} library={rizzLibrary} />
          )}
        </AnimatePresence>

        {/* MODALE : INSTANT RIZZ (Activée par le bouton central) */}
        <InstantRizz isOpen={isInstantOpen} onClose={() => setIsInstantOpen(false)} />

      </main>

      {/* --- BARRE DE NAVIGATION (Style Minimaliste) --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-[100]">
        
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutDashboard size={24}/>} />
        
        <NavBtn active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<SearchIcon size={24}/>} />
        
        {/* BOUTON ÉCLAIR (Action centrale) */}
        <button 
          onClick={() => setIsInstantOpen(true)}
          className="relative -top-2 active:scale-75 transition-transform"
        >
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/30">
            <Zap size={22} fill="white" className="text-white" />
          </div>
        </button>

        <NavBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={24}/>} />
        
        <NavBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={24}/>} />
        
      </nav>
    </div>
  );
}

// Composant interne pour les boutons de navigation
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