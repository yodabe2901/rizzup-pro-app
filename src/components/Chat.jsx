import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Trash2, Heart, ImagePlus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { generateRizzResponse } from '../services/ai';

export default function Chat({ onFav, favorites }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: "Yo. Ready to spark some fire? Drop a message or a screenshot of your chat." }]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null); // Stocke l'image en Base64
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Fonction pour transformer l'image en texte utilisable par l'IA (Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !image) return;

    const userText = input || "Analyze this screenshot and give me the best move.";
    const currentImg = image;

    // Ajouter le message utilisateur à l'écran
    setMessages(prev => [...prev, { role: 'user', text: userText, img: currentImg }]);
    
    // Reset de l'input et de l'image
    setInput("");
    setImage(null);
    setIsTyping(true);

    try {
      // On envoie le texte ET l'image à notre service IA
      const response = await generateRizzResponse(userText, currentImg);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Signal lost. The matrix is glitching." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <header className="p-6 pt-12 border-b border-white/5 flex justify-between items-end bg-black/50 backdrop-blur-md z-10">
        <h2 className="text-xl font-black italic uppercase text-blue-500 tracking-tighter text-left">RizzMaster AI</h2>
        <button onClick={() => setMessages([{role:'ai', text:'Terminal reset. New target?'}])} className="text-zinc-600 hover:text-red-500 transition-colors p-2">
          <Trash2 size={18} />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pt-6 pb-44 no-scrollbar">
        {messages.map((m, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} items-end gap-3`}>
            {m.role === 'ai' && <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-blue-500"/></div>}
            <div className={`relative max-w-[85%] p-4 rounded-[24px] text-sm shadow-2xl ${m.role === 'ai' ? 'bg-zinc-900 border border-white/10 rounded-bl-none text-zinc-200' : 'bg-blue-600 text-white rounded-br-none font-medium text-left'}`}>
              
              {/* Si le message contient une image envoyée par l'utilisateur */}
              {m.img && (
                <img src={m.img} alt="upload" className="w-full h-auto rounded-lg mb-3 border border-white/10" />
              )}

              <ReactMarkdown className="whitespace-pre-wrap break-words leading-relaxed prose prose-invert">
                {m.text}
              </ReactMarkdown>

              {m.role === 'ai' && (
                <button onClick={() => onFav(m.text)} className={`absolute top-2 right-2 ${favorites.includes(m.text) ? 'text-red-500' : 'text-zinc-700'}`}>
                  <Heart size={14} fill={favorites.includes(m.text) ? "currentColor" : "none"} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {isTyping && <div className="flex gap-1.5 p-4 bg-zinc-900/50 w-16 rounded-full justify-center animate-pulse ml-11"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div></div>}
      </div>

      {/* Barre d'input avec Preview d'image */}
      <div className="absolute bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
        
        {/* Preview de l'image avant envoi */}
        {image && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4 relative w-24 h-24 ml-2">
            <img src={image} className="w-full h-full object-cover rounded-xl border-2 border-blue-600 shadow-lg shadow-blue-600/20" />
            <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 shadow-lg text-white">
              <X size={12} />
            </button>
          </motion.div>
        )}

        <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 p-2 rounded-[28px] backdrop-blur-xl shadow-2xl transition-all focus-within:border-blue-500/50">
          
          {/* Bouton Upload Image */}
          <label className="cursor-pointer p-3 text-zinc-500 hover:text-blue-500 transition-colors">
            <ImagePlus size={22} />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          <input 
            value={input} 
            onChange={(e)=>setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
            placeholder={image ? "Describe the context..." : "Ask RizzMaster..."} 
            className="bg-transparent flex-1 p-3 outline-none text-sm font-medium text-white placeholder:text-zinc-600" 
          />
          
          <button onClick={handleSend} className="bg-blue-600 text-white p-3 rounded-[20px] active:scale-90 transition-all shadow-lg shadow-blue-600/30">
            <Send size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
}