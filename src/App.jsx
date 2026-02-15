import React, { useState, useEffect } from 'react';
import { getSheetsData as fetchRizzData } from './services/dataService';
import { LayoutDashboard, MessageSquare, Heart, Settings, Zap, Search as SearchIcon, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// --- IMPORT DES COMPOSANTS ---
import Home from './components/Home';
import Chat from './components/Chat';
import Library from './components/Library';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';

// --- NOUVEAUX COMPOSANTS (V2) ---
import Favorites from './pages/Favorites';
import Onboarding from './components/Onboarding';

export default function App() {
  // États globaux existants
  const [activeTab, setActiveTab] = useState('home');
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isInstantOpen, setIsInstantOpen] = useState(false);

  // Nouveaux états V2
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [rizzMode, setRizzMode] = useState('SAVAGE'); // Mode par défaut

  // Initialisation des données et vérification Onboarding
  useEffect(() => {
    async function init() {
      try {
        const data = await fetchRizzData(); 
        if (data && Array.isArray(data)) {
          setRizzLibrary(data);
        } else {
          setRizzLibrary([]);
        }

        // Charger favoris
        const saved = localStorage.getItem('rizz_favs');
        if (saved) setFavorites(JSON.parse(saved));

        // Vérifier si c'est la première visite
        const hasSeenOnboarding = localStorage.getItem('rizz_onboarded');
        if (!hasSeenOnboarding) setShowOnboarding(true);

      } catch (error) {
        console.error("Initialization error:", error);
        setRizzLibrary([]);
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

  // Fin de l'onboarding
  const completeOnboarding = () => {
    localStorage.setItem('rizz_onboarded', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden">
      
      {/* ONBOARDING (S'affiche par-dessus tout si première visite) */}
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
      </AnimatePresence>

      <main className="max-w-md mx-auto h-screen relative overflow-hidden shadow-2xl shadow-blue-500/10">
        
        <AnimatePresence mode="wait">
          {/* ACCUEIL */}
          {activeTab === 'home' && (
            <Home key="home" library={rizzLibrary} setTab={setActiveTab} />
          )}

          {/* RECHERCHE */}
          {activeTab === 'search' && (
            <Search key="search" library={rizzLibrary} />
          )}

          {/* CHAT (Injecte le mode de Rizz choisi) */}
          {activeTab === 'chat' && (
            <Chat 
              key="chat" 
              onFav={toggleFavorite} 
              favorites={favorites} 
              library={rizzLibrary}
              rizzMode={rizzMode} 
            />
          )}

          {/* FAVORIS (Nouvelle Page) */}
          {activeTab === 'favorites' && (
            <Favorites 
              key="favorites"
              favorites={favorites} 
              onFav={toggleFavorite} 
            />
          )}

          {/* PROFILE / SETTINGS */}
          {activeTab === 'profile' && (
            <Profile 
              key="profile" 
              favorites={favorites} 
              library={rizzLibrary}
              rizzMode={rizzMode}
              setRizzMode={setRizzMode}
            />
          )}
        </AnimatePresence>

        {/* MODALE ACTION RAPIDE */}
        <InstantRizz 
          isOpen={isInstantOpen} 
          onClose={() => setIsInstantOpen(false)} 
          library={rizzLibrary}
        />

      </main>

      {/* --- BARRE DE NAVIGATION V2 --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-[100]">
        
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutDashboard size={24}/>} />
        
        {/* On a remplacé Search par Favorites ici pour un accès direct, ou on garde Search ? */}
        <NavBtn active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} icon={<Heart size={24}/>} />
        
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