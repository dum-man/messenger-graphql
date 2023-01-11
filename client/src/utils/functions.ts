import { ParticipantPopulated } from "../types/conversationTypes";

export const formatUsernames = (
  participants: ParticipantPopulated[],
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  return usernames.join(", ");
};

export const formatUserImage = (
  participants: ParticipantPopulated[],
  myUserId: string
) => {
  if (participants.length > 2) {
    return "";
  }
  return participants.filter((p) => p.user.id !== myUserId)[0].user.image;
};
