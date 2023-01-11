import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }

  type CreateConversationResponse {
    conversationId: String
  }

  type ConversationDeletedSubscriptionPayload {
    id: String
  }
  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
  }

  type Mutation {
    markConversationAsRead(userId: String!, conversationId: String!): Boolean
  }

  type Mutation {
    deleteConversation(conversationId: String!): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
  }

  type Subscription {
    conversationUpdated: Conversation
  }

  type Subscription {
    conversationDeleted: ConversationDeletedSubscriptionPayload
  }
`;

export default typeDefs;
