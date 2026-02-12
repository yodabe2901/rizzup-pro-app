/**
 * DATA SERVICE - Version Publique (Lien de publication)
 */

// Ton nouveau lien de publication converti en format CSV pour une lecture facile
const PUB_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSWrcgV63CM7eC7xw6IsGfc-ZAUOR3Rr2auTa6mofspsFDAFePdYgi3PYsMaKQ49bE3hYMASf5VJNLx/pub?output=csv";

export const getSheetsData = async () => {
  const fallbackData = [
    "Le Rizz est un art, pas une science.",
    "Reste mystérieux, laisse-la poser les questions.",
    "Ton énergie définit ton statut."
  ];

  try {
    const res = await fetch(PUB_URL);
    
    if (!res.ok) throw new Error("Impossible de lire le lien de publication");

    const csvText = await res.text();
    
    // On transforme le CSV en tableau (on sépare par lignes)
    // On enlève la première ligne si c'est un titre (header)
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
    
    // Si tu as un titre en haut de ta colonne, on l'enlève avec .slice(1)
    // Sinon, utilise juste lines
    const data = lines.length > 1 ? lines.slice(1) : lines;

    return data.length > 0 ? data : fallbackData;

  } catch (error) {
    console.error("Erreur DataService (Lien Public):", error);
    return fallbackData; // Retourne toujours un tableau pour éviter l'erreur "not iterable"
  }
};