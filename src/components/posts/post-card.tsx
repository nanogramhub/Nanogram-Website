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
import { useState } from "react";

interface PostCardProps {
  post: PostCardData;
}

const CAPTION_LIMIT = 120;
const TAGS_LIMIT = 3;

export const PostCard = ({ post }: PostCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedTags, setExpandedTags] = useState(false);

  const isLong = post.caption.length > CAPTION_LIMIT;
  const displayedCaption =
    isLong && !expanded
      ? post.caption.slice(0, CAPTION_LIMIT).trimEnd()
      : post.caption;

  const hasManyTags = post.tags.length > TAGS_LIMIT;
  const displayedTags =
    hasManyTags && !expandedTags ? post.tags.slice(0, TAGS_LIMIT) : post.tags;

  return (
    <Card className="md:w-136 w-full shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between shrink-0">
          <PostCreator creator={post.creator} />
          <PostActions
            post={{
              $id: post.$id,
              creator: post.creator.$id,
              imageId: post.imageId,
            }}
            showViewButton={true}
          />
        </div>
        <p className="text-xs text-muted-foreground/80 font-medium tracking-tight">
          Posted on Nanogram • {formatRelativeTime(post.$createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word">
          {linkifyReact(displayedCaption!, {
            className:
              "text-blue-500 hover:text-blue-600 transition-colors cursor-pointer font-medium",
          })}
          {isLong && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-muted-foreground hover:text-foreground font-medium transition-colors ml-0.5 cursor-pointer"
            >
              ...more
            </button>
          )}
          {isLong && expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="block text-xs text-muted-foreground hover:text-foreground font-medium transition-colors mt-1 cursor-pointer"
            >
              show less
            </button>
          )}
        </div>
        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1 mt-1 text-xs items-center">
            {displayedTags.map((tag) => (
              <li key={tag} className="text-primary font-light">
                #{tag}
              </li>
            ))}
            {hasManyTags && !expandedTags && (
              <li>
                <button
                  onClick={() => setExpandedTags(true)}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
                >
                  +{post.tags.length - TAGS_LIMIT} more
                </button>
              </li>
            )}
            {hasManyTags && expandedTags && (
              <li>
                <button
                  onClick={() => setExpandedTags(false)}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
                >
                  show less
                </button>
              </li>
            )}
          </ul>
        )}
      </CardContent>
      <Link to="/posts/$postId" params={{ postId: post.$id }}>
        <figure>
          <img
            src={post.imageUrl || "/assets/images/placeholder.png"}
            alt={post.$id}
            className="w-full object-cover"
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
