import { ID, type Models,OAuthProvider } from "appwrite";

import { webappUrl } from "@/constants";
import { UserNotFoundException } from "@/exceptions";
import type {
  CommentData,
  CurrentUser,
  Followers,
  Following,
  MessageData,
  PostCardData,
  PostCardMinimal,
  PostsFilter,
  SavedPostData,
  UserProfileData,
} from "@/types/api";
import type {
  AppwriteDocument,
  AppwriteResponse,
  Event,
  Message,
  Nanogram,
  Newsletter,
  Post,
  User,
} from "@/types/schema";

import type { SigninFormValues, SignupFormValues } from "../validation";
import { account, appwriteConfig, avatars, database, storage } from "./config";
import { querySelector } from "./queries";

/** Scopes so Google returns profile picture via userinfo; GitHub `read:user` includes `avatar_url`. */
const GOOGLE_OAUTH_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];
const GITHUB_OAUTH_SCOPES = ["read:user", "user:email"];

async function getFreshOAuthIdentity(identity: Models.Identity) {
  const expiry = new Date(identity.providerAccessTokenExpiry);
  const minutesUntilExpiry = (expiry.getTime() - Date.now()) / 1000 / 60;
  if (minutesUntilExpiry < 5) {
    await account.updateSession({ sessionId: "current" });
  }
  const { identities } = await account.listIdentities();
  return (
    identities.find((i) => i.$id === identity.$id) ??
    identities.find((i) => i.provider === identity.provider) ??
    null
  );
}

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

  storage: {
    async uploadFile(file: File) {
      const response = await storage.createFile({
        bucketId: appwriteConfig.storageBucketId,
        fileId: ID.unique(),
        file,
      });
      return response;
    },

    async uploadFileFromUrl(url: string, filenamePrefix = "avatar") {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to download image");
      }
      const blob = await res.blob();
      const type = blob.type || "image/jpeg";
      const ext = type.includes("png")
        ? "png"
        : type.includes("webp")
          ? "webp"
          : "jpg";
      const file = new File([blob], `${filenamePrefix}.${ext}`, { type });
      return await storage.createFile({
        bucketId: appwriteConfig.storageBucketId,
        fileId: ID.unique(),
        file,
      });
    },

    getFileUrl(fileId: string) {
      return storage.getFileDownload({
        bucketId: appwriteConfig.storageBucketId,
        fileId,
      });
    },

    async deleteFile(fileId: string) {
      await storage.deleteFile({
        bucketId: appwriteConfig.storageBucketId,
        fileId,
      });
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
      account.createOAuth2Token({
        provider: OAuthProvider.Github,
        success: `${webappUrl}/oauth/callback`,
        failure: `${webappUrl}/login`,
        scopes: GITHUB_OAUTH_SCOPES,
      });
    },

    async loginWithGoogle() {
      account.createOAuth2Token({
        provider: OAuthProvider.Google,
        success: `${webappUrl}/oauth/callback`,
        failure: `${webappUrl}/login`,
        scopes: GOOGLE_OAUTH_SCOPES,
      });
    },

    /**
     * Completes the OAuth token flow: Appwrite redirects here with `userId` and `secret` query params.
     * @see https://appwrite.io/blog/post/appwrite-oauth
     */
    async createSessionFromOAuthToken(userId: string, secret: string) {
      return await account.createSession({ userId, secret });
    },

    async fetchOAuthProviderAvatarUrl(
      identity: Models.Identity,
    ): Promise<string | null> {
      const fresh = await getFreshOAuthIdentity(identity);
      if (!fresh?.providerAccessToken) return null;

      const token = fresh.providerAccessToken;

      if (identity.provider === "google") {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) return null;
        const data = (await res.json()) as { picture?: string };
        return typeof data.picture === "string" ? data.picture : null;
      }

      if (identity.provider === "github") {
        const res = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { avatar_url?: string };
        return typeof data.avatar_url === "string" ? data.avatar_url : null;
      }

      return null;
    },

    async signOut() {
      await account.deleteSession({
        sessionId: "current",
      });
    },

    async deleteSession(sessionId: string) {
      await account.deleteSession({
        sessionId,
      });
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

    async getCurrentUserAccount() {
      const response = await account.get();
      return response;
    },

    async getAllSessions() {
      return await account.listSessions();
    },

    async getAllIdentities() {
      return await account.listIdentities();
    },

    async deleteIdentity(identityId: string) {
      return await account.deleteIdentity({ identityId });
    },

    async updateName(name: string) {
      return await account.updateName({ name });
    },

    async updateEmail(email: string, password: string) {
      return await account.updateEmail({
        email,
        password,
      });
    },

    async updatePassword(password: string, oldPassword?: string) {
      return await account.updatePassword({
        password,
        ...(oldPassword && { oldPassword }),
      });
    },

    async updatePrefs(prefs: Record<string, unknown>) {
      return await account.updatePrefs({ prefs });
    },

    async getPrefs() {
      return await account.getPrefs();
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

      async getAllTeamMembers({
        cursorAfter,
        limit,
        search,
      }: {
        cursorAfter?: string;
        limit?: number;
        search?: string;
      }): Promise<AppwriteResponse<Nanogram>> {
        const response = await database.listRows<Nanogram>({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.nanogramsTableId,
          queries: querySelector.nanogram.getAllTeamMemberQueries({
            cursorAfter,
            limit,
            search,
          }),
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

      async createMember(data: Omit<Nanogram, keyof AppwriteDocument>) {
        return await database.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.nanogramsTableId,
          rowId: ID.unique(),
          data,
        });
      },

      async updateMember(
        rowId: string,
        data: Partial<Omit<Nanogram, keyof AppwriteDocument>>,
      ) {
        return await database.updateRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.nanogramsTableId,
          rowId,
          data,
        });
      },

      async deleteMember(rowId: string) {
        return await database.deleteRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.nanogramsTableId,
          rowId,
        });
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

      async createEvent(data: Omit<Event, keyof AppwriteDocument>) {
        return await database.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          rowId: ID.unique(),
          data,
        });
      },

      async updateEvent(
        rowId: string,
        data: Partial<Omit<Event, keyof AppwriteDocument>>,
      ) {
        return await database.updateRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          rowId,
          data,
        });
      },

      async deleteEvent(rowId: string) {
        return await database.deleteRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.eventsTableId,
          rowId,
        });
      },
    },
  },

  users: {
    async createuser(
      data: Omit<SignupFormValues, "password"> & {
        accountId: string;
        imageUrl: string;
        imageId: string | null;
        password?: string;
      },
    ) {
      const user = await database.createRow<User>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        rowId: ID.unique(),
        data: {
          name: data.name,
          username: data.username,
          email: data.email,
          accountId: data.accountId,
          imageUrl: data.imageUrl,
          imageId: data.imageId,
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

    async getUserById(id: string): Promise<User | null> {
      const response = await database.getRow<User>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        rowId: id,
      });
      return response;
    },

    async updateUser(
      userId: string,
      data: Partial<
        Pick<
          User,
          | "name"
          | "username"
          | "email"
          | "bio"
          | "imageId"
          | "imageUrl"
          | "admin"
        >
      >,
    ) {
      const response = await database.updateRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        rowId: userId,
        data,
      });
      return response;
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

    async getLikedPosts(modifiers: {
      userId: string;
      cursorAfter?: string;
      limit?: number;
    }) {
      const response = await database.listRows<PostCardMinimal>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.postsTableId,
        queries: querySelector.posts.getLikedPostsQueries(modifiers),
      });
      return response;
    },

    async createPost(
      creator: string,
      caption: string,
      tags: string[],
      imageId: string,
      imageUrl: string,
    ) {
      const response = await database.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.postsTableId,
        rowId: ID.unique(),
        data: {
          creator,
          caption,
          tags,
          imageId,
          imageUrl,
        },
      });
      return response;
    },

    async updatePost(
      postId: string,
      data: Partial<Pick<Post, "caption" | "tags" | "imageId" | "imageUrl">>,
    ) {
      const response = await database.updateRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.postsTableId,
        rowId: postId,
        data,
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

    async deletePost(postId: string) {
      const response = await database.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.postsTableId,
        rowId: postId,
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

      async updateLikes(likeArray: string[], commentId: string) {
        const response = await database.updateRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.commentsTableId,
          rowId: commentId,
          data: {
            likes: likeArray,
          },
        });
        return response;
      },

      async createComment(content: string, postId: string, userId: string) {
        const response = await database.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.commentsTableId,
          rowId: ID.unique(),
          data: {
            content,
            post: postId,
            commentor: userId,
          },
        });
        return response;
      },

      async deleteComment(commentId: string) {
        const response = await database.deleteRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.commentsTableId,
          rowId: commentId,
        });
        return response;
      },
    },
  },

  newsletters: {
    async getNewsletters(modifiers: { cursorAfter?: string; limit?: number }) {
      const response = await database.listRows<Newsletter>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.newsTableId,
        queries: querySelector.newsletters.getNewslettersQueries(modifiers),
      });
      return response;
    },

    async getNewsletterById(id: string) {
      const response = await database.getRow<Newsletter>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.newsTableId,
        rowId: id,
      });
      return response;
    },

    async createNewsletter(
      data: Partial<Omit<Newsletter, keyof AppwriteDocument>>,
    ) {
      const response = await database.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.newsTableId,
        rowId: ID.unique(),
        data,
      });
      return response;
    },

    async updateNewsletter(
      rowId: string,
      data: Partial<Omit<Newsletter, keyof AppwriteDocument>>,
    ) {
      return await database.updateRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.newsTableId,
        rowId,
        data,
      });
    },

    async deleteNewsletter(rowId: string) {
      return await database.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.newsTableId,
        rowId,
      });
    },
  },

  messages: {
    async getMessages(modifiers: {
      senderId: string;
      receiverId: string;
      cursorAfter?: string;
      limit?: number;
    }): Promise<AppwriteResponse<MessageData>> {
      const response = await database.listRows<MessageData>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.messagesTableId,
        queries:
          querySelector.messages.getMessagesBetweenUsersQueries(modifiers),
      });
      return response;
    },

    async sendMessage({
      senderId,
      receiverId,
      content,
    }: {
      senderId: string;
      receiverId: string;
      content: string;
    }) {
      const response = await database.createRow<Message>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.messagesTableId,
        rowId: ID.unique(),
        data: {
          sender: senderId,
          receiver: receiverId,
          content,
          reactions: [],
        },
      });
      return response;
    },

    async updateMessage({
      messageId,
      content,
      reactions,
    }: {
      messageId: string;
      content?: string;
      reactions?: string[];
    }) {
      const data: Partial<Pick<Message, "content" | "reactions">> = {};
      if (content !== undefined) data.content = content;
      if (reactions !== undefined) data.reactions = reactions;

      const response = await database.updateRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.messagesTableId,
        rowId: messageId,
        data,
      });
      return response;
    },

    async deleteMessage(messageId: string) {
      const response = await database.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.messagesTableId,
        rowId: messageId,
      });
      return response;
    },

    async getContacts(modifiers: {
      userId: string;
      cursorAfter?: string;
      limit?: number;
    }) {
      const response = await database.listRows<MessageData>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.messagesTableId,
        queries: querySelector.messages.getContactsQueries(modifiers),
      });
      return response;
    },
  },
};
