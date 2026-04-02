import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { postsQueries } from "@/lib/query/query-options";
import type { PostsFilter } from "@/types/api";

export const useGetPosts = ({
  cursorAfter,
  limit,
  enabled,
  filter,
  search,
}: {
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
  filter?: PostsFilter;
  search: string | undefined;
}) => {
  return useInfiniteQuery(
    postsQueries.getPosts({ cursorAfter, limit, enabled, filter, search }),
  );
};

export const usePostById = (postId: string) => {
  return useQuery(postsQueries.getPostById(postId));
};
