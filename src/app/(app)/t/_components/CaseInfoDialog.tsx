"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react";

import { Courier_Prime } from "next/font/google";
import { Box, Text } from "@radix-ui/themes";

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: "400",
});

interface Props {
  children: JSX.Element;
  caseInfo: {
    category: string;
    fileID: string;
    pdf_link: string;
    court: string | null;
  };
}
export function CasesInformationDialog({ children, caseInfo }: Props) {
  const [open, setOpen] = useState(false);
  // const [blobUrl, setBlobUrl] = useState("");

  // useEffect(() => {
  // const getcaseInfo.pdf_link = async () => {
  // try {
  //   const resp = await fetch(caseInfo.pdf_link);
  //   const blob = new Blob([await resp.blob()], { type: "application/pdf" });
  //   const caseInfo.pdf_link = URL.createObjectURL(blob);
  //   setcaseInfo.pdf_link(caseInfo.pdf_link);
  // } catch (error) {
  //   console.error("error getting blob url from pdf");
  // }
  // };
  // getcaseInfo.pdf_link();
  // return () => {
  // caseInfo.pdf_link && URL.revokeObjectURL(caseInfo.pdf_link);
  // };
  // }, []);

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-[90%] w-full">
        {caseInfo.fileID === null ? (
          <Box className="flex flex-col flex-1 h-full w-full p-4 justify-center text-center">
            <Text size={"2"} weight={"bold"}>
              No case selected
            </Text>
          </Box>
        ) : (
          <></>
        )}
        <Box height={"100%"} width={"100%"} className={courier.className}>
          {caseInfo.category === "Acts" && (
            <iframe
              loading="lazy"
              src={`${caseInfo.pdf_link}#toolbar=0&navpanes=0`}
              width="100%"
              height="100%"
            />
          )}
          {caseInfo.category === "CaseLaws" && (
            <iframe
              loading="lazy"
              src={caseInfo.pdf_link}
              width="100%"
              height="100%"
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
