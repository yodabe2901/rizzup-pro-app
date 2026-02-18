const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateRizzResponse = async (prompt, historyOrImage = [], library = []) => {
  try {
    let history = [];
    let image = null;

    if (typeof historyOrImage === 'string' && historyOrImage.startsWith('data:image')) {
      image = historyOrImage;
    } else if (Array.isArray(historyOrImage)) {
      history = historyOrImage;
    }

    const safeHistory = Array.isArray(history) 
      ? history.slice(-4).map(msg => ({
          role: msg.role === 'ai' || msg.role === 'assistant' ? 'assistant' : 'user',
          content: String(msg.text || msg.content || "").substring(0, 500)
        }))
      : [];

    const shuffled = Array.isArray(library) ? [...library].sort(() => 0.5 - Math.random()) : [];
    const safeLibrary = shuffled.slice(0, 5); 
    const contextData = safeLibrary.length > 0 
      ? "\n\n📚 INSPIRATION (Utilise ces styles) :\n" + safeLibrary.join(" | ")
      : "";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: image ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Tu es 'RizzMaster', mentor de 2026. Tu n'es pas un assistant, tu es une légende de la répartie. 

🚨 RÈGLES DE SURVIE :
- INTERDICTION de faire de la psychologie de comptoir ou d'être trop gentil.
- STYLE : Direct, audacieux, un peu provocateur.
- SI L'USER SE PLAINT : Recadre-le direct avec humour.
- FORMAT : Une punchline **en gras** d'abord, une explication tactique ensuite.

Exemple : "**Le charisme bat la génétique 10-0.** Si t'as pas la gueule, travaille le style et l'audace."

${contextData}`
          }, // <--- La virgule et l'accolade manquaient ici !
          ...safeHistory,
          { role: "user", content: String(prompt) }
        ],
        temperature: 0.8,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
        return "⚠️ Cerveau en surchauffe, attends 5s.";
    }

    const data = await response.json();
    let text = data.choices[0]?.message?.content || "J'ai eu un blanc...";

    return text.replace(/^(Salut|Bonjour|En tant qu'IA|Mon pote|Je vois).*?[!.:]/g, '').trim();

  } catch (error) {
    console.error("RizzMaster Error:", error);
    return "Petit bug technique, mon rizz est en maintenance.";
  }
};
// Ajoute ceci dans src/services/ai.js
export const validateRizz = async (text) => {
  // Simule une vérification de qualité du Rizz
  if (text.length < 5) return { valid: false, score: 0 };
  return { valid: true, score: Math.floor(Math.random() * 100) };
};