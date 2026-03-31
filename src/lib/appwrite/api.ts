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
    nanogram: {
      async getTestimonials(): Promise<
        AppwriteResponse<Nanogram & { content: string }>
      > {
        const response = await database.listRows<
          Nanogram & { content: string }
        >({
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
    },

    events: {
      async getEvents({
        cursorAfter,
        limit = 10,
      }: {
        cursorAfter?: string;
        limit?: number;
      }): Promise<AppwriteResponse<Event>> {
        const queries = [Query.orderDesc("date"), Query.limit(limit)];
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

      async getNextEvent(): Promise<Event> {
        const events = await database.listRows<Event>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          queries: [
            Query.orderAsc("date"),
            Query.limit(1),
            Query.equal("completed", false),
          ],
        });

        return events.rows[0] ?? null;
      },

      async getLatestCompletedEvent(): Promise<Event> {
        const events = await database.listRows<Event>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          queries: [
            Query.orderDesc("date"),
            Query.limit(1),
            Query.equal("completed", true),
          ],
        });

        return events.rows[0] ?? null;
      },

      async getUpcomingEvents() {
        const events = await database.listRows<Event>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          queries: [
            Query.orderAsc("date"),
            Query.limit(10),
            Query.equal("completed", false),
          ],
        });

        if (!events) throw Error;

        return events;
      },
    },
  },
};
