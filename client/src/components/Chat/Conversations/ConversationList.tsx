import { useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { Box, Button, Flex, useColorMode, Text, Stack } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BiLogOut } from "react-icons/bi";
import { TbPencilOff } from "react-icons/tb";
import ConversationModal from "./Modal/ConversationModal";
import ConversationItem from "./ConversationItem";
import ConversationOperations from "../../../graphql/operations/conversation";
import {
  ConversationPopulated,
  DeleteConversationData,
  DeleteConversationVariables,
} from "../../../types/conversationTypes";

interface ConversationListProps {
  conversations: ConversationPopulated[];
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onViewConversation,
}) => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();
  const { colorMode } = useColorMode();

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [deleteConversation, { loading: isDeletingLoading }] = useMutation<
    DeleteConversationData,
    DeleteConversationVariables
  >(ConversationOperations.Mutations.deleteConversation);

  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: { conversationId },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Conversation deleted",
          error: "Failed to delete conversation",
        }
      );
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  return (
    <Box
      position="relative"
      width={{ base: "100%", md: "430px" }}
      height="100%"
      overflow="hidden"
    >
      <Box px={4} mb={5}>
        <Button
          width="100%"
          bg="blackAlpha.200"
          _hover={{
            bg: colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.300",
          }}
          _active={{
            bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.200",
          }}
          leftIcon={<HiOutlinePencilAlt />}
          onClick={onOpen}
        >
          Start new conversation
        </Button>
      </Box>
      <ConversationModal isOpen={isOpen} onClose={onClose} />
      {conversations.length ? (
        <>
          {sortedConversations.map((conversation) => {
            const participant = conversation.participants.find(
              (p) => p.user.id === userId
            );
            if (!participant) {
              return;
            }
            return (
              <ConversationItem
                key={conversation.id}
                onViewConversation={() =>
                  onViewConversation(
                    conversation.id,
                    participant.hasSeenLatestMessage
                  )
                }
                userId={userId as string}
                conversation={conversation}
                isSelected={conversation.id === router.query.conversationId}
                hasSeenLatestMessage={participant?.hasSeenLatestMessage}
                onDeleteConversation={onDeleteConversation}
                isDeletingLoading={isDeletingLoading}
              />
            );
          })}
        </>
      ) : (
        <Stack align="center" mt={40}>
          <TbPencilOff size={50} />
          <Text fontSize="3xl">No conversations yet</Text>
        </Stack>
      )}

      <Flex
        position="absolute"
        bottom={0}
        left={0}
        width="100%"
        justify="center"
      >
        <Button
          width="70%"
          bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
          _hover={{
            bg: colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.300",
          }}
          _active={{
            bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.200",
          }}
          leftIcon={<BiLogOut />}
          onClick={() => signOut()}
        >
          Logout
        </Button>
      </Flex>
    </Box>
  );
};

export default ConversationList;
