import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import ConversationOperations from "../../../../graphql/operations/conversation";
import UserOperations from "../../../../graphql/operations/user";
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";
import {
  SearchedUser,
  SearchUsersData,
  SearchUserVariables,
} from "../../../../types/userTypes";
import {
  CreateConversationData,
  CreateConversationVariables,
} from "../../../../types/conversationTypes";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { colorMode } = useColorMode();

  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<SearchedUser[]>([]);

  const addParticipant = (user: SearchedUser) => {
    if (participants.find((p) => p.id === user.id)) {
      toast.error("User has been already added");
      return;
    }
    setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipants = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  const [searchUsers, { data, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUserVariables
  >(UserOperations.Queries.searchUsers, {
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationVariables>(
      ConversationOperations.Mutations.createConversation
    );

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value);
  };

  const onSearch = (evt: React.FocusEvent<HTMLFormElement>) => {
    evt.preventDefault();
    searchUsers({ variables: { username } });
  };

  const onCreateConversation = async () => {
    const participantIds = [
      session?.user.id as string,
      ...participants.map((participant) => participant.id),
    ];
    try {
      const { data } = await createConversation({
        variables: { participantIds },
      });

      if (!data?.createConversation) {
        throw new Error("Failed to create conversation");
      }

      const {
        createConversation: { conversationId },
      } = data;

      router.push({ query: { conversationId } });
      setParticipants([]);
      setUsername("");
      onClose();
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={colorMode === "dark" ? "#2d2d2d" : "#f5f5f5"} pb={4}>
        <ModalHeader>Create conversation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={onSearch}>
            <Stack spacing={4}>
              <Input
                placeholder="Enter a username"
                value={username}
                onChange={handleChange}
              />
              <Button
                type="submit"
                bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
                _hover={{
                  bg:
                    colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.300",
                }}
                _active={{
                  bg:
                    colorMode === "dark" ? "whiteAlpha.400" : "blackAlpha.200",
                }}
                isLoading={loading}
                disabled={!username.trim()}
              >
                Search
              </Button>
            </Stack>
          </form>
          {data?.searchUsers && (
            <UserSearchList
              users={data.searchUsers}
              addParticipant={addParticipant}
            />
          )}
          {participants.length !== 0 && (
            <>
              <Participants
                participants={participants}
                removeParticipants={removeParticipants}
              />
              <Button
                width="100%"
                bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
                _hover={{
                  bg:
                    colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.300",
                }}
                _active={{
                  bg:
                    colorMode === "dark" ? "whiteAlpha.400" : "blackAlpha.200",
                }}
                mt={6}
                isLoading={createConversationLoading}
                onClick={onCreateConversation}
              >
                Create conversation
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConversationModal;
