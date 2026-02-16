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
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- CONFIGURATION ---
const TABS = ['home', 'search', 'chat', 'profile'];

/**
 * RIZZ OS V2.5 - EDITION FINALE
 * Correction du bug d'écran noir et optimisation de la navigation symétrique.
 */
export default function App() {
  // --- ÉTATS DE NAVIGATION ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); 
  
  // --- ÉTATS DES DONNÉES ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  // --- ÉTATS UI ---
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notif, setNotif] = useState({ show: false, message: "" });

  // --- OPTION : BOUTON ZAP FLOTTANT ---
  const [showFloatingZap, setShowFloatingZap] = useState(() => {
    try {
      const saved = localStorage.getItem('rizz_zap_visible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) { return true; }
  });

  // --- BOOTSTRAP DE L'APPLICATION ---
  useEffect(() => {
    const initApp = async () => {
      console.log("Rizz OS: Starting Bootstrap...");
      try {
        // 1. Chargement des favoris locaux (Rapide)
        const savedFavs = localStorage.getItem('rizz_favs');
        if (savedFavs) setFavorites(JSON.parse(savedFavs));

        // 2. Vérification Onboarding
        if (!localStorage.getItem('rizz_onboarded')) setShowOnboarding(true);

        // 3. Récupération API / Sheets
        const data = await fetchRizzData();
        if (data && Array.isArray(data)) {
          setRizzLibrary(data);
        } else {
          console.warn("Rizz OS: Library is empty or malformed");
        }
      } catch (err) {
        console.error("Rizz OS: Init Error", err);
        setErrorStatus("Offline Mode");
      } finally {
        // FORCE L'AFFICHAGE même si l'API échoue
        setTimeout(() => {
          setIsLoaded(true);
          console.log("Rizz OS: UI Ready");
        }, 1000);
      }
    };

    initApp();
  }, []);

  // --- SYSTÈME DE SWIPE ---
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

  // --- ACTIONS ---
  const toggleFavorite = (text) => {
    setFavorites(prev => {
      const isFav = prev.includes(text);
      const updated = isFav ? prev.filter(f => f !== text) : [...prev, text];
      localStorage.setItem('rizz_favs', JSON.stringify(updated));
      
      setNotif({ show: true, message: isFav ? "Removed" : "Saved to Favs" });
      setTimeout(() => setNotif({ show: false, message: "" }), 1500);
      return updated;
    });
  };

  const toggleFloatingZap = () => {
    setShowFloatingZap(prev => {
      const next = !prev;
      localStorage.setItem('rizz_zap_visible', JSON.stringify(next));
      return next;
    });
  };

  // --- RENDU : SPLASH SCREEN (RIZZ OS) ---
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[300]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-blue-600 mb-8"
        >
          <Zap size={60} fill="currentColor" />
        </motion.div>
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[10px] font-black tracking-[0.6em] text-white uppercase italic"
        >
          Rizz OS Initializing
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden selection:bg-blue-600/30">
      
      {/* NOTIFICATIONS CLIP */}
      <AnimatePresence>
        {notif.show && (
          <motion.div 
            initial={{ y: -60 }} animate={{ y: 30 }} exit={{ y: -60 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] bg-zinc-900 border border-white/10 px-6 py-2 rounded-full shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase italic">{notif.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ONBOARDING */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={() => { localStorage.setItem('rizz_onboarded', 'true'); setShowOnboarding(false); }} />
        )}
      </AnimatePresence>

      {/* BOUTON ZAP FLOTTANT */}
      <AnimatePresence>
        {showFloatingZap && (
          <motion.div 
            drag dragConstraints={{ top: -600, left: -160, right: 20, bottom: 0 }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="fixed bottom-32 right-6 z-[120]"
          >
            <button 
              onClick={() => setIsInstantOpen(true)}
              className="bg-blue-600 p-5 rounded-[24px] shadow-2xl shadow-blue-600/40 border border-blue-400/30 active:scale-75 transition-transform"
            >
              <Zap size={28} fill="white" className="text-white" />
              <Sparkles className="absolute -top-1 -right-1 text-blue-200 animate-pulse" size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENEUR DE PAGES PRINCIPAL */}
      <main className="max-w-md mx-auto h-screen relative overflow-hidden bg-black shadow-inner">
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab}
            className="h-full w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -80) handleSwipe('left');
              if (offset.x > 80) handleSwipe('right');
            }}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* ROUTAGE SÉCURISÉ */}
            <div className="h-full w-full">
              {activeTab === 'home' && (
                <Home library={rizzLibrary} setTab={setActiveTab} />
              )}
              {activeTab === 'search' && (
                <Search library={rizzLibrary} />
              )}
              {activeTab === 'chat' && (
                <Chat onFav={toggleFavorite} favorites={favorites} library={rizzLibrary} />
              )}
              {activeTab === 'profile' && (
                <Profile 
                  favorites={favorites} 
                  library={rizzLibrary} 
                  setTab={setActiveTab}
                  zapVisible={showFloatingZap}
                  onToggleZap={toggleFloatingZap}
                />
              )}
              {/* Fallback pour la page favoris si appelée par le profil */}
              {activeTab === 'favorites' && (
                <Favorites favorites={favorites} onFav={toggleFavorite} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* MODALE INSTANT ZAP */}
        <InstantRizz isOpen={isInstantOpen} onClose={() => setIsInstantOpen(false)} library={rizzLibrary} />

      </main>

      {/* BARRE DE NAVIGATION (4 COLONNES PARFAITES) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/90 backdrop-blur-3xl border-t border-white/5 z-[100] pb-10 pt-4 px-2">
        <div className="flex w-full items-center">
          
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
            label="Explore"
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

      {/* STATUS D'ERREUR DISCRET */}
      {errorStatus && (
        <div className="fixed bottom-28 left-0 w-full flex justify-center pointer-events-none opacity-50">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{errorStatus}</span>
        </div>
      )}
    </div>
  );
}

// COMPOSANT BOUTON NAV SYMÉTRIQUE
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className="flex-1 flex flex-col items-center justify-center py-2 transition-all">
      <div className={`relative transition-all duration-300 ${active ? 'text-blue-500 scale-110' : 'text-zinc-600'}`}>
        {icon}
        {active && <motion.div layoutId="nav-glow" className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />}
      </div>
      <span className={`text-[8px] font-black uppercase tracking-tighter mt-1.5 transition-opacity ${active ? 'text-blue-500 opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
      {active && (
        <motion.div layoutId="nav-dot" className="w-1 h-1 bg-blue-500 rounded-full mt-1" />
      )}
    </button>
  );
}
