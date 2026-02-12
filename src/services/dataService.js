/**
 * DATA SERVICE - Gestion robuste de Google Sheets
 */

const SHEET_ID = "1p026z5M0w8DqWzY-T9U68xLInXfA6R_p6v7O8pL-yO8";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

export const getSheetsData = async () => {
  try {
    const res = await fetch(URL);
    
    // Si Google renvoie une erreur 404 ou autre
    if (!res.ok) throw new Error("Feuille non accessible");

    const text = await res.text();
    
    // On extrait uniquement le JSON pur
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
    
    if (match && match[1]) {
      const json = JSON.parse(match[1]);
      return json.table.rows
        .map(row => (row.c && row.c[0] ? row.c[0].v : null))
        .filter(v => v !== null && v !== "");
    }
    
    throw new Error("Format JSON invalide");

  } catch (error) {
    console.error("DataService Error:", error);
    // TRÈS IMPORTANT : On retourne un tableau par défaut pour éviter l'erreur "i is not iterable"
    return [
      "Le Rizz est un état d'esprit.",
      "Sois la personne la plus intéressante de la pièce.",
      "Le mystère est ton meilleur allié."
    ];
  }
};