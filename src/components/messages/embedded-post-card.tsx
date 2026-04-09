import { Link } from "@tanstack/react-router";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostById } from "@/hooks/queries/use-posts";

interface EmbeddedPostCardProps {
  postId: string;
}

/**
 * Mini post card rendered inside chat bubbles when a message
 * contains a nanogram://<postId> link. Shows post image thumbnail,
 * caption snippet, and creator info. Clickable to navigate to full post.
 */
export const EmbeddedPostCard = ({ postId }: EmbeddedPostCardProps) => {
  const { data: post, isLoading, isError } = useGetPostById(postId);

  if (isLoading) {
    return (
      <div className="w-56 rounded-xl overflow-hidden border border-border/30 bg-background/50">
        <Skeleton className="w-full aspect-video" />
        <div className="p-2 space-y-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="w-56 rounded-xl border border-border/30 bg-background/50 p-3 text-xs text-muted-foreground">
        Post not found or unavailable
      </div>
    );
  }

  return (
    <Link
      to="/posts/$postId"
      params={{ postId: post.$id }}
      className="block w-56 rounded-xl overflow-hidden border border-border/30 bg-background/80 backdrop-blur-sm hover:border-border/60 transition-all duration-200 hover:shadow-md group"
    >
      {/* Post image thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={post.imageUrl || "/assets/images/placeholder.png"}
          alt={post.caption?.slice(0, 30) || "Post"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Post info */}
      <div className="p-2.5 space-y-1">
        {/* Creator info */}
        <div className="flex items-center gap-1.5">
          <img
            src={post.creator.imageUrl || "/assets/icons/user.svg"}
            alt={post.creator.name}
            className="size-4 rounded-full object-cover"
          />
          <span className="text-[11px] font-medium text-foreground/80 truncate">
            {post.creator.name}
          </span>
        </div>

        {/* Caption snippet */}
        {post.caption && (
          <p className="text-[11px] text-foreground/60 line-clamp-2 leading-relaxed">
            {post.caption}
          </p>
        )}
      </div>
    </Link>
  );
};
