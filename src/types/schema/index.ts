export type AppwriteResponse<T> = {
  rows: T[];
  total: number;
};

export type AppwriteWrapper = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

export type AppwriteDocument = AppwriteWrapper & {
  $sequence: string;
  $permissions: string[];
  $tableId: string;
  $databaseId: string;
};

// Auth and Session
export type Session = AppwriteWrapper & {
  userId: string;
  expire: string;
  provider: string;
  providerUid: string;
  providerAccessToken: string;
  providerAccessTokenExpiry: string;
  providerRefreshToken: string;
  ip: string;
  osCode: string;
  osName: string;
  osVersion: string;
  clientType: string;
  clientCode: string;
  clientName: string;
  clientVersion: string;
  clientEngine: string;
  clientEngineVersion: string;
  deviceName: string;
  deviceBrand: string;
  deviceModel: string;
  countryCode: string;
  countryName: string;
  current: boolean;
  factors: string[];
  secret: string;
  mfaUpdatedAt: string;
};

type Target = AppwriteWrapper & {
  name: string;
  userId: string;
  providerId: string | null;
  providerType: string;
  identifier: string;
  expired: boolean;
};

export type AuthUser = AppwriteWrapper & {
  name: string;
  registration: string;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: Record<string, unknown>;
  targets: Target[];
  accessedAt: string;
  impersonator: boolean;
  impersonatorUserId: string | null;
};

// Various Table Data
export type Nanogram = AppwriteDocument & {
  name: string;
  role: string;
  content: string | null;
  avatarUrl: string;
  linkedin: string | null;
  instagram: string | null;
  github: string | null;
  avatarId: string;
  alumini: boolean;
  core: boolean;
  priority: number;
};

export type Event = AppwriteDocument & {
  date: string;
  completed: boolean;
  title: string;
  content: string;
  location: string;
  registration: string | null;
  imageId: string;
  imageUrl: string;
  description: string;
  subtitle: string;
};

export type User = AppwriteDocument & {
  name: string;
  username: string;
  accountId: string;
  email: string;
  bio?: string;
  imageId?: string;
  imageUrl: string;
  admin: boolean;
  karma: number;
};

export type Post = AppwriteDocument & {
  caption: string;
  tags: string[];
  imageUrl: string;
  imageId: string;
  creator: string;
};

export type Comment = AppwriteDocument & {
  content: string;
  commentor: string;
  post: string;
};
