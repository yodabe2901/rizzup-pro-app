import React, { useState, useEffect, useCallback } from 'react';
import { getSheetsData as fetchRizzData } from './services/dataService';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Heart, 
  Zap, 
  Search as SearchIcon, 
  User,
  Settings,
  ChevronRight,
  Layers
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';

// --- IMPORTATION DE TOUS LES COMPOSANTS DU PROJET ---
import Home from './components/Home';
import Chat from './components/Chat';
import Library from './components/Library';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';
import Favorites from './pages/Favorites';
import Onboarding from './components/Onboarding';

// Définition de la séquence de navigation pour le balayage (Swipe)
const TABS = ['home', 'search', 'chat', 'profile'];

export default function App() {
  // --- ÉTATS DE L'APPLICATION ---
  const [activeTab, setActiveTab] = useState('home');
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [rizzMode, setRizzMode] = useState('SAVAGE');
  const [isLoaded, setIsLoaded] = useState(false);

  // --- CHARGEMENT INITIAL ET PERSISTANCE ---
  useEffect(() => {
    const initApp = async () => {
      try {
        // Récupération des données Google Sheets (Library)
        const data = await fetchRizzData(); 
        setRizzLibrary(Array.isArray(data) ? data : []);

        // Chargement des favoris depuis le cache du téléphone/navigateur
        const savedFavs = localStorage.getItem('rizz_favs');
        if (savedFavs) setFavorites(JSON.parse(savedFavs));

        // Vérification du statut de l'Onboarding
        const onboarded = localStorage.getItem('rizz_onboarded');
        if (!onboarded) setShowOnboarding(true);

        setIsLoaded(true);
      } catch (error) {
        console.error("App Initialization Error:", error);
        setRizzLibrary([]);
        setIsLoaded(true);
      }
    };
    initApp();
  }, []);

  // --- LOGIQUE DE NAVIGATION TACTILE (SWIPE) ---
  const handleSwipe = useCallback((direction) => {
    const currentIndex = TABS.indexOf(activeTab);
    if (direction === 'left' && currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      setActiveTab(TABS[currentIndex - 1]);
    }
  }, [activeTab]);

  // --- ACTIONS GLOBALES ---
  const toggleFavorite = (text) => {
    setFavorites(prev => {
      const isFav = prev.includes(text);
      const updated = isFav ? prev.filter(f => f !== text) : [...prev, text];
      localStorage.setItem('rizz_favs', JSON.stringify(updated));
      return updated;
    });
  };

  const completeOnboarding = () => {
    localStorage.setItem('rizz_onboarded', 'true');
    setShowOnboarding(false);
  };

  if (!isLoaded) return <div className="bg-black h-screen w-full" />;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* --- OVERLAY : ONBOARDING --- */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding key="onboarding-screen" onComplete={completeOnboarding} />
        )}
      </AnimatePresence>

      {/* --- BOUTON ZAP FLOTTANT ET MOBILE --- */}
      <motion.div 
        drag
        dragConstraints={{ top: -600, left: -160, right: 20, bottom: 0 }}
        dragElastic={0.1}
        className="fixed bottom-28 right-6 z-[110]"
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => setIsInstantOpen(true)}
          className="bg-blue-600 p-5 rounded-[24px] shadow-[0_15px_40px_rgba(37,99,235,0.4)] border border-blue-400/20 flex items-center justify-center cursor-pointer overflow-hidden group"
        >
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" 
          />
          <Zap size={28} fill="white" className="relative z-10 text-white" />
        </motion.button>
      </motion.div>

      {/* --- CONTENEUR PRINCIPAL --- */}
      <main className="max-w-md mx-auto h-screen relative overflow-hidden shadow-2xl shadow-blue-500/5">
        
        {/* SYSTÈME DE GESTES ET ANIMATIONS DE PAGES */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="h-full w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(e, { offset, velocity }) => {
              const swipeThreshold = 100;
              if (offset.x < -swipeThreshold) handleSwipe('left');
              else if (offset.x > swipeThreshold) handleSwipe('right');
            }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            {/* ROUTING DES PAGES */}
            {activeTab === 'home' && (
              <Home library={rizzLibrary} setTab={setActiveTab} />
            )}

            {activeTab === 'search' && (
              <Search library={rizzLibrary} />
            )}

            {activeTab === 'chat' && (
              <Chat 
                onFav={toggleFavorite} 
                favorites={favorites} 
                library={rizzLibrary}
                rizzMode={rizzMode}
              />
            )}

            {activeTab === 'favorites' && (
              <Favorites 
                favorites={favorites} 
                onFav={toggleFavorite} 
              />
            )}

            {activeTab === 'profile' && (
              <Profile 
                favorites={favorites} 
                library={rizzLibrary}
                setTab={setActiveTab}
                rizzMode={rizzMode}
                setRizzMode={setRizzMode}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* COMPOSANT MODAL INSTANTANÉ */}
        <InstantRizz 
          isOpen={isInstantOpen} 
          onClose={() => setIsInstantOpen(false)} 
          library={rizzLibrary}
        />
      </main>

      {/* --- BARRE DE NAVIGATION INFÉRIEURE (HAUTE DÉFINITION) --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/95 backdrop-blur-3xl border-t border-white/5 px-8 py-5 flex justify-between items-center z-[100] pb-10">
        
        <NavBtn 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          icon={<LayoutDashboard size={24}/>} 
          label="Feed"
        />
        
        <NavBtn 
          active={activeTab === 'search'} 
          onClick={() => setActiveTab('search')} 
          icon={<SearchIcon size={24}/>} 
          label="Search"
        />
        
        {/* Placeholder technique pour l'espace du bouton flottant */}
        <div className="w-10 h-10 pointer-events-none" />

        <NavBtn 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
          icon={<MessageSquare size={24}/>} 
          label="AI Chat"
        />
        
        <NavBtn 
          active={activeTab === 'profile' || activeTab === 'favorites'} 
          onClick={() => setActiveTab('profile')} 
          icon={<User size={24}/>} 
          label="You"
        />
        
      </nav>
    </div>
  );
}

/**
 * Composant de bouton de navigation optimisé
 */
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 outline-none ${
        active ? 'text-blue-500 scale-105' : 'text-zinc-600 hover:text-zinc-400'
      }`}
    >
      <div className="relative">
        {icon}
        {active && (
          <motion.div 
            layoutId="nav-aura"
            className="absolute inset-0 bg-blue-500/15 blur-xl rounded-full"
          />
        )}
      </div>
      
      <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>

      {active && (
        <motion.div 
          layoutId="active-pill"
          className="absolute -bottom-2 w-1 h-1 bg-blue-500 rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
}
