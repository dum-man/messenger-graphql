import { useState } from "react";
import { useMutation } from "@apollo/client";
import { signIn, useSession } from "next-auth/react";
import { Button, Center, Stack, Text, Input, Box, useColorMode } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { BiUser } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { TiMessages } from "react-icons/ti";
import UserOperations from "../../graphql/operations/user";
import { CreateUsernameData, CreateUsernameVariables } from "../../types/userTypes";

interface AuthProps {
  reloadSession: () => void;
}

const Auth: React.FC<AuthProps> = ({ reloadSession }) => {
  const { data: session } = useSession();
  const { colorMode } = useColorMode();

  const [username, setUsername] = useState("");

  const [createUsername, { loading }] = useMutation<CreateUsernameData, CreateUsernameVariables>(
    UserOperations.Mutations.createUsername
  );

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value);
  };

  const onSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    try {
      const { data } = await createUsername({ variables: { username } });
      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      toast.success(`${username} successfully created!`);
      reloadSession();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <Center height="100vh">
      <Stack
        align="center"
        spacing={20}
        p={10}
        border="1px solid"
        borderColor={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
        borderRadius={20}
      >
        {session?.user ? (
          <form onSubmit={onSubmit}>
            <Stack align="center" spacing={8}>
              <BiUser size={100} />
              <Stack>
                <Input
                  placeholder="Enter a username"
                  maxLength={20}
                  value={username}
                  onChange={handleChange}
                />
                <Button
                  bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
                  _hover={{
                    bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.300",
                  }}
                  _active={{
                    bg: colorMode === "dark" ? "whiteAlpha.400" : "blackAlpha.200",
                  }}
                  type="submit"
                  isLoading={loading}
                  disabled={!username.trim()}
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </form>
        ) : (
          <>
            <Stack align="center">
              <Text as="h1" fontSize="4xl">
                Messenger
              </Text>
              <Box>
                <TiMessages size={100} />
              </Box>
            </Stack>
            <Button
              bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
              _hover={{
                bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.300",
              }}
              _active={{
                bg: colorMode === "dark" ? "whiteAlpha.400" : "blackAlpha.200",
              }}
              leftIcon={<FcGoogle size={24} />}
              onClick={() => signIn("google")}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
