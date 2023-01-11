import { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import ruRU from "date-fns/locale/ru";
import { GoPrimitiveDot } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbUsers } from "react-icons/tb";
import DropdownMenu from "../../DropdownMenu";
import { formatUserImage, formatUsernames } from "../../../utils/functions";
import { formatRelativeLocaleConversation } from "../../../utils/helpers";
import { ConversationPopulated } from "../../../types/conversationTypes";
import { useRouter } from "next/router";

interface ConversationItemProps {
  userId: string;
  conversation: ConversationPopulated;
  onViewConversation: () => void;
  isSelected: boolean;
  hasSeenLatestMessage?: boolean;
  onDeleteConversation: (conversationId: string) => void;
  isDeletingLoading: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  userId,
  conversation,
  onViewConversation,
  isSelected,
  hasSeenLatestMessage,
  onDeleteConversation,
  isDeletingLoading,
}) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { conversationId } = router.query;

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const onDropdownMenuOpen = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    setIsDropdownMenuOpen(true);
  };

  const onDropdownMenuClose = () => {
    setIsDropdownMenuOpen(false);
  };

  const handleViewConversation = () => {
    if (conversation.id === conversationId) {
      return;
    }
    onViewConversation();
  };

  return (
    <Stack
      position="relative"
      direction="row"
      align="center"
      p={4}
      pl={2}
      mb={2}
      cursor="pointer"
      borderRadius={4}
      bg={
        isSelected ? (colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200") : "none"
      }
      _hover={{
        bg: colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200",
      }}
      onClick={handleViewConversation}
    >
      <Flex position="absolute" left="-4px">
        {!hasSeenLatestMessage && <GoPrimitiveDot fontSize={18} color="#5082ef" />}
      </Flex>
      <Avatar
        src={formatUserImage(conversation.participants, userId)}
        icon={<TbUsers size={24} />}
      />
      <Flex width="80%" height="100%" pl={2}>
        <Flex direction="column" width={{ base: "100%", md: "95%" }} height="100%">
          <Text fontWeight={600}>
            {formatUsernames(conversation.participants, userId)}
          </Text>
          {conversation.latestMessage && (
            <Box>
              <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {conversation.latestMessage.body}
              </Text>
            </Box>
          )}
        </Flex>
        <Text position="absolute" right={10} fontSize="xs" textAlign="right">
          {formatRelative(new Date(conversation.updatedAt), new Date(), {
            locale: {
              ...ruRU,
              formatRelative: (token) =>
                formatRelativeLocaleConversation[
                  token as keyof typeof formatRelativeLocaleConversation
                ],
            },
          })}
        </Text>
      </Flex>
      <Box position="absolute" top={2.5} right={0}>
        <IconButton
          aria-label="open menu"
          size="sm"
          bg="transparent"
          _hover={{
            bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.200",
          }}
          _active={{
            bg: colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.50",
          }}
          icon={<BsThreeDotsVertical />}
          disabled={isDeletingLoading}
          onClick={onDropdownMenuOpen}
        />
      </Box>
      <Box position="absolute" top="10px" right="260px">
        <DropdownMenu
          isOpen={isDropdownMenuOpen}
          onClose={onDropdownMenuClose}
          onDeleteConversation={() => onDeleteConversation(conversation.id)}
        />
      </Box>
    </Stack>
  );
};

export default ConversationItem;
