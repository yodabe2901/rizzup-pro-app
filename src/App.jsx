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
  Heart
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- IMPORT DES PAGES ET COMPOSANTS ---
// On centralise les imports pour une meilleure visibilité
import Auth from './components/Auth';
import Discover from './pages/Discover'; 
import Chat from './components/Chat';
import Search from './components/Search';
import Profile from './components/Profile'; 
import InstantRizz from './components/InstantRizz';
import Favorites from './pages/Favorites';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';

// --- CONSTANTES DE CONFIGURATION ---
const MAIN_TABS = ['home', 'search', 'chat', 'profile'];
const SWIPE_SENSITIVITY = 80;
const APP_VERSION = "5.0.1-PREMIUM";

export default function App() {
  // --- ÉTATS D'AUTHENTIFICATION ET UTILISATEUR ---
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  
  // --- ÉTATS DE LA BIBLIOTHÈQUE ET FAVORIS ---
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  // --- ÉTATS DE L'INTERFACE UTILISATEUR (UI) ---
  const [activeTab, setActiveTab] = useState('home');
  const [prevTab, setPrevTab] = useState('home');
  const [direction, setDirection] = useState(0); 
  const [isInstantOpen, setIsInstantOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "default" });
  const [loadingStatus, setLoadingStatus] = useState("Démarrage du système...");

  // --- 1. GESTION DE LA CONNECTIVITÉ RÉSEAU ---
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- 2. INITIALISATION DE L'AUTHENTIFICATION AVEC PERSISTANCE ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoadingStatus("Vérification de la session...");
        // browserLocalPersistence permet de rester connecté même après fermeture du navigateur
        await setPersistence(auth, browserLocalPersistence);
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsAuthLoading(false);
          if (currentUser) {
            setLoadingStatus(`Connecté en tant que ${currentUser.email}`);
          }
        });
        return unsubscribe;
      } catch (error) {
        console.error("Erreur d'initialisation Auth:", error);
        setIsAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  // --- 3. SYNCHRONISATION DES DONNÉES CLOUD ET BIBLIOTHÈQUE ---
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const syncUserCloudData = async () => {
      setLoadingStatus("Synchronisation des données...");
      try {
        // Chargement de la bibliothèque de phrases depuis le service
        const libraryData = await fetchRizzData();
        if (isMounted && libraryData) {
          setRizzLibrary(libraryData);
        }

        const userDocRef = doc(db, "users", user.uid);
        
        // Écoute en temps réel des changements dans Firestore
        const unsubFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setFavorites(data.favs || []);
          } else {
            // Création du profil si c'est la première connexion
            setDoc(userDocRef, { 
              uid: user.uid, 
              email: user.email, 
              username: user.displayName || "Membre",
              favs: [], 
              xp: 0,
              level: 1,
              createdAt: serverTimestamp() 
            });
          }
        });

        // Vérification du tutoriel
        const hasCompletedOnboarding = localStorage.getItem('app_onboarded_v5');
        if (!hasCompletedOnboarding) {
          setShowOnboarding(true);
        }

        // Fin du chargement avec un léger délai pour la fluidité visuelle
        setTimeout(() => {
          if (isMounted) setIsDataReady(true);
        }, 1500);

        return unsubFirestore;
      } catch (error) {
        console.error("Erreur de synchronisation Cloud:", error);
        setLoadingStatus("Mode hors-ligne activé");
        setTimeout(() => setIsDataReady(true), 1000);
      }
    };

    syncUserCloudData();
    return () => { isMounted = false; };
  }, [user]);

  // --- 4. MOTEUR DE NAVIGATION ET GESTES (SWIPE) ---
  const triggerTabChange = (newTab) => {
    const currentIndex = MAIN_TABS.indexOf(activeTab);
    const nextIndex = MAIN_TABS.indexOf(newTab);
    
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setPrevTab(activeTab);
    setActiveTab(newTab);
  };

  const handleDragEnd = (event, info) => {
    if (!MAIN_TABS.includes(activeTab)) return;
    
    const currentIndex = MAIN_TABS.indexOf(activeTab);
    
    if (info.offset.x < -SWIPE_SENSITIVITY && currentIndex < MAIN_TABS.length - 1) {
      triggerTabChange(MAIN_TABS[currentIndex + 1]);
    } else if (info.offset.x > SWIPE_SENSITIVITY && currentIndex > 0) {
      triggerTabChange(MAIN_TABS[currentIndex - 1]);
    }
  };

  // --- 5. GESTION DES ACTIONS UTILISATEUR (FAVORIS) ---
  const handleToggleFavorite = async (text) => {
    if (!user) return;
    
    const isAlreadyInFavs = favorites.includes(text);
    
    // Feedback visuel immédiat (Optimistic UI)
    setFavorites(current => 
      isAlreadyInFavs ? current.filter(t => t !== text) : [...current, text]
    );

    setNotification({
      show: true,
      message: isAlreadyInFavs ? "Retiré des favoris" : "Ajouté aux favoris",
      type: isAlreadyInFavs ? "remove" : "add"
    });

    setTimeout(() => setNotification({ show: false, message: "" }), 2000);

    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        favs: isAlreadyInFavs ? arrayRemove(text) : arrayUnion(text)
      });
    } catch (err) {
      console.error("Échec de la mise à jour des favoris:", err);
    }
  };

  // --- RENDU CONDITIONNEL (SCÉNARIOS DE CHARGEMENT) ---
  if (isAuthLoading) return <LoadingScreen message="Chargement du profil..." />;
  if (!user) return <Auth />;
  if (!isDataReady) return <LoadingScreen message={loadingStatus} />;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none touch-none">
      
      {/* SYSTÈME DE NOTIFICATIONS GLOBAL */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ y: -100, x: "-50%", opacity: 0 }} 
            animate={{ y: 50, x: "-50%", opacity: 1 }} 
            exit={{ y: -100, x: "-50%", opacity: 0 }}
            className="fixed top-0 left-1/2 z-[1000] px-6 py-4 rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl flex items-center gap-3"
          >
            <div className={`p-2 rounded-full ${notification.type === 'add' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
              <Heart size={16} fill={notification.type === 'add' ? "currentColor" : "none"} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INDICATEUR HORS-LIGNE */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[500] bg-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
          <WifiOff size={12} /> Mode Hors-Ligne
        </div>
      )}

      {/* CADRE PRINCIPAL DE L'APPLICATION */}
      <main className="max-w-md mx-auto h-screen relative bg-black shadow-2xl border-x border-white/5">
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={activeTab}
            custom={direction}
            drag={MAIN_TABS.includes(activeTab) ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="h-full w-full"
          >
            {/* ZONE DE DÉFILEMENT DU CONTENU */}
            <section className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth">
              <div className="pb-80 pt-2">
                {activeTab === 'home' && <Discover />}
                {activeTab === 'search' && <Search library={rizzLibrary} />}
                {activeTab === 'chat' && (
                  <Chat 
                    onFav={handleToggleFavorite} 
                    favorites={favorites} 
                    library={rizzLibrary} 
                  />
                )}
                {activeTab === 'profile' && (
                  <Profile 
                    user={user} 
                    userData={userData} 
                    setTab={triggerTabChange} 
                    onLogout={() => signOut(auth)} 
                  />
                )}
                
                {/* VUES SECONDAIRES */}
                {activeTab === 'favorites' && (
                  <Favorites favorites={favorites} onFav={handleToggleFavorite} />
                )}
                {activeTab === 'settings' && (
                  <Settings onBack={() => triggerTabChange('profile')} />
                )}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        {/* BOUTON D'ACTION RAPIDE (INSTANT RIZZ) */}
        <AnimatePresence>
          {!['settings', 'favorites'].includes(activeTab) && (
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsInstantOpen(true)}
              className="fixed bottom-36 right-8 z-[150] bg-blue-600 p-6 rounded-[30px] shadow-2xl border-4 border-black"
            >
              <Zap size={30} color="white" fill="white" />
            </motion.button>
          )}
        </AnimatePresence>

        <InstantRizz 
          isOpen={isInstantOpen} 
          onClose={() => setIsInstantOpen(false)} 
          library={rizzLibrary} 
        />
      </main>

      {/* BARRE DE NAVIGATION INFÉRIEURE */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-3xl border-t border-white/10 z-[200] pb-12 pt-6 px-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <NavigationItem 
            isActive={activeTab === 'home'} 
            icon={<LayoutDashboard size={24}/>} 
            label="DÉCOUVRIR" 
            onClick={() => triggerTabChange('home')} 
          />
          <NavigationItem 
            isActive={activeTab === 'search'} 
            icon={<SearchIcon size={24}/>} 
            label="CHERCHER" 
            onClick={() => triggerTabChange('search')} 
          />
          <NavigationItem 
            isActive={activeTab === 'chat'} 
            icon={<MessageSquare size={24}/>} 
            label="COACH" 
            onClick={() => triggerTabChange('chat')} 
          />
          <NavigationItem 
            isActive={['profile', 'settings', 'favorites'].includes(activeTab)} 
            icon={<User size={24}/>} 
            label="PROFIL" 
            onClick={() => triggerTabChange('profile')} 
          />
        </div>
      </nav>

      {/* ÉCRAN D'INTRODUCTION (PREMIÈRE VISITE) */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding 
            onComplete={() => { 
              setShowOnboarding(false); 
              localStorage.setItem('app_onboarded_v5', 'true'); 
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SOUS-COMPOSANTS INTERNES ---

function NavigationItem({ isActive, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center flex-1 transition-all duration-300"
    >
      <motion.div 
        animate={{ 
          scale: isActive ? 1.2 : 1,
          color: isActive ? "#3b82f6" : "#52525b"
        }}
        className={`p-2 rounded-2xl ${isActive ? 'bg-blue-500/10 shadow-sm' : ''}`}
      >
        {icon}
      </motion.div>
      <span className={`text-[8px] font-black mt-2 tracking-widest transition-all ${isActive ? 'opacity-100 text-blue-500' : 'opacity-0'}`}>
        {label}
      </span>
    </button>
  );
}

function LoadingScreen({ message }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }} 
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-blue-600 mb-12"
      >
        <Zap size={90} fill="currentColor" />
      </motion.div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-full bg-blue-600"
          />
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}