import { Prisma } from "@prisma/client";
import { messagePopulated } from "../graphql/resolvers/message";

export interface MessagesArgs {
  conversationId: string;
}

export type MessagesResponse = Promise<MessagePopulated[]>;

export interface SendMessageArgs {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export type SendMessageResponse = Promise<boolean>;

export interface MessageSentSubscriptionPayload {
  messageSent: MessagePopulated;
}

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;
