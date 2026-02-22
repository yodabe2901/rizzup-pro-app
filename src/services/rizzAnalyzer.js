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