import React, { Suspense, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Box, Flex } from "@radix-ui/themes";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Acts, Cases, Conversations } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { Loader2Icon, SearchCodeIcon } from "lucide-react";

import { Space_Mono } from "next/font/google";
import { CasesInformation } from "./CasesInformation";
import { useAuthStore } from "@/providers/AuthProvider";
import Logo from "@/components/header/Logo";
import { getCaseByIds } from "@/lib/db/cases";
import { createClient } from "@/lib/supabase/client";
import { QueryStatus } from "./AnimatedQueryStatus";
import { getActByIds } from "@/lib/db/acts";

const spaceMono = Space_Mono({
  preload: false,
  subsets: ["latin"],
  weight: "400",
});

interface Props {
  message: Conversations;
}

export function ChatMessages({ message }: Props) {
  const { user } = useAuthStore((state) => state);
  const statusMessages = [
    "Fetching relevant documents...",
    "Generating response...",
  ];

  const supabase = createClient();
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);
  const [cases, setCases] = useState<Cases[]>([]);
  const [acts, setActs] = useState<Acts[]>([]);

  useEffect(() => {
    const fetchCases = async (docs: string[][] | null) => {
      if (!docs) return;
      setLoadingDocs(true);
      const caseIds: string[] = [];
      const actIds: string[] = [];
      for (let index = 0; index < docs.length; index++) {
        const d = docs[index];
        if (d[1] === "Acts") {
          !actIds.includes(d[0]) && actIds.push(d[0]);
        } else if (d[1] === "Cases") {
          !caseIds.includes(d[0]) && caseIds.push(d[0]);
        }
      }

      // console.log("cases", caseIds);
      // console.log("acts", actIds);

      const acts = await getActByIds(supabase, actIds);
      const cases = await getCaseByIds(supabase, caseIds);

      setCases(cases);
      setActs(acts);
      setLoadingDocs(false);
    };

    message.documents?.length && fetchCases(message.documents);
  }, []);

  return (
    <div className="flex flex-col">
      <Box className="h-full w-full flex flex-col gap-1">
        {/* User Query */}
        <Box className="flex items-center justify-between p-3 rounded-md border-[0px]">
          <Box className="flex items-center justify-start gap-4">
            <Avatar className="h-10 w-10 bg-secondary">
              <AvatarImage
                src="/profile-avatar.svg"
                alt="dummhy profile avatar"
              />
              <AvatarFallback className="bg-primary text-black text-lg">
                {user?.email?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Label className="text-md font-medium">{message.query}</Label>
          </Box>
        </Box>

        {/* AI Response */}
        <div className="flex flex-col gap-6 text-sm px-3">
          <QueryStatus text={statusMessages[0]} />

          <Box className="flex flex-col gap-6">
            {/* discovery cards */}
            <Box className="ml-14 flex flex-col overflow-hidden gap-2">
              <Flex align="center" justify="between">
                <Flex className="items-center justify-start gap-2">
                  <SearchCodeIcon className="bg-primary-foreground p-1 rounded-lg w-6 h-6" />
                  <Label className="text-sm font-medium inline-flex items-center">
                    Results (
                    <span className="text-xs">
                      {cases.length + acts.length || 0}
                    </span>
                    )
                  </Label>
                </Flex>
              </Flex>
              {loadingDocs ? (
                <Box className="w-full flex justify-center">
                  <Loader2Icon className="h-auto w-4 animate-spin" />
                </Box>
              ) : (
                <Suspense fallback={<h1>Loading PDF Links</h1>}>
                  <CasesInformation cases={cases} acts={acts} />
                </Suspense>
              )}
            </Box>

            <QueryStatus text={statusMessages[1]} />

            {/* Response */}
            <Flex className="gap-4">
              <Avatar className="bg-black p-2 flex justify-center items-center">
                <Logo
                  iconVariant="black"
                  enableLinkEle={false}
                  enableText={false}
                  size={38}
                />
              </Avatar>
              <Card className="w-auto max-w-[75%] px-3 py-2 text-sm bg-primary-foreground border-[1px] border-secondary">
                <CardContent className="flex flex-col p-0 space-y-4">
                  <ReactMarkdown>
                    {message.answer || `No response message found`}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            </Flex>
          </Box>
        </div>
      </Box>
      <Separator className="opacity-40 mt-4" />
    </div>
  );
}
