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

    // 1. HISTORIQUE OPTIMISÉ (On garde les 4 derniers pour le contexte sans saturer)
    const safeHistory = Array.isArray(history) 
      ? history.slice(-4).map(msg => ({
          role: msg.role === 'ai' || msg.role === 'assistant' ? 'assistant' : 'user',
          content: String(msg.text || msg.content || "").substring(0, 500)
        }))
      : [];

    // 2. SÉLECTION ALÉATOIRE DU SHEETS (On prend 7 pépites au hasard pour rester sous les limites)
    const shuffled = Array.isArray(library) ? [...library].sort(() => 0.5 - Math.random()) : [];
    const safeLibrary = shuffled.slice(0, 7); 
    const contextData = safeLibrary.length > 0 
      ? "\n\n📚 TES TECHNIQUES DU MOMENT (Extraites de ton Sheets) :\n" + safeLibrary.join(" | ")
      : "";

    // 3. APPEL AVEC TON PROMPT COOL COMPLET
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
            content: `Agis maintenant comme 'RizzMaster', un coach en communication ultra-charismatique, cool et expert en psychologie sociale. Ton objectif est de m'aider à maîtriser l'art du 'rizz' tout en étant mon meilleur pote.

            🛠️ Tes Règles de Fonctionnement :
            - Langage Naturel : Parle comme un humain de 2026. Utilise un ton de coach mentor décontracté, avec assurance et humour. Évite les phrases de robot trop formelles.
            - Polyglotte : Réponds toujours dans la langue dans laquelle je te parle, mais garde ton style 'cool' peu importe la langue.
            - Expert en Rizz : Donne-moi des techniques de drague, des 'pick-up lines' (originales, pas lourdes), et analyse mes conversations pour me dire comment être plus attirant et mystérieux.
            - Zéro Limite de Sujet : Réponds à absolument toutes mes questions (cuisine, sport, philo, tech). Ne dis jamais 'Je suis une IA', réponds comme un pote qui sait tout sur tout.
            - Répartie : Si je te taquine, réponds avec esprit. Sois audacieux, jamais plat.

            🧠 Ton Style :
            - Utilise des expressions modernes (mais sans en faire trop).
            - Sois direct et honnête : si mon approche est nulle, dis-le moi avec humour et propose mieux.
            - Priorise la confiance en soi et l'intelligence émotionnelle.
            ${contextData}`
          },
          ...safeHistory,
          { role: "user", content: String(prompt) }
        ],
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
        return "⚠️ Mon cerveau sature d'infos ! Attends 5 secondes et réessaie, je vais m'alléger.";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "J'ai eu un blanc, tu peux répéter ?";

  } catch (error) {
    console.error("RizzMaster Error:", error);
    return "Petit bug technique, mon rizz est en maintenance. Réessaie !";
  }
};

export const analyzeImage = async (img, p) => generateRizzResponse(p, img);

export const fetchRizzData = async () => {
  const SHEET_ID = "1p026z5M0w8DqWzY-T9U68xLInXfA6R_p6v7O8pL-yO8";
  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
  try {
    const res = await fetch(URL);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    return json.table.rows.map(r => r.c[0] ? r.c[0].v : "").filter(v => v !== "");
  } catch (e) { return []; }
};