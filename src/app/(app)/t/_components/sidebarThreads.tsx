"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { Box } from "@radix-ui/themes";
import { Text } from "@radix-ui/themes";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Threads } from "@/lib/db";
import { deleteThread } from "@/lib/db/threads";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRootStore } from "@/providers/RootProvider";

interface Props {
  thread: Threads;
  deleteIndicator: (b: boolean) => void;
}

export function Thread({ thread, deleteIndicator }: Props) {
  const threadId = useSelectedLayoutSegment();
  const { setThreadHeadingIndicator } = useRootStore((state) => state);

  useEffect(() => {
    if (threadId === thread.id) {
      if (thread.title === "New thread") {
        setThreadHeadingIndicator(false);
      } else {
        setThreadHeadingIndicator(true);
      }
    }
  }, [threadId]);

  return (
    <Link
      href={"/t/" + thread.id}
      className={cn(
        `flex h-10 max-h-10 w-full items-center justify-center rounded-md hover:bg-background hover:shadow-sm overflow-hidden p-2`,
        threadId === thread.id && "bg-background shadow-sm"
      )}
    >
      <Box className="flex-1 flex text-left">
        <Text size="2" className="line-clamp-1 font-medium">
          {thread.title === "New thread"
            ? "New thread (will load the title eventually)"
            : thread.title}
        </Text>
      </Box>
      {threadId === thread.id && (
        <DeleteThread threadId={thread.id} deleteIndicator={deleteIndicator} />
      )}
    </Link>
  );
}

function DeleteThread({
  threadId,
  deleteIndicator,
}: {
  threadId: string;
  deleteIndicator: (b: boolean) => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    deleteIndicator(true);
    await deleteThread(supabase, threadId);
    deleteIndicator(false);
    router.replace(`/t`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="overflow-hidden h-6 w-6 p-0 m-0 text-primary/50"
        >
          <X size="15" className="p-0 m-0 self-center" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Delete Thread</DialogTitle>
        </DialogHeader>
        <Text size="2" className="mb-4">
          Are you sure you want to delete this thread? This action cannot be
          undone.
        </Text>
        <Button
          className="focus-visible:ring-ring"
          type="button"
          variant="outline"
          onClick={(e) => setOpen(false)}
        >
          Cancel
        </Button>
        {/* submit on pressing enter */}
        <Button
          className="focus-visible:ring-ring"
          autoFocus
          type="button"
          onClick={(e) => handleSubmit(e)}
        >
          Confirm Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
