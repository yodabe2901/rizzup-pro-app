import { fetchRizzData } from './data';

const GROQ_API_KEY = "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"; 

export { fetchRizzData };

export const generateRizzResponse = async (userMessage) => {
  try {
    const myRizzLines = await fetchRizzData();
    const context = myRizzLines
      .filter(line => line && Object.values(line).some(v => v))
      .slice(0, 20) 
      .map((line, i) => `Technique ${i+1}: ${Object.values(line).join(' - ')}`)
      .join('\n');

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Mise à jour ici
        messages: [
          {
            role: "system",
            content: `Tu es RizzUp Coach, un expert charismatique. Voici ton savoir : ${context}. Réponds en français, sois percutant.`
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

    if (data.error) {
      console.error("Erreur API Groq:", data.error.message);
      return `Oups, petite erreur technique : ${data.error.message}`;
    }

    return data.choices[0].message.content;

  } catch (error) {
    return "Erreur de connexion. Vérifie ta clé ou le modèle !";
  }
};
