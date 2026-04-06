import { useInfiniteQuery } from "@tanstack/react-query";

import { followsQueries } from "@/lib/query/query-options";

export const useGetFollowers = ({
  userId,
  cursorAfter,
  limit,
  enabled,
}: {
  userId: string;
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
}) => {
  return useInfiniteQuery(
    followsQueries.getFollowers({
      userId,
      cursorAfter,
      limit,
      enabled,
    }),
  );
};

export const useGetFollowing = ({
  userId,
  cursorAfter,
  limit,
  enabled,
}: {
  userId: string;
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
}) => {
  return useInfiniteQuery(
    followsQueries.getFollowing({
      userId,
      cursorAfter,
      limit,
      enabled,
    }),
  );
};
