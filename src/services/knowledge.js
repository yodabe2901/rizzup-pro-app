import { getSheetsData } from './dataService';

/**
 * Prépare le contexte pour l'IA en fusionnant les données du Sheets.
 * Retourne une chaîne de caractères prête à être injectée.
 */
export const getContextFromSheets = async () => {
  try {
    const data = await getSheetsData();
    if (!data || !Array.isArray(data)) return "";
    
    // On transforme le tableau en un bloc de texte propre
    return "\n\nVoici tes connaissances supplémentaires issues du Google Sheets :\n" + data.join("\n");
  } catch (error) {
    console.error("Erreur Knowledge Bridge:", error);
    return "";
  }
};