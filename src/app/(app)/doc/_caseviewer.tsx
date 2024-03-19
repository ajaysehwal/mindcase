import { Courier_Prime } from "next/font/google";

import { Box, Text } from "@radix-ui/themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Acts, Cases } from "@/lib/db";
import { Json } from "@/lib/db/database.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LoaderIcon } from "lucide-react";

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: "400",
});

export default function CaseViewer({
  loading,
  category,
  cases,
  caseLaws,
  acts,
  caseCount,
  loadingCount,
  page,
  limit,
  caseId,
  setCaseId,
  setPage,
}: {
  loading: boolean;
  category: string;
  cases: Cases[] | Acts[];
  caseLaws?: Cases[];
  acts?: Acts[];
  caseCount: number;
  loadingCount: boolean;
  page: number;
  limit: number;
  caseId: string;
  setCaseId: (id: string) => void;
  setPage: (page: number) => void;
}) {
  return (
    <Box className="h-full w-full flex flex-col max-w-sm border-none">
      {/* <Box className="h-full w-full relative flex flex-col "> */}
      <ScrollArea className="w-full h-full max-h-full">
        {loading && (
          <Box className="absolute z-10 w-full h-full bg-muted/90 flex items-center justify-center">
            <Text size={"3"} weight={"bold"}>
              Loading...
            </Text>
          </Box>
        )}
        {!loading && cases.length === 0 && (
          <Box className="flex flex-col w-full h-full items-center justify-center space-y-2">
            <Text size={"3"} weight={"bold"}>
              No results found
            </Text>
            <Text size={"2"}>Try another search term</Text>
          </Box>
        )}
        {category === "CaseLaws" && cases.length !== 0 && (
          <Box className="w-full flex flex-col divide-y">
            {caseLaws!.map((caseItem, index) => (
              <Button
                key={caseItem.file_id}
                className={cn(
                  "flex flex-col h-auto w-full rounded-none border-l-2 border-l-transparent relative",
                  caseId === caseItem.file_id && "border-l-primary bg-muted"
                )}
                variant={null}
                onClick={() => setCaseId(caseItem.file_id)}
              >
                <Box className="flex flex-col w-full text-left py-1 space-y-1">
                  <Text size={"2"} weight={"bold"}>
                    {caseItem.case_name}
                  </Text>
                  {/* <Text size={"1"} className="line-clamp-2">
                {caseItem.doc_text}
              </Text> */}
                  <Box className="flex w-full justify-between">
                    <Text size={"1"} className="text-primary/50">
                      {caseItem.court}
                    </Text>
                    <Text size={"1"} className="text-primary/50">
                      {caseItem.decision_date}
                    </Text>
                  </Box>
                </Box>
              </Button>
            ))}
          </Box>
        )}
        {category === "Acts" && cases.length !== 0 && (
          <Box className="w-full flex flex-col divide-y">
            {acts!.map((caseItem, index) => (
              <Button
                key={caseItem.pdf_link}
                className={cn(
                  "flex flex-col h-auto w-full rounded-none border-l-2 border-l-transparent relative",
                  caseId === caseItem.pdf_link && "border-l-primary bg-muted"
                )}
                variant={null}
                onClick={() => setCaseId(caseItem.pdf_link)}
              >
                <Box className="flex flex-col w-full text-left py-1 space-y-1">
                  <Text size={"2"} weight={"bold"}>
                    {caseItem.act_name}
                  </Text>
                  {/* <Text size={"1"} className="line-clamp-2">
                {caseItem.doc_text}
              </Text> */}
                  <Box className="flex w-full justify-between">
                    <Text size={"1"} className="text-primary/50">
                      {caseItem.act_type}
                    </Text>
                    <Text size={"1"} className="text-primary/50">
                      {caseItem.enactment_date}
                    </Text>
                  </Box>
                </Box>
              </Button>
            ))}
          </Box>
        )}
        {/* {cases.length !== 0 && (
          
        )} */}
      </ScrollArea>
      <Box className="flex flex-col bg-muted py-2 px-4 w-full">
        {caseCount || loadingCount ? (
          <Pagination>
            <PaginationContent>
              <PaginationItem hidden={page === 0}>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(0, page - 1) || 0)}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  isActive={page === 0}
                  onClick={() => setPage(0)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem
                hidden={
                  page !== 0 ||
                  Math.floor((caseCount - 1) / limit - 1 || 0) <= 1
                }
              >
                <PaginationLink
                  isActive={page === 1}
                  onClick={() => setPage(1)}
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem
                hidden={
                  page === 0 ||
                  page === Math.floor((caseCount - 1) / limit - 1 || 0)
                }
              >
                <PaginationLink isActive={true}>{page + 1}</PaginationLink>
              </PaginationItem>
              <PaginationItem
                hidden={Math.floor((caseCount - 1) / limit - 1 || 0) <= 1}
              >
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem
                hidden={Math.floor((caseCount - 1) / limit - 1 || 0) <= 0}
              >
                <PaginationLink
                  onClick={() =>
                    setPage(Math.floor((caseCount - 1) / limit - 1 || 0))
                  }
                  isActive={
                    page === Math.floor((caseCount - 1) / limit - 1 || 0)
                  }
                >
                  {Math.floor((caseCount - 1) / limit || 0) === -1 ||
                  loadingCount ? (
                    <LoaderIcon
                      className={
                        loadingCount ? "animate-spin inline h-4" : "hidden"
                      }
                    />
                  ) : (
                    Math.floor((caseCount - 1) / limit || 0)
                  )}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem
                hidden={
                  page === Math.floor((caseCount - 1) / limit - 1 || 0) ||
                  Math.floor((caseCount - 1) / limit - 1 || 0) <= 0
                }
              >
                <PaginationNext
                  onClick={() => setPage(Math.min(page + 1, caseCount - 1))}
                  isActive={page === Math.min(page + 1, caseCount - 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : (
          <Text weight={"bold"}>Showing 0 results</Text>
        )}
      </Box>
    </Box>
  );
}
