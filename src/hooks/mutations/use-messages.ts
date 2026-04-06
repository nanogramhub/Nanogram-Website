import { useMutation } from "@tanstack/react-query";

import {
  getDeleteMessageMutationOptions,
  getSendMessageMutationOptions,
  getUpdateMessageMutationOptions,
} from "@/lib/query/mutation-options";

/** Send a new message */
export const useSendMessage = () => {
  return useMutation(getSendMessageMutationOptions());
};

/** Update a message's content or reactions */
export const useUpdateMessage = () => {
  return useMutation(getUpdateMessageMutationOptions());
};

/** Delete a message */
export const useDeleteMessage = () => {
  return useMutation(getDeleteMessageMutationOptions());
};
