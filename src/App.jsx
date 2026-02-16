import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { db } from './firebase'; 
import { doc, setDoc, onSnapshot, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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
  Settings,
  Wifi,
  WifiOff,
  Share2,
  MoreVertical,
  ShieldCheck
} from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';

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
const GESTURE_THRESHOLD = 40; 
const SESSION_ID = "rizz_user_001"; // Identifiant unique Cloud

/**
 * CORE APPLICATION : RIZZ OS v3.5 (ULTRA-LONG BUILD)
 * Focus : Redondance des données, Cloud Sync, Performance APK native
 */
export default function App() {
  // --- ÉTATS DE NAVIGATION ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); 
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const containerRef = useRef(null);
  
  // --- ÉTATS DES DONNÉES ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // --- ÉTATS D'INTERFACE (UI) ---
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notif, setNotif] = useState({ show: false, msg: "", type: "success" });
  const [appVersion] = useState("3.5.2");
  const [showZap, setShowZap] = useState(() => {
    try {
      const saved = localStorage.getItem('rizz_zap_visible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch { return true; }
  });

  /**
   * MONITORING RÉSEAU
   */
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  /**
   * INITIALISATION ASYNCHRONE ET SYNC FIRESTORE
   */
  useEffect(() => {
    const bootstrap = async () => {
      console.log(`RIZZ_OS v${appVersion}: Booting...`);
      try {
        // 1. Check Onboarding Status
        const onboarded = localStorage.getItem('rizz_onboarded');
        if (!onboarded) setShowOnboarding(true);

        // 2. Load Content from Google Sheets
        const data = await fetchRizzData();
        if (data && Array.isArray(data)) {
          setRizzLibrary(data);
        }

        // 3. Real-time Firebase Sync (Hybrid Cache)
        const userDocRef = doc(db, "users", SESSION_ID);
        
        // On essaye de récupérer le cache local d'abord pour la vitesse
        const localFavs = localStorage.getItem('rizz_favs');
        if (localFavs) setFavorites(JSON.parse(localFavs));

        // Sync Cloud
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const cloudFavs = snapshot.data().favs || [];
            setFavorites(cloudFavs);
            localStorage.setItem('rizz_favs', JSON.stringify(cloudFavs));
          } else {
            // Créer le document si inexistant
            setDoc(userDocRef, { favs: [], createdAt: new Date() });
          }
        }, (err) => {
          console.error("Firebase Sync Error:", err);
          setError("Cloud sync limited");
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Boot failure:", err);
        setError("Offline mode active");
      } finally {
        // Stabilisation de l'APK
        setTimeout(() => setIsReady(true), 1500);
      }
    };
    bootstrap();
  }, [appVersion]);

  /**
   * LOGIQUE DE NAVIGATION PAR GESTE (SWIPE)
   */
  const handleGesture = useCallback((_, info) => {
    const currentIndex = TABS.indexOf(activeTab);
    const { x } = info.offset;
    const { x: vx } = info.velocity;

    // Détection Swipe Gauche -> Droite (Suivant)
    if ((x < -GESTURE_THRESHOLD || vx < -250) && currentIndex < TABS.length - 1) {
      setDirection(1);
      setActiveTab(TABS[currentIndex + 1]);
    } 
    // Détection Swipe Droite -> Gauche (Précédent)
    else if ((x > GESTURE_THRESHOLD || vx > 250) && currentIndex > 0) {
      setDirection(-1);
      setActiveTab(TABS[currentIndex - 1]);
    }
  }, [activeTab]);

  /**
   * GESTIONNAIRE DE FAVORIS (CLOUDSYNC + FEEDBACK)
   */
  const handleToggleFavorite = async (text) => {
    const exists = favorites.includes(text);
    const userDocRef = doc(db, "users", SESSION_ID);

    // Optimistic UI : Update local d'abord
    const updatedFavs = exists 
      ? favorites.filter(f => f !== text) 
      : [...favorites, text];
    setFavorites(updatedFavs);
    localStorage.setItem('rizz_favs', JSON.stringify(updatedFavs));

    // Feedback visuel
    setNotif({ 
      show: true, 
      msg: exists ? "Removed from Cloud" : "Saved to Cloud",
      type: exists ? "info" : "success" 
    });
    setTimeout(() => setNotif(prev => ({ ...prev, show: false })), 2000);

    // Sync Firestore
    try {
      await updateDoc(userDocRef, {
        favs: exists ? arrayRemove(text) : arrayUnion(text)
      });
    } catch (err) {
      console.error("Firebase Update Error:", err);
      // Fallback local storage si Firestore échoue
    }
  };

  /**
   * ACTIONS UI
   */
  const toggleZapBtn = () => {
    const next = !showZap;
    setShowZap(next);
    localStorage.setItem('rizz_zap_visible', JSON.stringify(next));
  };

  /**
   * RENDER : LOADING / SPLASH
   */
  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[999] p-10 text-center">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            filter: ["drop-shadow(0 0 0px #2563eb)", "drop-shadow(0 0 20px #2563eb)", "drop-shadow(0 0 0px #2563eb)"]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-blue-600 mb-8"
        >
          <Zap size={64} fill="currentColor" />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-white text-[12px] font-black tracking-[0.8em] uppercase italic">Rizz OS Initializing</h2>
          <div className="w-48 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            />
          </div>
          <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest animate-pulse">
            Connecting to Firestore Cluster...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none touch-none">
      
      {/* --- LAYER: SYSTEM NOTIFICATIONS --- */}
      <AnimatePresence>
        {notif.show && (
          <motion.div 
            initial={{ y: -70, opacity: 0, scale: 0.9 }}
            animate={{ y: 20, opacity: 1, scale: 1 }}
            exit={{ y: -70, opacity: 0, scale: 0.9 }}
            className={`fixed top-0 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border backdrop-blur-xl ${
              notif.type === 'success' ? 'bg-blue-600/20 border-blue-500/30' : 'bg-zinc-900/80 border-white/10'
            }`}
          >
            {notif.type === 'success' ? <ShieldCheck size={16} className="text-blue-400" /> : <InfoIcon size={16} />}
            <span className="text-[10px] font-black uppercase italic tracking-wider">{notif.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LAYER: NETWORK STATUS --- */}
      {!isOnline && (
        <div className="fixed top-4 right-4 z-[400] flex items-center gap-2 bg-red-600/10 border border-red-500/20 px-3 py-1 rounded-md">
          <WifiOff size={12} className="text-red-500" />
          <span className="text-[8px] font-black uppercase text-red-500">Offline Mode</span>
        </div>
      )}

      {/* --- LAYER: ONBOARDING --- */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding key="onboarding-flow" onComplete={() => {
            localStorage.setItem('rizz_onboarded', 'true');
            setShowOnboarding(false);
          }} />
        )}
      </AnimatePresence>

      {/* --- LAYER: ZAP ACTION BUTTON (FLOATING) --- */}
      <AnimatePresence>
        {showZap && (
          <motion.div 
            drag
            dragConstraints={{ top: -500, left: -180, right: 30, bottom: 0 }}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            whileTap={{ scale: 0.8 }}
            className="fixed bottom-32 right-6 z-[120]"
          >
            <button 
              onClick={() => setIsInstantOpen(true)}
              className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[28px] shadow-[0_20px_50px_rgba(37,99,235,0.4)] border border-white/10"
            >
              <Zap size={28} fill="white" className="relative z-10" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-white/20 rounded-[28px] blur-md"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENEUR PRINCIPAL DE NAVIGATION --- */}
      <main ref={containerRef} className="max-w-md mx-auto h-screen relative bg-black">
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab}
            className="h-full w-full outline-none"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleGesture}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            {/* INJECTION DES PAGES DYNAMIQUES */}
            <section className="h-full w-full pb-28 overflow-y-auto no-scrollbar">
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
                  version={appVersion}
                />
              )}
              {activeTab === 'favorites' && (
                <Favorites 
                  favorites={favorites} 
                  onFav={handleToggleFavorite} 
                />
              )}
            </section>
          </motion.div>
        </AnimatePresence>

        {/* COMPOSANT OVERLAY : INSTANT ZAP */}
        <InstantRizz 
          isOpen={isInstantOpen} 
          onClose={() => setIsInstantOpen(false)} 
          library={rizzLibrary} 
        />
      </main>

      {/* --- NAVIGATION BAR (DESIGN APK OPTIMISÉ) --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-3xl border-t border-white/5 z-[100] pb-8 pt-4 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          
          <NavBtn 
            label="Feed"
            active={activeTab === 'home'} 
            onClick={() => { setDirection(-1); setActiveTab('home'); }} 
            icon={<LayoutDashboard size={24}/>} 
          />
          
          <NavBtn 
            label="Find"
            active={activeTab === 'search'} 
            onClick={() => { setDirection(activeTab === 'home' ? 1 : -1); setActiveTab('search'); }} 
            icon={<SearchIcon size={24}/>} 
          />
          
          <NavBtn 
            label="AI Chat"
            active={activeTab === 'chat'} 
            onClick={() => { setDirection(1); setActiveTab('chat'); }} 
            icon={<MessageSquare size={24}/>} 
          />
          
          <NavBtn 
            label="Profile"
            active={activeTab === 'profile' || activeTab === 'favorites'} 
            onClick={() => { setDirection(1); setActiveTab('profile'); }} 
            icon={<User size={24}/>} 
          />
          
        </div>
      </nav>

      {/* ERREURS FATALES */}
      {error && (
        <div className="fixed bottom-24 left-0 w-full flex justify-center pointer-events-none">
          <div className="bg-red-500/10 px-4 py-1.5 rounded-full flex items-center gap-2 border border-red-500/20">
            <AlertCircle size={10} className="text-red-500" />
            <span className="text-[8px] font-black uppercase text-red-400 tracking-widest">{error}</span>
          </div>
        </div>
      )}

    </div>
  );
}

/**
 * COMPOSANT : BOUTON DE NAVIGATION INDIVIDUEL
 */
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 group"
    >
      <div className={`relative p-2 rounded-2xl transition-all duration-500 ${
        active ? 'text-blue-500 bg-blue-500/10 scale-110' : 'text-zinc-600 group-active:scale-90'
      }`}>
        {icon}
        {active && (
          <motion.div 
            layoutId="nav-pill"
            className="absolute inset-0 bg-blue-500/5 blur-lg rounded-full"
          />
        )}
      </div>
      
      <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 transition-all duration-300 ${
        active ? 'text-blue-500 opacity-100 translate-y-0' : 'text-zinc-700 opacity-0 translate-y-1'
      }`}>
        {label}
      </span>

      {active && (
        <motion.div 
          layoutId="nav-active-dot"
          className="w-1.5 h-[3px] bg-blue-500 rounded-full mt-1"
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      )}
    </button>
  );
}

// Fonction utilitaire pour l'icône Info (LUCIDE ne l'exporte pas toujours par défaut)
function InfoIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}
