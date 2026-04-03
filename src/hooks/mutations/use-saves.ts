import {
  getSavePostMutationOptions,
  getUnsavePostMutationOptions,
} from "@/lib/query/mutation-options";
import { useMutation } from "@tanstack/react-query";

export const useSavePost = () => {
  return useMutation(getSavePostMutationOptions());
};

export const useUnSavePost = () => {
  return useMutation(getUnsavePostMutationOptions());
};
