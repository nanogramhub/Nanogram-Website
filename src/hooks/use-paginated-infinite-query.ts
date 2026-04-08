import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import type { AppwriteResponse } from "@/types/schema";

export function usePaginatedInfinitePagination<T>(
  infiniteQueryResult: UseInfiniteQueryResult<
    InfiniteData<AppwriteResponse<T>>,
    Error
  >,
  pageSize: number,
) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    infiniteQueryResult;

  // derive items and total from data
  const { items, total } = useMemo(() => {
    if (!data?.pages) return { items: [] as T[], total: 0 };
    return {
      items: data.pages.flatMap((p) => p.rows),
      total: data.pages[0]?.total ?? 0,
    };
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);

  // total pages from backend total
  const totalPages = useMemo(() => {
    return total ? Math.ceil(total / pageSize) : 0;
  }, [total, pageSize]);

  // ensure required pages are loaded up to currentPage
  useEffect(() => {
    const loadedPages = data?.pages.length ?? 0;

    if (currentPage > loadedPages && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    currentPage,
    data?.pages.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  // navigation
  const goToPage = (page: number) => {
    if (page < 1 || (totalPages && page > totalPages)) return;
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  // slice only items for current page (client-side view)
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    items: paginatedItems,
    allItems: items,
    total,
    totalPages,
    currentPage,
    isFetchingNextPage,
    hasNextPage,
    nextPage,
    prevPage,
    goToPage,
  };
}
