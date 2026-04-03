import { ID, OAuthProvider } from "appwrite";
import { account, appwriteConfig, avatars, database, storage } from "./config";
import type {
  AppwriteResponse,
  Event,
  Nanogram,
  Post,
  User,
} from "@/types/schema";
import type { SigninFormValues, SignupFormValues } from "../validation";
import type {
  CommentData,
  CurrentUser,
  Followers,
  Following,
  PostCardData,
  PostsFilter,
  SavedPostData,
  UserProfileData,
} from "@/types/api";
import { querySelector } from "./queries";
import { webappUrl } from "@/constants";
import { UserNotFoundException } from "@/exceptions";
// import { getUserKarma } from "../utils";

async function getEmailFromIdentifier(identifier: string) {
  if (identifier.includes("@")) {
    return identifier;
  }
  const response = await database.listRows<User>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    queries: querySelector.users.getUserByUsernameQueries(identifier),
  });
  if (!response.rows[0]) {
    throw new UserNotFoundException(
      `No user found for identifier: ${identifier}`,
    );
  }
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

    async loginWithGithub(redirect: string) {
      account.createOAuth2Session({
        provider: OAuthProvider.Github,
        success: `${webappUrl}${redirect}`,
        failure: `${webappUrl}/login`,
      });
    },

    async loginWithGoogle(redirect: string) {
      account.createOAuth2Session({
        provider: OAuthProvider.Google,
        success: `${webappUrl}${redirect}`,
        failure: `${webappUrl}/login`,
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

  users: {
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

    async getUsers(modifiers: {
      cursorAfter?: string;
      limit?: number;
      searchTerm?: string;
    }) {
      const response = await database.listRows<User>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        queries: querySelector.users.getUsersQueries(modifiers),
      });
      return response;
    },

    async getUserByUsername(username: string): Promise<UserProfileData | null> {
      const response = await database.listRows<UserProfileData>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        queries: querySelector.users.getUserByUsernameQueries(username),
      });
      return response.rows[0] ?? null;
    },

    async getUserByAccountId(id: string): Promise<CurrentUser | null> {
      const response = await database.listRows<CurrentUser>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        queries: querySelector.users.getUserByAccountIdQueries(id),
      });
      return response.rows[0] ?? null;
    },

    follows: {
      async getFollowers({
        userId,
        cursorAfter,
        limit = 10,
      }: {
        userId: string;
        cursorAfter?: string;
        limit?: number;
      }) {
        const response = await database.listRows<Followers>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.followsTableId,
          queries: querySelector.follows.getFollowersQueries({
            userId,
            cursorAfter,
            limit,
          }),
        });
        return response;
      },

      async getFollowing({
        userId,
        cursorAfter,
        limit = 10,
      }: {
        userId: string;
        cursorAfter?: string;
        limit?: number;
      }) {
        const response = await database.listRows<Following>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.followsTableId,
          queries: querySelector.follows.getFollowingQueries({
            userId,
            cursorAfter,
            limit,
          }),
        });
        return response;
      },

      async followUser(followerId: string, followedId: string) {
        const response = await database.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.followsTableId,
          rowId: ID.unique(),
          data: {
            follower: followerId,
            followed: followedId,
          },
        });
        return response;
      },

      async unfollowUser(followedRecordId: string) {
        const response = await database.deleteRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.followsTableId,
          rowId: followedRecordId,
        });
        return response;
      },
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
      const response = await database.getRow<PostCardData>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.postsTableId,
        rowId: id,
        queries: querySelector.posts.getPostQuery(),
      });
      return response;
    },

    async getPostsByUserId(modifiers: {
      userId: string;
      cursorAfter?: string;
      limit?: number;
    }) {
      const response = await database.listRows<Post>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.postsTableId,
        queries: querySelector.posts.getPostsByUserIdQueries(modifiers),
      });
      return response;
    },

    async updateLikes(likeArray: string[], postId: string) {
      const response = await database.updateRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.postsTableId,
        rowId: postId,
        data: {
          likes: likeArray,
        },
      });
      return response;
    },

    saves: {
      async getSavedPosts(modifiers: {
        userId: string;
        cursorAfter?: string;
        limit?: number;
      }) {
        const response = await database.listRows<SavedPostData>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.savesTableId,
          queries: querySelector.saves.getSavedPostsQueries(modifiers),
        });
        return response;
      },
      async savePost(userId: string, postId: string) {
        const response = await database.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.savesTableId,
          rowId: ID.unique(),
          data: {
            user: userId,
            post: postId,
          },
        });
        return response;
      },
      async unsavePost(savedRecordId: string) {
        const response = await database.deleteRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.savesTableId,
          rowId: savedRecordId,
        });
        return response;
      },
    },

    comments: {
      async getCommentsByPostId(modifiers: {
        postId: string;
        cursorAfter?: string;
        limit?: number;
      }) {
        const response = await database.listRows<CommentData>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.commentsTableId,
          queries: querySelector.comments.getCommentsByPostIdQueries(modifiers),
        });
        return response;
      },
    },
  },
};
