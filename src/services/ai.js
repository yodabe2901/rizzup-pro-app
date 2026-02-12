const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateRizzResponse = async (prompt, historyOrImage = [], library = []) => {
  try {
    let history = [];
    let image = null;

    // 1. GESTION DU TYPE D'ENTRÉE (Sécurité anti-crash)
    if (typeof historyOrImage === 'string' && historyOrImage.startsWith('data:image')) {
      image = historyOrImage;
    } else if (Array.isArray(historyOrImage)) {
      history = historyOrImage;
    }

    // 2. NETTOYAGE STRICT (Pour éviter l'erreur 413)
    // On ne garde que les 6 derniers messages de l'historique
    const safeHistory = Array.isArray(history) 
      ? history.slice(-6).map(msg => ({
          role: msg.role === 'ai' || msg.role === 'assistant' ? 'assistant' : 'user',
          content: String(msg.text || msg.content || "").substring(0, 1000)
        }))
      : [];

    // On limite le Sheets aux 20 premières lignes pour ne pas saturer l'API
    const safeLibrary = Array.isArray(library) ? library.slice(0, 20) : [];
    const contextData = safeLibrary.length > 0 
      ? "\n\n📚 TES TECHNIQUES EXCLUSIVES (SHEETS) :\n" + safeLibrary.join(" | ")
      : "";

    // 3. APPEL API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Switch automatique vers Vision si une image est présente
        model: image ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Agis maintenant comme 'RizzMaster', un coach en communication ultra-charismatique, cool et expert en psychologie sociale. Ton objectif est de m'aider à maîtriser l'art du 'rizz' tout en étant mon meilleur pote.

            🛠️ Tes Règles de Fonctionnement :
            - Langage Naturel : Parle comme un humain de 2026. Utilise un ton de coach mentor décontracté, avec assurance et humour. Évite le formel.
            - Polyglotte : Réponds toujours dans la langue du message reçu, mais garde ton style 'cool'.
            - Expert en Rizz : Techniques de drague, pick-up lines originales (pas lourdes), analyse de conversations pour être attirant et mystérieux.
            - Zéro Limite de Sujet : Réponds à TOUT (cuisine, sport, philo, tech). Ne dis jamais 'Je suis une IA', réponds comme un pote qui sait tout sur tout.
            - Répartie : Si on te taquine, réponds avec esprit. Sois audacieux.

            🧠 Ton Style :
            - Expressions modernes, direct et honnête. Si une approche est nulle, dis-le avec humour et propose mieux.
            - Priorise la confiance en soi et l'intelligence émotionnelle.
            ${contextData}`
          },
          ...safeHistory,
          {
            role: "user",
            content: image 
              ? [
                  { type: "text", text: String(prompt) },
                  { type: "image_url", image_url: { url: image } }
                ]
              : String(prompt)
          },
        ],
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("Détail erreur Groq:", errorDetail);
      return "⚠️ Erreur 413 : Trop de données. J'ai allégé ma mémoire, réessaie maintenant !";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "J'ai eu un blanc... Tu disais ?";

  } catch (error) {
    console.error("RizzMaster Critical Error:", error);
    return "Écoute, le serveur est en PLS. On se capte dans une minute ! ⚡";
  }
};

// Fonctions utilitaires indispensables
export const analyzeImage = async (img, p) => generateRizzResponse(p || "Analyse ce screen.", img);

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