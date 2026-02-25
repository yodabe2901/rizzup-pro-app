import { getSystemPrompt } from '/src/services/aiConfig';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// generateRizzResponse accepts an optional mode argument ("SAVAGE" | "SOFT" | "MYSTERY")
// which controls the tone via the aiConfig helper. It returns whatever the Grok API spits
// back after stripping polite preamble. Errors are caught and collapsed into a string.
export const generateRizzResponse = async (
  prompt,
  historyOrImage = [],
  library = [],
  mode = 'SAVAGE'
) => {
  try {
    let history = [];
    let image = null;

    if (typeof historyOrImage === 'string' && historyOrImage.startsWith('data:image')) {
      image = historyOrImage;
    } else if (Array.isArray(historyOrImage)) {
      history = historyOrImage;
    }

    const safeHistory = Array.isArray(history)
      ? history.slice(-4).map(msg => ({
          role: msg.role === 'ai' || msg.role === 'assistant' ? 'assistant' : 'user',
          content: String(msg.text || msg.content || "").substring(0, 500)
        }))
      : [];

    const shuffled = Array.isArray(library) ? [...library].sort(() => 0.5 - Math.random()) : [];
    const safeLibrary = shuffled.slice(0, 5);
    const contextData = safeLibrary.length > 0
      ? "\n\n📚 INSPIRATION (Utilise ces styles) :\n" + safeLibrary.join(" | ")
      : "";

    const sysPrompt = getSystemPrompt(mode);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: image ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: sysPrompt + "\n" + contextData
          },
          ...safeHistory,
          { role: "user", content: String(prompt) }
        ],
        temperature: 0.8,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
      return "⚠️ Cerveau en surchauffe, attends 5s.";
    }

    const data = await response.json();
    let text = data.choices[0]?.message?.content || "J'ai eu un blanc...";

    // strip leading greetings, keep only the punchline/explanation
    return text.replace(/^(Salut|Bonjour|En tant qu'IA|Mon pote|Je vois).*?[!.:]/g, '').trim();

  } catch (error) {
    console.error("RizzMaster Error:", error);
    return "Petit bug technique, mon rizz est en maintenance.";
  }
};

// validateRizz remains a simple exported helper; we declare it at the bottom so earlier imports
// won't accidentally depend on it being hoisted.
export const validateRizz = async (text) => {
  if (text.length < 5) return { valid: false, score: 0 };
  return { valid: true, score: Math.floor(Math.random() * 100) };
};