import { Avatar, Box, Button, Flex, Stack, Text, useColorMode } from "@chakra-ui/react";
import { SearchedUser } from "../../../../types/userTypes";

interface UserSearchListProps {
  users: SearchedUser[];
  addParticipant: (user: SearchedUser) => void;
}

const UserSearchList: React.FC<UserSearchListProps> = ({ users, addParticipant }) => {
  const { colorMode } = useColorMode();

  return (
    <>
      {users.length ? (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack
              key={user.id}
              direction="row"
              align="center"
              spacing={4}
              py={2}
              borderRadius={4}
            >
              <Avatar src={user.image} />
              <Flex width="100%" justify="space-between" align="center">
                <Box>
                  <Text fontWeight={600}>{user.username}</Text>
                  <Text fontSize="xs">{user.email}</Text>
                </Box>
                <Button
                  bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
                  _hover={{
                    bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.300",
                  }}
                  _active={{
                    bg: colorMode === "dark" ? "whiteAlpha.400" : "blackAlpha.200",
                  }}
                  onClick={() => addParticipant(user)}
                >
                  Select
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Flex justify="center" mt={6}>
          <Text>No users found</Text>
        </Flex>
      )}
    </>
  );
};

export default UserSearchList;
