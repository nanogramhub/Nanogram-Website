import { Edit, Ellipsis, Eye, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import type { Post } from "@/types/schema";

const PostActions = ({
  post,
  showViewButton = true,
}: {
  post: Pick<Post, "$id" | "creator">;
  showViewButton?: boolean;
}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  if (!currentUser) {
    return null;
  }
  // TOOD: Replace with mutation
  //   const deleteThisPost = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await deletePostById(post._id.toString());
  //       if (!res) {
  //         throw new Error("Failed to delete post");
  //       }
  //       toast("Post deleted successfully", {
  //         description:
  //           "Your post has been removed.\nChanges may take a moment to reflect.",
  //       });
  //     } catch (error) {
  //       console.error("Failed to delete post:", error);
  //       toast("Failed to delete post", {
  //         description: "Please try again later.",
  //       });
  //     } finally {
  //       setLoading(false);
  //       setOpen(false);
  //       router.push("/community");
  //       router.refresh();
  //     }
  //   };
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
                render={(props) => (
                  <Link
                    to="/community"
                    // to="/update-post/$postId"
                    // params={{ postId: post._id.toString() }}
                    {...props}
                  >
                    <Edit strokeWidth={1.5} />
                    <span className="sr-only">Edit Post</span>
                  </Link>
                )}
              />
              <Button variant="destructive" size="icon-lg">
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
