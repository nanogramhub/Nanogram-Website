import { Client, Account, Storage, Avatars, TablesDB, Realtime } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageBucketId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  usersTableId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  postsTableId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
  savesTableId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
  commentsTableId: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
  followsTableId: import.meta.env.VITE_APPWRITE_FOLLOWS_COLLECTION_ID,
  messagesTableId: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
  nanogramsTableId: import.meta.env.VITE_APPWRITE_NANOGRAM_COLLECTION_ID,
  newsTableId: import.meta.env.VITE_APPWRITE_NEWS_COLLECTION_ID,
  eventsTableId: import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID,
};

export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const database = new TablesDB(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const realtime = new Realtime(client);
