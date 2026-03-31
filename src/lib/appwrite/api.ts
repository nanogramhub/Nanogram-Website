import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, database, storage } from "./config";
import type { AppwriteResponse, Event, Nanogram } from "@/types/api";
// import { getUserKarma } from "../utils";

export const api = {
  auth: {
    async checkUsernameAvailability(username: string) {
      const response = await database.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        queries: [Query.equal("username", username), Query.limit(1)],
      });
      return response.rows.length === 0;
    },
  },

  public: {
    // NANOGRAM
    async getTestimonials(): Promise<
      AppwriteResponse<Nanogram & { content: string }>
    > {
      const response = await database.listRows<Nanogram & { content: string }>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.nanogramsTableId,
        queries: [
          Query.isNotNull("content"),
          Query.orderAsc("$createdAt"),
          Query.limit(10),
        ],
      });
      return response;
    },

    async getCoreMembers({
      cursorAfter,
      limit = 9,
    }: {
      cursorAfter?: string;
      limit?: number;
    }): Promise<AppwriteResponse<Nanogram>> {
      const queries = [
        Query.equal("core", true),
        Query.orderAsc("priority"),
        Query.limit(limit),
      ];
      if (cursorAfter) {
        queries.push(Query.cursorAfter(cursorAfter));
      }
      const response = await database.listRows<Nanogram>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.nanogramsTableId,
        queries,
      });
      return response;
    },

    async getAluminiMembers({
      cursorAfter,
      limit = 9,
    }: {
      cursorAfter?: string;
      limit?: number;
    }): Promise<AppwriteResponse<Nanogram>> {
      const queries = [
        Query.equal("alumini", true),
        Query.orderAsc("priority"),
        Query.limit(limit),
      ];
      if (cursorAfter) {
        queries.push(Query.cursorAfter(cursorAfter));
      }
      const response = await database.listRows<Nanogram>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.nanogramsTableId,
        queries,
      });
      return response;
    },

    // EVENTS
    async getEvents({
      cursorAfter,
      limit = 9,
    }: {
      cursorAfter?: string;
      limit?: number;
    }): Promise<AppwriteResponse<Event>> {
      const queries = [Query.orderDesc("$createdAt"), Query.limit(limit)];
      if (cursorAfter) {
        queries.push(Query.cursorAfter(cursorAfter));
      }
      const response = await database.listRows<Event>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.eventsTableId,
        queries,
      });
      return response;
    },
  },
};
