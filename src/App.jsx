import { fetchRizzData, generateRizzResponse } from './services/ai';
import { createClient } from '@supabase/supabase-js';
import { fetchRizzData, generateRizzResponse } from './ai'; // Import de ta logique Sheets
import { MessageSquare, Users, BookOpen, Settings, LayoutDashboard, Send, Zap, Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient('https://njfuqcrtcfhkivzcgreb.supabase.co', 'sb_publishable_JXkhQVQqlM2CWqc9Q7xDxA_oVT2v1-1');

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [rizzLibrary, setRizzLibrary] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // CHARGEMENT INITIAL DU SHEETS
  useEffect(() => {
    async function initApp() {
      const data = await fetchRizzData();
      setRizzLibrary(data);
      setIsLoaded(true);
    }
    initApp();
  }, []);

  if (!isLoaded) return <div className="bg-black h-screen flex items-center justify-center text-blue-500 font-black italic animate-pulse text-2xl">RIZZUP PRO LOADING...</div>;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden">
      <main className="max-w-md mx-auto h-screen overflow-y-auto pb-32 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeDashboard stats={{count: rizzLibrary.length}} />}
          {activeTab === 'chat' && <RizzAIChat library={rizzLibrary} />}
          {activeTab === 'academy' && <AcademyPage library={rizzLibrary} />}
          {activeTab === 'feed' && <CommunityFeed />}
          {activeTab === 'settings' && <SettingsPage />}
        </AnimatePresence>
      </main>

      {/* Navigation Matrix */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[420px] bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[30px] p-2 flex justify-between items-center z-50">
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutDashboard size={18}/>} label="Home" />
        <NavBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={18}/>} label="IA Chat" />
        <NavBtn active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={<Users size={18}/>} label="Social" />
        <NavBtn active={activeTab === 'academy'} onClick={() => setActiveTab('academy')} icon={<BookOpen size={18}/>} label="Academy" />
        <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18}/>} label="Profil" />
      </nav>
    </div>
  );
}

// --- PAGE : ACADEMY (DYNAMIQUE VIA SHEETS) ---
function AcademyPage({ library }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-12">
      <h1 className="text-3xl font-black italic mb-2 uppercase">Rizz Academy</h1>
      <p className="text-zinc-500 text-xs mb-8">Tes techniques extraites du Backend Sheets</p>
      
      <div className="space-y-4">
        {library.map((item, i) => (
          <div key={i} className="bg-zinc-900/80 p-5 rounded-[25px] border border-white/5">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Technique #{i+1}</span>
            </div>
            <p className="text-lg font-bold italic">"{item.RizzLine}"</p>
            {item.Description && <p className="text-zinc-500 text-xs mt-2">{item.Description}</p>}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- PAGE : HOME (TABLEAU DE BORD) ---
function HomeDashboard({ stats }) {
  return (
    <div className="p-6 pt-12">
      <h1 className="text-4xl font-black italic text-blue-500 uppercase tracking-tighter mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[35px]">
          <Trophy size={32} className="mb-4 text-yellow-300" />
          <h3 className="text-2xl font-black italic uppercase">{stats.count} Techniques</h3>
          <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Connectées au Sheets</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-[35px] border border-white/5">
          <Zap size={24} className="text-blue-500 mb-2"/>
          <p className="text-zinc-500 text-xs font-bold uppercase">Statut Serveur</p>
          <p className="text-xl font-black uppercase">Online 100%</p>
        </div>
      </div>
    </div>
  );
}

// --- LES AUTRES PAGES (COMMUNITY, CHAT, SETTINGS) RESTENT SIMILAIRES ---
// Assure-toi de garder les composants NavBtn, RizzAIChat, etc. que nous avons créé avant.
