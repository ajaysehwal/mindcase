"use client";

import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Databases } from "@/lib/db";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/Spinner";
import { createClient } from "@/lib/supabase/client";

interface DatabaseViewProps {
  params: { database_id: string };
}

export default function DatabaseView({
  params: { database_id },
}: DatabaseViewProps) {
  const router = useRouter();
  const supabase = createClient();
  const [db, setDb] = useState<Databases | null>();
  const [files, setFiles] = useState<FileObject[] | null>(null);
  const [fileLoading, setFileLoading] = useState(false);

  const loadDb = async (dbId: string) => {
    const { data } = await supabase
      .from("Databases")
      .select()
      .eq("id", dbId)
      .single();
    setDb(data);
    loadFiles(dbId);
  };

  const loadFiles = async (dbId: string) => {
    setFileLoading(true);
    const { data } = await supabase.storage.from("DatabaseDocs").list(dbId, {
      limit: 100,
      offset: 0,
    });

    console.log(data);
    setFiles(data);
    setFileLoading(false);
  };

  useEffect(() => {
    loadDb(database_id);
  }, [database_id]);

  const targetLink = (relatedDocuments: string[], file: FileObject) => {
    const newName = file.name.replace(/\s/g, "%20");
    return relatedDocuments?.find((url) => url.includes(newName)) || "";
  };

  return (
    <div className="w-full h-full flex flex-col items-center py-6 px-4 space-y-8">
      {db ? (
        <>
          <Label className="font-bold text-3xl">{db?.name}</Label>
          <div className="flex flex-col px-4 py-2 gap-1">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="">Related Docs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileLoading && <Spinner mt="16px" />}
                {!fileLoading &&
                  db?.relatedDocuments &&
                  files &&
                  files.map((file, i) => (
                    <TableRow
                      key={file.name}
                      className="cursor-pointer"
                      onClick={() => {
                        if (db.relatedDocuments) {
                          const url = targetLink(db.relatedDocuments, file);
                          router.replace(url);
                        }
                      }}
                    >
                      <TableCell className="flex justify-between">
                        <Label className="cursor-pointer">{file.name}</Label>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <Spinner width="28px" />
      )}
    </div>
  );
}
