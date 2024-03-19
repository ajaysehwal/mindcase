"use client";

import { Box } from "@radix-ui/themes";
import { ChatMessages } from "./chatMessages";
import { NewChatMessage } from "./newMessages";
import { Conversations } from "@/lib/db";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface Props {
  messages: Conversations[];
  newMessage: Conversations | null;
  setNewMessage: Dispatch<SetStateAction<Conversations | null>>;
  setStreaming: Dispatch<SetStateAction<boolean>>;
}

export function AllMessages({
  messages,
  newMessage,
  setNewMessage,
  setStreaming,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  }, [messages]);

  return (
    <Box className="h-full w-full flex flex-col py-4 gap-4">
      {messages.map((message, index) => (
        <ChatMessages key={index} message={message} />
      ))}
      {newMessage ? (
        <NewChatMessage
          message={newMessage}
          setMessage={setNewMessage}
          setStreaming={setStreaming}
        />
      ) : null}
      <Box ref={containerRef} />
    </Box>
  );
}
