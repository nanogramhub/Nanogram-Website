import {
  getSendMessageMutationOptions,
  getUpdateMessageMutationOptions,
  getDeleteMessageMutationOptions,
} from "@/lib/query/mutation-options";
import { useMutation } from "@tanstack/react-query";

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
