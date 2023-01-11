import { Avatar, Box, Flex, Stack, Text, useColorMode } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import ruRU from "date-fns/locale/ru";
import { MessagePopulated } from "../../../../types/messageTypes";
import { formatRelativeLocaleMessage } from "../../../../utils/helpers";

interface MessageItemProps {
  message: MessagePopulated;
  isSentByMe: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isSentByMe }) => {
  const { colorMode } = useColorMode();

  return (
    <Stack
      direction="row"
      justify={isSentByMe ? "flex-end" : "flex-start"}
      px={3}
      py={2}
      wordBreak="break-word"
    >
      {!isSentByMe && (
        <Flex align="flex-end">
          <Avatar src={message.sender.image} size="sm" />
        </Flex>
      )}
      <Stack width="100%" spacing={1}>
        <Stack
          direction="row"
          justify={isSentByMe ? "flex-end" : "flex-start"}
          align="center"
        >
          {!isSentByMe && (
            <Text fontWeight={500} textAlign="left">
              {message.sender.username}
            </Text>
          )}
          <Text fontSize={12}>
            {formatRelative(message.createdAt, new Date(), {
              locale: {
                ...ruRU,
                formatRelative: (token) =>
                  formatRelativeLocaleMessage[
                    token as keyof typeof formatRelativeLocaleMessage
                  ],
              },
            })}
          </Text>
        </Stack>
        <Flex justify={isSentByMe ? "flex-end" : "flex-start"}>
          <Box
            maxWidth="65%"
            px={2}
            py={1}
            bg={
              isSentByMe
                ? "brand.100"
                : colorMode === "dark"
                ? "whiteAlpha.300"
                : "blackAlpha.200"
            }
            borderRadius={12}
          >
            <Text
              color={
                isSentByMe
                  ? "white"
                  : colorMode === "dark"
                  ? "white"
                  : "blackAlpha.900"
              }
            >
              {message.body}
            </Text>
          </Box>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default MessageItem;
