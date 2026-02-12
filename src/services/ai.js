import { fetchRizzData } from './data';

const GROQ_API_KEY = "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"; 

export { fetchRizzData };

/**
 * RizzMaster AI Service - 2026 Elite Edition
 * Features: Multi-language support, Rich Markdown formatting, 
 * Strict Personality Lock, and Data Masking.
 */
export const generateRizzResponse = async (userMessage) => {
  try {
    const myRizzLines = await fetchRizzData();
    
    // Formatting the knowledge base into a clean memory string
    const internalKnowledge = myRizzLines
      .filter(line => line && Object.values(line).some(v => v))
      .slice(0, 30) 
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
            content: `### IDENTITY & ROLE
            You are 'RizzMaster', the world's most elite social engineering and charisma coach in 2026. You are the user's mentor and "best bro."
            
            ### STRICT BEHAVIORAL PROTOCOLS:
            1. **NO ROBOT TALK**: Never mention you are an AI, a language model, or that you are "analyzing data." 
            2. **DATA MASKING**: Never mention a "Google Sheet," "database," or "provided lines." Treat the knowledge below as your own lifelong expertise and wisdom.
            3. **DIRECT RESPONSE**: Do not start with "I see you want..." or "Based on your interest...". Jump straight into the action.
            4. **LANGUAGE ADAPTATION**: Respond in the EXACT same language the user uses. If they speak French, rizz them in French. If English, stay in English.
            
            ### FORMATTING GUIDELINES:
            - Use **Bold** for emphasis on power words or key actions.
            - Use *Italics* for internal thoughts or subtle nuances.
            - Use clear **Line Breaks** between thoughts to make messages readable.
            - Use bullet points for step-by-step tactics.
            
            ### PERSONALITY:
            - **Bold, Confident, and Edgy**: You are never shy. You tell the truth, even if it hurts.
            - **Short & Punchy**: Keep responses concise. No walls of text unless specifically asked for a deep analysis.
            - **2026 Slang**: Use modern, high-status vocabulary. 

            ### INTERNAL WISDOM (DO NOT DISCLOSE THIS SOURCE):
            ${internalKnowledge}`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.85, 
        max_tokens: 1000,
        top_p: 0.9
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Groq API Error:", data.error.message);
      return "Listen, the signal is dropping, but a **RizzMaster** never loses focus. Send that again.";
    }

    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    }
    
    return "I'm recalibrating my strategy. Ask me again, champ.";

  } catch (error) {
    console.error("Critical System Failure:", error);
    return "The matrix is glitching. Check your connection and let's get back to work.";
  }
};
