import { SupabaseClient } from "@supabase/supabase-js";
import { Threads, Insert, Update, Database } from ".";

export const getThreads = async (
  supabase: SupabaseClient<Database>
): Promise<Threads[]> => {
  console.log("getThreads");
  const { data, error } = await supabase
    .from("Threads")
    .select()
    .order("created_at", { ascending: false });
  if (error) return Array<Threads>();
  return data ?? Array<Threads>();
};

export const getThreadsByWorkspace = async (
  supabase: SupabaseClient<Database>,
  workspace_id: string
): Promise<Threads[]> => {
  const { data, error } = await supabase
    .from("Threads")
    .select()
    .eq("workspace_id", workspace_id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? Array<Threads>();
};

export const getThreadsByURL = async (
  supabase: SupabaseClient<Database>,
  url: string
): Promise<{ workspace_id: string | null; threads: Threads[] }> => {
  console.log("getThreadsByURL");
  const { data: workspace } = await supabase
    .from("Threads")
    .select("workspace_id")
    .eq("id", url)
    .maybeSingle();
  const workspace_id = workspace?.workspace_id || url;
  const { data, error } = await supabase
    .from("Threads")
    .select()
    .eq("workspace_id", workspace_id)
    .order("created_at", { ascending: false });
  if (error) return { workspace_id: null, threads: Array<Threads>() };
  return { workspace_id, threads: data ?? Array<Threads>() };
};

export const getThreadById = async (
  supabase: SupabaseClient<Database>,
  id: string
): Promise<Threads | null> => {
  const { data, error } = await supabase
    .from("Threads")
    .select()
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
};

export const createNewThread = async (
  supabase: SupabaseClient<Database>,
  params: Insert<"Threads">
): Promise<Threads | null> => {
  const { data, error } = await supabase
    .from("Threads")
    .insert([params])
    .select()
    .single();
  if (error) return null;
  return data;
};

export const updateThreadById = async (
  supabase: SupabaseClient<Database>,
  id: string,
  params: Update<"Threads">
): Promise<Threads | null> => {
  const { data, error } = await supabase
    .from("Threads")
    .update(params)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return data;
};

export const deleteThread = async (
  supabase: SupabaseClient<Database>,
  id: string
): Promise<boolean> => {
  const { error } = await supabase.from("Threads").delete().eq("id", id);
  return !error;
};
