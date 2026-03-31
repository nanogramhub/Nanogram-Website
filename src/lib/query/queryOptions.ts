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
      queryFn: () => api.public.getTestimonials(),
    });
  },
  getTeamMembers: () => {
    return queryOptions({
      queryKey: queryKeys.nanogram.getCoreMembers,
      queryFn: () => api.public.getCoreMembers({}),
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
        api.public.getCoreMembers({ cursorAfter: pageParam, limit }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
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
        api.public.getAluminiMembers({ cursorAfter: pageParam, limit }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
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
        api.public.getEvents({ cursorAfter: pageParam, limit }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
    });
  },
};
