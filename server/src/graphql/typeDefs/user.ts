import gql from "graphql-tag";

const typeDefs = gql`
  type User {
    id: String
    username: String
    name: String
    email: String
    image: String
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }

  type Query {
    searchUsers(username: String): [User]
  }

  type Mutation {
    createUsername(username: String): CreateUsernameResponse
  }
`;

export default typeDefs;
