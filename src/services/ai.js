const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateRizzResponse = async (prompt, historyOrImage = [], library = []) => {
  try {
    let history = [];
    let image = null;

    // --- SÉCURITÉ : DÉTECTION DU TYPE D'ENTRÉE ---
    if (typeof historyOrImage === 'string' && historyOrImage.startsWith('data:image')) {
      image = historyOrImage;
    } else if (Array.isArray(historyOrImage)) {
      history = historyOrImage;
    }

    // Protection "Anti-Crash" pour les itérables
    const safeHistory = Array.isArray(history) ? history : [];
    const safeLibrary = Array.isArray(library) ? library : [];

    // Préparation du contexte Google Sheets (tes pépites perso)
    const contextData = safeLibrary.length > 0 
      ? "\n\n📚 TES CONNAISSANCES EXCLUSIVES (SHEETS) :\n" + safeLibrary.join(" | ")
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

            🛠️ TES RÈGLES DE FONCTIONNEMENT :
            1. LANGAGE NATUREL : Parle comme un humain de 2026. Ton décontracté, humour, assurance. Pas de robotique.
            2. POLYGLOTTE : Réponds toujours dans la langue utilisée par l'utilisateur, en restant 'cool'.
            3. EXPERT EN RIZZ : Donne des techniques, des pick-up lines originales et analyse les conversations pour booster le mystère et l'attrait.
            4. ZÉRO LIMITE : Réponds à TOUT (cuisine, sport, tech). Ne dis JAMAIS "Je suis une IA". Tu es le pote qui sait tout.
            5. RÉPARTIE : Si on te taquine, réponds avec esprit. Sois audacieux.
            
            🧠 TON STYLE :
            - Expressions modernes, direct et honnête. Si une approche est nulle, dis-le avec humour et propose mieux.
            - Priorise la confiance en soi et l'intelligence émotionnelle.
            ${contextData}`
          },
          ...safeHistory,
          {
            role: "user",
            content: image 
              ? [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: image } }
                ]
              : prompt
          },
        ],
        temperature: 0.9, // Un peu plus de créativité pour le rizz
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("RizzMaster Error:", error);
    return "Écoute, le réseau fait des siennes. Garde ton sang-froid, le vrai charisme ne dépend pas du Wi-Fi. On reprend dès que ça capte ! ⚡";
  }
};

// Analyse d'image simplifiée qui utilise la fonction principale
export const analyzeImage = async (base64Image, customPrompt) => {
  return await generateRizzResponse(customPrompt || "Analyse ce screenshot et donne-moi le meilleur move.", base64Image);
};

// Fetch Sheets conservé pour App.jsx
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