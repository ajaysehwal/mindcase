import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Box, Flex } from "@radix-ui/themes";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Cases, Conversations, Threads, Acts } from "@/lib/db";

import { MagnifyingGlassIcon as SearchCodeIcon } from "@heroicons/react/24/outline";

import { AnimatedQueryStatus } from "./AnimatedQueryStatus";
import { CasesInformation } from "./CasesInformation";
import { getDocuments, getStream } from "./api";
import { useAuthStore } from "@/providers/AuthProvider";
import Logo from "@/components/header/Logo";
import { getCaseByIds } from "@/lib/db/cases";
import { createClient } from "@/lib/supabase/client";
import { useRootStore } from "@/providers/RootProvider";
import { useSelectedLayoutSegment } from "next/navigation";
import { getActByIds } from "@/lib/db/acts";

interface Props {
  message: Conversations | null;
  setMessage: React.Dispatch<React.SetStateAction<Conversations | null>>;
  setStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NewChatMessage({ message, setMessage, setStreaming }: Props) {
  const supabase = createClient();
  const threadId = useSelectedLayoutSegment();
  const [generatedData, setGeneratedData] = useState("");
  const [chatHistory, setChatHistory] = useState("");
  const [documents, setDocuments] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingDoc, setFetchingDoc] = useState<boolean>();
  const [generatinResp, setGeneratingResp] = useState<boolean>();
  const { user } = useAuthStore((state) => state);
  const { threads } = useRootStore((state) => state);
  const [cases, setCases] = useState<Cases[]>([]);
  const [acts, setActs] = useState<Acts[]>([]);

  useEffect(() => {
    const fetchDocuments = async (docs: string[][]) => {
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

      const acts = await getActByIds(supabase, actIds);
      const cases = await getCaseByIds(supabase, caseIds);

      // console.log(acts);
      // console.log(cases);

      setCases(cases);
      setActs(acts);
      setFetchingDoc(false);
    };

    const getResponse = async () => {
      if (message) {
        setLoading(true);
        const thread = threads.find((t) => t.id === threadId) as Threads;
        try {
          setFetchingDoc(true);
          const documents = await getDocuments({
            message: message.query,
            thread,
          });
          await fetchDocuments(documents.documents);
          setDocuments(documents.documents);
          await getStream(
            thread,
            documents,
            setGeneratedData,
            setLoading,
            setGeneratingResp
          );
        } catch (e) {
          setGeneratedData(
            "Sorry, I didn't get that. Please try again, some error occured."
          );
          setLoading(false);
        }
      }
    };

    getResponse();
  }, []);

  useEffect(() => {
    if (!loading && message?.type === "loading") {
      console.log("generated response", generatedData);
      setMessage((message) => ({
        answer: generatedData,
        analysis: generatedData,
        type: "answer",
        cases: null,
        documents: documents,
        id: message?.id || "",
        user_id: message?.user_id || "",
        created_at: message?.created_at || "",
        thread_id: message?.thread_id || "",
        query: message?.query || "",
        chat_history: chatHistory || "",
      }));
      setStreaming(false);
    }
  }, [loading]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  }, [documents, generatedData]);

  return (
    <Box className="h-full w-full flex flex-col gap-1">
      {/* User Query */}
      <Box className="flex items-center justify-between p-3 rounded-md border-[0px]">
        <Box className="flex items-center justify-start gap-4">
          <Avatar className="h-10 w-10 bg-secondary">
            <AvatarImage
              src="/profile-avatar.svg"
              alt="dummhy profile avatar"
            />
            <AvatarFallback className="bg-blue-300 text-black text-lg">
              {user?.email?.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Label className="text-md font-medium">{message?.query}</Label>
        </Box>
      </Box>

      <Box className="flex flex-col text-sm gap-6 px-3">
        {fetchingDoc === undefined ? null : fetchingDoc ? (
          <AnimatedQueryStatus
            message="Fetching relevant documents..."
            loading={true}
          />
        ) : (
          <AnimatedQueryStatus
            message="Fetching relevant documents..."
            loading={false}
          />
        )}
        {/* discovery cards */}
        {fetchingDoc === false ? (
          <Box className="transition-opacity duration-300 ease-in ml-14 flex flex-col overflow-hidden gap-2">
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
            <CasesInformation cases={cases} acts={acts} />
          </Box>
        ) : null}

        {generatinResp === undefined ? null : generatinResp &&
          !generatedData.length ? (
          <AnimatedQueryStatus
            message="Generating response..."
            loading={true}
          />
        ) : (
          <AnimatedQueryStatus
            message="Generating response..."
            loading={false}
          />
        )}

        {/* Response */}
        {generatedData.length ? (
          <Flex className="gap-4 mt-2 transition-opacity duration-300 ease-in">
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
                <ReactMarkdown>{generatedData}</ReactMarkdown>
              </CardContent>
            </Card>
          </Flex>
        ) : null}
      </Box>
      <Box ref={containerRef} />
    </Box>
  );
}
