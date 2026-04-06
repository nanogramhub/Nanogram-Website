import { useInfiniteQuery } from "@tanstack/react-query";

import { commentQueries } from "@/lib/query/query-options";

export const useGetComments = ({
  postId,
  cursorAfter,
  limit,
  enabled,
}: {
  postId: string;
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
}) => {
  return useInfiniteQuery(
    commentQueries.getCommentsByPostId({
      postId,
      cursorAfter,
      limit,
      enabled,
    }),
  );
};
