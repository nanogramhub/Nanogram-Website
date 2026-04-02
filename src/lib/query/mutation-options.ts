import { mutationOptions } from "@tanstack/react-query";
import { api } from "../appwrite/api";
import { queryKeys } from "./query-keys";

export const getResetPasswordMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.auth.resetPassword,
    mutationFn: async ({
      userId,
      secret,
      password,
    }: {
      userId: string;
      secret: string;
      password: string;
    }) => {
      const response = await api.auth.resetPassword(userId, secret, password);
      return response;
    },
  });
};
