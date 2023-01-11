import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Flex, Spinner, useColorMode, Text } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { TbMessageCircle2 } from "react-icons/tb";
import MessageItem from "./MessageItem";
import MessageOperations from "../../../../graphql/operations/message";
import {
  MessagesData,
  MessagesSubscriptionData,
  MessagesVariables,
} from "../../../../types/messageTypes";

interface MessagesProps {
  userId: string | undefined;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { colorMode } = useColorMode();

  const { data, loading, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const subscribeToMoreMessages = (conversationId: string) => {
    subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessagesSubscriptionData) => {
        if (!subscriptionData) {
          return prev;
        }
        const newMessage = subscriptionData.data.messageSent;
        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToMoreMessages(conversationId);
  }, [conversationId]);

  let content;

  if (loading) {
    content = (
      <Spinner
        thickness="6px"
        speed="0.65s"
        emptyColor={colorMode === "dark" ? "blackAlpha.200" : "blackAlpha.400"}
        color="whiteAlpha.600"
        size="xl"
      />
    );
  } else if (data?.messages) {
    content = data.messages.length ? (
      <Flex
        height="100%"
        direction="column-reverse"
        alignSelf="normal"
        overflowY="auto"
        pb={2}
      >
        {data.messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isSentByMe={message.sender.id === userId}
          />
        ))}
      </Flex>
    ) : (
      <Flex direction="column" align="center" alignSelf="center" mb="200px">
        <TbMessageCircle2 size={70} />
        <Text fontSize="2xl" fontWeight={600}>
          No messages
        </Text>
        <Text fontSize="larger">
          Messages you send or receive will appear here
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      justify="flex-end"
      align="center"
      overflow="hidden"
    >
      {content}
    </Flex>
  );
};

export default Messages;
