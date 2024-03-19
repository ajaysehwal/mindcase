import { Courier_Prime } from "next/font/google";

import { Box, Text } from "@radix-ui/themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cases } from "@/lib/db";
import { Json } from "@/lib/db/database.types";

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: "400",
});

export default function CasePdfViewer({
  category,
  fileID,
  pdf_link,
}: {
  category: string;
  fileID?: string | null;
  pdf_link?: string | null;
}) {
  if (fileID === null)
    return (
      <Box className="flex flex-col flex-1 h-full w-full p-4 justify-center text-center">
        <Text size={"2"} weight={"bold"}>
          No case selected
        </Text>
      </Box>
    );

  return (
    <Box height={"100%"} width={"100%"} className={courier.className}>
      {category === "CaseLaws" && (
        <iframe
          src="/test.pdf#toolbar=0&navpanes=0"
          width="100%"
          height="100%"
        />
      )}
      {category === "Acts" && (
        <iframe
          src={`https://epejgyynilwwbovbqxwz.supabase.co/storage/v1/object/public/Acts/central/${pdf_link!}#toolbar=0&navpanes=0`}
          width="100%"
          height="100%"
        />
      )}
    </Box>
  );
}
