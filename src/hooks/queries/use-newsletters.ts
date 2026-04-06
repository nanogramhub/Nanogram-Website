import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { newslettersQueries } from "@/lib/query/query-options";

export const useNewsletters = ({
  enabled,
  limit,
  cursorAfter,
}: {
  enabled: boolean;
  limit?: number;
  cursorAfter?: string;
}) => {
  return useInfiniteQuery(
    newslettersQueries.getNewsletters({
      enabled: enabled,
      limit,
      cursorAfter,
    }),
  );
};

export const useNewsletterById = (id: string) => {
  return useQuery(newslettersQueries.getNewsletterById(id));
};
