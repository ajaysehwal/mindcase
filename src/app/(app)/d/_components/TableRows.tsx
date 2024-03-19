"use client";

import { useEffect, SetStateAction, Dispatch } from "react";
import { TableRow, TableBody, TableCell } from "@/components/ui/table";
import { fetchDatabases } from "@/lib/db/databases";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AddDocDialog } from "./AddDocDialog";
import { Databases } from "@/lib/db";

interface TableRowsProps {
  databases: Databases[];
  setDatabases: Dispatch<SetStateAction<Databases[]>>;
}

export function TableRows({ databases, setDatabases }: TableRowsProps) {
  const supabase = createClient();
  const router = useRouter();

  const loadDatabases = async () => {
    const data = await fetchDatabases(supabase);
    if (data) {
      setDatabases(data);
    }
  };

  useEffect(() => {
    loadDatabases();
  }, []);

  return (
    <TableBody>
      {databases.map(async (d, i) => {
        const files = await supabase.storage.from("DatabaseDocs").list(d.id, {
          limit: 100,
          offset: 0,
        });
        return (
          <TableRow key={i} className="">
            <TableCell
              className="font-medium cursor-pointer"
              onClick={() => {
                router.push(`/d/${d.id}`);
              }}
            >
              {d.name}
            </TableCell>
            <TableCell
              className="cursor-pointer"
              onClick={() => {
                router.push(`/d/${d.id}`);
              }}
            >
              {d.has_access}
            </TableCell>
            <TableCell className="flex justify-between">
              <div className="flex gap-2">
                {d.relatedDocuments &&
                  files.data &&
                  files.data.map((f, i) => (
                    <a
                      key={i}
                      href={d.relatedDocuments?.find((url) => {
                        if (f.name.includes(" ")) {
                        }
                        const newName = f.name.replace(/\s/g, "%20");
                        return url.includes(newName);
                      })}
                      className="underline"
                    >
                      {f.name}
                    </a>
                  ))}
              </div>
              <AddDocDialog
                dbId={d.id}
                databases={databases}
                loadDatabases={loadDatabases}
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
