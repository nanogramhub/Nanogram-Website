import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPickerPopover } from "@/components/shared/default/emoji-picker";
import { useCreateComment } from "@/hooks/mutations/use-comments";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";

interface CommentTextareaProps {
  postId: string;
}

export function CommentTextarea({ postId }: CommentTextareaProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [content, setContent] = useState("");
  const { mutateAsync: createComment, isPending } = useCreateComment();

  const handleSend = async () => {
    if (!content.trim() || isPending || !currentUser) return;

    try {
      await createComment({ content, postId, userId: currentUser.$id });
      setContent("");
    } catch (error) {
      toast.error("Failed to post comment");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex items-center border rounded-2xl bg-muted/20 focus-within:bg-muted/40 transition-all">
      <div className="flex items-center justify-center size-10 rounded-full hover:bg-muted/60 transition-colors">
        <EmojiPickerPopover
          onSelectEmoji={(emojiData) =>
            setContent((prev) => prev + emojiData.emoji)
          }
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        />
      </div>
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-10 py-2 px-3 resize-none border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
        )}
      />
      <Button
        size="icon"
        variant="ghost"
        disabled={!content.trim() || isPending}
        onClick={handleSend}
        className="mb-1 shrink-0 hover:bg-transparent"
      >
        <SendHorizontal
          className={cn(
            "size-5 transition-colors",
            content.trim() ? "text-primary" : "text-muted-foreground",
          )}
        />
      </Button>
    </div>
  );
}
