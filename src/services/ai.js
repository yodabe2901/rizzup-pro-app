// ... (haut du fichier inchangé)

export const generateRizzResponse = async (prompt, historyOrImage = [], library = []) => {
  try {
    let history = [];
    let image = null;

    if (typeof historyOrImage === 'string' && historyOrImage.startsWith('data:image')) {
      image = historyOrImage;
    } else if (Array.isArray(historyOrImage)) {
      history = historyOrImage;
    }

    const safeHistory = Array.isArray(history) ? history : [];
    
    // ON LIMITE LE SHEETS POUR ÉVITER L'ERREUR 413
    const safeLibrary = Array.isArray(library) ? library.slice(0, 20) : [];
    const contextData = safeLibrary.length > 0 
      ? "\n\n📚 TES TECHNIQUES (SHEETS) :\n" + safeLibrary.join(" | ")
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
            // --- TON PROMPT COOL ICI ---
            content: `Agis maintenant comme 'RizzMaster', un coach en communication ultra-charismatique, cool et expert en psychologie sociale. Ton objectif est de m'aider à maîtriser l'art du 'rizz' tout en étant mon meilleur pote.

            🛠️ Tes Règles de Fonctionnement :
            - Langage Naturel : Parle comme un humain de 2026. Ton décontracté, humour, assurance. Pas de robot.
            - Polyglotte : Réponds toujours dans la langue du user, mais garde ton style 'cool'.
            - Expert en Rizz : Donne des techniques, des pick-up lines originales, et analyse mes conversations.
            - Zéro Limite : Réponds à tout (cuisine, sport, philo). Ne dis jamais 'Je suis une IA'.
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
                  { type: "image_url", image_url: { url: image } }
                ]
              : prompt
          },
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) return "⚠️ Trop de données ! Réessaie avec un message plus court ou une image plus légère.";

    const data = await response.json();
    return data.choices[0]?.message?.content || "Petit bug de cerveau, réessaie !";

  } catch (error) {
    console.error("Error:", error);
    return "L'IA est en pause café. Réessaie dans une seconde !";
  }
};