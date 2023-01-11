import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { userIsConversationParticipant } from "../../utils/functions";
import {
  ConversationDeletedSubscriptionPayload,
  ConversationPopulated,
  ConversationUpdatedSubscriptionPayload,
  CreateConversationArgs,
  ConversationsResponse,
  DeleteConversationArgs,
  MarkConversationAsReadArgs,
  CreateConversationResponse,
  MarkConversationAsReadResponse,
  DeleteConversationResponse,
} from "../../types/conversationTypes";
import { GraphQLContext } from "../../types/types";

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): ConversationsResponse => {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { id: userId },
      } = session;

      try {
        const conversations = await prisma.conversation.findMany({
          include: conversationPopulated,
        });
        return conversations.filter(
          (conversation) =>
            !!conversation.participants.find((p) => p.userId === userId)
        );
      } catch (error: any) {
        console.log(error?.message);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: CreateConversationArgs,
      context: GraphQLContext
    ): CreateConversationResponse => {
      const { participantIds } = args;
      const { session, prisma, pubsub } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { id: userId },
      } = session;

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: conversation,
        });

        return {
          conversationId: conversation.id,
        };
      } catch (error: any) {
        console.log(error?.message);
        throw new GraphQLError("Error creating conversation");
      }
    },

    markConversationAsRead: async (
      _: any,
      args: MarkConversationAsReadArgs,
      context: GraphQLContext
    ): MarkConversationAsReadResponse => {
      const { session, prisma } = context;
      const { userId, conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        if (!participant) {
          throw new GraphQLError("Participant entity not found");
        }

        await prisma.conversationParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            hasSeenLatestMessage: true,
          },
        });

        return true;
      } catch (error: any) {
        console.log(error?.message);
        throw new GraphQLError(error?.message);
      }
    },
    deleteConversation: async (
      _: any,
      args: DeleteConversationArgs,
      context: GraphQLContext
    ): DeleteConversationResponse => {
      const { session, prisma, pubsub } = context;
      const { conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const [deleteConversation] = await prisma.$transaction([
          prisma.conversation.delete({
            where: {
              id: conversationId,
            },
            include: conversationPopulated,
          }),
          prisma.conversationParticipant.deleteMany({
            where: {
              conversationId,
            },
          }),
          prisma.message.deleteMany({
            where: {
              conversationId,
            },
          }),
        ]);

        pubsub.publish("CONVERSATION_DELETED", {
          conversationDeleted: deleteConversation,
        });
      } catch (error: any) {
        console.log(error?.message);
        throw new GraphQLError(error?.message);
      }
      return true;
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;
          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }

          const { id: userId } = session.user;
          const {
            conversationCreated: { participants },
          } = payload;

          const userIsParticipant = userIsConversationParticipant(
            participants,
            userId
          );
          return userIsParticipant;
        }
      ),
    },
    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
        },
        (
          payload: ConversationUpdatedSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;
          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }

          const { id: userId } = session.user;
          const {
            conversationUpdated: { participants },
          } = payload;

          const userIsParticipant = userIsConversationParticipant(
            participants,
            userId
          );
          return userIsParticipant;
        }
      ),
    },
    conversationDeleted: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(["CONVERSATION_DELETED"]);
        },
        (
          payload: ConversationDeletedSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;
          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }

          const { id: userId } = session.user;
          const {
            conversationDeleted: { participants },
          } = payload;

          const userIsParticipant = userIsConversationParticipant(
            participants,
            userId
          );
          return userIsParticipant;
        }
      ),
    },
  },
};

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
        image: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    },
  });

export default resolvers;
