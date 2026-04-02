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
      return [Query.equal("username", username), Query.limit(1)];
    },
    getUserByAccountIdQueries(accountId: string) {
      return [Query.equal("accountId", accountId), Query.limit(1)];
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
        Query.select([
          "caption",
          "imageId",
          "imageUrl",
          "creator.name",
          "creator.imageUrl",
          "creator.username",
          "creator.karma",
          "likes.$id",
          "save.*",
          "tags",
        ]),
        getPostFilterQueries(filter),
        ...getSearchQueries(search),
        ...querySelector.general.addCursorIfPresent(cursorAfter),
        Query.limit(limit),
      ];
    },
    getPostDetailsDataQuery() {
      return [
        Query.select([
          "caption",
          "imageId",
          "imageUrl",
          "creator.name",
          "creator.imageUrl",
          "creator.username",
          "creator.karma",
          "likes.$id",
          "save.*",
          "tags",
          "comments.*",
          "comments.commentor.name",
          "comments.commentor.imageUrl",
          "comments.commentor.username",
        ]),
      ];
    },
  },
};
