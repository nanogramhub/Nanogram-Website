import { useMutation } from "@tanstack/react-query";
import {
  getCreateEventMutationOptions,
  getDeleteEventMutationOptions,
  getUpdateEventMutationOptions,
} from "@/lib/query/mutation-options";

export const useCreateEvent = () => {
  return useMutation(getCreateEventMutationOptions());
};

export const useUpdateEvent = () => {
  return useMutation(getUpdateEventMutationOptions());
};

export const useDeleteEvent = () => {
  return useMutation(getDeleteEventMutationOptions());
};
