import type { RealtimeSubscription } from "appwrite";
import type { MessageData, ContactUser } from "@/types/api";
import { appwriteConfig, realtime } from "./config";

// Global failure counter to "give up" on repeated WS issues
let failureCount = 0;
const MAX_FAILURES = 2;

// Listen for global realtime errors to count failures
realtime.onError((error) => {
  console.warn("Realtime connection error:", error);
  failureCount++;
});

// Event type emitted by the message realtime subscription
type MessageRealtimeEvent = {
  event: "create" | "update" | "delete" | null;
  payload: MessageData;
};

/**
 * Subscribe to realtime message events for the current user.
 * Fires on create/update/delete of any message where the user
 * is either the sender or receiver.
 */
export const messageRealtime = async (
  currentUserId: string,
  onEvent: (event: MessageRealtimeEvent) => void,
): Promise<RealtimeSubscription> => {
  // If we've reached max failures, don't try to connect anymore
  if (failureCount >= MAX_FAILURES) {
    console.info("Realtime reached max failures. Giving up on websocket connection.");
    return { close: async () => {} };
  }

  const subscription = await realtime.subscribe(
    `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesTableId}.documents`,
    (response) => {
      // On successful message delivery, reset failure count as we know connection works
      failureCount = 0;

      const payload = response.payload as MessageData;

      // Only process events relevant to the current user
      if (
        payload.receiver?.$id === currentUserId ||
        payload.sender?.$id === currentUserId
      ) {
        // Determine event type from the Appwrite events array
        const event = response.events.includes(
          "databases.*.collections.*.documents.*.create",
        )
          ? "create"
          : response.events.includes(
                "databases.*.collections.*.documents.*.delete",
              )
            ? "delete"
            : response.events.includes(
                  "databases.*.collections.*.documents.*.update",
                )
              ? "update"
              : null;

        onEvent({ event, payload });
      }
    },
  );

  return subscription;
};

/**
 * Subscribe to realtime events to detect new contacts.
 * Fires when a new message is created involving the current user,
 * returning the "other" user as a potential new contact.
 */
export const getContactsRealtime = async (
  currentUserId: string,
  onEvent: (contact: ContactUser) => void,
): Promise<RealtimeSubscription> => {
  // If we've reached max failures, don't try to connect anymore
  if (failureCount >= MAX_FAILURES) {
    return { close: async () => {} };
  }

  const subscription = await realtime.subscribe(
    `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesTableId}.documents`,
    (response) => {
      // On successful delivery, reset failure count
      failureCount = 0;

      // Only care about new messages for contact discovery
      if (
        response.events.includes(
          "databases.*.collections.*.documents.*.create",
        )
      ) {
        const payload = response.payload as MessageData;

        // Return the "other" user as the new/updated contact
        if (payload.receiver?.$id === currentUserId) {
          onEvent(payload.sender);
        } else if (payload.sender?.$id === currentUserId) {
          onEvent(payload.receiver);
        }
      }
    },
  );

  return subscription;
};
