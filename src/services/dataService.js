import { saveAnalysis } from './dataBridge';

const PUB_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSWrcgV63CM7eC7xw6IsGfc-ZAUOR3Rr2auTa6mofspsFDAFePdYgi3PYsMaKQ49bE3hYMASf5VJNLx/pub?output=csv";

export const getSheetsData = async () => {
  try {
    const res = await fetch(PUB_URL);
    if (!res.ok) throw new Error("Impossible de lire le Sheets");
    const csvText = await res.text();
    
    // On transforme le CSV en un tableau de lignes propres
    const lines = csvText.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 5); // Filtre les lignes vides ou trop courtes

    return lines;
  } catch (error) {
    console.error("Erreur Sheets:", error);
    return [];
  }
};

// convert analyzer output into a sheet-friendly row format
export const prepareSheetRow = (analysis) => {
  const { Score, Status, Feedback } = analysis;
  return {
    Timestamp: new Date().toISOString(),
    Score,
    Status,
    Feedback,
  };
};

// high-level helper used by callers to record the result
export const recordAnalysis = async (analysis) => {
  const row = prepareSheetRow(analysis);
  return await saveAnalysis(row);
};
