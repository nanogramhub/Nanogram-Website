import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
  commentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
  followsCollectionId: import.meta.env.VITE_APPWRITE_FOLLOWS_COLLECTION_ID,
  messagesCollectionId: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
  nanogramCollectionId: import.meta.env.VITE_APPWRITE_NANOGRAM_COLLECTION_ID,
  newsCollectionId: import.meta.env.VITE_APPWRITE_NEWS_COLLECTION_ID,
  eventsCollectionId: import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID,
};

export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
