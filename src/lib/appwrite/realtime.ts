// import { appwriteConfig, client } from "./config";

// export const messageRealtime = (currentUserId, onEvent) => {
//   const unsubcribe = client.subscribe(
//     `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
//     (response) => {
//       if (
//         response.payload.receiver.$id === currentUserId ||
//         response.payload.sender.$id === currentUserId
//       )
//         onEvent({
//           event: response.events.includes(
//             "databases.*.collections.*.documents.*.create"
//           )
//             ? "create"
//             : response.events.includes(
//                 "databases.*.collections.*.documents.*.delete"
//               )
//             ? "delete"
//             : response.events.includes(
//                 "databases.*.collections.*.documents.*.update"
//               )
//             ? "update"
//             : null,
//           payload: response.payload,
//         });
//     }
//   );

//   return unsubcribe;
// };

// export const getContactsRealtime = (currentUserId, onEvent) => {
//   const unsubcribe = client.subscribe(
//     `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
//     (response) => {
//       if (
//         response.events.includes("databases.*.collections.*.documents.*.create")
//       ) {
//         if (response.payload.receiver.$id === currentUserId)
//           onEvent(response.payload.sender);
//         else if (response.payload.sender.$id === currentUserId)
//           onEvent(response.payload.receiver);
//       }
//     }
//   );

//   return unsubcribe;
// };
