import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getSheetsData as fetchRizzData } from './services/dataService';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Heart, 
  Zap, 
  Search as SearchIcon, 
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Bell,
  Settings
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';

// --- IMPORTS COMPOSANTS ---
import Home from './components/Home';
import Chat from './components/Chat';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';
import Favorites from './pages/Favorites';
import Onboarding from './components/Onboarding';

// --- CONFIGURATION SYSTÈME ---
const TABS = ['home', 'search', 'chat', 'profile'];
const GESTURE_THRESHOLD = 45; // Sensibilité du swipe (plus bas = plus sensible)

/**
 * CORE APPLICATION : RIZZ V2.8 (BUILD APK OPTIMIZED)
 * Focus : Navigation au pouce, Latence 0, Symétrie totale
 */
export default function App() {
  // --- ÉTATS DE NAVIGATION ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); 
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  
  // --- ÉTATS DES DONNÉES ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // --- ÉTATS D'INTERFACE (UI) ---
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notif, setNotif] = useState({ show: false, msg: "" });
  const [showZap, setShowZap] = useState(() => {
    try {
      const saved = localStorage.getItem('rizz_zap_visible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch { return true; }
  });

  /**
   * INITIALISATION ASYNCHRONE
   * Chargement des données Sheets et synchronisation locale
   */
  useEffect(() => {
    const bootstrap = async () => {
      console.log("RIZZ_OS: Initializing Build...");
      try {
        // 1. Check Onboarding
        if (!localStorage.getItem('rizz_onboarded')) setShowOnboarding(true);

        // 2. Load Favs
        const cachedFavs = localStorage.getItem('rizz_favs');
        if (cachedFavs) setFavorites(JSON.parse(cachedFavs));

        // 3. Fetch Data from Google Sheets
        const data = await fetchRizzData();
        if (data && Array.isArray(data)) {
          setRizzLibrary(data);
        } else {
          console.warn("RIZZ_OS: Data empty, using fallback");
        }
      } catch (err) {
        console.error("RIZZ_OS: Critical Failure", err);
        setError("Connection error");
      } finally {
        // Delay artificiel pour stabiliser l'APK au lancement
        setTimeout(() => setIsReady(true), 1100);
      }
    };
    bootstrap();
  }, []);

  /**
   * LOGIQUE DE NAVIGATION PAR GESTE (SWIPE)
   * Calibrée pour mobile (Velocity + Offset)
   */
  const handleGesture = useCallback((_, info) => {
    const currentIndex = TABS.indexOf(activeTab);
    const { x } = info.offset;
    const { x: vx } = info.velocity;

    // Swipe vers la gauche (Tab suivante)
    if ((x < -GESTURE_THRESHOLD || vx < -300) && currentIndex < TABS.length - 1) {
      setDirection(1);
      setActiveTab(TABS[currentIndex + 1]);
    } 
    // Swipe vers la droite (Tab précédente)
    else if ((x > GESTURE_THRESHOLD || vx > 300) && currentIndex > 0) {
      setDirection(-1);
      setActiveTab(TABS[currentIndex - 1]);
    }
  }, [activeTab]);

  /**
   * ACTIONS GLOBALES
   */
  const handleToggleFavorite = (text) => {
    setFavorites(prev => {
      const exists = prev.includes(text);
      const updated = exists ? prev.filter(f => f !== text) : [...prev, text];
      localStorage.setItem('rizz_favs', JSON.stringify(updated));
      
      setNotif({ show: true, msg: exists ? "Removed" : "Added to Favs" });
      setTimeout(() => setNotif({ show: false, msg: "" }), 1800);
      return updated;
    });
  };

  const toggleZapBtn = () => {
    const next = !showZap;
    setShowZap(next);
    localStorage.setItem('rizz_zap_visible', JSON.stringify(next));
  };

  /**
   * RENDER : SPLASH SCREEN
   */
  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[999]">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-blue-600 mb-6"
        >
          <Zap size={56} fill="currentColor" />
        </motion.div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-white text-[10px] font-black tracking-[0.6em] uppercase italic">Rizz OS v2.8</span>
          <div className="w-24 h-[1px] bg-zinc-800 relative overflow-hidden">
            <motion.div 
              animate={{ left: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="absolute w-1/2 h-full bg-blue-500"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none touch-none">
      
      {/* --- LAYER: NOTIFICATIONS --- */}
      <AnimatePresence>
        {notif.show && (
          <motion.div 
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[500] px-6 py-2 bg-zinc-900 border border-white/10 rounded-full flex items-center gap-3 shadow-2xl"
          >
            <CheckCircle2 size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase italic tracking-tighter">{notif.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LAYER: ONBOARDING --- */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={() => {
            localStorage.setItem('rizz_onboarded', 'true');
            setShowOnboarding(false);
          }} />
        )}
      </AnimatePresence>

      {/* --- LAYER: BOUTON ZAP FLOTTANT (DRAGGABLE) --- */}
      <AnimatePresence>
        {showZap && (
          <motion.div 
            drag
            dragConstraints={{ top: -500, left: -160, right: 20, bottom: 0 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.85 }}
            className="fixed bottom-24 right-6 z-[120]"
          >
            <button 
              onClick={() => setIsInstantOpen(true)}
              className="bg-blue-600 p-5 rounded-[24px] shadow-[0_15px_40px_rgba(37,99,235,0.4)] border border-blue-400/30"
            >
              <Zap size={28} fill="white" />
              <div className="absolute -top-1 -right-1">
                <Sparkles size={14} className="text-blue-200 animate-pulse" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENEUR DE PAGES PRINCIPAL --- */}
      <main className="max-w-md mx-auto h-screen relative bg-black shadow-inner">
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab}
            className="h-full w-full touch-pan-y"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleGesture}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          >
            {/* INJECTION DES COMPOSANTS */}
            <div className="h-full w-full pb-20 overflow-y-auto">
              {activeTab === 'home' && (
                <Home library={rizzLibrary} setTab={setActiveTab} />
              )}
              {activeTab === 'search' && (
                <Search library={rizzLibrary} />
              )}
              {activeTab === 'chat' && (
                <Chat 
                  onFav={handleToggleFavorite} 
                  favorites={favorites} 
                  library={rizzLibrary} 
                />
              )}
              {activeTab === 'profile' && (
                <Profile 
                  favorites={favorites} 
                  library={rizzLibrary} 
                  setTab={setActiveTab}
                  zapVisible={showZap}
                  onToggleZap={toggleZapBtn}
                />
              )}
              {activeTab === 'favorites' && (
                <Favorites favorites={favorites} onFav={handleToggleFavorite} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* MODALE INSTANT ZAP */}
        <InstantRizz 
          isOpen={isInstantOpen} 
          onClose={() => setIsInstantOpen(false)} 
          library={rizzLibrary} 
        />
      </main>

      {/* --- NAV BAR ABAISSÉE (4 COLONNES PARFAITES) --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-white/5 z-[100] pb-6 pt-3 px-2">
        <div className="max-w-md mx-auto flex w-full items-center justify-around">
          
          <NavBtn 
            active={activeTab === 'home'} 
            onClick={() => { setDirection(-1); setActiveTab('home'); }} 
            icon={<LayoutDashboard size={22}/>} 
            label="Feed"
          />
          
          <NavBtn 
            active={activeTab === 'search'} 
            onClick={() => { setDirection(activeTab === 'home' ? 1 : -1); setActiveTab('search'); }} 
            icon={<SearchIcon size={22}/>} 
            label="Find"
          />
          
          <NavBtn 
            active={activeTab === 'chat'} 
            onClick={() => { setDirection(1); setActiveTab('chat'); }} 
            icon={<MessageSquare size={22}/>} 
            label="AI Chat"
          />
          
          <NavBtn 
            active={activeTab === 'profile' || activeTab === 'favorites'} 
            onClick={() => { setDirection(1); setActiveTab('profile'); }} 
            icon={<User size={22}/>} 
            label="You"
          />
          
        </div>
      </nav>

      {/* FEEDBACK ERREUR API */}
      {error && (
        <div className="fixed bottom-24 left-0 w-full flex justify-center pointer-events-none opacity-40">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 rounded-full">
            <AlertCircle size={10} className="text-red-500" />
            <span className="text-[8px] font-black uppercase text-red-500 tracking-tighter">{error}</span>
          </div>
        </div>
      )}

    </div>
  );
}

/**
 * COMPOSANT BOUTON DE NAVIGATION
 * Divise l'espace en 4 via flex-1. 
 * Les icônes sont positionnées plus bas pour l'accessibilité APK.
 */
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 relative"
    >
      <div className={`transition-all duration-300 ${active ? 'text-blue-500 scale-110' : 'text-zinc-600'}`}>
        {icon}
        {active && (
          <motion.div 
            layoutId="nav-glow"
            className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"
          />
        )}
      </div>
      
      <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 transition-all duration-300 ${active ? 'text-blue-500 opacity-100 translate-y-0' : 'text-zinc-700 opacity-0 translate-y-2'}`}>
        {label}
      </span>

      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="w-1 h-1 bg-blue-500 rounded-full mt-0.5"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}
