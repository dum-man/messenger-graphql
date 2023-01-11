import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Box, Button, Stack, Text, useColorMode } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import ThemeToggleButton from "../../../ThemeToggleButton";
import ConversationOperations from "../../../../graphql/operations/conversation";
import { formatUsernames } from "../../../../utils/functions";
import { ConversationData } from "../../../../types/conversationTypes";

interface MessagesHeaderProps {
  userId: string;
  conversationId: string;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  userId,
  conversationId,
}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const { data } = useQuery<ConversationData, void>(
    ConversationOperations.Queries.conversations
  );

  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  );

  return (
    <Stack
      direction="row"
      align="center"
      spacing={6}
      py={4}
      px={4}
      borderBottom="1px solid"
      borderColor={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
    >
      <Button
        aria-label="back"
        bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.50"}
        _hover={{
          bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.200",
        }}
        _active={{
          bg: colorMode === "dark" ? "whiteAlpha.400" : "blackAlpha.50",
        }}
        leftIcon={<IoIosArrowBack size={20} />}
        onClick={() =>
          router.replace("?conversationId", "/", { shallow: true })
        }
      />
      {conversation && (
        <Stack direction="row">
          <Text>To: </Text>
          <Text fontWeight={600}>
            {formatUsernames(conversation.participants, userId)}
          </Text>
        </Stack>
      )}
      <Box position="absolute" top={4} right={4}>
        <ThemeToggleButton />
      </Box>
    </Stack>
  );
};
export default MessagesHeader;
