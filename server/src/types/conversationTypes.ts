import { Prisma } from "@prisma/client";
import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/conversation";

export type ConversationsResponse = Promise<ConversationPopulated[]>;

export interface CreateConversationArgs {
  participantIds: string[];
}

export type CreateConversationResponse = Promise<{ conversationId: string }>;

export interface MarkConversationAsReadArgs {
  userId: string;
  conversationId: string;
}

export type MarkConversationAsReadResponse = Promise<boolean>;

export interface DeleteConversationArgs {
  conversationId: string;
}

export type DeleteConversationResponse = Promise<boolean>;

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

export interface ConversationUpdatedSubscriptionPayload {
  conversationUpdated: ConversationPopulated;
}

export interface ConversationDeletedSubscriptionPayload {
  conversationDeleted: ConversationPopulated;
}
