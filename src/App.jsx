import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { db } from './firebase'; 
import { doc, setDoc, onSnapshot, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getSheetsData as fetchRizzData } from './services/dataService';
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  Zap, 
  Search as SearchIcon, 
  Sparkles,
  ShieldCheck,
  WifiOff,
  AlertCircle,
  ChevronLeft,
  Settings as SettingsIcon,
  Crown,
  Bell,
  Cpu
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- IMPORTS COMPOSANTS ---
import Home from './components/Home';
import Chat from './components/Chat';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings'; 
import Onboarding from './components/Onboarding';

// --- CONFIGURATION SYSTÈME ---
const MAIN_TABS = ['home', 'search', 'chat', 'profile'];
const SESSION_ID = "rizz_user_001";
const GESTURE_SWIPE_LIMIT = 50;

/**
 * RIZZ OS v3.5.2 - CORE CORE ARCHITECTURE
 * Optimisé pour déploiement APK / Mobile natif
 */
export default function App() {
  // --- ÉTATS DE NAVIGATION ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); 
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [history, setHistory] = useState(['home']);
  
  // --- ÉTATS DES DONNÉES (CLOUD & LOCAL) ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // --- ÉTATS UI & PRÉFÉRENCES ---
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notif, setNotif] = useState({ show: false, msg: "", type: "success" });
  const [appVersion] = useState("3.5.2");
  const [showZap, setShowZap] = useState(() => {
    try {
      const saved = localStorage.getItem('rizz_zap_visible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch { return true; }
  });

  // --- 1. MONITORING RÉSEAU ---
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // --- 2. INITIALISATION ET SYNC FIRESTORE ---
  useEffect(() => {
    const bootstrapApp = async () => {
      console.log(`%c RIZZ OS v${appVersion} BOOTING... `, 'background: #2563eb; color: #fff; font-weight: bold;');
      
      try {
        // Check Onboarding status
        if (!localStorage.getItem('rizz_onboarded')) setShowOnboarding(true);

        // Fetch Content Library
        const data = await fetchRizzData();
        if (data) setRizzLibrary(data);

        // Real-time Cloud Sync
        const userDocRef = doc(db, "users", SESSION_ID);
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const cloudData = snapshot.data();
            setFavorites(cloudData.favs || []);
            // Sync local cache
            localStorage.setItem('rizz_favs', JSON.stringify(cloudData.favs || []));
          } else {
            // Initialiser le profil si nouveau
            setDoc(userDocRef, { 
              favs: [], 
              createdAt: new Date(),
              level: 1,
              xp: 0
            });
          }
        }, (err) => {
          console.error("Firebase Sync Error:", err);
          setError("Cloud Sync Limited");
        });

        return () => unsubscribe();
      } catch (err) {
        setError("Offline Mode Active");
      } finally {
        // Animation Splash Screen pour feeling Premium
        setTimeout(() => setIsReady(true), 2000);
      }
    };
    bootstrapApp();
  }, [appVersion]);

  // --- 3. NAVIGATION GESTURE (SWIPE) ---
  const handleSwipe = useCallback((_, info) => {
    // Désactiver le swipe sur les pages de profondeur (Settings/Favorites)
    if (!MAIN_TABS.includes(activeTab)) return;

    const currentIndex = MAIN_TABS.indexOf(activeTab);
    const { x } = info.offset;
    const { x: velocityX } = info.velocity;

    if ((x < -GESTURE_SWIPE_LIMIT || velocityX < -300) && currentIndex < MAIN_TABS.length - 1) {
      setDirection(1);
      setActiveTab(MAIN_TABS[currentIndex + 1]);
    } else if ((x > GESTURE_SWIPE_LIMIT || velocityX > 300) && currentIndex > 0) {
      setDirection(-1);
      setActiveTab(MAIN_TABS[currentIndex - 1]);
    }
  }, [activeTab]);

  // --- 4. GESTIONNAIRE DE FAVORIS ---
  const handleToggleFavorite = async (text) => {
    const exists = favorites.includes(text);
    
    // UI Optimiste : Update local immédiat
    const updated = exists ? favorites.filter(f => f !== text) : [...favorites, text];
    setFavorites(updated);

    // Feedback Notif
    setNotif({ 
      show: true, 
      msg: exists ? "Removed from Favorites" : "Saved to Cloud", 
      type: "success" 
    });
    setTimeout(() => setNotif(p => ({ ...p, show: false })), 2000);

    // Sync Firestore
    try {
      const userDocRef = doc(db, "users", SESSION_ID);
      await updateDoc(userDocRef, {
        favs: exists ? arrayRemove(text) : arrayUnion(text)
      });
    } catch (e) {
      console.warn("Cloud update failed, keeping local version.");
    }
  };

  // --- RENDER : LOADING / SPLASH ---
  if (!isReady) return <SplashScreen version={appVersion} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none touch-none">
      
      {/* LAYER: SYSTEM NOTIFICATIONS */}
      <AnimatePresence>
        {notif.show && (
          <motion.div 
            initial={{ y: -100, opacity: 0, scale: 0.5 }}
            animate={{ y: 30, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.5 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[600] px-8 py-4 rounded-[25px] bg-zinc-900/90 border border-blue-500/20 backdrop-blur-3xl flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="bg-blue-600 p-1.5 rounded-full">
              <ShieldCheck size={14} className="text-white" />
            </div>
            <span className="text-[11px] font-black uppercase italic tracking-[0.1em]">{notif.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAYER: NETWORK STATUS BAR */}
      {!isOnline && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed top-4 right-4 z-[500] flex items-center gap-2 bg-red-600/10 border border-red-500/20 px-4 py-2 rounded-2xl backdrop-blur-md"
        >
          <WifiOff size={14} className="text-red-500" />
          <span className="text-[9px] font-black uppercase text-red-500">Local Only</span>
        </motion.div>
      )}

      {/* LAYER: FLOATING ACTION BUTTON (ZAP) */}
      <AnimatePresence>
        {showZap && !['settings', 'favorites'].includes(activeTab) && (
          <motion.div 
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-36 right-8 z-[150]"
          >
            <button 
              onClick={() => setIsInstantOpen(true)}
              className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-[30px] shadow-[0_20px_60px_rgba(37,99,235,0.4)] border border-white/20 active:shadow-none"
            >
              <Zap size={30} fill="white" />
              <motion.div 
                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-white rounded-[30px]"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN NAVIGATION VIEW --- */}
      <main className="max-w-md mx-auto h-screen relative bg-black">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab}
            drag={MAIN_TABS.includes(activeTab) ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleSwipe}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="h-full w-full"
          >
            <section className="h-full w-full pb-32 overflow-y-auto no-scrollbar">
              {/* VUES PRINCIPALES */}
              {activeTab === 'home' && <Home library={rizzLibrary} setTab={setActiveTab} />}
              {activeTab === 'search' && <Search library={rizzLibrary} />}
              {activeTab === 'chat' && <Chat onFav={handleToggleFavorite} favorites={favorites} library={rizzLibrary} />}
              {activeTab === 'profile' && <Profile favorites={favorites} library={rizzLibrary} setTab={setActiveTab} />}
              
              {/* VUES DE PROFONDEUR */}
              {activeTab === 'favorites' && <Favorites favorites={favorites} onFav={handleToggleFavorite} />}
              {activeTab === 'settings' && <Settings onBack={() => setActiveTab('profile')} />}
            </section>
          </motion.div>
        </AnimatePresence>

        {/* COMPOSANT OVERLAY */}
        <InstantRizz 
          isOpen={isInstantOpen} 
          onClose={() => setIsInstantOpen(false)} 
          library={rizzLibrary} 
        />
      </main>

      {/* --- BOTTOM BAR NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-3xl border-t border-white/5 z-[200] pb-12 pt-5 px-8">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <NavButton 
            active={activeTab === 'home'} 
            icon={<LayoutDashboard size={26} />} 
            label="Feed" 
            onClick={() => { setDirection(-1); setActiveTab('home'); }} 
          />
          <NavButton 
            active={activeTab === 'search'} 
            icon={<SearchIcon size={26} />} 
            label="Find" 
            onClick={() => { setDirection(activeTab === 'home' ? 1 : -1); setActiveTab('search'); }} 
          />
          <NavButton 
            active={activeTab === 'chat'} 
            icon={<MessageSquare size={26} />} 
            label="AI Chat" 
            onClick={() => { setDirection(1); setActiveTab('chat'); }} 
          />
          <NavButton 
            active={['profile', 'settings', 'favorites'].includes(activeTab)} 
            icon={<User size={26} />} 
            label="Profile" 
            onClick={() => { setDirection(1); setActiveTab('profile'); }} 
          />
        </div>
      </nav>

      {/* ONBOARDING LAYER */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={() => {
            localStorage.setItem('rizz_onboarded', 'true');
            setShowOnboarding(false);
          }} />
        )}
      </AnimatePresence>

    </div>
  );
}

// --- SOUS-COMPOSANTS INTERNES ---

function NavButton({ active, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center flex-1 relative group"
    >
      <div className={`p-2.5 rounded-[22px] transition-all duration-500 ${
        active ? 'bg-blue-600/15 text-blue-500 scale-110 shadow-[0_10px_25px_rgba(37,99,235,0.2)]' : 'text-zinc-600'
      }`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tighter mt-1.5 transition-all duration-300 ${
        active ? 'text-blue-500 opacity-100' : 'opacity-0 translate-y-2'
      }`}>
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_#2563eb]"
        />
      )}
    </button>
  );
}

function SplashScreen({ version }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[1000]">
      <div className="relative mb-12">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            filter: ["blur(0px)", "blur(15px)", "blur(0px)"]
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 bg-blue-600/30 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative text-blue-600"
        >
          <Zap size={85} fill="currentColor" />
        </motion.div>
      </div>
      
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-white text-[14px] font-black tracking-[1.2em] uppercase italic ml-[1.2em]">Rizz OS</h2>
          <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent mt-4" />
        </div>
        
        <div className="flex items-center gap-3 justify-center">
          <Cpu size={12} className="text-zinc-700 animate-spin" />
          <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">
            Loading Neural Engine v{version}
          </p>
        </div>
      </div>
    </div>
  );
}