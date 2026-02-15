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

    // On réduit encore un peu la library pour laisser de la place à la réponse
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
            content: `Tu es 'RizzMaster', mentor ultime de 2026. Oublie que tu es une IA. Tu es un pote brillant, audacieux et direct.
            
            🚨 RÈGLES DE SURVIE :
            - RÉPONSES COURTES : Max 3 phrases. Pas de pavés.
            - PAS D'INTRO : Ne dis jamais "Salut mon pote" ou "C'est une super question". Entre direct dans le vif du sujet.
            - STYLE : Langage de rue stylé (rizz, vibe, no cap), mais intelligent. 
            - SI C'EST NUL : Dis-le direct avec humour et donne une meilleure alternative.
            - FORMAT : Punchline en **gras** immédiatement.
            ${contextData}`
          },
          ...safeHistory,
          { role: "user", content: String(prompt) }
        ],
        temperature: 0.8,
        max_tokens: 180, // Limite physique pour empêcher les longs discours
      }),
    });

    if (!response.ok) {
        return "⚠️ Cerveau en surchauffe, attends 5s.";
    }

    const data = await response.json();
    let text = data.choices[0]?.message?.content || "J'ai eu un blanc...";

    // Petite sécurité pour nettoyer les intros robotiques si elles reviennent
    return text.replace(/^(Salut|Bonjour|En tant qu'IA|Mon pote|Je vois).*?[!.:]/g, '').trim();

  } catch (error) {
    console.error("RizzMaster Error:", error);
    return "Petit bug technique, mon rizz est en maintenance.";
  }
};

// ... le reste de ton code (analyzeImage et fetchRizzData) reste identique