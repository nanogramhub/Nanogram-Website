import { getUpdateLikesMutationOptions } from "@/lib/query/mutation-options";
import { useMutation } from "@tanstack/react-query";

export const useUpdateLikes = () => {
  return useMutation(getUpdateLikesMutationOptions());
};
