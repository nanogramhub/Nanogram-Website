import { followsQueries } from "@/lib/query/query-options";
import { useInfiniteQuery } from "@tanstack/react-query";

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
