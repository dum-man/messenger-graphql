export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUserVariables {
  username: string;
}

export interface SearchUsersData {
  searchUsers: SearchedUser[];
}

export interface SearchedUser {
  id: string;
  username: string;
  image: string;
  email: string;
}
