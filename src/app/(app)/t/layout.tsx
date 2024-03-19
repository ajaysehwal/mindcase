"use client";

import { ReactNode, useEffect } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import { Box } from "@radix-ui/themes";
import { ChatView } from "./_components/CaseView";
import { SidebarLeft } from "./_components/SidebarLeft";
import { SidebarRight } from "./_components/SidebarRight";
import { useRootStore } from "@/providers/RootProvider";
import UserDetailsForm from "./_components/userDetailform";

export default function ThreadsLayout({}: { children: ReactNode }) {
  const threadId = useSelectedLayoutSegment();
  const { setWorkspaceId, workspaces } = useRootStore((state) => state);

  useEffect(() => {
    if (!threadId && workspaces.length) {
      setWorkspaceId(workspaces[0].id);
    } else {
      // TODO: handle case of no workspace of user
      setWorkspaceId("260b11de-b226-473d-96ed-11f5ad4abd5b");
    }
  }, [workspaces]);

  return (
    <Box className="h-full w-full flex relative">
      <UserDetailsForm />
      <SidebarLeft />
      <ChatView />
      <SidebarRight />
    </Box>
  );
}
