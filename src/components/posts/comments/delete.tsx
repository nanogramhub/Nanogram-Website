import { Button } from "@/components/ui/button";
import { useDeleteComment } from "@/hooks/mutations/use-comments";
import { useAuthStore } from "@/store/use-auth-store";
import type { CommentData } from "@/types/api";
import { toast } from "sonner";

export const DeleteComment = ({ comment }: { comment: CommentData }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const deleteComment = useDeleteComment();

  const handleDelete = () => {
    if (!currentUser) return;
    deleteComment.mutate(
      { commentId: comment.$id },
      {
        onError: () => {
          toast.error("Failed to delete comment");
        },
      },
    );
  };

  if (!currentUser) return null;
  if (currentUser.$id !== comment.commentor.$id) return null;
  return (
    <Button
      variant="ghost"
      size="xs"
      className="p-0 h-auto w-auto text-destructive/70 hover:text-destructive"
      onClick={handleDelete}
    >
      delete
    </Button>
  );
};
