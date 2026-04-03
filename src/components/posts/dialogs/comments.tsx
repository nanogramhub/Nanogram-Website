import { useGetComments } from "@/hooks/queries/use-comments";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import UserAvatar from "@/components/shared/profile/user-avatar";
import { formatRelativeTime } from "@/lib/utils";
import CommentLike from "@/components/posts/comments/like";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";

interface CommentsProps {
  postId: string;
  trigger: React.ReactNode;
}

function CommentsList({ postId }: { postId: string }) {
  const getCommentsResult = useGetComments({ postId, enabled: true });
  const { items, ref, isFetchingNextPage } =
    usePersistentInfiniteQuery(getCommentsResult);

  if (items.length === 0 && !isFetchingNextPage) {
    return (
      <p className="text-center text-sm text-muted-foreground py-8">
        No comments yet. Be the first!
      </p>
    );
  }

  return (
    <ScrollArea className="h-[60vh] w-full pr-3">
      <div className="flex flex-col gap-4 py-2">
        {items.map((comment) => (
          <div key={comment.$id} className="flex gap-3 items-start">
            <UserAvatar
              name={comment.commentor.name}
              imageUrl={comment.commentor.imageUrl}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold truncate">
                  {comment.commentor.name}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatRelativeTime(comment.$createdAt)}
                </span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed mt-0.5 whitespace-pre-wrap wrap-break-word">
                {comment.content}
              </p>
            </div>
            <CommentLike comment={comment} />
          </div>
        ))}

        {/* Infinite scroll sentinel */}
        <div ref={ref} className="flex justify-center py-2">
          {isFetchingNextPage && <Spinner />}
        </div>
      </div>
    </ScrollArea>
  );
}

const Comments = ({ postId, trigger }: CommentsProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Comments</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <CommentsList postId={postId} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)}>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <CommentsList postId={postId} />
      </DialogContent>
    </Dialog>
  );
};

export default Comments;
