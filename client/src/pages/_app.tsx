import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { client } from "../graphql/apollo/apollo-client";
import { theme } from "../chakra/theme";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Component {...pageProps} />
          <Toaster />
        </ChakraProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
