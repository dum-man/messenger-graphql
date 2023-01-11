import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Box, Spinner, useColorMode } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import {
  ConversationPopulated,
  ConversationData,
  ParticipantPopulated,
  ConversationUpdatedData,
  ConversationDeletedData,
  MarkConversationAsReadData,
  MarkConversationAsReadVariables,
} from "../../../types/conversationTypes";

const ConversationsWrapper: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();
  const { conversationId } = router.query;
  const { colorMode } = useColorMode();

  const {
    data: conversationsData,
    loading,
    subscribeToMore,
  } = useQuery<ConversationData, void>(ConversationOperations.Queries.conversations, {
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const [markConversationAsRead] = useMutation<
    MarkConversationAsReadData,
    MarkConversationAsReadVariables
  >(ConversationOperations.Mutations.markConversationAsRead);

  useSubscription<ConversationUpdatedData, void>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) {
          return;
        }
        const { conversationUpdated: updatedConversation } = subscriptionData;

        const currentlyViewingConversation = updatedConversation.id === conversationId;

        if (currentlyViewingConversation) {
          onViewConversation(conversationId, false);
        }
      },
    }
  );

  useSubscription<ConversationDeletedData, void>(
    ConversationOperations.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) {
          return;
        }
        const existingData = client.readQuery<ConversationData>({
          query: ConversationOperations.Queries.conversations,
        });

        if (!existingData) {
          return;
        }
        const { conversations } = existingData;
        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        client.writeQuery<ConversationData>({
          query: ConversationOperations.Queries.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            ),
          },
        });
        router.push("/");
      },
    }
  );

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => {
    router.push({ query: { conversationId } });

    if (hasSeenLatestMessage) {
      return;
    }
    try {
      await markConversationAsRead({
        variables: { userId: userId as string, conversationId },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          const participantsFragment = cache.readFragment<{
            participants: ParticipantPopulated[];
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                    image
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });
          if (!participantsFragment) {
            return;
          }
          const participants = [...participantsFragment.participants];
          const userParticipantIndex = participants.findIndex(
            (p) => p.user.id === userId
          );
          if (userParticipantIndex === -1) {
            return;
          }
          const userParticipant = participants[userParticipantIndex];

          participants[userParticipantIndex] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  let content;

  if (loading) {
    content = (
      <Box
        width={{ base: "100%", md: "430px" }}
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner
          thickness="6px"
          speed="0.65s"
          emptyColor={colorMode === "dark" ? "blackAlpha.200" : "blackAlpha.400"}
          color="whiteAlpha.600"
          size="xl"
        />
      </Box>
    );
  } else if (conversationsData?.conversations) {
    content = (
      <ConversationList
        conversations={conversationsData?.conversations}
        onViewConversation={onViewConversation}
      />
    );
  }

  return (
    <Box
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "430px" }}
      justifyContent="center"
      px={3}
      pt={4}
      pb={6}
      bg={colorMode === "dark" ? "whiteAlpha.50" : "blackAlpha.200"}
    >
      {content}
    </Box>
  );
};

export default ConversationsWrapper;
