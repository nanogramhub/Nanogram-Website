import type { PostCardData } from "@/types/api";
import { Link } from "@tanstack/react-router";
import PostStats from "./post-stats";
import UserAvatar from "../shared/profile/user-avatar";

interface GridPostsProps {
  posts: PostCardData[];
  displayOptions: {
    showUser?: boolean;
    showStats?: boolean;
  };
}

const GridPosts = ({
  posts,
  displayOptions: { showUser = true, showStats = true },
}: GridPostsProps) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-muted-foreground py-5">
        No posts found.
      </div>
    );
  }
  return (
    <ul className="flex flex-wrap gap-4 justify-center py-5">
      {posts.map((post) => (
        <li
          key={post.$id}
          className="relative w-72 aspect-square shadow-lg rounded-lg"
        >
          <div className="w-full h-full rounded-lg overflow-hidden">
            <Link
              to="/posts/$postId"
              params={{ postId: post.$id }}
              title={
                post.caption
                  ? post.caption.substring(0, 100) + "..."
                  : `A Post by ${post.creator.name}`
              }
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
                {showUser && (
                  <div className="flex items-center gap-2 px-2 py-2">
                    <UserAvatar
                      name={post.creator.name}
                      imageUrl={post.creator.imageUrl}
                    />
                    <p className="text-bold">{post.creator.name}</p>
                  </div>
                )}
                {showStats && (
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
      ))}
    </ul>
  );
};

export default GridPosts;
