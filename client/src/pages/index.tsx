import { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { Box } from "@chakra-ui/react";
import Auth from "../components/Auth/Auth";
import Chat from "../components/Chat/Chat";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <Box>
      {session?.user.username ? (
        <Chat />
      ) : (
        <Auth reloadSession={reloadSession} />
      )}
    </Box>
  );
};

export default Home;

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
