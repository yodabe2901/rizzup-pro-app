import { fetchRizzData } from './data';

const GROQ_API_KEY = "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"; // <--- COLLE TA CLÉ ICI

export { fetchRizzData };

export const generateRizzResponse = async (userMessage) => {
  const myRizzLines = await fetchRizzData();
  
  // On transforme ton Sheets en texte pour l'IA
  const context = myRizzLines
    .map((line, i) => `Technique ${i+1}: ${Object.values(line).join(' - ')}`)
    .join('\n');

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Modèle ultra rapide et gratuit
        messages: [
          {
            role: "system",
            content: `Tu es RizzUp Coach, un expert en séduction et charisme. 
            Voici ta base de connaissances (ton Sheets) :
            ${context}
            
            Instructions :
            1. Utilise les techniques du Sheets pour répondre.
            2. Si la question est générale (bonjour, etc.), sois cool et charismatique.
            3. Réponds toujours en français, de façon courte et percutante.`
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
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Erreur Groq:", error);
    return "Désolé, mon cerveau est en surchauffe. Vérifie ta clé API !";
  }
};
