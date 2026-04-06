import { createFileRoute } from "@tanstack/react-router";
import { MessageCircleMore } from "lucide-react";

import { ContactsSidebar } from "@/components/messages/contacts-sidebar";

export const Route = createFileRoute("/_privateLayout/messages/")({
  component: MessagesLayout,
});

/**
 * Messages landing page with split layout:
 * - Left: Contacts sidebar (always visible)
 * - Right: Active chat (Outlet) or welcome placeholder
 *
 * On mobile, only the contacts list is shown until a chat is selected.
 */
function MessagesLayout() {
  return (
    <div className="flex h-[calc(100dvh-3.5rem)] overflow-hidden">
      {/* Contacts sidebar — fixed width on desktop, hidden on mobile when chat is active */}
      <div className="w-full md:w-20 lg:w-80 shrink-0 h-full">
        <ContactsSidebar />
      </div>

      {/* Welcome placeholder — shown when no chat is selected */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-secondary/5">
        <div className="flex flex-col items-center gap-4 text-center p-8">
          {/* Brand-consistent icon */}
          <div className="size-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <MessageCircleMore className="size-10 text-primary-foreground" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold">Your Messages</h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Send private messages to your friends. Select a conversation or
              start a new one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
