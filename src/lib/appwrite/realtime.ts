import type { MessageData, ContactUser } from "@/types/api";
import { appwriteConfig, client } from "./config";

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
export const messageRealtime = (
  currentUserId: string,
  onEvent: (event: MessageRealtimeEvent) => void,
) => {
  const unsubscribe = client.subscribe(
    `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesTableId}.documents`,
    (response) => {
      const payload = response.payload as MessageData;

      // Only process events relevant to the current user
      if (
        payload.receiver.$id === currentUserId ||
        payload.sender.$id === currentUserId
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

  return unsubscribe;
};

/**
 * Subscribe to realtime events to detect new contacts.
 * Fires when a new message is created involving the current user,
 * returning the "other" user as a potential new contact.
 */
export const getContactsRealtime = (
  currentUserId: string,
  onEvent: (contact: ContactUser) => void,
) => {
  const unsubscribe = client.subscribe(
    `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesTableId}.documents`,
    (response) => {
      // Only care about new messages for contact discovery
      if (
        response.events.includes(
          "databases.*.collections.*.documents.*.create",
        )
      ) {
        const payload = response.payload as MessageData;

        // Return the "other" user as the new/updated contact
        if (payload.receiver.$id === currentUserId) {
          onEvent(payload.sender);
        } else if (payload.sender.$id === currentUserId) {
          onEvent(payload.receiver);
        }
      }
    },
  );

  return unsubscribe;
};
