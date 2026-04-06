import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/appwrite/api";
import type { PostsFilter } from "@/types/api";

import { queryKeys } from "./query-keys";

export const authQueries = {
  checkUsernameAvailability: (username: string) => {
    return queryOptions({
      queryKey: [...queryKeys.auth.checkUsernameAvailability, username],
      queryFn: () => api.auth.checkUsernameAvailability(username),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  },
  getAllIdentities: ({ enabled }: { enabled: boolean }) => {
    return queryOptions({
      queryKey: queryKeys.auth.getAllIdentities,
      queryFn: () => api.auth.getAllIdentities(),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled,
    });
  },
  getAllSessions: ({ enabled }: { enabled: boolean }) => {
    return queryOptions({
      queryKey: queryKeys.auth.getAllSessions,
      queryFn: () => api.auth.getAllSessions(),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled,
    });
  },
};

export const nanogramQueries = {
  getTestimonials: (enabled: boolean) => {
    return queryOptions({
      queryKey: queryKeys.nanogram.getTestimonials,
      queryFn: () => api.public.nanogram.getTestimonials(),
      staleTime: 1000 * 60 * 30, // 30 minutes
      enabled,
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
    enabled,
  }: {
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
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
      enabled,
    });
  },
  getAluminiMembers: ({
    cursorAfter,
    limit,
    enabled,
  }: {
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
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
      enabled,
    });
  },
};

export const newslettersQueries = {
  getNewsletters: ({
    cursorAfter,
    limit,
    enabled,
  }: {
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
  }) => {
    return infiniteQueryOptions({
      queryKey: [
        ...queryKeys.newsletters.getNewsletters,
        { cursorAfter, limit },
      ],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.newsletters.getNewsletters({ cursorAfter: pageParam, limit }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 30, // 30 minutes
      enabled,
    });
  },
  getNewsletterById: (id: string) => {
    return queryOptions({
      queryKey: [...queryKeys.newsletters.getNewsletters, id],
      queryFn: () => api.newsletters.getNewsletterById(id),
      staleTime: 1000 * 60 * 30, // 30 minutes
      enabled: !!id,
    });
  },
};

export const eventsQueries = {
  getEvents: ({
    cursorAfter,
    limit,
    enabled,
  }: {
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
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
      enabled,
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
  getUpcomingEvents: ({ enabled }: { enabled: boolean }) => {
    return queryOptions({
      queryKey: queryKeys.events.getUpcomingEvents,
      queryFn: () => api.public.events.getUpcomingEvents(),
      enabled,
    });
  },
};

export const usersQueries = {
  getUserByAccountId: (userId: string) => {
    return queryOptions({
      queryKey: [...queryKeys.users.getUserByAccountId, userId],
      queryFn: () => api.users.getUserByAccountId(userId),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!userId,
    });
  },
  getUserByUsername: (username: string) => {
    return queryOptions({
      queryKey: [...queryKeys.users.getUserByUsername, username],
      queryFn: () => api.users.getUserByUsername(username),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!username,
    });
  },
  getUsers: ({
    cursorAfter,
    limit,
    enabled,
    searchTerm,
  }: {
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
    searchTerm?: string;
  }) => {
    return infiniteQueryOptions({
      queryKey: [
        ...queryKeys.users.getUsers,
        { cursorAfter, limit, searchTerm },
      ],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.users.getUsers({ cursorAfter: pageParam, limit, searchTerm }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled,
    });
  },
  getUserById: (userId: string | undefined) => {
    return queryOptions({
      queryKey: [...queryKeys.users.getUsers, userId],
      queryFn: () => (userId ? api.users.getUserById(userId) : null),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!userId,
    });
  },
};

export const postsQueries = {
  getPosts: ({
    cursorAfter,
    limit,
    enabled,
    filter,
    search,
  }: {
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
    filter?: PostsFilter;
    search: string | undefined;
  }) => {
    return infiniteQueryOptions({
      queryKey: [
        ...queryKeys.posts.getRecentPosts,
        { cursorAfter, filter, search },
      ],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.posts.getPosts({ cursorAfter: pageParam, limit, filter, search }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      enabled,
    });
  },
  getPostById: (postId: string) => {
    return queryOptions({
      queryKey: [...queryKeys.posts.getPostById, postId],
      queryFn: () => api.posts.getPostById(postId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  },
  getPostsByUserId: ({
    userId,
    cursorAfter,
    limit,
    enabled,
  }: {
    userId: string;
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
  }) => {
    return infiniteQueryOptions({
      queryKey: [
        ...queryKeys.posts.getPostsByUserId,
        { userId, cursorAfter, limit },
      ],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.posts.getPostsByUserId({
          userId,
          cursorAfter: pageParam,
          limit,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled,
    });
  },
  getLikedPosts: ({
    userId,
    cursorAfter,
    limit,
    enabled,
  }: {
    userId: string;
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
  }) => {
    return infiniteQueryOptions({
      queryKey: [
        ...queryKeys.posts.getLikedPosts,
        { userId, cursorAfter, limit },
      ],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.posts.getLikedPosts({
          userId,
          cursorAfter: pageParam,
          limit,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled,
    });
  },
};

export const commentQueries = {
  getCommentsByPostId: ({
    postId,
    cursorAfter,
    limit,
    enabled,
  }: {
    postId: string;
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
  }) => {
    return infiniteQueryOptions({
      queryKey: [
        ...queryKeys.comments.getCommentsByPostId,
        { postId, cursorAfter, limit },
      ],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.posts.comments.getCommentsByPostId({
          postId,
          cursorAfter: pageParam,
          limit,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled,
    });
  },
};

export const savesQueries = {
  getSavedPosts: ({
    userId,
    cursorAfter,
    limit,
    enabled,
  }: {
    userId: string;
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
  }) => {
    return infiniteQueryOptions({
      queryKey: [
        ...queryKeys.saves.getSavedPosts,
        { userId, cursorAfter, limit },
      ],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.posts.saves.getSavedPosts({
          userId,
          cursorAfter: pageParam,
          limit,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled,
    });
  },
};

export const followsQueries = {
  getFollowers: ({
    userId,
    cursorAfter,
    limit,
    enabled,
  }: {
    userId: string;
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
  }) => {
    return infiniteQueryOptions({
      queryKey: [
        ...queryKeys.follows.getFollowers,
        { userId, cursorAfter, limit },
      ],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.users.follows.getFollowers({
          userId,
          cursorAfter: pageParam,
          limit,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled,
    });
  },
  getFollowing: ({
    userId,
    cursorAfter,
    limit,
    enabled,
  }: {
    userId: string;
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
  }) => {
    return infiniteQueryOptions({
      queryKey: [
        ...queryKeys.follows.getFollowing,
        { userId, cursorAfter, limit },
      ],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.users.follows.getFollowing({
          userId,
          cursorAfter: pageParam,
          limit,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled,
    });
  },
};

export const messagesQueries = {
  getMessages: ({
    senderId,
    receiverId,
    cursorAfter,
    limit,
    enabled,
  }: {
    senderId: string;
    receiverId: string;
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
  }) => {
    return infiniteQueryOptions({
      queryKey: [...queryKeys.messages.getMessages, { senderId, receiverId }],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.messages.getMessages({
          senderId,
          receiverId,
          cursorAfter: pageParam,
          limit,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 30, // 30 seconds
      enabled,
    });
  },

  getContacts: ({
    userId,
    cursorAfter,
    limit,
    enabled,
  }: {
    userId: string;
    cursorAfter?: string;
    limit?: number;
    enabled: boolean;
  }) => {
    return infiniteQueryOptions({
      queryKey: [...queryKeys.messages.getContacts, { userId }],
      initialPageParam: cursorAfter,
      queryFn: ({ pageParam }) =>
        api.messages.getContacts({
          userId,
          cursorAfter: pageParam,
          limit,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.rows.length === 0
          ? null
          : lastPage.rows[lastPage.rows.length - 1].$id,
      staleTime: 1000 * 60 * 2, // 2 minutes
      enabled,
    });
  },
};
