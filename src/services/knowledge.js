import { getSheetsData } from './dataService';

/**
 * Prépare le contexte pour l'IA en fusionnant les données du Sheets.
 * Retourne une chaîne de caractères prête à être injectée.
 */
let _cachedContext = null;

export const getContextFromSheets = async () => {
  // return cached copy if already fetched during this session
  if (_cachedContext) return _cachedContext;

  try {
    const data = await getSheetsData();
    if (!data || !Array.isArray(data)) return "";

    const context = "\n\nVoici tes connaissances supplémentaires issues du Google Sheets :\n" + data.join("\n");
    _cachedContext = context; // store for later calls
    return context;
  } catch (error) {
    console.error("Erreur Knowledge Bridge:", error);
    return "";
  }
};