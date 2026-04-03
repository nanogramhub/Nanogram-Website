import type { PostsFilter } from "@/types/api";
import { Query } from "appwrite";

function getPostFilterQueries(filter: PostsFilter) {
  switch (filter) {
    case "recent":
      return Query.orderDesc("$createdAt");
    case "oldest":
      return Query.orderAsc("$createdAt");
    case "trending":
      return Query.orderDesc("$updatedAt");
    default:
      return filter satisfies never;
  }
}

function getSearchQueries(search: string | undefined) {
  if (!search) return [];
  if (search.startsWith("#")) {
    return [Query.contains("tags", search.slice(1))];
  }
  return [Query.search("caption", search)];
}

export const querySelector = {
  general: {
    addCursorIfPresent(cursorAfter?: string) {
      return cursorAfter ? [Query.cursorAfter(cursorAfter)] : [];
    },
  },
  auth: {
    getCheckUsernameQueries(username: string) {
      return [Query.equal("username", username), Query.limit(1)];
    },
  },
  nanogram: {
    getTestimonialQueries() {
      return [
        Query.isNotNull("content"),
        Query.orderAsc("$createdAt"),
        Query.limit(10),
      ];
    },
    getCoreMemberQueries({
      cursorAfter,
      limit = 9,
    }: {
      cursorAfter?: string;
      limit?: number;
    }) {
      return [
        Query.equal("core", true),
        Query.orderAsc("priority"),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
    getAluminiMemberQueries({
      cursorAfter,
      limit = 9,
    }: {
      cursorAfter?: string;
      limit?: number;
    }) {
      return [
        Query.equal("alumini", true),
        Query.orderAsc("priority"),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
  },
  events: {
    getEventsQueries({
      cursorAfter,
      limit = 10,
    }: {
      cursorAfter?: string;
      limit?: number;
    }) {
      return [
        Query.orderDesc("date"),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
    getUpcomingEventsQueries() {
      return [
        Query.orderAsc("date"),
        Query.equal("completed", false),
        Query.limit(10),
      ];
    },
    getLatestCompletedEventQueries() {
      return [
        Query.orderDesc("date"),
        Query.equal("completed", true),
        Query.limit(1),
      ];
    },
    getNextEventQueries() {
      return [
        Query.orderAsc("date"),
        Query.equal("completed", false),
        Query.limit(1),
      ];
    },
  },
  users: {
    getUserByUsernameQueries(username: string) {
      return [
        Query.select(["*", "posts.$id", "followers.$id", "following.$id"]),
        Query.equal("username", username),
        Query.limit(1),
      ];
    },
    getUsersQueries({
      cursorAfter,
      limit = 10,
      searchTerm,
    }: {
      cursorAfter?: string;
      limit?: number;
      searchTerm?: string;
    }) {
      const queries = [
        Query.orderDesc("$createdAt"),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
      if (searchTerm) {
        if (searchTerm.startsWith("@")) {
          queries.push(Query.search("username", searchTerm.slice(1)));
        } else {
          queries.push(Query.search("name", searchTerm));
        }
      }
      return queries;
    },
    getUserByAccountIdQueries(accountId: string) {
      return [
        Query.select(["*", "following.*"]),
        Query.equal("accountId", accountId),
        Query.limit(1),
      ];
    },
  },
  follows: {
    getFollowersQueries({
      userId,
      cursorAfter,
      limit = 10,
    }: {
      userId: string;
      cursorAfter?: string;
      limit?: number;
    }) {
      return [
        Query.select([
          "follower.$id",
          "follower.name",
          "follower.imageUrl",
          "follower.username",
        ]),
        Query.equal("followed", userId),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
    getFollowingQueries({
      userId,
      cursorAfter,
      limit = 10,
    }: {
      userId: string;
      cursorAfter?: string;
      limit?: number;
    }) {
      return [
        Query.select([
          "followed.$id",
          "followed.name",
          "followed.imageUrl",
          "followed.username",
        ]),
        Query.equal("follower", userId),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
  },
  posts: {
    getPostCardDataQuery({
      cursorAfter,
      limit = 2,
      filter = "recent",
      search,
    }: {
      cursorAfter?: string;
      limit?: number;
      filter?: PostsFilter;
      search?: string;
    }) {
      return [
        ...querySelector.posts.getPostQuery(),
        getPostFilterQueries(filter),
        ...getSearchQueries(search),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
    getPostQuery() {
      return [
        Query.select([
          "*",
          "creator.name",
          "creator.imageUrl",
          "creator.username",
          "creator.karma",
          "likes.$id",
          "save.*",
        ]),
      ];
    },
    getPostsByUserIdQueries({
      userId,
      cursorAfter,
      limit = 10,
    }: {
      userId: string;
      cursorAfter?: string;
      limit?: number;
    }) {
      return [
        Query.select(["*"]),
        Query.equal("creator.$id", userId),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
  },
  saves: {
    getSavedPostsQueries({
      userId,
      cursorAfter,
      limit = 10,
    }: {
      userId: string;
      cursorAfter?: string;
      limit?: number;
    }) {
      return [
        Query.select(["post.*", "post.creator.name", "post.creator.imageUrl"]),
        Query.equal("user", userId),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
  },
  comments: {
    getCommentsByPostIdQueries({
      postId,
      cursorAfter,
      limit = 10,
    }: {
      postId: string;
      cursorAfter?: string;
      limit?: number;
    }) {
      return [
        Query.select([
          "*",
          "commentor.name",
          "commentor.imageUrl",
          "commentor.username",
          "likes.$id",
        ]),
        Query.equal("post.$id", postId),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
  },
};
