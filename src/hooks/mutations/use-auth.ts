import { useMutation } from "@tanstack/react-query";

import {
  getDeleteSessionMutationOptions,
  getResetPasswordMutationOptions,
  getSendResetLinkMutationOptions,
} from "@/lib/query/mutation-options";

export const useSendResetLinkMutation = () => {
  return useMutation(getSendResetLinkMutationOptions());
};

export const useResetPasswordMutation = () => {
  return useMutation(getResetPasswordMutationOptions());
};

export const useDeleteSessionMutation = () => {
  return useMutation(getDeleteSessionMutationOptions());
};
