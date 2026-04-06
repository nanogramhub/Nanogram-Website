import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { eventsQueries } from "@/lib/query/query-options";

export function useGetEvents({
  cursorAfter,
  limit,
  enabled,
}: {
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
}) {
  return useInfiniteQuery(
    eventsQueries.getEvents({ cursorAfter, limit, enabled }),
  );
}

export function useGetNextEvent() {
  return useQuery(eventsQueries.getNextEvent());
}

export function useGetLatestCompletedEvent() {
  return useQuery(eventsQueries.getLatestCompletedEvent());
}

export function useGetUpcomingEvents({ enabled }: { enabled: boolean }) {
  return useQuery(eventsQueries.getUpcomingEvents({ enabled }));
}
