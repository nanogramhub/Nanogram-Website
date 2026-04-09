import { debounce } from "@tanstack/react-pacer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import type { RealtimeSubscription } from "appwrite";
import { MessageCircleMore, SquarePen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import SearchInput from "@/components/shared/default/search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetContacts } from "@/hooks/queries/use-messages";
import { getContactsRealtime } from "@/lib/appwrite/realtime";
import { usersQueries } from "@/lib/query/query-options";
import { cn,getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import type { ContactUser } from "@/types/api";

/**
 * Contacts sidebar for the messages page.
 * Features:
 * - Derives contacts from message history (de-duplicates sender/receiver)
 * - Realtime updates when new messages arrive
 * - "New conversation" dialog with user search
 * - Active contact highlighting
 */
export const ContactsSidebar = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const activeUserId = (params as { userId?: string }).userId;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [contactFilter, setContactFilter] = useState<string>("");
  const [realtimeContacts, setRealtimeContacts] = useState<ContactUser[]>([]);

  const debouncedSearch = debounce((query: string) => setSearchValue(query), {
    wait: 400,
  });

  const debouncedFilter = debounce((query: string) => setContactFilter(query), {
    wait: 300,
  });

  // Fetch messages to derive contacts
  const contactsQuery = useGetContacts({
    userId: currentUser?.$id ?? "",
    enabled: !!currentUser?.$id,
  });

  // Search users for the "new conversation" dialog
  // Only search when there's a value and dialog is open
  const searchQuery = useInfiniteQuery(
    usersQueries.getUsers({
      searchTerm: searchValue,
      enabled: !!searchValue && isDialogOpen,
    }),
  );

  /**
   * Derive unique contacts from message data.
   * For each message, the "other" user (not current) becomes a contact.
   * De-duplicated by $id, maintaining most-recent-first order.
   */
  const derivedContacts = useMemo(() => {
    if (!contactsQuery.data?.pages || !currentUser) return [];

    const contactMap = new Map<string, ContactUser>();

    // Process all pages of messages
    for (const page of contactsQuery.data.pages) {
      for (const message of page.rows) {
        const otherUser =
          message.sender.$id === currentUser.$id
            ? message.receiver
            : message.sender;

        // Keep first occurrence (most recent due to desc ordering)
        if (!contactMap.has(otherUser.$id)) {
          contactMap.set(otherUser.$id, otherUser);
        }
      }
    }

    return Array.from(contactMap.values());
  }, [contactsQuery.data, currentUser]);

  /**
   * Merge realtime contacts with derived contacts and apply filtering.
   * Realtime contacts are newer and should appear first.
   */
  const contacts = useMemo(() => {
    const merged = new Map<string, ContactUser>();

    // Realtime contacts first (newest)
    for (const contact of realtimeContacts) {
      merged.set(contact.$id, contact);
    }

    // Then derived contacts (from query)
    for (const contact of derivedContacts) {
      if (!merged.has(contact.$id)) {
        merged.set(contact.$id, contact);
      }
    }

    const allContacts = Array.from(merged.values());

    if (!contactFilter) return allContacts;

    const query = contactFilter.toLowerCase();
    return allContacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.username.toLowerCase().includes(query),
    );
  }, [realtimeContacts, derivedContacts, contactFilter]);

  // Subscribe to realtime contact updates
  useEffect(() => {
    if (!currentUser?.$id) return;

    let cancelled = false;
    let subscription: RealtimeSubscription | null = null;

    getContactsRealtime(currentUser.$id, (contact) => {
      setRealtimeContacts((prev) => {
        // Move to front if already exists, or add as new
        const filtered = prev.filter((c) => c.$id !== contact.$id);
        return [contact, ...filtered];
      });
    }).then((sub) => {
      if (cancelled) {
        sub.close();
      } else {
        subscription = sub;
      }
    });

    return () => {
      cancelled = true;
      if (subscription) subscription.close();
    };
  }, [currentUser?.$id]);

  return (
    <div className="flex flex-col h-full border-r border-border/50">
      {/* Header */}
      <div className="flex flex-col border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageCircleMore className="size-5 text-primary" />
            <h2 className="text-lg font-bold hidden lg:block">Messages</h2>
          </div>

          {/* New conversation button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              render={(props) => (
                <Button {...props} variant="ghost" size="icon">
                  <SquarePen className="size-5" />
                </Button>
              )}
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription>
                  Search for a user to start a conversation
                </DialogDescription>
              </DialogHeader>

              {/* User search input */}
              <div className="space-y-4">
                <SearchInput
                  setSearchQuery={debouncedSearch}
                  className="max-w-full"
                />

                {/* Search results */}
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {searchQuery.isLoading && (
                    <div className="space-y-2 p-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="size-9 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-2.5 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchQuery.data?.pages?.flatMap((page) =>
                    page.rows
                      .filter((user) => user.$id !== currentUser?.$id)
                      .map((user) => (
                        <button
                          key={user.$id}
                          onClick={() => {
                            navigate({
                              to: "/messages/$userId",
                              params: { userId: user.$id },
                            });
                            setIsDialogOpen(false);
                            setSearchValue(undefined);
                          }}
                          className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary/60 transition-colors text-left"
                        >
                          <Avatar>
                            <AvatarImage
                              src={user.imageUrl || "/assets/icons/user.svg"}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium truncate">
                              {user.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              @{user.username}
                            </span>
                          </div>
                        </button>
                      )),
                  )}

                  {searchValue &&
                    !searchQuery.isLoading &&
                    searchQuery.data?.pages?.[0]?.rows.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        No users found
                      </p>
                    )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Local contact filter */}
        <div className="px-4 pb-3 hidden lg:block">
          <SearchInput
            setSearchQuery={debouncedFilter}
            className="w-full max-w-full h-9"
          />
        </div>
      </div>

      {/* Contacts list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {contactsQuery.isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl"
              >
                <Skeleton className="size-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5 hidden lg:block">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          ) : contacts.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageCircleMore className="size-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                {contactFilter ? "No contacts found" : "No conversations yet"}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {contactFilter
                  ? "Try a different search term"
                  : "Start a new conversation"}
              </p>
            </div>
          ) : (
            // Contact items
            contacts.map((contact) => (
              <Link
                key={contact.$id}
                to="/messages/$userId"
                params={{ userId: contact.$id }}
                onClick={() => setIsDialogOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-xl transition-all duration-150",
                  "hover:bg-secondary/60",
                  activeUserId === contact.$id &&
                    "bg-primary/10 hover:bg-primary/15 border border-primary/20",
                )}
              >
                <Avatar>
                  <AvatarImage
                    src={contact.imageUrl || "/assets/icons/user.svg"}
                    alt={contact.name}
                  />
                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col min-w-0">
                  <span
                    className={cn(
                      "text-sm font-medium truncate",
                      activeUserId === contact.$id && "text-primary",
                    )}
                  >
                    {contact.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    @{contact.username}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
