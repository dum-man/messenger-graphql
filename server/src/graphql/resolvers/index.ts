import merge from "lodash.merge";
import userResolvers from "./user";
import conversationResolvers from "./conversation";
import messageResolvers from "./message";
import scalarResolvers from "./scalar";

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers,
  scalarResolvers
);

export default resolvers;
