import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, database, storage } from "./config";
import type { AppwriteResponse, Event, Nanogram, User } from "@/types/api";
import type { SigninFormValues, SignupFormValues } from "../validation";
// import { getUserKarma } from "../utils";

export const api = {
  avatars: {
    getInitials(name: string) {
      const response = avatars.getInitials({ name });
      return response;
    },
  },

  auth: {
    async signIn({ identifier, password }: SigninFormValues) {
      let email = identifier;

      // If it's not an email, we assume it's a username and look up the email
      if (!identifier.includes("@")) {
        const response = await database.listRows({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.usersTableId,
          queries: [Query.equal("username", identifier), Query.limit(1)],
        });
        if (response.rows.length === 0) {
          throw new Error("No user found with the given username.");
        }
        email = response.rows[0].email;
      }

      const response = await account.createEmailPasswordSession({
        email,
        password,
      });
      return response;
    },

    async signOut() {
      const response = await account.deleteSession({
        sessionId: "current",
      });
      return response;
    },

    async createAccount({
      email,
      password,
      name,
    }: Omit<SignupFormValues, "username">) {
      const response = await account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });

      return response;
    },

    async getCurrentSession() {
      const response = await account.get();
      return response;
    },

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

  user: {
    async createuser({
      email,
      name,
      username,
      accountId,
      imageUrl,
    }: SignupFormValues & { accountId: string; imageUrl: string }) {
      const user = await database.createRow<User>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        rowId: ID.unique(),
        data: {
          accountId,
          email,
          name,
          username,
          imageUrl,
          karma: 0,
          admin: false,
        },
      });

      return user;
    },

    async getUserByAccountId(id: string) {
      const response = await database.listRows<User>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        queries: [Query.equal("accountId", id), Query.limit(1)],
      });
      return response.rows[0] ?? null;
    },
  },
};
