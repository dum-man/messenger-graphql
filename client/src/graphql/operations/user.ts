import { gql } from "@apollo/client";

const UserOperations = {
  Queries: {
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUsers(username: $username) {
          id
          username
          image
          email
        }
      }
    `,
  },
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
};

export default UserOperations;
