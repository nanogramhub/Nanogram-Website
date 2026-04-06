import { useMutation } from "@tanstack/react-query";

import {
  getSavePostMutationOptions,
  getUnsavePostMutationOptions,
} from "@/lib/query/mutation-options";

export const useSavePost = () => {
  return useMutation(getSavePostMutationOptions());
};

export const useUnSavePost = () => {
  return useMutation(getUnsavePostMutationOptions());
};
