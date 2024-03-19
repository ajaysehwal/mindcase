import { Threads } from "@/lib/db";
import { updateConversationById } from "@/lib/db/conversations";
import { createClient } from "@/lib/supabase/client";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export interface DocumentResponse {
  documents: string[][];
  chunks_reranked: string;
  doc_query: string;
  do_research: string;
  query_type: string;
  chat_history: string;
}

export const updateChatHistory = async ({
  threadId,
  chatHistory,
  final_response_str,
}: {
  threadId: string;
  chatHistory: string;
  final_response_str: string;
}) => {
  const supabase = createClient();
  const documentsURL =
    process.env.NEXT_PUBLIC_BACKEND_URL + "/chat/chat_history/";
  const response = await fetch(documentsURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_history: chatHistory,
      final_response_str: final_response_str,
    }),
  });
  const { chat_history } = (await response.json()) as { chat_history: string };
  await updateConversationById(supabase, threadId, {
    chat_history: chat_history,
  });
  return chat_history;
};

export const getThreadHeading = async ({
  chat_history,
}: {
  chat_history: string;
}) => {
  const documentsURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/chatHeading/";
  const response = await fetch(documentsURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_history: chat_history,
    }),
  });
  const { chat_heading } = (await response.json()) as { chat_heading: string };
  return chat_heading;
};

export const getDocuments = async ({
  message,
  thread,
}: {
  message: string;
  thread: Threads;
}) => {
  const documentsURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/chat/documents/";
  const response = await fetch(documentsURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_query: message,
      chat_history: "",
      metadata_filters_cases: {},
      metadata_filters_acts: {},
      keyword_filters: {},
      thread: thread,
    }),
  });
  const documents: DocumentResponse = await response.json();
  return documents;
};

export const getStream = async (
  thread: Threads,
  documents: DocumentResponse,
  setGeneratedData: React.Dispatch<React.SetStateAction<string>>,
  setStreaming: React.Dispatch<React.SetStateAction<boolean>>,
  setGeneratingResp: React.Dispatch<React.SetStateAction<boolean | undefined>>
) => {
  setGeneratingResp(true);
  const responseURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/chat/response/";
  await fetchEventSource(responseURL, {
    method: "POST",
    openWhenHidden: true,
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chunks: documents.chunks_reranked,
      user_query: documents.doc_query,
      do_research: documents.do_research,
      query_type: documents.query_type,
      thread: thread,
    }),
    async onopen(res) {
      if (res.ok && res.status === 200) {
        console.log("Connection made ", res);
      } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
        console.log("Client-side error ", res);
      }
    },
    onmessage(event) {
      const parsedData: string = event.data === "" ? "\n" : event.data;
      setGeneratedData((data: string) => data + parsedData);
    },
    onclose() {
      setStreaming(false);
      setGeneratingResp(false);
    },
    onerror(err) {
      setStreaming(false);
      setGeneratingResp(false);
    },
  });
};
