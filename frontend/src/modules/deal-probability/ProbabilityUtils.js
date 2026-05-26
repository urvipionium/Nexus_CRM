export const calculateProbability = (deal) => {
  let score = 0;

  if (deal.stage === "Negotiation") score += 40;
  if (deal.followUpDone) score += 30;
  if (deal.clientResponded) score += 30;

  return Math.min(score, 100);
};
