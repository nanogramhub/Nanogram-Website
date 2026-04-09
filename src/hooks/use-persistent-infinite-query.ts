import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import type { AppwriteResponse } from "@/types/schema";

export function usePersistentInfiniteQuery<T>(
  infiniteQueryResult: UseInfiniteQueryResult<
    InfiniteData<AppwriteResponse<T>>,
    Error
  >,
) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    infiniteQueryResult;
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = useMemo(
    () => (data?.pages ? data.pages.flatMap((page) => page.rows) : []),
    [data],
  );
  const total = data?.pages?.[0]?.total;

  return { items, ref, isFetchingNextPage, hasNextPage, fetchNextPage, total };
}
