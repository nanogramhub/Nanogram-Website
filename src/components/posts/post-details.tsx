import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime } from "@/lib/utils";
import type { PostCardData } from "@/types/api";

import { linkifyReact } from "../shared/default/linkify-text";
import { Card, CardContent } from "../ui/card";
import PostActions from "./post-actions";
import PostCreator from "./post-creator";
import PostStats from "./post-stats";

const PostDetails = ({ post }: { post: PostCardData }) => {
  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-xl flex flex-col lg:relative overflow-hidden bg-background min-h-[400px] py-0">
      <div className="relative w-full lg:w-1/2 aspect-square bg-muted flex items-center justify-center overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.imageId || "post"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="w-full lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 flex flex-col lg:border-l border-border/50">
        <div className="p-4 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm z-10 shrink-0">
          <PostCreator creator={post.creator} />
          <PostActions
            post={{
              $id: post.$id,
              creator: post.creator.$id,
              imageId: post.imageId,
            }}
            showViewButton={false}
          />
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <CardContent className="p-4 md:p-6 flex flex-col gap-4">
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground/80 font-medium tracking-tight">
                Posted on Nanogram • {formatRelativeTime(post.$createdAt)}
              </p>

              <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word">
                {linkifyReact(post.caption, {
                  className:
                    "text-blue-500 hover:text-blue-600 transition-colors cursor-pointer font-medium",
                })}
              </div>

              {post.tags && post.tags.length > 0 && (
                <ul className="flex flex-wrap gap-x-2 gap-y-1">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-sm text-blue-500 hover:underline cursor-pointer transition-all active:scale-95"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </ScrollArea>

        <div className="shrink-0 border-t border-border/50 bg-background">
          <PostStats post={post} displayOptions={{ align: "between" }} />
        </div>
      </div>
    </Card>
  );
};

export default PostDetails;
