import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Edit, Ellipsis, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDeletePost } from "@/hooks/mutations/use-posts";
import { useAuthStore } from "@/store/use-auth-store";
import type { Post } from "@/types/schema";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const PostActions = ({
  post,
  showViewButton = true,
}: {
  post: Pick<Post, "$id" | "creator" | "imageId">;
  showViewButton?: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);

  const deletePost = useDeletePost();
  const handleDelete = () => {
    deletePost.mutate(
      { postId: post.$id, imageId: post.imageId },
      {
        onSuccess: () => {
          toast.success("Post deleted successfully");
          if (location.pathname.startsWith("/posts")) {
            navigate({ to: "/community" });
          }
        },
        onError: () => {
          toast.error("Failed to delete post");
        },
      },
    );
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Ellipsis />
      </PopoverTrigger>
      <PopoverContent side="left" className="w-fit">
        <div className="flex flex-row-reverse gap-2">
          {showViewButton && (
            <Button
              nativeButton={false}
              size="icon-lg"
              disabled={deletePost.isPending}
              render={(props) => (
                <Link
                  to="/posts/$postId"
                  params={{ postId: post.$id }}
                  {...props}
                >
                  <Eye strokeWidth={1.5} />
                  <span className="sr-only">View Post</span>
                </Link>
              )}
            />
          )}
          {currentUser.$id === post.creator && (
            <>
              <Button
                nativeButton={false}
                size="icon-lg"
                disabled={deletePost.isPending}
                render={(props) => (
                  <Link
                    to="/edit-post/$postId"
                    params={{ postId: post.$id }}
                    {...props}
                  >
                    <Edit strokeWidth={1.5} />
                    <span className="sr-only">Edit Post</span>
                  </Link>
                )}
              />
              <Button
                variant="destructive"
                size="icon-lg"
                onClick={handleDelete}
                disabled={deletePost.isPending}
              >
                <Trash2 strokeWidth={1.5} />
                <span className="sr-only">Delete Post</span>
              </Button>
            </>
          )}
          {/* {user._id !== post.creator._id && (
            // TODO: report media page
            // <ReportMedia
            //   media="Post"
            //   mediaId={post._id}
            //   currentUser={user}
            //   userId={post.creator._id}
            //   closeCallback={() => setOpen(false)}
            // />
          )} */}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PostActions;
