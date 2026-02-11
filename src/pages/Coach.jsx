import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { generateRizzResponse } from '../services/ai'; // On importe le moteur ici

export default function Coach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // C'est ici qu'on gère l'envoi (handleSend)
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');

    // On appelle le moteur
    const response = await generateRizzResponse(input);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div className="p-4 flex flex-col h-screen bg-black">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block p-3 rounded-2xl ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-800'}`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pb-20">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-zinc-900 p-4 rounded-xl outline-none" 
          placeholder="Type here..."
        />
        <button onClick={handleSend} className="bg-blue-600 p-4 rounded-xl"><Send /></button>
      </div>
    </div>
  );
}