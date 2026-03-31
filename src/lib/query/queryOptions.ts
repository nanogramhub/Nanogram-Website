import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { api } from "@/lib/appwrite/api";

export const authQueries = {
  checkUsernameAvailability: (username: string) => {
    return queryOptions({
      queryKey: [...queryKeys.auth.checkUsernameAvailability, username],
      queryFn: () => api.auth.checkUsernameAvailability(username),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  },
};

export const nanogramQueries = {
  getTestimonials: () => {
    return queryOptions({
      queryKey: queryKeys.nanogram.getTestimonials,
      queryFn: () => api.public.nanogram.getTestimonials(),
      staleTime: 1000 * 60 * 30, // 30 minutes
    });
  },
  getTeamMembers: () => {
    return queryOptions({
      queryKey: queryKeys.nanogram.getCoreMembers,
      queryFn: () => api.public.nanogram.getCoreMembers({}),
      staleTime: 1000 * 60 * 30, // 30 minutes
    });
  },
  getCoreMembers: ({
    cursorAfter,
    limit,
  }: {
    cursorAfter?: string;
    limit?: number;
  }) => {
    return infiniteQueryOptions({
      queryKey: [...queryKeys.nanogram.getCoreMembers, cursorAfter],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.public.nanogram.getCoreMembers({ cursorAfter: pageParam, limit }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 30, // 30 minutes
    });
  },
  getAluminiMembers: ({
    cursorAfter,
    limit,
  }: {
    cursorAfter?: string;
    limit?: number;
  }) => {
    return infiniteQueryOptions({
      queryKey: [...queryKeys.nanogram.getAluminiMembers, cursorAfter],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.public.nanogram.getAluminiMembers({
          cursorAfter: pageParam,
          limit,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 30, // 30 minutes
    });
  },
};

export const eventsQueries = {
  getEvents: ({
    cursorAfter,
    limit,
  }: {
    cursorAfter?: string;
    limit?: number;
  }) => {
    return infiniteQueryOptions({
      queryKey: [...queryKeys.events.getEvents, cursorAfter],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.public.events.getEvents({ cursorAfter: pageParam, limit }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
    });
  },
  getNextEvent: () => {
    return queryOptions({
      queryKey: queryKeys.events.getNextEvent,
      queryFn: () => api.public.events.getNextEvent(),
    });
  },
  getLatestCompletedEvent: () => {
    return queryOptions({
      queryKey: queryKeys.events.getLatestCompletedEvent,
      queryFn: () => api.public.events.getLatestCompletedEvent(),
    });
  },
  getUpcomingEvents: () => {
    return queryOptions({
      queryKey: queryKeys.events.getUpcomingEvents,
      queryFn: () => api.public.events.getUpcomingEvents(),
    });
  },
};
