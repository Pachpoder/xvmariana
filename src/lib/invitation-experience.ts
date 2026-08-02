export const invitationStages = ["loading", "envelope", "opening", "invitation"] as const;
export type InvitationStage = typeof invitationStages[number];

export function nextInvitationStage(stage: InvitationStage): InvitationStage {
  const index = invitationStages.indexOf(stage);
  return invitationStages[Math.min(index + 1, invitationStages.length - 1)] ?? "invitation";
}
