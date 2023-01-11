import { ParticipantPopulated } from "../types/conversationTypes";

export const userIsConversationParticipant = (
  participants: ParticipantPopulated[],
  userId: string
): boolean => {
  return !!participants.find((participant) => participant.userId === userId);
};
