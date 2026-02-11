import Papa from 'papaparse'; // On va l'installer juste après

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSWrcgV63CM7eC7xw6IsGfc-ZAUOR3Rr2auTa6mofspsFDAFePdYgi3PYsMaKQ49bE3hYMASf5VJNLx/pub?output=csv";

export const fetchRizzData = () => {
  return new Promise((resolve) => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};