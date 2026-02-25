// basic analyser that returns sentiment and a crude xp reward
export const analyzeCommentSentiment = async (comment) => {
  const positiveKeywords = ['w rizz', 'incroyable', 'smooth', 'goat', 'pro', 'chef d\'oeuvre', 'incroyable', 'validé'];
  const negativeKeywords = ['l rizz', 'mid', 'bad', 'cringe', 'weird', 'nul'];

  const text = comment.toLowerCase();
  let score = 0;

  if (positiveKeywords.some(word => text.includes(word))) score = 100;
  else if (negativeKeywords.some(word => text.includes(word))) score = -50;

  return {
    sentiment: score > 0 ? 'POSITIVE' : score < 0 ? 'NEGATIVE' : 'NEUTRAL',
    xpReward: score
  };
};

// wrapper that maps to the shape expected by dataService/sheets
export const analyzeRizz = async (text) => {
  const { sentiment, xpReward } = await analyzeCommentSentiment(text);
  const Score = xpReward;
  const Status = sentiment === 'POSITIVE' ? 'W Rizz' : sentiment === 'NEGATIVE' ? 'L Rizz' : 'Neutral';
  const Feedback = sentiment === 'POSITIVE' ? 'High energy validated' : sentiment === 'NEGATIVE' ? 'Needs work' : 'Neither good nor bad';
  return { Score, Status, Feedback };
};

// convenience method tying analysis to storage
import { recordAnalysis } from './dataService';
export const analyzeAndRecord = async (text) => {
  const analysis = await analyzeRizz(text);
  // fire and forget, failure shouldn't block caller
  recordAnalysis(analysis).catch(err => console.warn('recordAnalysis failed', err));
  return analysis;
};
