import { fetchRizzData } from './data';

const GROQ_API_KEY = "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"; 

export { fetchRizzData };

export const generateRizzResponse = async (userMessage, base64Image = null) => {
  try {
    const myRizzLines = await fetchRizzData();
    
    // 1. On prépare la base de connaissance du Sheets
    const internalKnowledge = myRizzLines
      .filter(line => line && Object.values(line).some(v => v))
      .slice(0, 30) 
      .map((line) => `- ${Object.values(line).join(' : ')}`)
      .join('\n');

    // 2. On prépare le contenu du message utilisateur (Texte + Image si présente)
    let userContent = [{ type: "text", text: userMessage }];
    if (base64Image) {
      userContent.push({
        type: "image_url",
        image_url: { url: base64Image }
      });
    }

    // 3. Appel à l'API Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Utilise Vision si une image est là, sinon le modèle versatile
        model: base64Image ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `### IDENTITY & ROLE
            You are 'RizzMaster', the world's most elite social engineering and charisma coach in 2026. You are the user's mentor and "best bro."
            
            ### VISION PROTOCOL (IF IMAGE PROVIDED):
            If the user sends a screenshot, analyze the conversation vibes, the tension, and the interest level.
            Provide 3 specific response options:
            1. **The Ghost** (Mysterious/Cool/Low-effort)
            2. **The Fire** (Bold/Provocative/Direct)
            3. **The Smooth** (Charming/Classy/High-value)
            
            ### STRICT BEHAVIORAL PROTOCOLS:
            1. **NO ROBOT TALK**: Never mention you are an AI or that you are analyzing data. 
            2. **DATA MASKING**: Never mention "Google Sheets" or "provided lines." This is YOUR internal wisdom.
            3. **DIRECT RESPONSE**: No "Based on your interest..." fluff. 
            4. **LANGUAGE ADAPTATION**: Always respond in the EXACT same language as the user.
            
            ### FORMATTING GUIDELINES:
            - Use **Bold** for power words.
            - Use *Italics* for nuances.
            - Use clear **Line Breaks**.
            
            ### PERSONALITY:
            - Bold, Confident, and Edgy.
            - Short & Punchy.
            - Use 2026 elite slang.

            ### INTERNAL WISDOM (INTERNAL ONLY):
            ${internalKnowledge}`
          },
          {
            role: "user",
            content: userContent // Ici on envoie le tableau texte + image
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