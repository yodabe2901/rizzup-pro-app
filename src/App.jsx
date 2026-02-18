import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db, auth } from './firebase'; 
import { 
  onAuthStateChanged, 
  signOut, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { getSheetsData as fetchRizzData } from './services/dataService';
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  Zap, 
  Search as SearchIcon, 
  WifiOff,
  Fingerprint,
  Heart,
  Settings as SettingsIcon,
  ShieldCheck,
  Activity,
  ChevronRight,
  Plus
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- CORE PAGE IMPORTS ---
import Auth from './components/Auth';
import Discover from './pages/Discover'; 
import Chat from './components/Chat';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';
import Favorites from './pages/Favorites';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';

// --- SYSTEM CONSTANTS ---
const MAIN_TABS = ['home', 'search', 'chat', 'profile'];
const SWIPE_POWER = 0.2;
const APP_VER = "6.5.0-STABLE-EN";

export default function App() {
  // --- AUTHENTICATION & USER DATA STATES ---
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  
  // --- CONTENT & LIBRARY STATES ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  // --- INTERFACE & NAVIGATION STATES ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); 
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [bootLog, setBootLog] = useState("Initializing Core...");

  // --- 1. NETWORK STATUS MONITOR ---
  useEffect(() => {
    const handleConn = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleConn);
    window.addEventListener('offline', handleConn);
    return () => {
      window.removeEventListener('online', handleConn);
      window.removeEventListener('offline', handleConn);
    };
  }, []);

  // --- 2. AUTHENTICATION ENGINE (WITH PERSISTENCE) ---
  useEffect(() => {
    const bootSequence = async () => {
      try {
        setBootLog("Establishing secure session...");
        await setPersistence(auth, browserLocalPersistence);
        
        return onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsAuthLoading(false);
          if (currentUser) setBootLog(`Logged in as: ${currentUser.email}`);
        });
      } catch (error) {
        console.error("Critical Auth Error:", error);
        setIsAuthLoading(false);
      }
    };
    bootSequence();
  }, []);

  // --- 3. DATA SYNCHRONIZATION (FIRESTORE + GOOGLE SHEETS) ---
  useEffect(() => {
    if (!user) return;

    const syncPipeline = async () => {
      setBootLog("Syncing Cloud Library...");
      try {
        // Fetch library content
        const content = await fetchRizzData();
        if (content) setRizzLibrary(content);

        // User Profile Real-time Sync
        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUserData(data);
            setFavorites(data.favs || []);
          } else {
            // First time initialization
            setDoc(userRef, { 
              uid: user.uid, email: user.email, 
              username: user.displayName || "New User",
              favs: [], xp: 0, level: 1, createdAt: serverTimestamp() 
            });
          }
        });

        // Version-specific onboarding check
        if (!localStorage.getItem('rizz_v65_onboarded')) setShowOnboarding(true);

        // Smooth transition to app
        setTimeout(() => setIsDataReady(true), 1500);
        return unsubscribe;
      } catch (e) {
        setBootLog("Local database engaged.");
        setTimeout(() => setIsDataReady(true), 1000);
      }
    };

    syncPipeline();
  }, [user]);

  // --- 4. NAVIGATION ENGINE (TABS & SWIPE) ---
  const navigateTo = useCallback((tabName) => {
    const currentIdx = MAIN_TABS.indexOf(activeTab);
    const targetIdx = MAIN_TABS.indexOf(tabName);
    setDirection(targetIdx > currentIdx ? 1 : -1);
    setActiveTab(tabName);
  }, [activeTab]);

  // --- 5. GLOBAL FAVORITES HANDLER ---
  const handleToggleFav = async (text) => {
    if (!user) return;
    const isAlreadyFav = favorites.includes(text);
    
    // UI Optimistic Update
    setFavorites(prev => isAlreadyFav ? prev.filter(t => t !== text) : [...prev, text]);
    setToast({ show: true, msg: isAlreadyFav ? "Removed" : "Saved to Profile" });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);

    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { 
        favs: isAlreadyFav ? arrayRemove(text) : arrayUnion(text) 
      });
    } catch (err) { console.error("Sync Error", err); }
  };

  // --- LOADING / AUTH ROUTING ---
  if (isAuthLoading) return <SplashScreen log="BOOT_UP" />;
  if (!user) return <Auth />;
  if (!isDataReady) return <SplashScreen log={bootLog} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none antialiased">
      
      {/* GLOBAL TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ y: -60, x: "-50%", opacity: 0 }} 
            animate={{ y: 40, x: "-50%", opacity: 1 }} 
            exit={{ y: -60, x: "-50%", opacity: 0 }}
            className="fixed top-0 left-1/2 z-[1000] px-6 py-2.5 rounded-full bg-zinc-900 border border-white/10 shadow-2xl flex items-center gap-2"
          >
            <ShieldCheck size={14} className="text-blue-500" />
            <span className="text-[11px] font-black uppercase tracking-widest">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OFFLINE BANNER */}
      {!isOnline && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] bg-red-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-xl">
          <WifiOff size={12} /> Connection Lost - Offline Mode
        </div>
      )}

      {/* MOBILE APPLICATION SHELL */}
      <main className="max-w-md mx-auto h-screen relative bg-black border-x border-white/5 shadow-2xl overflow-hidden">
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab} custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="h-full w-full"
          >
            {/* SCROLLABLE VIEWPORT */}
            <section className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth">
              <div className="pb-44 pt-4 px-4"> 
                {activeTab === 'home' && <Discover />}
                {activeTab === 'search' && <Search library={rizzLibrary} />}
                {activeTab === 'chat' && <Chat onFav={handleToggleFav} favorites={favorites} library={rizzLibrary} />}
                {activeTab === 'profile' && <Profile user={user} userData={userData} setTab={navigateTo} onLogout={() => signOut(auth)} />}
                
                {/* AUXILIARY VIEWS */}
                {activeTab === 'favorites' && <Favorites favorites={favorites} onFav={handleToggleFav} />}
                {activeTab === 'settings' && <Settings onBack={() => navigateTo('profile')} />}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        {/* COMPACT FLOATING ZAP BUTTON */}
        <AnimatePresence>
          {!['settings', 'favorites'].includes(activeTab) && (
            <motion.button 
              initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, y: 20 }} 
              whileTap={{ scale: 0.85 }}
              onClick={() => setIsInstantOpen(true)}
              className="fixed bottom-28 right-8 z-[150] bg-blue-600 p-5 rounded-[28px] shadow-2xl border-4 border-black"
            >
              <Zap size={26} color="white" fill="white" />
            </motion.button>
          )}
        </AnimatePresence>

        <InstantRizz isOpen={isInstantOpen} onClose={() => setIsInstantOpen(false)} library={rizzLibrary} />
      </main>

      {/* SLIM-LINE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-3xl border-t border-white/10 z-[200] pt-3 pb-6 px-8">
        <div className="max-w-md mx-auto flex items-center justify-between gap-1">
          <NavigationButton active={activeTab === 'home'} icon={<LayoutDashboard size={22}/>} label="Feed" onClick={() => navigateTo('home')} />
          <NavigationButton active={activeTab === 'search'} icon={<SearchIcon size={22}/>} label="Search" onClick={() => navigateTo('search')} />
          <NavigationButton active={activeTab === 'chat'} icon={<MessageSquare size={22}/>} label="Coach" onClick={() => navigateTo('chat')} />
          <NavigationButton active={['profile', 'settings', 'favorites'].includes(activeTab)} icon={<User size={22}/>} label="Me" onClick={() => navigateTo('profile')} />
        </div>
      </nav>

      {/* INITIAL ONBOARDING OVERLAY */}
      {showOnboarding && (
        <Onboarding 
          onComplete={() => { 
            setShowOnboarding(false); 
            localStorage.setItem('rizz_v65_onboarded', 'true'); 
          }} 
        />
      )}
    </div>
  );
}

// --- NAVIGATION UI SUB-COMPONENT ---

function NavigationButton({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 py-1 relative">
      <motion.div 
        animate={{ 
          scale: active ? 1.15 : 1, 
          color: active ? "#3b82f6" : "#4b5563" 
        }}
        className="transition-colors duration-200"
      >
        {icon}
      </motion.div>
      <span className={`text-[10px] font-bold mt-1 tracking-tight transition-opacity duration-300 ${active ? 'text-blue-500 opacity-100' : 'text-zinc-600 opacity-60'}`}>
        {label}
      </span>
      {active && (
        <motion.div layoutId="nav-dot" className="absolute -top-1 w-1 h-1 bg-blue-500 rounded-full" />
      )}
    </button>
  );
}

// --- BOOT ANIMATION SUB-COMPONENT ---

function SplashScreen({ log }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} 
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} 
        className="text-blue-600 mb-10"
      >
        <Zap size={70} fill="currentColor" />
      </motion.div>
      <div className="flex flex-col items-center gap-5">
        <div className="w-20 h-0.5 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }} animate={{ x: "100%" }} 
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-full h-full bg-blue-600" 
          />
        </div>
        <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em] antialiased">
          {log}
        </p>
      </div>
    </div>
  );
}