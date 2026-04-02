import type { AppwriteDocument, Comment, Post, User } from "../schema";

export type PostsFilter = "recent" | "oldest" | "trending";



// User
type PostCreator = AppwriteDocument &
  Pick<User, "username" | "name" | "imageUrl" | "bio" | "karma">;

type Like = AppwriteDocument & Pick<User, "$id">; // Like :: User

type Save = AppwriteDocument & { user: User["$id"] }; // post -> Save <- user

export type PostCardData = Omit<Post, "creator"> & {
  likes: Like[];
  save: Save[];
  creator: PostCreator;
};

type CommentCreator = AppwriteDocument &
  Pick<User, "username" | "name" | "imageUrl">;

export type PostDetailsData = PostCardData & {
  comments: Omit<Comment, "commentor"> & { commentor: CommentCreator }[];
};
