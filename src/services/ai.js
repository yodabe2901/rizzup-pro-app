import { fetchRizzData } from './data';

export { fetchRizzData };

export const generateRizzResponse = async (userMessage) => {
  const input = userMessage.toLowerCase().trim();
  
  // 1. GESTION DES SALUTATIONS (Le "Cerveau" social)
  const greetings = ['bonjour', 'salut', 'hello', 'ca va', 'ça va', 'wesh', 'yo'];
  if (greetings.some(g => input.includes(g))) {
    const helloResponses = [
      "Salut ! Prêt à devenir un maître du Rizz ? Pose-moi une question ou demande-moi une technique.",
      "Yo ! Je suis connecté à ton Sheets. On booste ton game aujourd'hui ?",
      "Hello ! Dis-moi ce qu'il te faut : une bio, une phrase d'accroche ou un conseil ?"
    ];
    return helloResponses[Math.floor(Math.random() * helloResponses.length)];
  }

  // 2. RÉCUPÉRATION DES DONNÉES DU SHEETS
  const myRizzLines = await fetchRizzData();
  
  // On filtre pour éviter les lignes vides
  const cleanData = myRizzLines.filter(line => Object.values(line).some(v => v && v.length > 0));

  if (cleanData.length === 0) {
    return "Ton Sheets est vide ! Ajoute des phrases dans la colonne 'RizzLine' pour que je puisse t'aider.";
  }

  // 3. RECHERCHE SÉMANTIQUE (Match avec le Sheets)
  let match = cleanData.find(line => {
    const text = Object.values(line).join(" ").toLowerCase();
    return input.split(' ').some(word => word.length > 3 && text.includes(word));
  });

  // Si pas de match précis, on prend une ligne au hasard
  const result = match || cleanData[Math.floor(Math.random() * cleanData.length)];
  
  // Sécurité contre le "undefined" : on cherche n'importe quelle valeur textuelle dans la ligne
  const rizzPhrase = result.RizzLine || Object.values(result).find(v => v && v.length > 1) || "Reste toi-même, c'est ton meilleur atout.";

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Analyse de ton Sheets terminée : "${rizzPhrase}"`);
    }, 800);
  });
};
