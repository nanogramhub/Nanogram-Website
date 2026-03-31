import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import type { AppwriteResponse } from "@/types/api";

export function usePersistentInfiniteQuery<T>(
  infiniteQueryResult: UseInfiniteQueryResult<InfiniteData<AppwriteResponse<T>>, Error>
) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteQueryResult;
  const [items, setItems] = useState<T[]>([]);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (data?.pages) {
      const allItems = data.pages.flatMap((page) => page.rows);
      setItems(allItems);
    }
  }, [data]);

  return { items, ref };
}
