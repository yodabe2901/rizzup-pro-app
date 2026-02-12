/**
 * DATA SERVICE - Version Ultra-Stable
 */

const SHEET_ID = "1p026z5M0w8DqWzY-T9U68xLInXfA6R_p6v7O8pL-yO8";
// On utilise l'URL de base, le script ajoutera le formatage
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

export const getSheetsData = async () => {
  // Liste de secours au cas où Google Sheets ferait encore des siennes
  const fallbackData = [
    "Le Rizz est un art, pas une science.",
    "Reste mystérieux, laisse-la poser les questions.",
    "Ton énergie définit ton statut."
  ];

  try {
    const res = await fetch(URL);
    
    if (!res.ok) {
      console.error("Sheets inaccessible (404/Private). Utilisation du secours.");
      return fallbackData;
    }

    const text = await res.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
    
    if (match && match[1]) {
      const json = JSON.parse(match[1]);
      const data = json.table.rows
        .map(row => (row.c && row.c[0] ? row.c[0].v : null))
        .filter(v => v !== null && v !== "");
      
      return data.length > 0 ? data : fallbackData;
    }
    
    return fallbackData;

  } catch (error) {
    console.error("Erreur critique DataService:", error);
    return fallbackData; // Garantit qu'on renvoie TOUJOURS un tableau (évite l'erreur iterable)
  }
};