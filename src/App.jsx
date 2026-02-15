import React, { useState, useEffect } from 'react';
import { getSheetsData as fetchRizzData } from './services/dataService';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Heart, 
  Zap, 
  Search as SearchIcon, 
  User,
  Settings
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- IMPORT DES COMPOSANTS ---
import Home from './components/Home';
import Chat from './components/Chat';
import Library from './components/Library';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';

// --- NOUVEAUX COMPOSANTS V2 ---
import Favorites from './pages/Favorites';
import Onboarding from './components/Onboarding';

export default function App() {
  // --- ÉTATS GLOBAUX ---
  const [activeTab, setActiveTab] = useState('home');
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [rizzMode, setRizzMode] = useState('SAVAGE');

  // --- INITIALISATION DES DONNÉES ET SÉCURITÉ ---
  useEffect(() => {
    async function init() {
      try {
        // 1. Récupération des données Sheets
        const data = await fetchRizzData(); 
        if (data && Array.isArray(data)) {
          setRizzLibrary(data);
        } else {
          setRizzLibrary([]);
        }

        // 2. Chargement des favoris depuis le stockage local
        const saved = localStorage.getItem('rizz_favs');
        if (saved) {
          try {
            setFavorites(JSON.parse(saved));
          } catch (e) {
            console.error("Erreur parsing favoris");
            setFavorites([]);
          }
        }

        // 3. Gestion du premier lancement (Onboarding)
        const hasSeenOnboarding = localStorage.getItem('rizz_onboarded');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }

      } catch (error) {
        console.error("Critical Initialization error:", error);
        setRizzLibrary([]);
      }
    }
    init();
  }, []);

  // --- GESTIONNAIRE DE FAVORIS ---
  const toggleFavorite = (text) => {
    const newFavs = favorites.includes(text) 
      ? favorites.filter(f => f !== text) 
      : [...favorites, text];
    setFavorites(newFavs);
    localStorage.setItem('rizz_favs', JSON.stringify(newFavs));
  };

  // --- FERMETURE ONBOARDING ---
  const completeOnboarding = () => {
    localStorage.setItem('rizz_onboarded', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden selection:bg-blue-600/40">
      
      {/* COUCHE ONBOARDING (Priorité haute) */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding key="onboard" onComplete={completeOnboarding} />
        )}
      </AnimatePresence>

      <main className="max-w-md mx-auto h-screen relative overflow-hidden shadow-2xl shadow-blue-500/10 border-x border-white/5">
        
        <AnimatePresence mode="wait">
          {/* NAVIGATION : ACCUEIL */}
          {activeTab === 'home' && (
            <Home 
              key="home" 
              library={rizzLibrary} 
              setTab={setActiveTab} 
            />
          )}

          {/* NAVIGATION : RECHERCHE */}
          {activeTab === 'search' && (
            <Search 
              key="search" 
              library={rizzLibrary} 
            />
          )}

          {/* NAVIGATION : CHAT (IA + VISION) */}
          {activeTab === 'chat' && (
            <Chat 
              key="chat" 
              onFav={toggleFavorite} 
              favorites={favorites} 
              library={rizzLibrary}
              rizzMode={rizzMode}
            />
          )}

          {/* NAVIGATION : FAVORIS (Via bouton Profile) */}
          {activeTab === 'favorites' && (
            <Favorites 
              key="favorites"
              favorites={favorites} 
              onFav={toggleFavorite} 
            />
          )}

          {/* NAVIGATION : PROFILE (Stats + Leveling + Settings) */}
          {activeTab === 'profile' && (
            <Profile 
              key="profile" 
              favorites={favorites} 
              library={rizzLibrary}
              setTab={setActiveTab}
              rizzMode={rizzMode}
              setRizzMode={setRizzMode}
            />
          )}
        </AnimatePresence>

        {/* MODALE : INSTANT RIZZ (Trigger central) */}
        <InstantRizz 
          isOpen={isInstantOpen} 
          onClose={() => setIsInstantOpen(false)} 
          library={rizzLibrary}
        />

      </main>

      {/* --- BARRE DE NAVIGATION (Design Premium) --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/95 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-[100] pb-8">
        
        <NavBtn 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          icon={<LayoutDashboard size={24}/>} 
          label="Home"
        />
        
        <NavBtn 
          active={activeTab === 'search'} 
          onClick={() => setActiveTab('search')} 
          icon={<SearchIcon size={24}/>} 
          label="Find"
        />
        
        {/* BOUTON D'ACTION CENTRAL (ZAP) */}
        <div className="relative -top-3">
          <button 
            onClick={() => setIsInstantOpen(true)}
            className="group relative active:scale-75 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-600/40 border border-blue-400/20">
              <Zap size={22} fill="white" className="text-white" />
            </div>
          </button>
        </div>

        <NavBtn 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
          icon={<MessageSquare size={24}/>} 
          label="Chat"
        />
        
        <NavBtn 
          active={activeTab === 'profile' || activeTab === 'favorites'} 
          onClick={() => setActiveTab('profile')} 
          icon={<User size={24}/>} 
          label="Profile"
        />
        
      </nav>
    </div>
  );
}

// COMPOSANT INTERNE : BOUTON DE NAVIGATION AVEC INDICATEUR
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`relative p-2 flex flex-col items-center gap-1 transition-all duration-300 ${
        active ? 'text-blue-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'
      }`}
    >
      <div className="relative">
        {icon}
        {active && (
          <motion.div 
            layoutId="nav-glow"
            className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full"
          />
        )}
      </div>
      
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="w-1 h-1 bg-blue-500 rounded-full mt-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </button>
  );
}