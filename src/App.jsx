import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { db, auth } from './firebase'; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp 
} from "firebase/firestore";
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
  Cpu,
  LogOut,
  Fingerprint
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- CORE COMPONENTS ---
import Auth from './components/Auth';
import Home from './components/Home';
import Chat from './components/Chat';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';
import Favorites from './pages/Favorites';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';

// --- ENGINE CONFIGURATION ---
const MAIN_TABS = ['home', 'search', 'chat', 'profile'];
const GESTURE_SWIPE_LIMIT = 60;
const VERSION = "3.5.2-PRO";

/**
 * RIZZ OS - TITAN ENGINE
 * Full Cloud Synchronization & Auth Guard System
 */
export default function App() {
  // --- AUTHENTICATION STATE ---
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); 
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  
  // --- DATA PIPELINE ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // --- UI & FEEDBACK ---
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notif, setNotif] = useState({ show: false, msg: "", type: "success" });
  const [bootLog, setBootLog] = useState("Initializing Core...");

  // --- 1. NETWORK INTELLIGENCE ---
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  // --- 2. AUTHENTICATION WATCHER ---
  useEffect(() => {
    setBootLog("Verifying Identity...");
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (!currentUser) {
        setIsDataReady(false);
        setUserData(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // --- 3. DATA & CLOUD SYNC ENGINE ---
  useEffect(() => {
    if (!user) return;

    const initializeUserSession = async () => {
      setBootLog("Establishing Secure Cloud Link...");
      try {
        // A. Load Content Library (Google Sheets)
        const libraryData = await fetchRizzData();
        if (libraryData) setRizzLibrary(libraryData);

        // B. Setup Real-time Firestore Sync
        const userDocRef = doc(db, "users", user.uid);
        
        const unsubscribeData = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserData(data);
            setFavorites(data.favs || []);
            setBootLog("Neural Map Synced.");
          } else {
            // New User Initialization
            setBootLog("Creating Neural Profile...");
            setDoc(userDocRef, { 
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || "Rizz Operative",
              photoURL: user.photoURL || null,
              favs: [], 
              level: 1,
              xp: 0,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
          }
        });

        // C. Onboarding Check
        if (!localStorage.getItem('rizz_onboarded')) setShowOnboarding(true);

        // Finalize Boot
        setTimeout(() => setIsDataReady(true), 2000);
        return () => unsubscribeData();

      } catch (error) {
        console.error("Critical Engine Failure:", error);
        setBootLog("Sync Error. Running Local.");
        setTimeout(() => setIsDataReady(true), 1500);
      }
    };

    initializeUserSession();
  }, [user]);

  // --- 4. GESTURE NAVIGATION CONTROL ---
  const handleNavigationGesture = useCallback((_, info) => {
    if (!MAIN_TABS.includes(activeTab)) return;

    const currentIndex = MAIN_TABS.indexOf(activeTab);
    const { x: offset } = info.offset;
    const { x: velocity } = info.velocity;

    if ((offset < -GESTURE_SWIPE_LIMIT || velocity < -400) && currentIndex < MAIN_TABS.length - 1) {
      setDirection(1);
      setActiveTab(MAIN_TABS[currentIndex + 1]);
    } else if ((offset > GESTURE_SWIPE_LIMIT || velocity > 400) && currentIndex > 0) {
      setDirection(-1);
      setActiveTab(MAIN_TABS[currentIndex - 1]);
    }
  }, [activeTab]);

  // --- 5. FAVORITES SYSTEM (OPTIMISTIC UI) ---
  const toggleFavorite = async (text) => {
    if (!user) return;
    
    const isFav = favorites.includes(text);
    const newFavs = isFav ? favorites.filter(f => f !== text) : [...favorites, text];
    
    // Step 1: Instant Local Update
    setFavorites(newFavs);
    setNotif({ show: true, msg: isFav ? "Memory Purged" : "Neural Link Saved" });
    setTimeout(() => setNotif(p => ({ ...p, show: false })), 2000);

    // Step 2: Cloud Sync
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        favs: isFav ? arrayRemove(text) : arrayUnion(text)
      });
    } catch (err) {
      console.error("Cloud Rejection:", err);
    }
  };

  // --- 6. LOGOUT HANDLER ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTab('home');
    } catch (e) { console.error("Logout failed", e); }
  };

  // --- RENDERING PIPELINE ---

  // Phase A: Hardware/Auth Boot
  if (isAuthLoading) return <SplashScreen version={VERSION} log="Hardware Boot..." />;

  // Phase B: Unauthorized Access
  if (!user) return <Auth />;

  // Phase C: Data Synchronization
  if (!isDataReady) return <SplashScreen version={VERSION} log={bootLog} />;

  // Phase D: Operational OS
  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none touch-none">
      
      {/* HUD: SYSTEM NOTIFICATIONS */}
      <AnimatePresence>
        {notif.show && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }} 
            animate={{ y: 30, opacity: 1 }} 
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-full bg-blue-600/10 border border-blue-500/30 backdrop-blur-3xl flex items-center gap-3"
          >
            <Fingerprint size={16} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase italic tracking-widest">{notif.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD: STATUS INDICATORS */}
      <div className="fixed top-6 left-6 z-[500] flex items-center gap-4">
        {!isOnline && (
          <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full border border-red-600/30">
            <WifiOff size={10} className="text-red-500" />
            <span className="text-[8px] font-black uppercase text-red-500 tracking-tighter">Local Link Only</span>
          </div>
        )}
      </div>

      <main className="max-w-md mx-auto h-screen relative bg-black">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab}
            drag={MAIN_TABS.includes(activeTab) ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleNavigationGesture}
            initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full w-full"
          >
            <section className="h-full w-full pb-32 overflow-y-auto no-scrollbar">
              {activeTab === 'home' && <Home library={rizzLibrary} setTab={setActiveTab} />}
              {activeTab === 'search' && <Search library={rizzLibrary} />}
              {activeTab === 'chat' && <Chat onFav={toggleFavorite} favorites={favorites} library={rizzLibrary} />}
              {activeTab === 'profile' && <Profile user={user} userData={userData} favorites={favorites} library={rizzLibrary} setTab={setActiveTab} onLogout={handleLogout} />}
              
              {/* DEEP VIEWS */}
              {activeTab === 'favorites' && <Favorites favorites={favorites} onFav={toggleFavorite} />}
              {activeTab === 'settings' && <Settings onBack={() => setActiveTab('profile')} />}
            </section>
          </motion.div>
        </AnimatePresence>

        {/* OVERLAY ENGINE */}
        <InstantRizz isOpen={isInstantOpen} onClose={() => setIsInstantOpen(false)} library={rizzLibrary} />
        
        {/* ACTION BUTTON */}
        <AnimatePresence>
          {!['settings', 'favorites'].includes(activeTab) && (
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setIsInstantOpen(true)}
              className="fixed bottom-36 right-8 z-[150] bg-blue-600 p-6 rounded-[32px] shadow-[0_20px_50px_rgba(37,99,235,0.4)] border border-white/10"
            >
              <Zap size={28} fill="white" />
            </motion.button>
          )}
        </AnimatePresence>
      </main>

      {/* CORE NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 z-[200] pb-12 pt-5 px-8">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <NavBtn active={activeTab === 'home'} icon={<LayoutDashboard size={24}/>} label="Feed" onClick={() => setActiveTab('home')} />
          <NavBtn active={activeTab === 'search'} icon={<SearchIcon size={24}/>} label="Find" onClick={() => setActiveTab('search')} />
          <NavBtn active={activeTab === 'chat'} icon={<MessageSquare size={24}/>} label="AI" onClick={() => setActiveTab('chat')} />
          <NavBtn active={['profile', 'settings', 'favorites'].includes(activeTab)} icon={<User size={24}/>} label="Me" onClick={() => setActiveTab('profile')} />
        </div>
      </nav>

      {/* ONBOARDING FLOW */}
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={() => { setShowOnboarding(false); localStorage.setItem('rizz_onboarded', 'true'); }} />}
      </AnimatePresence>

    </div>
  );
}

// --- ENGINE SUB-COMPONENTS ---

function NavBtn({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center flex-1 transition-all">
      <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? 'bg-blue-600/10 text-blue-500 scale-110 shadow-[0_0_20px_rgba(37,99,235,0.1)]' : 'text-zinc-600'}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase mt-1.5 tracking-tighter transition-all ${active ? 'text-blue-500 opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </button>
  );
}

function SplashScreen({ version, log }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="text-blue-600 mb-12"
      >
        <Zap size={90} fill="currentColor" />
      </motion.div>
      <div className="text-center">
        <h2 className="text-white text-[14px] font-black tracking-[1.2em] uppercase italic mb-4">Rizz OS</h2>
        <div className="flex flex-col items-center gap-2">
          <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] animate-pulse">{log}</p>
          <div className="text-zinc-800 text-[7px] font-black uppercase">Core Engine v{version}</div>
        </div>
      </div>
    </div>
  );
}