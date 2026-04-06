import { useInfiniteQuery } from "@tanstack/react-query";

import { savesQueries } from "@/lib/query/query-options";

export function useGetSavedPosts({
  userId,
  cursorAfter,
  limit,
  enabled,
}: {
  userId: string;
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
}) {
  return useInfiniteQuery(
    savesQueries.getSavedPosts({
      userId,
      cursorAfter,
      limit,
      enabled,
    }),
  );
}
