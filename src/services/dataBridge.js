/**
 * DATABRIDGE - Sécurise les flux de données sans toucher aux prompts IA
 */

// Nettoyage spécifique pour le format bizarre de Google Sheets
export const cleanSheetsResponse = (rawText) => {
  try {
    const match = rawText.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
    if (!match || !match[1]) return null;
    const json = JSON.parse(match[1]);
    return json.table.rows
      .map(row => (row.c && row.c[0] ? row.c[0].v : null))
      .filter(v => v !== null);
  } catch (e) {
    console.error("Bridge Error: Format JSON Sheets invalide", e);
    return null;
  }
};

// Vérificateur de Clé API pour éviter les erreurs 401 silencieuses
export const checkApiConfig = (key) => {
  if (!key || key.length < 10) {
    console.warn("⚠️ BRIDGE WARNING: Clé API Groq manquante ou trop courte.");
    return false;
  }
  return true;
};