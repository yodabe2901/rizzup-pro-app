import { fetchRizzData } from './data';

export { fetchRizzData };

export const generateRizzResponse = async (userMessage) => {
  const myRizzLines = await fetchRizzData();
  const prompt = userMessage.toLowerCase();

  // 🧠 LOGIQUE D'IA LOCALE (Recherche par mots-clés dans ton Sheets)
  // On cherche si un mot de la question de l'utilisateur est dans ton Sheets
  let bestMatch = myRizzLines.find(line => {
    const content = (line.RizzLine + " " + (line.Description || "")).toLowerCase();
    return prompt.split(' ').some(word => word.length > 3 && content.includes(word));
  });

  // Si aucun match précis, on prend une ligne au hasard
  if (!bestMatch) {
    bestMatch = myRizzLines[Math.floor(Math.random() * myRizzLines.length)];
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      if (bestMatch) {
        // L'IA simule une réflexion basée sur le Sheets
        const responses = [
          `Analyse terminée. Ma base de données suggère : "${bestMatch.RizzLine}"`,
          `Pour cette situation, utilise ça : "${bestMatch.RizzLine}"`,
          `D'après ton Sheets, la meilleure approche est : "${bestMatch.RizzLine}"`
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      } else {
        resolve("Je n'ai pas encore assez de données dans ton Sheets pour répondre à ça. Ajoute plus de rizz !");
      }
    }, 1200);
  });
};

export const validateRizz = async (text) => {
  return text && text.length >= 5;
};
