import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { RealtimeSubscription } from "appwrite";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChatHeader } from "@/components/messages/chat-header";
import { ContactsSidebar } from "@/components/messages/contacts-sidebar";
import { MessageBubble } from "@/components/messages/message-bubble";
import { MessageInput } from "@/components/messages/message-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  useSendMessage,
  useUpdateMessage,
} from "@/hooks/mutations/use-messages";
import { useGetUserById } from "@/hooks/queries/use-users";
import { messageRealtime } from "@/lib/appwrite/realtime";
import { queryKeys } from "@/lib/query/query-keys";
import { messagesQueries } from "@/lib/query/query-options";
import { useAuthStore } from "@/store/use-auth-store";
import type { MessageData } from "@/types/api";
import type { AppwriteResponse } from "@/types/schema";

export const Route = createFileRoute("/_privateLayout/messages/$userId")({
  component: ChatView,
});

/**
 * Chat view for a specific conversation.
 * Features:
 * - Infinite scroll upward for older messages
 * - Realtime message subscription for live updates
 * - Edit/delete messages with optimistic updates
 * - Emoji reactions
 * - nanogram:// post embed support
 */
function ChatView() {
  const { userId: otherUserId } = Route.useParams();
  const currentUser = useAuthStore((state) => state.currentUser);
  const queryClient = useQueryClient();
  const sendMessage = useSendMessage();
  const updateMessage = useUpdateMessage();

  // Edit mode state
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  // Ref for scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch messages between current user and other user
  const messagesQuery = useInfiniteQuery(
    messagesQueries.getMessages({
      senderId: currentUser?.$id ?? "",
      receiverId: otherUserId,
      enabled: !!currentUser?.$id && !!otherUserId,
    }),
  );

  // Fetch other user's info for the chat header
  const { data: otherUser } = useGetUserById(otherUserId);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (
      isInitialLoad &&
      messagesQuery.isSuccess &&
      messagesQuery.data?.pages?.[0]?.rows.length
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      setIsInitialLoad(false);
    }
  }, [messagesQuery.isSuccess, messagesQuery.data, isInitialLoad]);

  // Flatten messages from all pages (reversed for chronological display)
  const messages = (
    messagesQuery.data?.pages?.flatMap((page) => page.rows) ?? []
  ).reverse();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isInitialLoad && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages.length, isInitialLoad]);

  // Reset initial load flag when switching conversations
  useEffect(() => {
    setIsInitialLoad(true);
    setEditingMessageId(null);
    setEditingContent("");
  }, [otherUserId]);

  /**
   * Realtime subscription: push new messages into the query cache
   * and scroll to bottom for new messages.
   */
  useEffect(() => {
    if (!currentUser?.$id) return;

    let cancelled = false;
    let subscription: RealtimeSubscription | null = null;

    messageRealtime(currentUser.$id, ({ event, payload }) => {
      // ... logic ... (keep existing)
      const isRelevant =
        (payload.sender?.$id === currentUser.$id &&
          payload.receiver?.$id === otherUserId) ||
        (payload.sender?.$id === otherUserId &&
          payload.receiver?.$id === currentUser.$id);

      if (!isRelevant) return;

      const queryKey = [
        ...queryKeys.messages.getMessages,
        { senderId: currentUser.$id, receiverId: otherUserId },
      ];

      if (event === "create") {
        queryClient.invalidateQueries({ queryKey });

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else if (event === "update") {
        queryClient.setQueryData<InfiniteData<AppwriteResponse<MessageData>>>(
          queryKey,
          (old) => {
            if (!old) return old;

            const newPages = old.pages.map((page) => ({
              ...page,
              rows: page.rows.map((msg) =>
                msg.$id === payload.$id
                  ? {
                      ...msg,
                      content: payload.content ?? msg.content,
                      reactions: payload.reactions ?? msg.reactions,
                      $updatedAt: payload.$updatedAt ?? msg.$updatedAt,
                    }
                  : msg,
              ),
            }));

            return { ...old, pages: newPages };
          },
        );
      } else if (event === "delete") {
        queryClient.setQueryData<InfiniteData<AppwriteResponse<MessageData>>>(
          queryKey,
          (old) => {
            if (!old) return old;

            const newPages = old.pages.map((page) => ({
              ...page,
              rows: page.rows.filter((msg) => msg.$id !== payload.$id),
              total: page.total - 1,
            }));

            return { ...old, pages: newPages };
          },
        );
      }
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
  }, [currentUser?.$id, otherUserId, queryClient]);

  /** Send a new message */
  const handleSend = (content: string) => {
    if (!currentUser) return;

    sendMessage.mutate(
      {
        senderId: currentUser.$id,
        receiverId: otherUserId,
        content,
      },
      {
        onSuccess: () => {
          // Scroll to bottom after sending
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        },
      },
    );
  };

  /** Update an existing message */
  const handleUpdate = (messageId: string, content: string) => {
    updateMessage.mutate(
      { messageId, content },
      {
        onSuccess: () => {
          setEditingMessageId(null);
          setEditingContent("");
        },
      },
    );
  };

  /** Start editing a message */
  const startEdit = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditingContent(currentContent);
  };

  /** Cancel editing */
  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  /** Load older messages when scrolling to the top */
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // If scrolled near the top, fetch next page
    if (
      container.scrollTop < 100 &&
      messagesQuery.hasNextPage &&
      !messagesQuery.isFetchingNextPage
    ) {
      const prevScrollHeight = container.scrollHeight;

      messagesQuery.fetchNextPage().then(() => {
        // Maintain scroll position after loading older messages
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        });
      });
    }
  }, [messagesQuery.hasNextPage, messagesQuery.isFetchingNextPage]);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] overflow-hidden">
      {/* Contacts sidebar — hidden on mobile, visible on md+ */}
      <div className="hidden md:block md:w-20 lg:w-80 shrink-0 h-full">
        <ContactsSidebar />
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Chat header */}
        {otherUser ? (
          <ChatHeader user={otherUser} />
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        )}

        {/* Messages area with scroll */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-3"
        >
          {/* Loading older messages indicator */}
          {messagesQuery.isFetchingNextPage && (
            <div className="flex justify-center py-3">
              <Spinner className="size-5 text-muted-foreground" />
            </div>
          )}

          {/* Loading state */}
          {messagesQuery.isLoading && (
            <div className="flex flex-col gap-3 py-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                >
                  <Skeleton
                    className={`h-10 rounded-2xl ${i % 2 === 0 ? "w-48 rounded-br-md" : "w-56 rounded-bl-md"}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!messagesQuery.isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl">👋</span>
              </div>
              <p className="text-sm text-muted-foreground">
                No messages yet. Say hello!
              </p>
            </div>
          )}

          {/* Message bubbles */}
          <div className="flex flex-col gap-1.5">
            {messages.map((message) => (
              <MessageBubble
                key={message.$id}
                message={message}
                onEditStart={startEdit}
              />
            ))}
          </div>

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <MessageInput
          onSend={handleSend}
          onUpdate={handleUpdate}
          onCancelEdit={cancelEdit}
          isEditing={!!editingMessageId}
          editingMessageId={editingMessageId}
          editingContent={editingContent}
          isPending={sendMessage.isPending || updateMessage.isPending}
        />
      </div>
    </div>
  );
}
