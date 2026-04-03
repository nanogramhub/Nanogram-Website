import { useMutation } from "@tanstack/react-query";
import {
  getFollowUserMutationOptions,
  getUnfollowUserMutationOptions,
} from "@/lib/query/mutation-options";

export const useFollowUser = () => {
  return useMutation(getFollowUserMutationOptions());
};

export const useUnfollowUser = () => {
  return useMutation(getUnfollowUserMutationOptions());
};
