import PostCreator from "./post-creator";
import PostActions from "./post-actions";
import { formatRelativeTime } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import PostStats from "./post-stats";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { linkifyReact } from "../shared/default/linkify-text";
import { Skeleton } from "../ui/skeleton";
import { Ellipsis } from "lucide-react";
import type { PostCardData } from "@/types/api";

interface PostCardProps {
  post: PostCardData;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="md:w-136 w-full shadow-sm">
      <CardHeader>
        <div className="flex justify-between">
          <PostCreator creator={post.creator} />
          <PostActions post={{ $id: post.$id, creator: post.creator.$id }} />
        </div>
        <p className="text-xs text-muted-foreground">
          Posted on Nanogram, {formatRelativeTime(post.$createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        {post.caption && (
          <p className="text-sm">
            {linkifyReact(post.caption, {
              className:
                "text-sm text-chart-2 hover:underline hover:text-chart-1",
            })}
          </p>
        )}
        <ul className="flex flex-wrap gap-1 mt-1 text-xs">
          {post.tags.length === 0
            ? null
            : post.tags.map((tag) => (
                <li key={tag} className="text-primary font-light">
                  #{tag}
                </li>
              ))}
        </ul>
      </CardContent>
      <Link to="/posts/$postId" params={{ postId: post.$id }}>
        <figure>
          <img
            src={post.imageUrl || "/assets/images/placeholder.png"}
            alt={post.$id}
          />
        </figure>
      </Link>
      <PostStats post={post} displayOptions={{ align: "between" }} />
    </Card>
  );
};

export const PostCardSkeleton = () => {
  return (
    <Card className="md:w-136 w-full shadow-sm">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-1">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
          <Ellipsis />
        </div>
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-1/2 pt-1" />
      </CardContent>
      <Skeleton className="w-full aspect-square" />
      <CardFooter className="h-4" />
    </Card>
  );
};
