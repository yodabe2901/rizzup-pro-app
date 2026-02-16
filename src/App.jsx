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
  ZapOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';

/**
 * CONFIGURATION DES CONSTANTES
 * L'ordre des TABS définit la logique physique du Swipe (gauche/droite)
 */
const TABS = ['home', 'search', 'chat', 'profile'];

const SWIPE_CONF = {
  threshold: 80,    // Distance minimum pour déclencher le changement de page
  elasticity: 0.35, // Résistance lors du glissement
  stiffness: 300,   // Rapidité de l'animation ressort
  damping: 30       // Amortissement de l'animation
};

/**
 * APPLICATION PRINCIPALE : RIZZ OS V2.5
 * Architecture : Clean Mobile-First avec navigation symétrique et bouton flottant dynamique
 */
export default function App() {
  // --- ÉTATS DE NAVIGATION ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); // -1 pour gauche, 1 pour droite
  
  // --- ÉTATS DES DONNÉES ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // --- ÉTATS D'INTERFACE (UI) ---
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notif, setNotif] = useState({ show: false, message: "" });

  // --- PERSONNALISATION : BOUTON ÉCLAIR FLOTTANT ---
  const [showFloatingZap, setShowFloatingZap] = useState(() => {
    try {
      const saved = localStorage.getItem('rizz_zap_visible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) { return true; }
  });

  /**
   * INITIALISATION DE L'APPLICATION
   * Récupération des données distantes et synchronisation du stockage local
   */
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // 1. Fetch Google Sheets Data
        const data = await fetchRizzData();
        if (data && Array.isArray(data)) {
          setRizzLibrary(data);
        } else {
          throw new Error("Data format invalid");
        }

        // 2. Load Persisted Favorites
        const savedFavs = localStorage.getItem('rizz_favs');
        if (savedFavs) {
          setFavorites(JSON.parse(savedFavs));
        }

        // 3. Check Onboarding Status
        const hasOnboarded = localStorage.getItem('rizz_onboarded');
        if (!hasOnboarded) {
          setShowOnboarding(true);
        }

        // 4. Delay loading for a smooth splash effect
        setTimeout(() => setIsLoaded(true), 1200);

      } catch (err) {
        console.error("Bootstrap Error:", err);
        setLoadError("Check your connection...");
        setIsLoaded(true); // On affiche quand même pour permettre la navigation locale
      }
    };

    bootstrap();
  }, []);

  /**
   * LOGIQUE DE NAVIGATION TACTILE (SWIPE)
   * Calcule la nouvelle tab en fonction de l'index actuel et de la direction
   */
  const executeSwipe = useCallback((swipeDir) => {
    const currentIndex = TABS.indexOf(activeTab);
    
    if (swipeDir === 'left' && currentIndex < TABS.length - 1) {
      setDirection(1); // On va vers la droite (nouvelle page arrive de droite)
      setActiveTab(TABS[currentIndex + 1]);
    } else if (swipeDir === 'right' && currentIndex > 0) {
      setDirection(-1); // On va vers la gauche (nouvelle page arrive de gauche)
      setActiveTab(TABS[currentIndex - 1]);
    }
  }, [activeTab]);

  /**
   * ACTIONS GLOBALES (FAVORIS ET TOGGLES)
   */
  const handleToggleFavorite = (text) => {
    setFavorites(prev => {
      const exists = prev.includes(text);
      const updated = exists ? prev.filter(f => f !== text) : [...prev, text];
      localStorage.setItem('rizz_favs', JSON.stringify(updated));
      
      // Feedback Notification
      setNotif({ show: true, message: exists ? "Removed from Favs" : "Added to Favorites!" });
      setTimeout(() => setNotif({ show: false, message: "" }), 2000);
      
      return updated;
    });
  };

  const handleToggleFloatingZap = useCallback(() => {
    setShowFloatingZap(prev => {
      const newState = !prev;
      localStorage.setItem('rizz_zap_visible', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const closeOnboarding = () => {
    localStorage.setItem('rizz_onboarded', 'true');
    setShowOnboarding(false);
  };

  /**
   * RENDU : ÉCRAN DE CHARGEMENT PREMIUM
   */
  if (!isLoaded) {
    return (
      <div className="bg-black h-screen w-full flex flex-col items-center justify-center space-y-6">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 1, 0.4], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-blue-600"
        >
          <Zap size={64} fill="currentColor" strokeWidth={1} />
        </motion.div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white italic">RIZZ OS</p>
          <div className="w-32 h-[1px] bg-zinc-800 relative overflow-hidden">
            <motion.div 
              initial={{ left: '-100%' }}
              animate={{ left: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 w-1/2 h-full bg-blue-500"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden selection:bg-blue-600/30 selection:text-white">
      
      {/* --- NOTIFICATIONS SYSTEM --- */}
      <AnimatePresence>
        {notif.show && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-zinc-900 border border-white/10 rounded-full shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={16} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase italic tracking-widest">{notif.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- OVERLAY : ONBOARDING --- */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding key="modal-welcome" onComplete={closeOnboarding} />
        )}
      </AnimatePresence>

      {/* --- BOUTON ZAP FLOTTANT (DESIGN PREMIUM & DRAGGABLE) --- */}
      <AnimatePresence>
        {showFloatingZap && (
          <motion.div 
            drag
            dragConstraints={{ top: -600, left: -160, right: 20, bottom: 0 }}
            dragElastic={0.15}
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.8 }}
            className="fixed bottom-32 right-6 z-[120]"
          >
            <button 
              onClick={() => setIsInstantOpen(true)}
              className="relative group bg-blue-600 p-5 rounded-[26px] shadow-[0_20px_60px_rgba(37,99,235,0.5)] border border-blue-400/30 active:shadow-inner"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-[26px] transition-opacity" />
              <Zap size={30} fill="white" className="text-white relative z-10" />
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-blue-400 rounded-[26px]"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENEUR PRINCIPAL --- */}
      <main className="max-w-md mx-auto h-screen relative overflow-hidden bg-black shadow-[0_0_100px_rgba(37,99,235,0.05)]">
        
        {/* SYSTÈME DE GESTES TACTILES AVEC ANIMATION DE SLIDE */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab}
            className="h-full w-full outline-none"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={SWIPE_CONF.elasticity}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -SWIPE_CONF.threshold) executeSwipe('left');
              else if (offset.x > SWIPE_CONF.threshold) executeSwipe('right');
            }}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ 
              type: "spring", 
              stiffness: SWIPE_CONF.stiffness, 
              damping: SWIPE_CONF.damping 
            }}
          >
            {/* ROUTING DES COMPOSANTS */}
            <div className="h-full w-full">
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

      {/* --- BARRE DE NAVIGATION (4 COLONNES SYMÉTRIQUES PARFAITES) --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/95 backdrop-blur-3xl border-t border-white/5 z-[100] pb-10 pt-5 px-4">
        <div className="flex w-full items-center justify-around">
          
          <NavBtn 
            active={activeTab === 'home'} 
            onClick={() => { setDirection(activeTab === 'home' ? 0 : -1); setActiveTab('home'); }} 
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

      {/* AFFICHAGE DES ERREURS DE CHARGEMENT */}
      {loadError && (
        <div className="fixed bottom-28 left-0 w-full flex justify-center pointer-events-none">
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full flex items-center gap-2">
            <AlertCircle size={14} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-500 uppercase">{loadError}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * SOUS-COMPOSANT : BOUTON DE NAVIGATION
 * Divise l'espace de la nav en parts égales (25% chacune via flex-1 ou justify-around)
 */
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className="flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative group"
    >
      {/* Container Icone avec effet de lueur */}
      <div className={`relative transition-all duration-300 ${active ? 'scale-110 text-blue-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
        {icon}
        {active && (
          <motion.div 
            layoutId="nav-glow-aura"
            className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"
          />
        )}
      </div>
      
      {/* Label dynamique qui glisse vers le haut */}
      <div className="h-3 relative overflow-hidden w-full flex justify-center">
        <AnimatePresence>
          {active && (
            <motion.span 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="text-[8px] font-black uppercase tracking-widest text-blue-500 italic absolute"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Indicateur Pillule (LayoutId pour animation de glissement entre les boutons) */}
      {active && (
        <motion.div 
          layoutId="nav-active-indicator"
          className="w-1 h-1 bg-blue-500 rounded-full mt-1"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
    </button>
  );
}
