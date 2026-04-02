import { useMutation } from "@tanstack/react-query";
import { getResetPasswordMutationOptions } from "@/lib/query/mutation-options";

export const useResetPasswordMutation = () => {
  return useMutation(getResetPasswordMutationOptions());
};
