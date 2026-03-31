import { useInfiniteQuery, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { nanogramQueries } from "@/lib/query/queryOptions";

export function useGetTeamMembers() {
  return useQuery(nanogramQueries.getTeamMembers());
}

export function useGetCoreMembers({
  cursorAfter,
  limit,
}: {
  cursorAfter?: string;
  limit?: number;
}) {
  return useInfiniteQuery(
    nanogramQueries.getCoreMembers({ cursorAfter, limit }),
  );
}

export function useGetAluminiMembers({
  cursorAfter,
  limit,
}: {
  cursorAfter?: string;
  limit?: number;
}) {
  return useInfiniteQuery(
    nanogramQueries.getAluminiMembers({ cursorAfter, limit }),
  );
}

export function useGetTestimonials() {
  return useSuspenseQuery(nanogramQueries.getTestimonials());
}
