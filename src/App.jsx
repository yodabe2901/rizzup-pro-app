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
  Bell,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- PAGE & COMPONENT IMPORTS ---
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
const SWIPE_THRESHOLD = 70;
const VERSION = "6.0.0-ULTRA-SLIM";

export default function App() {
  // --- CORE STATES ---
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  // --- UI STATES ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); 
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notif, setNotif] = useState({ show: false, msg: "", type: "info" });
  const [bootStatus, setBootStatus] = useState("Initializing...");

  // --- 1. NETWORK CONNECTIVITY MONITOR ---
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // --- 2. AUTHENTICATION ENGINE ---
  useEffect(() => {
    const startAuth = async () => {
      try {
        setBootStatus("Checking session...");
        await setPersistence(auth, browserLocalPersistence);
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsAuthLoading(false);
          if (currentUser) setBootStatus(`Authenticated: ${currentUser.email}`);
        });
        return unsubscribe;
      } catch (err) {
        console.error("Auth initialization failed", err);
        setIsAuthLoading(false);
      }
    };
    startAuth();
  }, []);

  // --- 3. DATA SYNC PIPELINE (FIRESTORE & LIBRARY) ---
  useEffect(() => {
    if (!user) return;

    const syncData = async () => {
      setBootStatus("Syncing Library...");
      try {
        // Fetch library from Service (Sheets/API)
        const data = await fetchRizzData();
        if (data) setRizzLibrary(data);

        // Real-time User Data Listener
        const userRef = doc(db, "users", user.uid);
        const unsubscribeDoc = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const cloudData = snap.data();
            setUserData(cloudData);
            setFavorites(cloudData.favs || []);
          } else {
            // Auto-create profile if missing
            setDoc(userRef, { 
              uid: user.uid, 
              email: user.email, 
              username: user.displayName || "User",
              favs: [], 
              xp: 0, level: 1,
              createdAt: serverTimestamp() 
            });
          }
        });

        // Onboarding Check
        if (!localStorage.getItem('app_v6_onboarded')) setShowOnboarding(true);

        setTimeout(() => setIsDataReady(true), 1000);
        return unsubscribeDoc;
      } catch (error) {
        setBootStatus("Offline Mode Active");
        setTimeout(() => setIsDataReady(true), 800);
      }
    };

    syncData();
  }, [user]);

  // --- 4. NAVIGATION LOGIC (SWIPE & TABS) ---
  const handleTabSwitch = useCallback((target) => {
    const from = MAIN_TABS.indexOf(activeTab);
    const to = MAIN_TABS.indexOf(target);
    setDirection(to > from ? 1 : -1);
    setActiveTab(target);
  }, [activeTab]);

  const onSwipeEnd = (e, info) => {
    if (!MAIN_TABS.includes(activeTab)) return;
    const idx = MAIN_TABS.indexOf(activeTab);
    
    if (info.offset.x < -SWIPE_THRESHOLD && idx < MAIN_TABS.length - 1) {
      handleTabSwitch(MAIN_TABS[idx + 1]);
    } else if (info.offset.x > SWIPE_THRESHOLD && idx > 0) {
      handleTabSwitch(MAIN_TABS[idx - 1]);
    }
  };

  // --- 5. CLOUD FAVORITES HANDLER ---
  const toggleFav = async (text) => {
    if (!user) return;
    const isFav = favorites.includes(text);
    
    setFavorites(prev => isFav ? prev.filter(i => i !== text) : [...prev, text]);
    setNotif({ show: true, msg: isFav ? "Removed" : "Saved" });
    setTimeout(() => setNotif({ show: false, msg: "" }), 2000);

    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { favs: isFav ? arrayRemove(text) : arrayUnion(text) });
    } catch (e) { console.error("Favorite sync failed", e); }
  };

  // --- RENDER SCENARIOS ---
  if (isAuthLoading) return <BootScreen log="CORE_START" />;
  if (!user) return <Auth />;
  if (!isDataReady) return <BootScreen log={bootStatus} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none touch-none">
      
      {/* HUD NOTIFICATIONS */}
      <AnimatePresence>
        {notif.show && (
          <motion.div 
            initial={{ y: -50, x: "-50%", opacity: 0 }} 
            animate={{ y: 30, x: "-50%", opacity: 1 }} 
            exit={{ y: -50, x: "-50%", opacity: 0 }}
            className="fixed top-0 left-1/2 z-[1000] px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-2"
          >
            <ShieldCheck size={12} className="text-blue-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">{notif.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN APPLICATION CONTAINER */}
      <main className="max-w-md mx-auto h-screen relative bg-black border-x border-white/5">
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab} custom={direction} onDragEnd={onSwipeEnd}
            drag={MAIN_TABS.includes(activeTab) ? "x" : false} dragConstraints={{ left: 0, right: 0 }}
            initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="h-full w-full"
          >
            <section className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth">
              {/* pb-32 to leave space for the ultra-slim bar */}
              <div className="pb-32 pt-2 px-3"> 
                {activeTab === 'home' && <Discover />}
                {activeTab === 'search' && <Search library={rizzLibrary} />}
                {activeTab === 'chat' && <Chat onFav={toggleFav} favorites={favorites} library={rizzLibrary} />}
                {activeTab === 'profile' && <Profile user={user} userData={userData} setTab={handleTabSwitch} onLogout={() => signOut(auth)} />}
                {activeTab === 'favorites' && <Favorites favorites={favorites} onFav={toggleFav} />}
                {activeTab === 'settings' && <Settings onBack={() => handleTabSwitch('profile')} />}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        {/* ULTRA-COMPACT FLOATING ACTION BUTTON */}
        <AnimatePresence>
          {!['settings', 'favorites'].includes(activeTab) && (
            <motion.button 
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileTap={{ scale: 0.9 }}
              onClick={() => setIsInstantOpen(true)}
              className="fixed bottom-16 right-6 z-[150] bg-blue-600 p-4 rounded-2xl shadow-2xl border-2 border-black"
            >
              <Zap size={22} color="white" fill="white" />
            </motion.button>
          )}
        </AnimatePresence>

        <InstantRizz isOpen={isInstantOpen} onClose={() => setIsInstantOpen(false)} library={rizzLibrary} />
      </main>

      {/* ULTRA-SLIM BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 z-[200] pt-2 pb-2 px-6">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <NavItem active={activeTab === 'home'} icon={<LayoutDashboard size={18}/>} label="Feed" onClick={() => handleTabSwitch('home')} />
          <NavItem active={activeTab === 'search'} icon={<SearchIcon size={18}/>} label="Search" onClick={() => handleTabSwitch('search')} />
          <NavItem active={activeTab === 'chat'} icon={<MessageSquare size={18}/>} label="AI" onClick={() => handleTabSwitch('chat')} />
          <NavItem active={['profile', 'settings', 'favorites'].includes(activeTab)} icon={<User size={18}/>} label="Me" onClick={() => handleTabSwitch('profile')} />
        </div>
      </nav>

      {showOnboarding && <Onboarding onComplete={() => { setShowOnboarding(false); localStorage.setItem('app_v6_onboarded', 'true'); }} />}
    </div>
  );
}

// --- REUSABLE SUB-COMPONENTS ---

function NavItem({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 py-1 transition-all">
      <div className={`transition-colors duration-300 ${active ? 'text-blue-500' : 'text-zinc-600'}`}>
        {icon}
      </div>
      <span className={`text-[8px] font-bold mt-0.5 uppercase tracking-tighter ${active ? 'text-blue-500' : 'text-zinc-700'}`}>
        {label}
      </span>
    </button>
  );
}

function BootScreen({ log }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-blue-600 mb-8">
        <Zap size={50} fill="currentColor" />
      </motion.div>
      <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-[0.5em]">{log}</p>
    </div>
  );
}