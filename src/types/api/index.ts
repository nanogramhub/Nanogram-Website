export type AppwriteResponse<T> = {
  rows: T[];
  total: number;
};

export type AppwriteDocument = {
  $id: string;
  $sequence: string;
  $permissions: string[];
  $tableId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
};

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

export type Event = AppwriteDocument & {};
