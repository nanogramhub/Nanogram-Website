import { useMutation } from "@tanstack/react-query";
import {
  getResetPasswordMutationOptions,
  getSendResetLinkMutationOptions,
} from "@/lib/query/mutation-options";

export const useSendResetLinkMutation = () => {
  return useMutation(getSendResetLinkMutationOptions());
};

export const useResetPasswordMutation = () => {
  return useMutation(getResetPasswordMutationOptions());
};
