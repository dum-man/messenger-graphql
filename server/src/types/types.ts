import { PrismaClient, User } from "@prisma/client";
import { Context } from "graphql-ws/lib/server";
import { PubSub } from "graphql-subscriptions";
import { ISODateString } from "next-auth";

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface Session {
  user: User;
  expires: ISODateString;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}
