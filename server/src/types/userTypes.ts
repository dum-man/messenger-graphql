import { User } from "@prisma/client";

export interface CreateUsernameArgs {
  username: string;
}

export type CreateUsernameResponse = Promise<{
  success?: boolean;
  error?: string;
}>;

export type SearchUsersResponse = Promise<User[]>;

export interface SearchUsersArgs {
  username: string;
}
