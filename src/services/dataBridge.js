const PUB_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSWrcgV63CM7eC7xw6IsGfc-ZAUOR3Rr2auTa6mofspsFDAFePdYgi3PYsMaKQ49bE3hYMASf5VJNLx/pub?output=csv";

export const getSheetsData = async () => {
  try {
    const res = await fetch(PUB_URL);
    
    // Si Google Sheets ne répond pas bien
    if (!res.ok) {
      console.warn("Sheets non accessible, retour d'un tableau vide.");
      return []; 
    }

    const csvText = await res.text();
    
    // On transforme le texte en tableau de lignes
    const lines = csvText.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 2); // On ignore les lignes vides

    // GARANTIE : On renvoie toujours un tableau, même vide
    return Array.isArray(lines) ? lines : [];

  } catch (error) {
    console.error("Erreur critique dataBridge/getSheetsData:", error);
    return [];
  }
};

// write helper – in a real app this would call a Google Sheets API or
// webhook. we simulate with fetch and guard against connection loss.
export const saveAnalysis = async (row) => {
  try {
    // pretend there is an endpoint that accepts JSON rows
    const endpoint = import.meta.env.VITE_SHEETS_WRITE_URL;
    if (!endpoint) {
      console.warn('No write endpoint configured, discarding', row);
      return false;
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });

    if (!res.ok) {
      throw new Error(`Sheets write failed: ${res.status}`);
    }

    return true;
  } catch (err) {
    // fail silently but log the problem; app should not crash.
    console.error('dataBridge.saveAnalysis error:', err);
    return false;
  }
};