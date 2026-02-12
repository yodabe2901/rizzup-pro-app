import { fetchRizzData } from './data';

const GROQ_API_KEY = "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"; 

export { fetchRizzData };

export const generateRizzResponse = async (userMessage) => {
  try {
    const myRizzLines = await fetchRizzData();
    
    // On nettoie les données pour ne pas envoyer n'importe quoi à l'API
    const context = myRizzLines
      .filter(line => line && Object.values(line).some(v => v))
      .slice(0, 15) // On limite aux 15 premières lignes pour ne pas saturer l'API
      .map((line, i) => `Technique ${i+1}: ${Object.values(line).join(' - ')}`)
      .join('\n');

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `Tu es RizzUp Coach. Utilise ce contexte : ${context}. Réponds en français, court et stylé.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // SÉCURITÉ : On vérifie si l'API a renvoyé une erreur (ex: clé bloquée)
    if (data.error) {
      console.error("Erreur API Groq:", data.error.message);
      return "Désolé, ma clé API semble bloquée par GitHub ou invalide. Regénère une clé sur Groq !";
    }

    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    }
    
    return "Je n'ai pas pu formuler de réponse. Réessaie ?";

  } catch (error) {
    console.error("Erreur Catch:", error);
    return "Problème de connexion. Vérifie ta console !";
  }
};
