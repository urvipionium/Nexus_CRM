export function getAISuggestion(deal: any) {
  if (deal.probability < 40) return "Send discount offer";
  if (deal.noReplyDays > 3) return "Follow-up urgently";
  return "Keep nurturing";
}