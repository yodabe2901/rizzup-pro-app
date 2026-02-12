import { fetchRizzData } from './data';

const GROQ_API_KEY = "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"; 

export { fetchRizzData };

export const generateRizzResponse = async (userMessage) => {
  try {
    const myRizzLines = await fetchRizzData();
    const context = myRizzLines
      .filter(line => line && Object.values(line).some(v => v))
      .slice(0, 25) 
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
            content: `You are 'RizzMaster', a 2026 elite communication coach. 
            
            RULES:
            1. LANGUAGE: Always respond in the user's language. Default to English.
            2. FORMATTING: Use **bold** for impact, *italics* for nuance. Use bullet points and clear line breaks.
            3. STYLE: Charismatic, bold, honest, and slightly provocative. You are a mentor, not a bot.
            4. SECRET: Never mention "Google Sheets" or "database". The knowledge provided below is YOUR OWN natural expertise.
            5. NO LIMITS: Answer anything (tech, life, dating) with your unique RizzMaster flair.

            YOUR EXPERTISE (INTERNAL KNOWLEDGE):
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
    if (data.error) return "Looks like a glitch in the matrix. Hit me up again.";
    return data.choices[0].message.content;

  } catch (error) {
    return "Technical hiccup. A **RizzMaster** always bounces back. Try again!";
  }
};
