import type { Database } from "./database.types";

export type { Database };

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Update<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
// export type DbResultErr = PostgrestError;

export type Workspaces = Tables<"Workspaces">;
export type Threads = Tables<"Threads">;
export type Conversations = Tables<"Conversations">;
export type Cases = Tables<"Cases">;
export type Acts = Tables<"Acts">;
export type Databases = Tables<"Databases">;
