import React, { useState } from 'react';
import { LayoutGrid, MessageSquare, User } from 'lucide-react';
import Discover from './pages/Discover';
import Coach from './pages/Coach';
import Account from './pages/Account';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page Content */}
      <div className="pb-20">
        {activeTab === 'discover' && <Discover />}
        {activeTab === 'coach' && <Coach />}
        {activeTab === 'account' && <Account />}
      </div>

      {/* Modern Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-white/10 px-6 py-4 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('discover')} className={`flex flex-col items-center gap-1 ${activeTab === 'discover' ? 'text-blue-500' : 'text-zinc-500'}`}>
          <LayoutGrid size={24} />
          <span className="text-[10px] font-bold">DISCOVER</span>
        </button>
        <button onClick={() => setActiveTab('coach')} className={`flex flex-col items-center gap-1 ${activeTab === 'coach' ? 'text-blue-500' : 'text-zinc-500'}`}>
          <MessageSquare size={24} />
          <span className="text-[10px] font-bold">AI COACH</span>
        </button>
        <button onClick={() => setActiveTab('account')} className={`flex flex-col items-center gap-1 ${activeTab === 'account' ? 'text-blue-500' : 'text-zinc-500'}`}>
          <User size={24} />
          <span className="text-[10px] font-bold">ACCOUNT</span>
        </button>
      </nav>
    </div>
  );
}