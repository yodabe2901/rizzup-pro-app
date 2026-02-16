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
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  ZapOff
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- CONFIGURATION DES ROUTES ---
// L'ordre ici définit l'ordre du glissement (Swipe)
const TABS = ['home', 'search', 'chat', 'profile'];

/**
 * APPLICATION PRINCIPALE : RIZZ V2 GOLD EDITION
 * Focus : Fluidité native, Symétrie parfaite, Personnalisation UI
 */
export default function App() {
  // --- ÉTATS DE NAVIGATION ET UI ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); // Pour les animations de slide
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  // --- ÉTATS DE DONNÉES ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [rizzMode, setRizzMode] = useState('SAVAGE');

  // --- ÉTAT DE PERSONNALISATION ---
  // Option pour cacher/montrer le bouton éclair flottant
  const [showFloatingZap, setShowFloatingZap] = useState(() => {
    const saved = localStorage.getItem('rizz_zap_visible');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // --- INITIALISATION PROFONDE ---
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // 1. Récupération des données distantes (Google Sheets)
        const data = await fetchRizzData(); 
        if (data && Array.isArray(data)) {
          setRizzLibrary(data);
        }

        // 2. Synchronisation des Favoris (Local Storage)
        const cachedFavs = localStorage.getItem('rizz_favs');
        if (cachedFavs) setFavorites(JSON.parse(cachedFavs));

        // 3. Vérification du premier lancement
        const hasOnboarded = localStorage.getItem('rizz_onboarded');
        if (!hasOnboarded) setShowOnboarding(true);

        // 4. Finalisation du chargement
        setTimeout(() => setIsAppReady(true), 800);
      } catch (error) {
        console.error("Critical Failure during App Bootstrap:", error);
        setIsAppReady(true); // On force l'affichage même en cas d'erreur
      }
    };

    bootstrapAsync();
  }, []);

  // --- LOGIQUE DE NAVIGATION TACTILE (SWIPE GESTURE) ---
  const handleSwipe = useCallback((swipeDirection) => {
    const currentIndex = TABS.indexOf(activeTab);
    
    if (swipeDirection === 'left' && currentIndex < TABS.length - 1) {
      setDirection(1);
      setActiveTab(TABS[currentIndex + 1]);
    } else if (swipeDirection === 'right' && currentIndex > 0) {
      setDirection(-1);
      setActiveTab(TABS[currentIndex - 1]);
    }
  }, [activeTab]);

  // --- GESTIONNAIRES D'ACTIONS ---
  const handleToggleFavorite = (text) => {
    setFavorites(prev => {
      const exists = prev.includes(text);
      const updated = exists ? prev.filter(f => f !== text) : [...prev, text];
      localStorage.setItem('rizz_favs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleFloatingZap = () => {
    setShowFloatingZap(prev => {
      const nextState = !prev;
      localStorage.setItem('rizz_zap_visible', JSON.stringify(nextState));
      return nextState;
    });
  };

  const closeOnboarding = () => {
    localStorage.setItem('rizz_onboarded', 'true');
    setShowOnboarding(false);
  };

  // --- RENDU : ÉCRAN DE CHARGEMENT ---
  if (!isAppReady) {
    return (
      <div className="bg-black h-screen w-full flex flex-col items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-blue-600 mb-4"
        >
          <Zap size={48} fill="currentColor" />
        </motion.div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Initializing Rizz...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* --- COUCHE : ONBOARDING (WELCOME) --- */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding key="modal-onboard" onComplete={closeOnboarding} />
        )}
      </AnimatePresence>

      {/* --- BOUTON ZAP FLOTTANT (DRAGGABLE & TOGGLEABLE) --- */}
      <AnimatePresence>
        {showFloatingZap && (
          <motion.div 
            drag
            dragConstraints={{ top: -600, left: -160, right: 20, bottom: 0 }}
            dragElastic={0.15}
            initial={{ scale: 0, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0, opacity: 0, scale: 0.5 }}
            whileTap={{ scale: 0.85 }}
            className="fixed bottom-28 right-6 z-[120]"
          >
            <button 
              onClick={() => setIsInstantOpen(true)}
              className="relative group bg-blue-600 p-5 rounded-[24px] shadow-[0_20px_50px_rgba(37,99,235,0.5)] border border-blue-400/30"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 rounded-[24px] transition-opacity" />
              <Zap size={28} fill="white" className="text-white relative z-10" />
              <Sparkles className="absolute -top-1 -right-1 text-blue-200 animate-pulse" size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENEUR DE PAGES PRINCIPAL --- */}
      <main className="max-w-md mx-auto h-screen relative overflow-hidden shadow-2xl shadow-blue-500/5">
        
        {/* SYSTÈME DE GESTES TACTILES (DRAG CONTENT) */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab}
            className="h-full w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={(e, { offset, velocity }) => {
              const swipeThreshold = 70;
              if (offset.x < -swipeThreshold) handleSwipe('left');
              else if (offset.x > swipeThreshold) handleSwipe('right');
            }}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* INJECTION DES PAGES PAR TAB ACTIVE */}
            <div className="h-full w-full pt-4">
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
                  rizzMode={rizzMode}
                />
              )}

              {activeTab === 'favorites' && (
                <Favorites 
                  favorites={favorites} 
                  onFav={handleToggleFavorite} 
                />
              )}

              {activeTab === 'profile' && (
                <Profile 
                  favorites={favorites} 
                  library={rizzLibrary}
                  setTab={setActiveTab}
                  rizzMode={rizzMode}
                  setRizzMode={setRizzMode}
                  zapVisible={showFloatingZap}
                  onToggleZap={handleToggleFloatingZap}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* MODALE INSTANTANÉE (TRIGGER ZAP) */}
        <InstantRizz 
          isOpen={isInstantOpen} 
          onClose={() => setIsInstantOpen(false)} 
          library={rizzLibrary}
        />

      </main>

      {/* --- BARRE DE NAVIGATION (4 COLONNES SYMÉTRIQUES) --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/95 backdrop-blur-3xl border-t border-white/5 z-[100] pb-10 pt-4 px-2">
        <div className="flex w-full items-center justify-around">
          
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
            label="Library"
          />
          
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
            label="Account"
          />
          
        </div>
      </nav>
    </div>
  );
}

/**
 * SOUS-COMPOSANT : BOUTON DE NAVIGATION
 * Divise l'espace de manière égale grâce à flex-1
 */
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className="flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-500 relative py-2"
    >
      {/* Effet de lueur active */}
      <div className={`relative transition-transform duration-300 ${active ? 'scale-110 text-blue-500' : 'text-zinc-600'}`}>
        {icon}
        {active && (
          <motion.div 
            layoutId="nav-glow"
            className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"
          />
        )}
      </div>
      
      {/* Label dynamique */}
      <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${active ? 'text-blue-500 opacity-100 translate-y-0' : 'text-zinc-500 opacity-0 translate-y-2'}`}>
        {label}
      </span>

      {/* Point d'activation (Indicator) */}
      {active && (
        <motion.div 
          layoutId="active-nav-indicator"
          className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full"
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        />
      )}
    </button>
  );
}
