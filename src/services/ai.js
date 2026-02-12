const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * 1. GÉNÉRATION DE TEXTE (CHAT & INSTANT RIZZ)
 * Inclut maintenant une mémoire courte et un formatage Markdown riche.
 */
export const generateRizzResponse = async (prompt, history = []) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Tu es RizzUP AI, l'expert mondial en charisme et psychologie sociale.
            
            RÈGLES D'OR :
            1. STYLE : Réponses courtes, punchy, et haut de gamme. Utilise un ton de coach mentor.
            2. FORMAT : Utilise le Markdown (**gras**, *italique*) pour souligner les mots clés.
            3. STRATÉGIE : Ne sois jamais passif. Si l'utilisateur demande une ligne, donne-lui une option 'Safe' et une option 'Risk'.
            4. LANGUE : Réponds toujours en Français, sauf si on te demande spécifiquement une ligne en Anglais.`
          },
          ...history, // On réinjecte l'historique pour qu'il sache de quoi on parlait
          { role: "user", content: prompt }
        ],
        temperature: 0.85,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return "**Erreur de réseau.** Garde ton sang-froid, le charisme ne dépend pas du Wi-Fi.";
  }
};

/**
 * 2. ANALYSE D'IMAGE (VISION) 
 * Le cerveau qui décode les screenshots de Tinder/Instagram.
 */
export const analyzeImage = async (base64Image, customPrompt) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.2-90b-vision-preview", 
        messages: [
          {
            role: "system",
            content: `Tu es un expert en analyse de captures d'écran de messagerie.
            
            TA MISSION :
            1. Décoder la "Vibe" : Qui mène la danse ? Est-ce que l'autre personne est intéressée (IOI) ou froide (IOD) ?
            2. Analyse psychologique : Détecte les non-dits et les tests de l'autre personne.
            3. Recommandations : Fournis 3 réponses distinctes :
               - 👻 **The Ghost** (Détachement, mystère)
               - 🔥 **The Fire** (Taquin, challengeant)
               - 🍯 **The Smooth** (Direct, charmeur)
            
            Formatte ta réponse avec des titres clairs et des emojis.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: customPrompt || "Analyse ce screenshot et dis-moi quoi répondre pour reprendre l'avantage." },
              {
                type: "image_url",
                image_url: { url: base64Image },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Vision Error:", error);
    throw error;
  }
};

/**
 * 3. GOOGLE SHEETS DATA
 */
export const fetchRizzData = async () => {
  const SHEET_ID = "1p026z5M0w8DqWzY-T9U68xLInXfA6R_p6v7O8pL-yO8"; // Vérifie cet ID
  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  try {
    const res = await fetch(URL);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    return json.table.rows.map(row => row.c[0] ? row.c[0].v : "").filter(v => v !== "");
  } catch (error) {
    console.error("Sheets error:", error);
    return ["Ligne de secours : 'Tu as l'air d'avoir un problème, et je pense être la solution.'"];
  }
};