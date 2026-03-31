import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { eventsQueries } from "@/lib/query/queryOptions";

export function useGetEvents({
  cursorAfter,
  limit,
}: {
  cursorAfter?: string;
  limit?: number;
}) {
  return useInfiniteQuery(eventsQueries.getEvents({ cursorAfter, limit }));
}

export function useGetNextEvent() {
  return useQuery(eventsQueries.getNextEvent());
}

export function useGetLatestCompletedEvent() {
  return useQuery(eventsQueries.getLatestCompletedEvent());
}

export function useGetUpcomingEvents() {
  return useQuery(eventsQueries.getUpcomingEvents());
}
