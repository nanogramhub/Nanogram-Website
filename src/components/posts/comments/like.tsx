import type { CommentData } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Like, Liked } from "@/components/icons";
import type { User } from "@/types/schema";
import { useEffect, useState } from "react";
import { useUpdateCommentLikes } from "@/hooks/mutations/use-comments";
import { useAuthStore } from "@/store/use-auth-store";

interface CommentLikeProps {
  comment: Pick<CommentData, "$id" | "likes">;
}

function flattenLikes(likes: CommentLikeProps["comment"]["likes"]) {
  return likes.map((like) => like.$id);
}

function hasLiked(
  likes: CommentLikeProps["comment"]["likes"],
  currentUser: User,
) {
  return flattenLikes(likes).includes(currentUser.$id);
}

const CommentLike = ({ comment }: CommentLikeProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [liked, setLiked] = useState<boolean>(false);
  const [likedCount, setLikedCount] = useState(comment.likes.length);
  const updateCommentLikes = useUpdateCommentLikes();

  const toggleLike = () => {
    if (!currentUser) return;
    // Optimistically update UI
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikedCount((c) => (nextLiked ? c + 1 : c - 1));

    const nextLikeArray = nextLiked
      ? [...flattenLikes(comment.likes), currentUser.$id]
      : flattenLikes(comment.likes).filter((id) => id !== currentUser.$id);

    updateCommentLikes.mutate(
      { likeArray: nextLikeArray, commentId: comment.$id },
      {
        onError: () => {
          // Roll back on failure
          setLiked(!nextLiked);
          setLikedCount((c) => (nextLiked ? c - 1 : c + 1));
        },
      },
    );
  };

  useEffect(() => {
    if (currentUser) {
      setLiked(hasLiked(comment.likes, currentUser));
      setLikedCount(comment.likes.length);
    }
  }, [currentUser]);

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        className="p-0 h-auto w-auto"
        onClick={toggleLike}
        disabled={updateCommentLikes.isPending}
      >
        {liked ? (
          <Liked className="size-4 text-primary" />
        ) : (
          <Like className="size-4" />
        )}
      </Button>
      <span>{likedCount}</span>
    </div>
  );
};

export default CommentLike;
