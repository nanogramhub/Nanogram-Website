import type { AppwriteDocument, Comment, Message, Post, User } from "../schema";

export type CurrentUser = User & {
  following: (AppwriteDocument & { followed: User["$id"] })[];
};

export type PostsFilter = "recent" | "oldest" | "trending";

// User
type PostCreator = AppwriteDocument &
  Pick<User, "username" | "name" | "imageUrl" | "bio" | "karma">;

type PostCreatorMinimal = AppwriteDocument & Pick<User, "name" | "imageUrl">;

type Like = AppwriteDocument & Pick<User, "$id">; // Like :: User

type Save = AppwriteDocument & { user: User["$id"] }; // post -> Save <- user

export type PostCardData = Omit<Post, "creator"> & {
  likes: Like[];
  save: Save[];
  creator: PostCreator;
};

type CommentCreator = AppwriteDocument &
  Pick<User, "username" | "name" | "imageUrl">;

export type PostCardMinimal = Omit<Post, "creator"> & {
  creator: PostCreatorMinimal;
};

export type SavedPostData = AppwriteDocument & {
  post: PostCardData;
};

type UserFollower = AppwriteDocument & Pick<User, "$id">;

type UserPostsCount = AppwriteDocument & Pick<Post, "$id">;

export type UserProfileData = User & {
  followers: UserFollower[];
  following: UserFollower[];
  posts: UserPostsCount[];
};

export type Followers = AppwriteDocument & {
  follower: AppwriteDocument &
    Pick<User, "$id" | "username" | "name" | "imageUrl">;
};
export type Following = AppwriteDocument & {
  followed: AppwriteDocument &
    Pick<User, "$id" | "username" | "name" | "imageUrl">;
};

export type CommentData = Omit<Comment, "commentor"> & {
  commentor: CommentCreator;
  likes: Like[];
};

// ==================
// Message Types
// ==================

/** A message document with expanded sender/receiver user relationships */
export type MessageData = Omit<Message, "sender" | "receiver"> & {
  sender: AppwriteDocument & Pick<User, "name" | "imageUrl" | "username">;
  receiver: AppwriteDocument & Pick<User, "name" | "imageUrl" | "username">;
};

/** Lightweight user info used in the contacts sidebar */
export type ContactUser = AppwriteDocument &
  Pick<User, "name" | "imageUrl" | "username">;
