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
  RefreshCcw,
  ShieldCheck,
  Bell,
  MoreVertical,
  ChevronRight,
  Heart,
  Activity
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- IMPORTATION DES MODULES DE PAGES ---
import Auth from './components/Auth';
import Discover from './pages/Discover'; 
import Chat from './components/Chat';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';
import Favorites from './pages/Favorites';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';

// --- CONFIGURATION DES PARAMÈTRES SYSTÈME ---
const MAIN_TABS = ['home', 'search', 'chat', 'profile'];
const SWIPE_SENSITIVITY = 80;
const VERSION_ID = "5.2.0-PRO-MAX";

export default function App() {
  // --- ÉTATS DU NOYAU (AUTH & DATA) ---
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  // --- ÉTATS DE L'INTERFACE (UI & UX) ---
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0); 
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notif, setNotif] = useState({ show: false, message: "", type: "info" });
  const [statusLog, setStatusLog] = useState("Vérification des protocoles...");

  // --- 1. SURVEILLANCE DE LA CONNECTIVITÉ (NETWORK WATCHER) ---
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // --- 2. GESTION DE LA SESSION (AUTH ENGINE) ---
  useEffect(() => {
    const bootAuth = async () => {
      try {
        setStatusLog("Accès au stockage sécurisé...");
        // Maintien de la connexion même après fermeture (browserLocalPersistence)
        await setPersistence(auth, browserLocalPersistence);
        
        return onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsAuthLoading(false);
        });
      } catch (err) {
        console.error("Erreur critique Auth:", err);
        setIsAuthLoading(false);
      }
    };
    bootAuth();
  }, []);

  // --- 3. SYNCHRONISATION CLOUD & BIBLIOTHÈQUE (CLOUD SYNC) ---
  useEffect(() => {
    if (!user) return;

    const syncPipeline = async () => {
      setStatusLog("Téléchargement de la base de données...");
      try {
        // Chargement du contenu distant
        const remoteData = await fetchRizzData();
        if (remoteData) setRizzLibrary(remoteData);

        // Connexion temps réel au document utilisateur Firestore
        const docRef = doc(db, "users", user.uid);
        const unsubscribeFirestore = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUserData(data);
            setFavorites(data.favs || []);
          } else {
            // Initialisation d'un nouveau compte si inexistant
            setDoc(docRef, { 
              uid: user.uid, email: user.email, 
              username: user.displayName || "Membre",
              favs: [], level: 1, xp: 0, createdAt: serverTimestamp() 
            });
          }
        });

        if (!localStorage.getItem('app_onboarded_v5')) setShowOnboarding(true);
        
        // Délai de confort pour l'animation de Splash
        setTimeout(() => setIsDataReady(true), 1200);
        return unsubscribeFirestore;
      } catch (e) {
        setStatusLog("Mode local activé (Cloud inaccessible)");
        setTimeout(() => setIsDataReady(true), 1000);
      }
    };

    syncPipeline();
  }, [user]);

  // --- 4. LOGIQUE DE NAVIGATION (SWIPE & TABS) ---
  const switchTab = useCallback((target) => {
    const fromIdx = MAIN_TABS.indexOf(activeTab);
    const toIdx = MAIN_TABS.indexOf(target);
    setDirection(toIdx > fromIdx ? 1 : -1);
    setActiveTab(target);
  }, [activeTab]);

  const handleDragNavigation = (e, info) => {
    if (!MAIN_TABS.includes(activeTab)) return;
    const currentIdx = MAIN_TABS.indexOf(activeTab);
    
    if (info.offset.x < -SWIPE_SENSITIVITY && currentIdx < MAIN_TABS.length - 1) {
      switchTab(MAIN_TABS[currentIdx + 1]);
    } else if (info.offset.x > SWIPE_SENSITIVITY && currentIdx > 0) {
      switchTab(MAIN_TABS[currentIdx - 1]);
    }
  };

  // --- 5. SYSTÈME DE FAVORIS (PERSISTANCE) ---
  const handleFavoriteAction = async (rizzText) => {
    if (!user) return;
    const exists = favorites.includes(rizzText);
    
    // Mise à jour visuelle instantanée
    setFavorites(prev => exists ? prev.filter(t => t !== rizzText) : [...prev, rizzText]);
    setNotif({ show: true, message: exists ? "Retiré" : "Sauvegardé" });
    setTimeout(() => setNotif({ show: false, message: "" }), 2000);

    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { favs: exists ? arrayRemove(rizzText) : arrayUnion(rizzText) });
    } catch (err) { console.error("Erreur Sync Favoris:", err); }
  };

  // --- ÉCRANS DE TRANSITION ---
  if (isAuthLoading) return <SplashScreen log="BOOT_SEQUENCE_START" />;
  if (!user) return <Auth />;
  if (!isDataReady) return <SplashScreen log={statusLog} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none">
      
      {/* HUD DE NOTIFICATION */}
      <AnimatePresence>
        {notif.show && (
          <motion.div initial={{ y: -80, x: "-50%", opacity: 0 }} animate={{ y: 40, x: "-50%", opacity: 1 }} exit={{ y: -80, x: "-50%", opacity: 0 }}
            className="fixed top-0 left-1/2 z-[1000] px-6 py-3 rounded-full bg-zinc-900 border border-white/10 shadow-2xl flex items-center gap-2">
            <Fingerprint size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">{notif.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CADRE PRINCIPAL (MOBILE VIEW) */}
      <main className="max-w-md mx-auto h-screen relative bg-black border-x border-white/5 shadow-2xl">
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab} custom={direction} onDragEnd={handleDragNavigation}
            drag={MAIN_TABS.includes(activeTab) ? "x" : false} dragConstraints={{ left: 0, right: 0 }}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="h-full w-full"
          >
            {/* ZONE DE SCROLL AVEC PADDING XXL POUR LA BARRE BASSE */}
            <section className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth">
              <div className="pb-96 pt-4 px-2"> 
                {activeTab === 'home' && <Discover />}
                {activeTab === 'search' && <Search library={rizzLibrary} />}
                {activeTab === 'chat' && <Chat onFav={handleFavoriteAction} favorites={favorites} library={rizzLibrary} />}
                {activeTab === 'profile' && <Profile user={user} userData={userData} setTab={switchTab} onLogout={() => signOut(auth)} />}
                {activeTab === 'favorites' && <Favorites favorites={favorites} onFav={handleFavoriteAction} />}
                {activeTab === 'settings' && <Settings onBack={() => switchTab('profile')} />}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        {/* BOUTON ZAP (ACTION RAPIDE) - REMONTÉ ICI */}
        <AnimatePresence>
          {!['settings', 'favorites'].includes(activeTab) && (
            <motion.button 
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileTap={{ scale: 0.9 }}
              onClick={() => setIsInstantOpen(true)}
              className="fixed bottom-44 right-8 z-[150] bg-blue-600 p-6 rounded-[30px] shadow-2xl border-4 border-black"
            >
              <Zap size={32} color="white" fill="white" />
            </motion.button>
          )}
        </AnimatePresence>

        <InstantRizz isOpen={isInstantOpen} onClose={() => setIsInstantOpen(false)} library={rizzLibrary} />
      </main>

      {/* BARRE DE NAVIGATION (REPOSITIONNÉE BASSE) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-3xl border-t border-white/10 z-[200] pb-14 pt-6 px-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <NavItem active={activeTab === 'home'} icon={<LayoutDashboard size={26}/>} label="FEED" onClick={() => switchTab('home')} />
          <NavItem active={activeTab === 'search'} icon={<SearchIcon size={26}/>} label="FIND" onClick={() => switchTab('search')} />
          <NavItem active={activeTab === 'chat'} icon={<MessageSquare size={26}/>} label="COACH" onClick={() => switchTab('chat')} />
          <NavItem active={['profile', 'settings', 'favorites'].includes(activeTab)} icon={<User size={26}/>} label="PROFIL" onClick={() => switchTab('profile')} />
        </div>
      </nav>

      {showOnboarding && <Onboarding onComplete={() => { setShowOnboarding(false); localStorage.setItem('app_onboarded_v5', 'true'); }} />}
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function NavItem({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center flex-1 transition-all duration-300">
      <motion.div animate={{ scale: active ? 1.25 : 1, color: active ? "#3b82f6" : "#4b5563" }}
        className={`p-2 rounded-2xl ${active ? 'bg-blue-500/10' : ''}`}>
        {icon}
      </motion.div>
      <span className={`text-[8px] font-black mt-2 tracking-widest ${active ? 'text-blue-500 opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </button>
  );
}

function SplashScreen({ log }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-blue-600 mb-12">
        <Zap size={80} fill="currentColor" />
      </motion.div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-1 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-full h-full bg-blue-600" />
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{log}</p>
      </div>
    </div>
  );
}