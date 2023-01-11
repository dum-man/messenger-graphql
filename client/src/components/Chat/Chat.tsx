import { Flex } from "@chakra-ui/react";
import ConversationsWrapper from "./Conversations/ConversationsWrapper";
import FeedWrapper from "./Feed/FeedWrapper";

const Chat: React.FC = () => {
  return (
    <Flex height="100vh">
      <ConversationsWrapper />
      <FeedWrapper />
    </Flex>
  );
};

export default Chat;
