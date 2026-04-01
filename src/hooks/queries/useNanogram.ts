import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { nanogramQueries } from "@/lib/query/queryOptions";

export function useGetTeamMembers() {
  return useQuery(nanogramQueries.getTeamMembers());
}

export function useGetCoreMembers({
  cursorAfter,
  limit,
  enabled,
}: {
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
}) {
  return useInfiniteQuery(
    nanogramQueries.getCoreMembers({ cursorAfter, limit, enabled }),
  );
}

export function useGetAluminiMembers({
  cursorAfter,
  limit,
  enabled,
}: {
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
}) {
  return useInfiniteQuery(
    nanogramQueries.getAluminiMembers({ cursorAfter, limit, enabled }),
  );
}

export function useGetTestimonials({ enabled }: { enabled: boolean }) {
  return useQuery(nanogramQueries.getTestimonials(enabled));
}
