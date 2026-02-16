import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getSheetsData as fetchRizzData } from './services/dataService';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Heart, 
  Zap, 
  Search as SearchIcon, 
  User,
  Settings,
  Sparkles,
  Shield,
  Layers,
  ZapOff,
  Bell,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- COMPOSANTS INTERNES ---
import Home from './components/Home';
import Chat from './components/Chat';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';
import Favorites from './pages/Favorites';
import Onboarding from './components/Onboarding';

/**
 * CONFIGURATION DU SYSTÈME
 */
const TABS = ['home', 'search', 'chat', 'profile'];
const ANIM_DURATION = 0.4;

export default function App() {
  // --- ÉTATS DE NAVIGATION ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); 

  // --- ÉTATS DE DONNÉES ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [apiError, setApiError] = useState(false);

  // --- ÉTATS INTERFACE ---
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notification, setNotification] = useState({ show: false, msg: "" });

  // --- OPTION : BOUTON ZAP FLOTTANT ---
  const [showFloatingZap, setShowFloatingZap] = useState(() => {
    try {
      const saved = localStorage.getItem('rizz_zap_visible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch { return true; }
  });

  /**
   * INITIALISATION CRITIQUE
   * Charge les données et gère les délais pour éviter l'écran noir
   */
  useEffect(() => {
    const bootstrap = async () => {
      console.log("🚀 Rizz OS: Initializing...");
      try {
        // 1. Favoris & Cache
        const cached = localStorage.getItem('rizz_favs');
        if (cached) setFavorites(JSON.parse(cached));

        // 2. Onboarding check
        if (!localStorage.getItem('rizz_onboarded')) {
          setShowOnboarding(true);
        }

        // 3. API Fetch
        const data = await fetchRizzData();
        if (data && Array.isArray(data)) {
          setRizzLibrary(data);
        } else {
          setApiError(true);
        }
      } catch (err) {
        console.error("❌ Rizz OS Error:", err);
        setApiError(true);
      } finally {
        // Temps de sécurité pour laisser React monter les composants
        setTimeout(() => {
          setIsReady(true);
          console.log("✅ Rizz OS: Interface Ready");
        }, 1200);
      }
    };
    bootstrap();
  }, []);

  /**
   * NAVIGATION PAR BALAYAGE (SWIPE)
   */
  const handleSwipe = useCallback((swipeDir) => {
    const currentIndex = TABS.indexOf(activeTab);
    if (swipeDir === 'left' && currentIndex < TABS.length - 1) {
      setDirection(1);
      setActiveTab(TABS[currentIndex + 1]);
    } else if (swipeDir === 'right' && currentIndex > 0) {
      setDirection(-1);
      setActiveTab(TABS[currentIndex - 1]);
    }
  }, [activeTab]);

  /**
   * LOGIQUE DES FAVORIS
   */
  const handleFavorite = (text) => {
    setFavorites(prev => {
      const isFav = prev.includes(text);
      const nextFavs = isFav ? prev.filter(f => f !== text) : [...prev, text];
      localStorage.setItem('rizz_favs', JSON.stringify(nextFavs));
      
      // Petit feedback visuel
      setNotification({ show: true, msg: isFav ? "Removed" : "Saved!" });
      setTimeout(() => setNotification({ show: false, msg: "" }), 2000);
      
      return nextFavs;
    });
  };

  /**
   * TOGGLE DU BOUTON FLOTTANT
   */
  const toggleZapDisplay = () => {
    const nextState = !showFloatingZap;
    setShowFloatingZap(nextState);
    localStorage.setItem('rizz_zap_visible', JSON.stringify(nextState));
  };

  /**
   * SPLASH SCREEN (Affiché tant que isReady est faux)
   */
  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[999]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-blue-600 mb-6"
        >
          <Zap size={60} fill="currentColor" />
        </motion.div>
        <p className="text-white text-[10px] font-black tracking-[0.8em] uppercase italic animate-pulse">
          Rizz OS Loading
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none">
      
      {/* --- NOTIFICATIONS --- */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 30 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[500] bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full flex items-center gap-2 shadow-2xl"
          >
            <CheckCircle2 size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold uppercase">{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ONBOARDING --- */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding key="onboard" onComplete={() => {
            localStorage.setItem('rizz_onboarded', 'true');
            setShowOnboarding(false);
          }} />
        )}
      </AnimatePresence>

      {/* --- BOUTON ZAP FLOTTANT (DESIGN PREMIUM) --- */}
      <AnimatePresence>
        {showFloatingZap && (
          <motion.div 
            drag
            dragConstraints={{ top: -600, left: -180, right: 20, bottom: 0 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.8 }}
            className="fixed bottom-36 right-6 z-[120]"
          >
            <button 
              onClick={() => setIsInstantOpen(true)}
              className="bg-gradient-to-tr from-blue-700 to-blue-500 p-5 rounded-[26px] shadow-[0_15px_45px_rgba(37,99,235,0.4)] border border-white/10 group"
            >
              <Zap size={30} fill="white" className="group-active:scale-110 transition-transform" />
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-white rounded-[26px]"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENEUR PRINCIPAL --- */}
      <main className="max-w-md mx-auto h-screen relative overflow-hidden bg-black shadow-2xl">
        
        {/* SYSTÈME DE GESTES ET ANIMATIONS DE PAGES */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab}
            className="h-full w-full outline-none"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -100) handleSwipe('left');
              if (offset.x > 100) handleSwipe('right');
            }}
            initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <div className="h-full w-full pb-32">
              {activeTab === 'home' && <Home library={rizzLibrary} setTab={setActiveTab} />}
              {activeTab === 'search' && <Search library={rizzLibrary} />}
              {activeTab === 'chat' && <Chat onFav={handleFavorite} favorites={favorites} library={rizzLibrary} />}
              {activeTab === 'profile' && (
                <Profile 
                  favorites={favorites} 
                  library={rizzLibrary} 
                  setTab={setActiveTab}
                  zapVisible={showFloatingZap}
                  onToggleZap={toggleZapDisplay}
                />
              )}
              {activeTab === 'favorites' && <Favorites favorites={favorites} onFav={handleFavorite} />}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* MODALE INSTANTANÉE */}
        <InstantRizz isOpen={isInstantOpen} onClose={() => setIsInstantOpen(false)} library={rizzLibrary} />
      </main>

      {/* --- BARRE DE NAVIGATION (ESPACEMENT ÉGAL PARFAIT) --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/95 backdrop-blur-3xl border-t border-white/5 z-[100] pb-12 pt-4 px-2">
        <div className="flex w-full items-center justify-around">
          
          <NavBtn 
            active={activeTab === 'home'} 
            onClick={() => { setDirection(-1); setActiveTab('home'); }} 
            icon={<LayoutDashboard size={24}/>} 
            label="Feed"
          />
          
          <NavBtn 
            active={activeTab === 'search'} 
            onClick={() => { setDirection(activeTab === 'home' ? 1 : -1); setActiveTab('search'); }} 
            icon={<SearchIcon size={24}/>} 
            label="Find"
          />
          
          <NavBtn 
            active={activeTab === 'chat'} 
            onClick={() => { setDirection(1); setActiveTab('chat'); }} 
            icon={<MessageSquare size={24}/>} 
            label="AI Chat"
          />
          
          <NavBtn 
            active={activeTab === 'profile' || activeTab === 'favorites'} 
            onClick={() => { setDirection(1); setActiveTab('profile'); }} 
            icon={<User size={24}/>} 
            label="You"
          />
          
        </div>
      </nav>

      {/* ALERTES ERREUR API */}
      {apiError && (
        <div className="fixed bottom-28 left-0 w-full flex justify-center pointer-events-none opacity-40">
          <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-500">
            <AlertTriangle size={10} />
            Offline Mode Active
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * COMPOSANT BOUTON DE NAVIGATION
 * Divise l'espace en 4 parties égales (flex-1)
 */
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className="flex-1 flex flex-col items-center justify-center py-2 relative"
    >
      <div className={`transition-all duration-300 ${active ? 'text-blue-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}>
        {icon}
        {active && (
          <motion.div 
            layoutId="nav-glow-indicator"
            className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full"
          />
        )}
      </div>
      
      <span className={`text-[8px] font-black uppercase mt-1.5 tracking-widest transition-opacity duration-300 ${active ? 'text-blue-500 opacity-100' : 'opacity-0'}`}>
        {label}
      </span>

      {active && (
        <motion.div 
          layoutId="active-nav-dot"
          className="w-1 h-1 bg-blue-500 rounded-full mt-1"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}
