import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { ObjectID } from "bson";
import { Box, Input, useColorMode } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";
import {
  MessagesData,
  SendMessageData,
  SendMessageVariables,
} from "../../../../types/messageTypes";

interface MessageInputProps {
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const { colorMode } = useColorMode();

  const { data: session } = useSession();
  const [messageText, setMessageText] = useState("");

  const [sendMessage] = useMutation<SendMessageData, SendMessageVariables>(
    MessageOperations.Mutation.sendMessage
  );

  const onSetMessageText = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(evt.target.value);
  };

  const onSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newMessageText = messageText;
    setMessageText("");

    try {
      const sender = session?.user;
      if (!sender) {
        return;
      }

      const messageId = new ObjectID().toString();
      const newMessage: SendMessageVariables = {
        id: messageId,
        senderId: sender.id,
        conversationId,
        body: newMessageText,
      };

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          const existing = cache.readQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: messageId,
                  body: newMessageText,
                  senderId: sender.id,
                  conversationId,
                  sender: {
                    id: sender.id,
                    username: sender.username,
                    image: sender.image as string,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Failed to send message");
      }
    } catch (error: any) {
      console.log(error?.message);
      toast.error(error?.message);
    }
  };

  return (
    <Box width="100%" px={4} pt={4} pb={6}>
      <form onSubmit={onSendMessage}>
        <Input
          size="md"
          placeholder="New message"
          resize="none"
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor:
              colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200",
          }}
          value={messageText}
          onChange={onSetMessageText}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
