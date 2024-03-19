"use client";

import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "../supabase/client";
import { toast } from "@/components/ui/use-toast";

let supabase: SupabaseClient<any, "public", any> | undefined;

const supabaseActive = () => {
  if (!supabase) {
    supabase = createClient();
  }
  return supabase;
};

export const insertPromptResponse = async (
  query: any,
  response: string,
  user_id: string
) => {
  if (response === "") {
    toast({
      title: "LLM Response was empty!",
    });

    return null;
  }

  const word_count = response.split(" ").length;
  const page_count = Number(Number(word_count / 500).toFixed(0)) + 1;

  const supabase = supabaseActive();
  const promptResponse = {
    user_id: user_id,
    query: `${query.user_query} ${query.query_type} ${Object.values(
      query.user_input
    ).join(",")}`,
    type: query.user_query,
    response: response,
    word_count: word_count,
    page_count: page_count,
  };
  const { data, error } = await supabase.from("prompts").insert(promptResponse);
  if (error) {
    toast({
      title: error.message,
    });
    console.error(error.message);
    return;
  }

  if (data) {
    toast({
      title: "Previous prompts was saved.",
    });
    console.log(data);
  }
  return;
};
