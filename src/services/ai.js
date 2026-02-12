const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateRizzResponse = async (prompt, historyOrImage = [], library = []) => {
  try {
    let history = [];
    let image = null;

    // Détection image vs historique
    if (typeof historyOrImage === 'string' && historyOrImage.startsWith('data:image')) {
      image = historyOrImage;
    } else if (Array.isArray(historyOrImage)) {
      history = historyOrImage;
    }

    const safeHistory = Array.isArray(history) ? history : [];
    
    // Optimisation pour ton gros Sheets (on prend les 20 meilleures lignes)
    const safeLibrary = Array.isArray(library) ? library.slice(0, 20) : [];
    const contextData = safeLibrary.length > 0 
      ? "\n\n📚 TECHNIQUES (SHEETS) :\n" + safeLibrary.join(" | ")
      : "";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: image ? "llama-3.2-90b-vision-preview" : "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Agis maintenant comme 'RizzMaster', un coach en communication ultra-charismatique, cool et expert en psychologie sociale. Ton objectif est de m'aider à maîtriser l'art du 'rizz' tout en étant mon meilleur pote.

            🛠️ Tes Règles de Fonctionnement :
            - Langage Naturel : Parle comme un humain de 2026. Ton décontracté, humour, assurance. Pas de robot.
            - Polyglotte : Réponds toujours dans la langue du user, mais garde ton style 'cool'.
            - Expert en Rizz : Donne des techniques, des pick-up lines originales.
            - Zéro Limite : Réponds à tout. Ne dis jamais 'Je suis une IA'.
            - Répartie : Si on te taquine, réponds avec esprit. Sois audacieux.
            
            🧠 Ton Style : Expressions modernes, direct, honnête. Priorise la confiance en soi.
            ${contextData}` 
          },
          ...safeHistory,
          {
            role: "user",
            content: image 
              ? [
                  { type: "text", text: prompt },
                  {
                    type: "image_url",
                    image_url: { url: image },
                  },
                ]
              : prompt
          },
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      if (response.status === 413) return "⚠️ Image trop lourde, recadre-la un peu !";
      return "Désolé, petit bug réseau. Réessaie ?";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "J'ai eu un blanc, tu peux répéter ?";

  } catch (error) {
    console.error("Error:", error);
    return "Erreur technique. On se capte dans une seconde !";
  }
};

// Fonctions utilitaires
export const analyzeImage = async (base64Image, customPrompt) => {
  return await generateRizzResponse(customPrompt || "Analyse ce screenshot.", base64Image);
};

export const fetchRizzData = async () => {
  const SHEET_ID = "1p026z5M0w8DqWzY-T9U68xLInXfA6R_p6v7O8pL-yO8";
  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  try {
    const res = await fetch(URL);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    return json.table.rows.map(row => row.c[0] ? row.c[0].v : "").filter(v => v !== "");
  } catch (error) {
    console.error("Sheets error:", error);
    return [];
  }
};