import { useState } from "react";
import EmojiPicker, {
  type EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { Laugh } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function EmojiPickerPopover({
  onSelectEmoji,
  className,
}: {
  onSelectEmoji: (emojiData: EmojiClickData) => void;
  className?: string;
}) {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (onSelectEmoji) {
      onSelectEmoji(emojiData);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="p-0">
        <Laugh className={cn(className)} />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={36}
        align="start"
        alignOffset={-40}
        className="m-0 py-0 px-0 bg-transparent border-0"
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={true}
          lazyLoadEmojis
          emojiStyle={EmojiStyle.NATIVE}
          theme={Theme.AUTO}
        />
      </PopoverContent>
    </Popover>
  );
}

export function ReactionSelector({
  onSelectEmoji,
  className,
}: {
  onSelectEmoji: (emojiData: EmojiClickData) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const emojis = ["1f600", "1f601", "1f602"];

  const handleReactionClick = (emojiData: EmojiClickData) => {
    if (onSelectEmoji) {
      onSelectEmoji(emojiData);
    }
    setOpen(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (onSelectEmoji) {
      onSelectEmoji(emojiData);
    }
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="hidden group-hover:flex">
        <Laugh className={cn(className)} />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={36}
        align="start"
        alignOffset={-40}
        className="m-0 py-0 px-0 bg-transparent border-0"
      >
        <EmojiPicker
          onReactionClick={handleReactionClick}
          onEmojiClick={handleEmojiClick}
          open={open}
          lazyLoadEmojis
          emojiStyle={EmojiStyle.NATIVE}
          theme={Theme.AUTO}
          reactionsDefaultOpen={true}
          reactions={emojis}
        />
      </PopoverContent>
    </Popover>
  );
}
