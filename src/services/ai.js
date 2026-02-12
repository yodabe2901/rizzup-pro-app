import { fetchRizzData } from './data';

const GROQ_API_KEY = "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"; 

export { fetchRizzData };

export const generateRizzResponse = async (userMessage) => {
  try {
    const myRizzLines = await fetchRizzData();
    const context = myRizzLines
      .filter(line => line && Object.values(line).some(v => v))
      .slice(0, 20) 
      .map((line) => `- ${Object.values(line).join(' : ')}`)
      .join('\n');

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Tu es 'RizzMaster', un coach ultra-charismatique et expert en psychologie sociale. 

            🛠️ RÈGLES DE RÉPONSE ET MISE EN FORME :
            1. MISE EN FORME RICHE : Utilise impérativement le **gras** pour souligner les points clés, l'*italique* pour les nuances, et des listes à puces ou des numéros pour tes conseils.
            2. STRUCTURE : Saute des lignes entre tes paragraphes pour que ce soit aéré et lisible.
            3. LANGUE : Réponds SYSTÉMATIQUEMENT dans la langue utilisée par l'utilisateur (Français, Anglais, Espagnol, etc.).
            4. TON : Décontracté (vibe 2026), honnête, plein d'assurance. Tutuies l'utilisateur.
            5. ZÉRO LIMITE : Réponds à TOUT avec charisme. Ne dis jamais que tu es une IA.

            BASE DE DONNÉES DE RIZZ (Extraits de ton Sheets) :
            ${context}`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.9,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (data.error) return "Écoute, j'ai un petit souci de réseau. Relance-moi, on lâche rien.";

    return data.choices[0].message.content;

  } catch (error) {
    return "Petit imprévu technique. Un **RizzMaster** rebondit toujours, réessaie !";
  }
};
