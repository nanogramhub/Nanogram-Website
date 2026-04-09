import { Heart } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useUpdateCommentLikes } from "@/hooks/mutations/use-comments";
import { useAuthStore } from "@/store/use-auth-store";
import type { CommentData } from "@/types/api";
import type { User } from "@/types/schema";

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
  const baseLiked = useMemo(
    () => (currentUser ? hasLiked(comment.likes, currentUser) : false),
    [comment.likes, currentUser],
  );
  const [liked, setLiked] = useState<boolean>(baseLiked);
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
          <Heart className="size-4 text-red-500 fill-red-500" />
        ) : (
          <Heart className="size-4" />
        )}
      </Button>
      <span>{likedCount}</span>
    </div>
  );
};

export default CommentLike;
