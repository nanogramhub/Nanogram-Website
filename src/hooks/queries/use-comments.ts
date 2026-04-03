import { commentQueries } from "@/lib/query/query-options";
import { useInfiniteQuery } from "@tanstack/react-query";

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
