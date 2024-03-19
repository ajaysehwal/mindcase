import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Insert, Workspaces } from ".";
import { cache } from "react";

export const getWorkspaceId: (
  supabase: SupabaseClient<Database>,
  thread_id: string
) => Promise<string | null> = cache(
  async (
    supabase: SupabaseClient<Database>,
    thread_id: string
  ): Promise<string | null> => {
    const { data, error } = await supabase
      .from("Threads")
      .select("workspace_id")
      .eq("id", thread_id)
      .single();
    if (error) return null;
    return data?.workspace_id ?? null;
  }
);

export const createWorkspace = async (
  supabase: SupabaseClient<Database>,
  params: Insert<"Workspaces">
): Promise<Workspaces | null> => {
  const { data, error } = await supabase
    .from("Workspaces")
    .insert([params])
    .select()
    .maybeSingle();
  if (error) return null;
  return data;
};

export const deleteWorkspace = async (
  supabase: SupabaseClient<Database>,
  id: string
): Promise<boolean> => {
  const { error } = await supabase.from("Workspaces").delete().eq("id", id);
  return !error;
};

export const getAllWorkspaces = async (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Workspaces[]> => {
  const { data, error } = await supabase
    .from("Workspaces")
    .select()
    .eq("user_id", userId);

  if (error) {
    console.error(error.message);
  } else if (data) {
    return data;
  }

  return Array<Workspaces>();
};
