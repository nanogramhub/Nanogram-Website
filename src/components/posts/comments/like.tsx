import type { CommentData } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Like, Liked } from "@/components/icons";

interface CommentLikeProps {
  comment: Pick<CommentData, "$id" | "likes">;
}

const CommentLike = ({ comment: _comment }: CommentLikeProps) => {
  // TODO: implement like/unlike logic
  const liked = false;

  return (
    <Button variant="ghost" size="icon-sm" className="p-0 h-auto w-auto">
      {liked ? (
        <Liked className="size-4 text-primary" />
      ) : (
        <Like className="size-4" />
      )}
    </Button>
  );
};

export default CommentLike;
