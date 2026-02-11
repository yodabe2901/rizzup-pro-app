import { fetchRizzData } from './data';

export const generateRizzResponse = async (userMessage) => {
  const myRizzLines = await fetchRizzData();
  
  // On transforme tes lignes Sheets en un texte pour l'IA
  const context = myRizzLines.map(line => `Example: ${line.RizzLine}`).join("\n");

  // Simulation de l'appel OpenAI avec ton contexte personnalisé
  console.log("L'IA s'inspire de :", context);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Based on my elite database, you should say: "${myRizzLines[0]?.RizzLine || 'Be yourself, but better.'}"`);
    }, 1000);
  });
};
export const validateRizz = async (text) => {
  // Simulation de validation IA
  // Dans une vraie app, on demande à GPT: "Est-ce que cette phrase est une pick-up line ?"
  if (text.length < 10) return false; // Trop court = pas de Rizz
  return true; 
};