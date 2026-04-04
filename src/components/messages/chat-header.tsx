import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ContactUser } from "@/types/api";

interface ChatHeaderProps {
  /** The other user in the conversation */
  user: ContactUser;
}

/**
 * Chat header showing the other user's avatar, name, username,
 * and a link to their profile. Includes back button for mobile.
 */
export const ChatHeader = ({ user }: ChatHeaderProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      {/* Back button — visible on mobile */}
      <Link
        to="/messages"
        className="md:hidden p-1 rounded-full hover:bg-secondary transition-colors"
      >
        <ArrowLeft className="size-5" />
      </Link>

      {/* User avatar — links to profile */}
      <Link
        to="/u/$userId"
        params={{ userId: user.username }}
        className="flex items-center gap-3 group"
      >
        <Avatar size="lg">
          <AvatarImage
            src={user.imageUrl || "/assets/icons/user.svg"}
            alt={user.name}
          />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="text-sm font-semibold group-hover:text-primary transition-colors">
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground">
            @{user.username}
          </span>
        </div>
      </Link>
    </div>
  );
};
