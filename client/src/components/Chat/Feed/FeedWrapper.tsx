import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { GiConversation } from "react-icons/gi";
import ThemeToggleButton from "../../ThemeToggleButton";
import MessageInput from "./Messages/MessageInput";
import Messages from "./Messages/Messages";
import MessagesHeader from "./Messages/MessagesHeader";

const FeedWrapper: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const router = useRouter();
  const { conversationId } = router.query;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      direction="column"
      width="100%"
    >
      {conversationId && typeof conversationId === "string" ? (
        <>
          <Flex
            direction="column"
            justify="space-between"
            flexGrow={1}
            overflow="hidden"
          >
            <MessagesHeader
              userId={userId as string}
              conversationId={conversationId}
            />
            <Messages userId={userId} conversationId={conversationId} />
          </Flex>
          <MessageInput conversationId={conversationId} />
        </>
      ) : (
        <Flex position="relative" height="100%" justify="center" align="center">
          <Stack align="center">
            <GiConversation size={80} />
            <Text fontSize="3xl">Select conversation</Text>
          </Stack>
          <Box position="absolute" top={4} right={4}>
            <ThemeToggleButton />
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default FeedWrapper;
