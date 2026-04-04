import { useMutation } from "@tanstack/react-query";
import {
  getCreateCommentMutationOptions,
  getDeleteCommentMutationOptions,
  getUpdateCommentLikesMutationOptions,
} from "@/lib/query/mutation-options";

export const useUpdateCommentLikes = () => {
  return useMutation(getUpdateCommentLikesMutationOptions());
};

export const useCreateComment = () => {
  return useMutation(getCreateCommentMutationOptions());
};

export const useDeleteComment = () => {
  return useMutation(getDeleteCommentMutationOptions());
};
