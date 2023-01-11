export interface ConversationData {
  conversations: ConversationPopulated[];
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationVariables {
  participantIds: string[];
}

export interface ConversationUpdatedData {
  conversationUpdated: ConversationPopulated;
}

export interface DeleteConversationData {
  deleteConversation: boolean;
}

export interface DeleteConversationVariables {
  conversationId: string;
}

export interface ConversationDeletedData {
  conversationDeleted: {
    id: string;
  };
}

export interface MarkConversationAsReadData {
  markConversationAsRead: boolean;
}

export interface MarkConversationAsReadVariables {
  userId: string;
  conversationId: string;
}

interface Participant {
  hasSeenLatestMessage: boolean;
  user: {
    id: string;
    username: string;
    image: string;
  };
}

export interface ConversationPopulated {
  id: string;
  updatedAt: Date;
  participants: Participant[];
  latestMessage: {
    sender: {
      id: string;
      username: string;
    };
    body: string;
  };
}

export interface ParticipantPopulated {
  user: {
    id: string;
    username: string;
    image: string;
  };
  hasSeenLatestMessage: boolean;
}
