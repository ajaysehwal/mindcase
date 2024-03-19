"use client";

import { Table, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Box, Flex, Grid, Heading } from "@radix-ui/themes";
import { Loader2Icon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { createDatabase } from "@/lib/db/databases";
import { Suspense, useState } from "react";
import { Databases } from "@/lib/db";
import { CreateDbDialog } from "./_components/CreateDbDialog";
import { createClient } from "@/lib/supabase/client";
import { TableRows } from "./_components/TableRows";

export type NewDbType = {
  created_at: string | null;
  created_by: string | null;
  has_access: "Onlyme" | "Everyone" | null;
  id: string;
  name: string;
  relatedDocuments: string[] | null;
} | null;

export default function Home() {
  const supabase = createClient();
  const [databases, setDatabases] = useState<Databases[]>([]);

  const createNewDatabase = async (values: any): Promise<NewDbType> => {
    const data = await createDatabase(supabase, values);
    if (data) {
      setDatabases((p) => [...p, data]);
    }
    return data;
  };

  return (
    <Box className="flex flex-col h-full w-full">
      <ScrollArea className="h-[calc(100%-4rem)] w-full">
        <Box className="h-full w-full flex flex-col px-10 py-8 space-y-8">
          {/* Body Heading */}
          <Flex justify={"between"} align={"center"}>
            <Heading size="6">Databases</Heading>
            <Flex className="w-full space-x-4 max-w-[500px] items-center">
              <Flex className="flex-1 space-x-4 items-center">
                <Search size={20} className="hidden md:flex" />
                <Input placeholder="Search" className="w-full hidden md:flex" />
              </Flex>
              <CreateDbDialog createNewDatabase={createNewDatabase} />
            </Flex>
          </Flex>

          {/* Body Content */}
          <Grid className="h-full w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Name</TableHead>
                  <TableHead className="">Who has access</TableHead>
                  <TableHead className="w-[60%]">Related Docs</TableHead>
                </TableRow>
              </TableHeader>
              <Suspense
                fallback={
                  <Box className="flex items-center justify-center py-12">
                    <Loader2Icon className="h-8 w-8 animate-spin mr-2" />
                    <Box className="text-xl font-medium text-gray-900">
                      Loading...
                    </Box>
                  </Box>
                }
              >
                <TableRows databases={databases} setDatabases={setDatabases} />
              </Suspense>
            </Table>
          </Grid>
        </Box>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </Box>
  );
}
