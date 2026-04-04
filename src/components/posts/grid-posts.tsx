import type { PostCardData, PostCardMinimal } from "@/types/api";
import { Link } from "@tanstack/react-router";
import PostStats from "./post-stats";
import UserAvatar from "../shared/profile/user-avatar";
import type { Post } from "@/types/schema";

interface GridPostsFullProps {
  posts: PostCardData[];
  displayOptions: {
    showUser?: true;
    showStats?: boolean;
  };
}
interface GridPostsMinimalProps {
  posts: PostCardMinimal[];
  displayOptions: {
    showUser?: true;
    showStats?: false;
  };
}

interface GridPostsLiteProps {
  posts: Post[];
  displayOptions: {
    showUser?: false;
    showStats?: false;
  };
}

type GridPostsProps =
  | GridPostsFullProps
  | GridPostsMinimalProps
  | GridPostsLiteProps;

function checkHasCreator(
  post: Post | PostCardData | PostCardMinimal,
): post is PostCardData | PostCardMinimal {
  return typeof post.creator === "object" && post.creator !== null;
}

function checkHasStats(
  post: Post | PostCardData | PostCardMinimal,
): post is PostCardData {
  return "likes" in post && "save" in post;
}

const GridPosts = (props: GridPostsProps) => {
  const { posts, displayOptions } = props;
  const showUser = displayOptions.showUser ?? true;
  const showStats = displayOptions.showStats ?? true;

  if (!posts || posts.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-muted-foreground py-5">
        No posts found.
      </div>
    );
  }

  return (
    <ul className="flex flex-wrap gap-4 justify-center py-5">
      {posts.map((post) => {
        // Safe access checks for narrower types
        const hasCreator = checkHasCreator(post);
        const hasStats = checkHasStats(post);

        return (
          <li
            key={post.$id}
            className="relative w-72 aspect-square shadow-lg rounded-lg"
          >
            <div className="w-full h-full rounded-lg overflow-hidden">
              <Link
                to="/posts/$postId"
                params={{ postId: post.$id }}
                title={post.caption.substring(0, 100) + "..."}
              >
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </Link>

              {(showUser || showStats) && (
                <div className="w-full bg-linear-to-t from-muted absolute bottom-0 flex rounded-b-md">
                  {showUser && hasCreator && (
                    <div className="flex items-center gap-2 px-2 py-2">
                      <UserAvatar
                        name={post.creator.name}
                        imageUrl={post.creator.imageUrl}
                      />
                      <p className="text-bold">{post.creator.name}</p>
                    </div>
                  )}
                  {showStats && hasStats && (
                    <div className="w-full flex items-center">
                      <PostStats
                        post={post}
                        displayOptions={{
                          showComments: false,
                          showShare: false,
                          align: "end",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPosts;
