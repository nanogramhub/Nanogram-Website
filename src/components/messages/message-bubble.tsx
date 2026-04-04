import { useState } from "react";
import { toast } from "sonner";
import { cn, formatDateTime } from "@/lib/utils";
import type { MessageData } from "@/types/api";
import { useAuthStore } from "@/store/use-auth-store";
import { useUpdateMessage, useDeleteMessage } from "@/hooks/mutations/use-messages";
import { EmbeddedPostCard, extractPostId } from "./embedded-post-card";
import { ReactionSelector } from "@/components/shared/default/emoji-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash2 } from "lucide-react";
import type { EmojiClickData } from "emoji-picker-react";

interface MessageBubbleProps {
  message: MessageData;
  /** Callback when user initiates editing this message */
  onEditStart: (messageId: string, currentContent: string) => void;
}

/**
 * Instagram-style chat bubble with:
 * - Sent messages: right-aligned with solid backgrounds
 * - Received messages: left-aligned with solid backgrounds
 * - Hover toolbar: edit (own only), delete (own only), reactions
 * - Reactions display: emoji chips below the bubble
 * - Post embed: detects nanogram://<postId> and renders inline post card
 */
export const MessageBubble = ({ message, onEditStart }: MessageBubbleProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const updateMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage();
  const [showActions, setShowActions] = useState(false);
  const [isReactionOpen, setIsReactionOpen] = useState(false);

  // Determine if this message was sent by the current user
  const isSent = currentUser?.$id === message.sender.$id;

  // Check if the message is a nanogram:// post link
  const postId = extractPostId(message.content);

  /** Toggle a reaction emoji on this message */
  const handleReaction = (emojiData: any) => {
    let emojiStr = "";
    if (typeof emojiData === "string") {
      emojiStr = emojiData;
    } else if (emojiData?.emoji) {
      emojiStr = emojiData.emoji;
    } else if (emojiData?.unified) {
      emojiStr = String.fromCodePoint(
        ...emojiData.unified.split("-").map((u: string) => parseInt(u, 16)),
      );
    }

    if (!emojiStr) return;

    const currentReactions = message.reactions || [];

    const updatedReactions = currentReactions.includes(emojiStr)
      ? currentReactions.filter((r) => r !== emojiStr)
      : [...currentReactions, emojiStr];

    updateMessage.mutate(
      {
        messageId: message.$id,
        reactions: updatedReactions,
      },
      {
        onError: (err: any) => {
          toast.error("Failed to update reaction: " + (err?.message || "Unknown error"));
        },
      }
    );
  };

  /** Delete this message after confirmation */
  const handleDelete = () => {
    deleteMessage.mutate({ messageId: message.$id });
  };

  return (
    <div
      className={cn(
        "group flex flex-col gap-1 max-w-[75%] relative",
        isSent ? "self-end items-end" : "self-start items-start",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => !isReactionOpen && setShowActions(false)}
    >
      {/* Floating action toolbar */}
      <div
        className={cn(
          "flex items-center gap-0.5 transition-all duration-200 h-6",
          showActions || isReactionOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 translate-y-1 invisible pointer-events-none",
          isSent ? "flex-row-reverse" : "flex-row",
        )}
      >
        {/* Reaction Selector with controlled state */}
        <ReactionSelector
          onSelectEmoji={handleReaction}
          open={isReactionOpen}
          onOpenChange={(open) => {
            setIsReactionOpen(open);
            if (!open) setShowActions(false);
          }}
          className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        />

        {/* Edit button — only for own messages, not for post embeds */}
        {isSent && !postId && (
          <button
            onClick={() => onEditStart(message.$id, message.content)}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            title="Edit message"
          >
            <Pencil className="size-3 text-muted-foreground hover:text-foreground" />
          </button>
        )}

        {/* Delete button — only for own messages */}
        {isSent && (
          <button
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-destructive/10 transition-colors"
            title="Delete msssage"
          >
            <Trash2 className="size-3 text-muted-foreground hover:text-destructive" />
          </button>
        )}
      </div>

      {/* Message bubble */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className={cn("block")}
            render={(props) => <div {...props} />}
          >
            <div
              className={cn(
                "px-3.5 py-2 text-sm leading-relaxed wrap-break-word transition-shadow duration-200",
                isSent
                  ? // Sent: Solid primary color
                    "bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-sm"
                  : // Received: Solid secondary color
                    "bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md shadow-sm",
                postId && "p-1.5", // Tighter padding for post embeds
              )}
            >
              {postId ? (
                // Render embedded post card
                <EmbeddedPostCard postId={postId} />
              ) : (
                // Render text content with whitespace preserved
                <span className="whitespace-pre-wrap">{message.content}</span>
              )}
            </div>
          </TooltipTrigger>

          {/* Timestamp tooltip on hover */}
          <TooltipContent side={isSent ? "left" : "right"} sideOffset={8}>
            {formatDateTime(message.$createdAt, "PPPp")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Reaction chips — displayed below the bubble */}
      {message.reactions && message.reactions.length > 0 && (
        <div
          className={cn(
            "flex gap-1 mt-0.5",
            isSent ? "justify-end" : "justify-start",
          )}
        >
          {message.reactions.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() =>
                handleReaction({ emoji } as EmojiClickData)
              }
              className="text-sm bg-secondary/50 hover:bg-secondary/80 rounded-full px-1.5 py-0.5 transition-colors cursor-pointer border border-border/20"
              title="Click to toggle reaction"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
