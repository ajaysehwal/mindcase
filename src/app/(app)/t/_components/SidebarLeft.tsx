"use client";

import { useEffect, useState } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

import { Box, Flex, Text } from "@radix-ui/themes";
import { createClient } from "@/lib/supabase/client";
import { Times, cn } from "@/lib/utils";
import { getWorkspaceId } from "@/lib/db/workspaces";
import { createNewThread, getThreadsByWorkspace } from "@/lib/db/threads";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import MainNav from "@/components/header/Logo";
import Profile from "@/components/sidebar/profileDropdown";

import {
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon,
  FolderOpenIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import { Loader2Icon } from "lucide-react";

import { useAuthStore } from "@/providers/AuthProvider";
import { useRootStore } from "@/providers/RootProvider";
import { TimeSeparatedThreads } from "./TimeSeparateEle";

export function SidebarLeft() {
  const router = useRouter();
  const supabase = createClient();
  const threadId = useSelectedLayoutSegment();

  const {
    workspaces,
    workspaceId,
    setWorkspaceId,
    loadThreads,
    threads,
    newThreadLoading,
    setNewThreadLoading,
  } = useRootStore((state) => state);
  const { user } = useAuthStore((state) => state);

  const [sidebar, setSidebar] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showAllThread, setShowAllThread] = useState(true);
  const [isPending, setIsPending] = useState(true);

  // sets thread if not selected
  useEffect(() => {
    if (!threadId) {
      if (threads.length) {
        router.replace(`/t/${threads[0].id}`);
      }
    }
  }, [threadId, threads]);

  // sets workspaceId based on the current thread if already not set
  useEffect(() => {
    const setWorkspaceIdBasedOnThread = async () => {
      if (threadId) {
        const workspace = await getWorkspaceId(supabase, threadId);
        if (workspace) {
          workspaceId !== workspace && setWorkspaceId(workspace);
        } else {
          router.replace("/t");
        }
      }
    };

    !workspaceId && setWorkspaceIdBasedOnThread();
  }, [threadId]);

  // sets available threads by workspace id
  useEffect(() => {
    const loadAllThreads = async () => {
      if (workspaceId) {
        setIsPending(true);
        try {
          const threads = await getThreadsByWorkspace(supabase, workspaceId);
          loadThreads(threads);
        } catch (error) {
          console.error(error);
        }
        setIsPending(false);
      }
      if (newThreadLoading) setNewThreadLoading(false);
    };

    loadAllThreads();
  }, [workspaceId, newThreadLoading]);

  const toggleSidebar = () => setSidebar(!sidebar);
  const handleNewThread = async () => {
    if (!workspaceId) {
      console.error("no workspaceId selected");
      return;
    }
    if (user) {
      setNewThreadLoading(true);
      const thread = await createNewThread(supabase, {
        workspace_id: workspaceId,
      });
      if (!thread) {
        console.error("failed creating new thread");
        return;
      }
      setNewThreadLoading(false);
      router.push("/t/" + thread.id);
    }
  };
  const handleWorkspaceChange = (val: string) => {
    loadThreads([]);
    setWorkspaceId(val);
    router.replace("/t");
  };

  useEffect(() => {
    // hot keyboard implementation with debounce 3s
    const isMac = window.navigator.userAgent.includes("Apple");
    let lastPressAt = 0;
    const handleKeyboardAction = (e: globalThis.KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.code === "KeyK" && (isMac ? e.metaKey : e.ctrlKey)) {
        const now = new Date().getTime();
        if (now - lastPressAt >= 3000) {
          handleNewThread();
        }
        lastPressAt = now;
      }
      if (e.code === "KeyE" && (isMac ? e.metaKey : e.ctrlKey) && e.shiftKey) {
        const now = new Date().getTime();
        if (now - lastPressAt >= 3000) {
          document.getElementById("thread-search-bar")?.focus();
        }
        lastPressAt = now;
      }
    };

    window.addEventListener("keydown", handleKeyboardAction);
    return () => window.removeEventListener("keydown", handleKeyboardAction);
  }, [workspaceId]);

  const WorkspaceSelectItems = ({ title, val }: any) => {
    return <SelectItem value={val}>{title}</SelectItem>;
  };

  return (
    <Box
      className={cn(
        "relative h-full w-full flex flex-col md:max-w-[320px] border-r transition-all duration-500 bg-gradient-to-bl from-sky-50 to-sky-100 text-sm",
        sidebar ? "shrink-0" : "ml-[-100%] md:ml-[-260px]"
      )}
    >
      <Box
        className={cn(
          "absolute top-11 z-10 left-[300px] transition-all duration-500",
          sidebar ? "" : "left-[270px] top-16 "
        )}
      >
        <Button
          size="icon"
          variant="link"
          onClick={toggleSidebar}
          className="p-0"
        >
          <ArrowLeftCircleIcon
            className={cn(
              "w-6 h-auto text-primary drop-shadow-lg",
              sidebar ? "" : "hidden opacity-0"
            )}
          />
          <ArrowRightCircleIcon
            className={cn(
              "w-6 h-auto text-primary drop-shadow-lg",
              sidebar ? "hidden opacity-0" : ""
            )}
          />
        </Button>
      </Box>
      <Box
        className={cn(
          sidebar ? "flex flex-col h-full w-full" : "hidden opacity-0"
        )}
      >
        {/* Workspace selection */}
        <Flex justify="between" align="center" className="p-4">
          <MainNav enableText={false} />
          <Select value={workspaceId} onValueChange={handleWorkspaceChange}>
            <SelectTrigger className="self-end shadow-sm space-x-2 w-fit focus:ring-0 focus-visible:ring-0 font-medium text-md">
              <FolderOpenIcon className="" />
              <SelectValue
                placeholder={
                  <Loader2Icon className="w-3 h-auto animate-spin ml-1" />
                }
              ></SelectValue>
            </SelectTrigger>
            <SelectContent className="focus-visible:ring-0">
              <WorkspaceSelectItems
                title="Public"
                val="260b11de-b226-473d-96ed-11f5ad4abd5b"
              />
              {workspaces.map((w, i) => (
                <WorkspaceSelectItems
                  key={i}
                  title={w.title ?? ""}
                  val={w.id}
                />
              ))}
            </SelectContent>
          </Select>
        </Flex>

        <div className="flex flex-col px-4 gap-y-4">
          {/* New chat with collasp button */}
          <Flex className="w-full items-center rounded-md ">
            <Button className="w-full shadow-sm" onClick={handleNewThread}>
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <PlusCircleIcon className="w-5 h-auto" />
                  <Text size="2" weight="bold">
                    New Thread
                  </Text>
                  {newThreadLoading ? (
                    <Loader2Icon
                      className={cn("w-4 h-auto animate-spin ml-1")}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <DropdownMenuShortcut className="font-bold">
                  ⌘K
                </DropdownMenuShortcut>
              </div>
            </Button>
          </Flex>

          {/* Search bar */}
          <Flex
            align="center"
            justify="center"
            className="w-full border-[1px] p-1 px-1.5 rounded-lg shadow-sm h-10 bg-background"
          >
            <MagnifyingGlassIcon className="p-1 rounded-md w-6 h-auto" />
            <Input
              id="thread-search-bar"
              value={searchText}
              placeholder="Search"
              onChange={(e) => setSearchText(e.currentTarget.value)}
              className="shadow-none border-0 focus-visible:ring-transparent flex-1 h-8"
            />
            <DropdownMenuShortcut className="font-bold bg-accent p-1 rounded-md">
              ⌘⇧E
            </DropdownMenuShortcut>
          </Flex>
        </div>

        <div className="flex-1">
          {/* Threads */}
          <Flex direction="column" align="center" className="flex-1">
            <Toggle
              className="ml-4 my-2 self-start flex hover:bg-transparent data-[state=on]:bg-transparent p-0 items-center justify-center mb-1"
              onClick={() => setShowAllThread((p) => !p)}
            >
              <ChatBubbleLeftEllipsisIcon className="w-4 h-auto" />
              <h4 className="font-medium ml-1.5 mr-1">Threads</h4>
              <ChevronDownIcon
                className={`w-4 h-auto ${showAllThread ? "" : "rotate-180"}`}
              />
            </Toggle>

            {isPending && (
              <Box className="mt-4 flex flex-1 w-full h-full items-center justify-center">
                <Loader2Icon size="16" className="mr-2 animate-spin" />
                <Text size="3">Loading...</Text>
              </Box>
            )}

            {!isPending && showAllThread && (
              <ScrollArea className="h-[calc(100vh-320px)] ml-4 overflow-y-scroll">
                <TimeSeparatedThreads timeText={Times.Today} />
                <TimeSeparatedThreads timeText={Times.Yesterday} />
                <TimeSeparatedThreads timeText={Times.ThisWeek} />
                <TimeSeparatedThreads timeText={Times.BeforeThisWeek} />
              </ScrollArea>
            )}
          </Flex>
        </div>

        <Box className="h-20 w-full border-t-[1px] flex items-center justify-center p-2">
          <Profile />
        </Box>
      </Box>
      <Box
        className={cn(
          "place-self-end flex flex-col h-full w-[60px] justify-between items-center py-4",
          sidebar ? "hidden opacity-0" : ""
        )}
      >
        <MainNav enableText={false} />
        <Box className="h-fit w-full flex items-center justify-center">
          <Profile enableEmail={false} bgTransparent={true} />
        </Box>
      </Box>
    </Box>
  );
}
