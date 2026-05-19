export function getLeadScore(lead: any) {
  let score = 0;

  if (lead.source === "WhatsApp") score += 30;
  if (lead.lastReplyDays < 2) score += 40;
  if (lead.budget > 10000) score += 20;

  if (score > 70) return "Hot";
  if (score > 40) return "Warm";
  return "Cold";
}