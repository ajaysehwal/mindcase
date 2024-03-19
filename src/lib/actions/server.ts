"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";

export const isAuthenticated = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.auth.getSession();
  if (data.session) {
    return true;
  }

  return false;
};
