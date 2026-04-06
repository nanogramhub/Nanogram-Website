import { useMutation } from "@tanstack/react-query";

import {
  getCreatePostMutationOptions,
  getDeletePostMutationOptions,
  getUpdateLikesMutationOptions,
  getUpdatePostMutationOptions,
} from "@/lib/query/mutation-options";

export const useCreatePost = () => {
  return useMutation(getCreatePostMutationOptions());
};

export const useUpdatePost = () => {
  return useMutation(getUpdatePostMutationOptions());
};

export const useDeletePost = () => {
  return useMutation(getDeletePostMutationOptions());
};

export const useUpdateLikes = () => {
  return useMutation(getUpdateLikesMutationOptions());
};
