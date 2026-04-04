import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { EmojiPickerPopover } from "@/components/shared/default/emoji-picker";
import { Button } from "@/components/ui/button";
import { SendHorizonal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmojiClickData } from "emoji-picker-react";
import { Textarea } from "../ui/textarea";

interface MessageInputProps {
  /** Send a new message */
  onSend: (content: string) => void;
  /** Update an existing message (edit mode) */
  onUpdate: (messageId: string, content: string) => void;
  /** Cancel editing */
  onCancelEdit: () => void;
  /** Whether we're currently in edit mode */
  isEditing: boolean;
  /** The message ID being edited */
  editingMessageId: string | null;
  /** The initial content when editing */
  editingContent: string;
  /** Whether the send/update mutation is pending */
  isPending: boolean;
}

/**
 * Message input area with:
 * - Auto-resizing textarea
 * - Emoji picker integration
 * - Edit mode with "Editing" banner and cancel button
 * - Enter to send (Shift+Enter for newline)
 */
export const MessageInput = ({
  onSend,
  onUpdate,
  onCancelEdit,
  isEditing,
  editingMessageId,
  editingContent,
  isPending,
}: MessageInputProps) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // When entering edit mode, populate the textarea with existing content
  useEffect(() => {
    if (isEditing && editingContent) {
      setContent(editingContent);
      // Focus and move cursor to end
      setTimeout(() => {
        textareaRef.current?.focus();
        if (textareaRef.current) {
          textareaRef.current.selectionStart = editingContent.length;
          textareaRef.current.selectionEnd = editingContent.length;
        }
      }, 50);
    }
  }, [isEditing, editingContent]);

  /** Handle emoji selection — insert emoji at cursor position */
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + emojiData.emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      content.substring(0, start) + emojiData.emoji + content.substring(end);
    setContent(newContent);

    // Restore cursor position after emoji
    setTimeout(() => {
      textarea.selectionStart = start + emojiData.emoji.length;
      textarea.selectionEnd = start + emojiData.emoji.length;
      textarea.focus();
    }, 10);
  };

  /** Submit handler — send or update based on mode */
  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    if (isEditing && editingMessageId) {
      onUpdate(editingMessageId, trimmed);
    } else {
      onSend(trimmed);
    }

    setContent("");
  };

  /** Keyboard handler — Enter to send, Shift+Enter for newline */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Escape to cancel editing
    if (e.key === "Escape" && isEditing) {
      onCancelEdit();
      setContent("");
    }
  };

  return (
    <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-3">
      {/* Edit mode banner */}
      {isEditing && (
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-primary/10 rounded-lg border border-primary/20">
          <span className="text-xs font-medium text-primary">
            Editing message
          </span>
          <button
            onClick={() => {
              onCancelEdit();
              setContent("");
            }}
            className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
          >
            <X className="size-3.5 text-primary" />
          </button>
        </div>
      )}

      {/* Input row: emoji picker + textarea + send button */}
      <div className="flex items-end gap-2">
        {/* Emoji picker */}
        <EmojiPickerPopover
          onSelectEmoji={handleEmojiSelect}
          className="size-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 mb-2"
        />

        {/* Auto-resizing textarea */}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-2xl border border-border/50 bg-secondary/20",
            "px-4 py-2.5 text-sm leading-relaxed outline-none",
            "placeholder:text-muted-foreground/60",
            "focus:border-primary/30 focus:ring-1 focus:ring-primary/20",
            "transition-all duration-200",
            "max-h-32 overflow-y-auto",
            "field-sizing-content min-h-0",
          )}
        />

        {/* Send / Update button */}
        <Button
          variant="default"
          size="icon"
          onClick={handleSubmit}
          disabled={!content.trim() || isPending}
          className={cn(
            "shrink-0 rounded-full size-9 mb-0.5",
            "bg-primary text-primary-foreground",
            "hover:opacity-90 transition-opacity",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          <SendHorizonal className="size-4" />
        </Button>
      </div>

      {/* Hint text */}
      <p className="text-[10px] text-muted-foreground/50 mt-1 ml-10">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};
