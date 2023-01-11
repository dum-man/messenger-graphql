import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import * as dotenv from "dotenv";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { getSession } from "next-auth/react";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { GraphQLContext, Session, SubscriptionContext } from "./types/types";

async function main() {
  dotenv.config();

  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const prisma = new PrismaClient();
  const pubsub = new PubSub();

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams && ctx.connectionParams.session) {
          const { session } = ctx.connectionParams;
          return { session, prisma, pubsub };
        }
        return { session: null, prisma, pubsub };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const session = (await getSession({ req })) as Session;
        return { session, prisma, pubsub };
      },
    })
  );

  const PORT = 4000;

  await new Promise<void>((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

main().catch((err) => console.log(err));
