"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "@/providers/AuthProvider";
import { useRootStore } from "@/providers/RootProvider";
import { createClient } from "@/lib/supabase/client";
import { getAllWorkspaces } from "@/lib/db/workspaces";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { user } = useAuthStore((state) => state);
  const { loadWorkspaces, workspaces } = useRootStore((state) => state);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkspacesToState = async () => {
      if (user) {
        setLoading(true);
        const workspaces = await getAllWorkspaces(supabase, user.id);
        if (workspaces.length > 0) {
          loadWorkspaces(workspaces);
        }
        setLoading(false);
      }
    };

    !workspaces.length && loadWorkspacesToState(); // fetches all the workspaces of the user
  }, [user]);

  return (
    <main className="w-full h-full relative">
      {loading ? (
        <div className="h-full w-full flex justify-center items-center">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      ) : (
        children
      )}
    </main>
  );
}
