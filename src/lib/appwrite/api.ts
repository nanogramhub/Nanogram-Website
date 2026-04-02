import { ID, OAuthProvider } from "appwrite";
import { account, appwriteConfig, avatars, database, storage } from "./config";
import type { AppwriteResponse, Event, Nanogram, User } from "@/types/schema";
import type { SigninFormValues, SignupFormValues } from "../validation";
import type { PostCardData, PostDetailsData, PostsFilter } from "@/types/api";
import { querySelector } from "./queries";
import { webappUrl } from "@/constants";
// import { getUserKarma } from "../utils";

async function getEmailFromIdentifier(identifier: string) {
  if (identifier.includes("@")) {
    return identifier;
  }
  const response = await database.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    queries: querySelector.users.getUserByUsernameQueries(identifier),
  });
  return response.rows[0].email;
}

export const api = {
  avatars: {
    getInitials(name: string) {
      const response = avatars.getInitials({ name });
      return response;
    },
  },

  auth: {
    async signIn({ identifier, password }: SigninFormValues) {
      const email = await getEmailFromIdentifier(identifier);
      const response = await account.createEmailPasswordSession({
        email,
        password,
      });
      return response;
    },

    async loginWithGithub() {
      account.createOAuth2Session({
        provider: OAuthProvider.Github,
        success: `${webappUrl}/`,
        failure: `${webappUrl}/login?error=github`,
      });
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
        queries: querySelector.auth.getCheckUsernameQueries(username),
      });
      return response.rows.length === 0;
    },

    async sendResetPasswordEmail(email: string) {
      const response = await account.createRecovery({
        email,
        url: `${webappUrl}/reset-password`,
      });
      return response;
    },

    async resetPassword(userId: string, secret: string, password: string) {
      const response = await account.updateRecovery({
        userId,
        secret,
        password,
      });
      return response;
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
          queries: querySelector.nanogram.getTestimonialQueries(),
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
        const response = await database.listRows<Nanogram>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.nanogramsTableId,
          queries: querySelector.nanogram.getCoreMemberQueries({
            cursorAfter,
            limit,
          }),
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
        const response = await database.listRows<Nanogram>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.nanogramsTableId,
          queries: querySelector.nanogram.getAluminiMemberQueries({
            cursorAfter,
            limit,
          }),
        });
        return response;
      },
    },

    events: {
      async getEvents(modifiers: {
        cursorAfter?: string;
        limit?: number;
      }): Promise<AppwriteResponse<Event>> {
        const response = await database.listRows<Event>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          queries: querySelector.events.getEventsQueries(modifiers),
        });
        return response;
      },

      async getNextEvent(): Promise<Event> {
        const events = await database.listRows<Event>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          queries: querySelector.events.getNextEventQueries(),
        });

        return events.rows[0] ?? null;
      },

      async getLatestCompletedEvent(): Promise<Event> {
        const events = await database.listRows<Event>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          queries: querySelector.events.getLatestCompletedEventQueries(),
        });

        return events.rows[0] ?? null;
      },

      async getUpcomingEvents() {
        const events = await database.listRows<Event>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          queries: querySelector.events.getUpcomingEventsQueries(),
        });

        return events;
      },
    },
  },

  user: {
    async createuser(
      data: SignupFormValues & { accountId: string; imageUrl: string },
    ) {
      const user = await database.createRow<User>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        rowId: ID.unique(),
        data: {
          ...data,
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
        queries: querySelector.users.getUserByAccountIdQueries(id),
      });
      return response.rows[0] ?? null;
    },
  },

  posts: {
    async getPosts(modifiers: {
      cursorAfter?: string;
      limit?: number;
      filter?: PostsFilter;
      search: string | undefined;
    }) {
      const response = await database.listRows<PostCardData>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.postsTableId,
        queries: querySelector.posts.getPostCardDataQuery(modifiers),
      });
      return response;
    },

    async getPostById(id: string) {
      const response = await database.getRow<PostDetailsData>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.postsTableId,
        rowId: id,
        queries: querySelector.posts.getPostDetailsDataQuery(),
      });
      return response;
    },
  },
};
