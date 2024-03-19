import Link from "next/link";

import { Box, Text } from "@radix-ui/themes";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useEffect, useState } from "react";
import { getCaseByIds } from "@/lib/db/cases";
import { Cases } from "@/lib/db";
import { Loader2Icon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function CasesDialog({ caseIds }: { caseIds: string[] }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [cases, setCases] = useState<Cases[]>([]);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      const supabase = createClient();
      const cases = await getCaseByIds(supabase, caseIds);
      setCases(cases);
      setLoading(false);
    };
    fetchCases();
  }, [caseIds]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={loading}>
          Cases{" "}
          {loading ? (
            <Loader2Icon className="animate-spin w-4 ml-2" />
          ) : (
            "(" + cases.length + ")"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 flex flex-col outline-none w-full sm:max-w-[700px]">
        <DialogHeader className="p-4 h-min w-full border-b">
          <DialogTitle>Cases ({cases.length})</DialogTitle>
          <DialogDescription>View all cases here.</DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search cases..." />
          <CommandList>
            <CommandEmpty>No cases found.</CommandEmpty>
            <CommandGroup className="p-2 h-full w-full flex flex-col">
              <Accordion type="single" collapsible>
                {cases.map((user) => (
                  <CommandItem
                    key={user.file_id}
                    className="w-full p-0 overflow-hidden border my-1"
                  >
                    <AccordionItem value={user.file_id} className="w-full">
                      <AccordionTrigger className="px-4 w-full">
                        <Link href={"/doc/" + user.file_id}>
                          {user.case_name}
                        </Link>
                        {/* {user.title} */}
                      </AccordionTrigger>
                      <AccordionContent>
                        <Box className="flex flex-col mx-4 overflow-hidden items-start">
                          <Text
                            size={"2"}
                            className="text-muted-foreground line-clamp-4"
                          >
                            {user.case_name}
                          </Text>
                          {/* <Button variant={"link"} className="p-0 text-xs" asChild> */}
                          {/* </Button> */}
                        </Box>
                      </AccordionContent>
                    </AccordionItem>
                  </CommandItem>
                ))}
              </Accordion>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
