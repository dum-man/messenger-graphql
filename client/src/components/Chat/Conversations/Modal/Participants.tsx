import { Flex, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { SearchedUser } from "../../../../types/userTypes";

interface ParticipantsProps {
  participants: SearchedUser[];
  removeParticipants: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  removeParticipants,
}) => {
  return (
    <Flex mt={8} gap="10px" flexWrap="wrap">
      {participants.map((participant) => (
        <Tag
          key={participant.id}
          variant="solid"
          size="lg"
          colorScheme="gray"
          borderRadius="full"
        >
          <TagLabel>{participant.username}</TagLabel>
          <TagCloseButton onClick={() => removeParticipants(participant.id)} />
        </Tag>
      ))}
    </Flex>
  );
};

export default Participants;
