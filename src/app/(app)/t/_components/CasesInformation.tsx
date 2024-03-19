"use client";

import { Flex } from "@radix-ui/themes";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { cn, getMappedCourtName } from "@/lib/utils";
import { Acts, Cases } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { CasesInformationDialog } from "./CaseInfoDialog";

interface Props {
  cases: Cases[];
  acts: Acts[];
}

export const CasesInformation = ({ cases, acts }: Props) => {
  return (
    <Flex className={cn("gap-2 overflow-y-hidden scroll-m-8")}>
      {!cases.length && !acts.length && (
        <Label className="opacity-70 ml-2">No results found</Label>
      )}
      {cases.length ? (
        cases.map((c, index) => (
          <CasesCard key={index} index={index} caseInfo={c} />
        ))
      ) : (
        <></>
      )}
      {acts.length ? (
        acts.map((c, index) => (
          <CasesCard
            key={index + cases.length}
            index={index + cases.length}
            actInfo={c}
          />
        ))
      ) : (
        <></>
      )}
    </Flex>
  );
};

interface CasesCardProps {
  index: number;
  caseInfo?: Cases;
  actInfo?: Acts;
}

const CasesCard = ({ index, caseInfo, actInfo }: CasesCardProps) => {
  const supabase = createClient();
  const [pdfLink, setPdfLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (caseInfo) {
      const courtName = getMappedCourtName(caseInfo?.court!);
      if (courtName) {
        const { data } = supabase.storage
          .from("Cases")
          .getPublicUrl(`${courtName}/${caseInfo?.file_id}`);
        setPdfLink(data.publicUrl);
        // console.log(data.publicUrl);
      }
    } else if (actInfo) {
      const { data } = supabase.storage
        .from("Acts")
        .getPublicUrl(`central/${actInfo.pdf_link}`);
      // console.log(data.publicUrl);
      setPdfLink(data.publicUrl);
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      {caseInfo ? (
        <CasesInformationDialog
          caseInfo={{
            category: "CaseLaws",
            pdf_link: pdfLink,
            fileID: caseInfo.file_id,
            court: getMappedCourtName(caseInfo.court),
          }}
        >
          <Card className="relative hover:shadow-md hover:bg-primary-foreground cursor-pointer h-28 w-[220px]">
            <CardContent className="p-4 text-start">
              <p className="text-sm absolute top-1 right-2 text-gray-400">
                {index + 1}
              </p>
              <h3 className="text-sm flex-wrap text-ellipsis">
                {(caseInfo.case_name || "").length > 70
                  ? `${caseInfo.case_name?.substring(0, 70)}...`
                  : caseInfo.case_name}
              </h3>
            </CardContent>
          </Card>
        </CasesInformationDialog>
      ) : actInfo ? (
        <CasesInformationDialog
          caseInfo={{
            category: "Acts",
            pdf_link: pdfLink,
            fileID: actInfo.pdf_link,
            court: "central",
          }}
        >
          <Card className="relative hover:shadow-md hover:bg-primary-foreground cursor-pointer h-28 w-[220px]">
            <CardContent className="p-4 text-start">
              <p className="text-sm absolute top-1 right-2 text-gray-400">
                {index + 1}
              </p>
              <h3 className="text-sm flex-wrap text-ellipsis">
                {(actInfo.act_name || "").length > 70
                  ? `${actInfo.act_name?.substring(0, 70)}...`
                  : actInfo.act_name}
              </h3>
            </CardContent>
          </Card>
        </CasesInformationDialog>
      ) : (
        <></>
      )}
    </>
  );
};
