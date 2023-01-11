import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../types/types";
import {
  CreateUsernameArgs,
  CreateUsernameResponse,
  SearchUsersArgs,
  SearchUsersResponse,
} from "../../types/userTypes";

const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: SearchUsersArgs,
      context: GraphQLContext
    ): SearchUsersResponse => {
      const { username: searchedUsername } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { username: myUsername },
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });
        return users;
      } catch (error: any) {
        console.log(error?.message);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: CreateUsernameArgs,
      context: GraphQLContext
    ): CreateUsernameResponse => {
      const { username } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      const { id: userId } = session.user;

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUser) {
          return {
            error: `${username} already taken. Try another`,
          };
        }

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return {
          success: true,
        };
      } catch (error: any) {
        console.log(error?.message);
        return {
          error: error?.message,
        };
      }
    },
  },
};

export default resolvers;
