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
    // AU LIEU DE REVOYER CONSOLE.ERROR, ON RENVOIE UN TABLEAU VIDE
    console.error("Erreur critique dataService:", error);
    return []; 
  }
};