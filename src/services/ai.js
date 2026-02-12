import { fetchRizzData } from './data';

// IMPORTANT : On ré-exporte fetchRizzData pour que App.jsx puisse l'utiliser
export { fetchRizzData };

export const generateRizzResponse = async (userMessage) => {
  const myRizzLines = await fetchRizzData();
  
  // On sélectionne une ligne au hasard dans ton Sheets
  const randomLine = myRizzLines[Math.floor(Math.random() * myRizzLines.length)];

  return new Promise((resolve) => {
    setTimeout(() => {
      if (randomLine && randomLine.RizzLine) {
        resolve(`D'après mon analyse Sheets, tu devrais dire : "${randomLine.RizzLine}"`);
      } else {
        resolve("Mon cerveau Sheets est vide... Ajoute des lignes dans ton tableau !");
      }
    }, 1000);
  });
};

export const validateRizz = async (text) => {
  // Simple validation : plus de 5 caractères = Rizz valide
  return text && text.length >= 5;
};
