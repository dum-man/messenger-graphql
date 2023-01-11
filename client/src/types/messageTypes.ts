export interface MessagePopulated {
  id: string;
  body: string;
  conversationId: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    image: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MessagesData {
  messages: MessagePopulated[];
}

export interface MessagesVariables {
  conversationId: string;
}

export interface SendMessageData {
  sendMessage: boolean;
}

export interface SendMessageVariables {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessagesSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}
