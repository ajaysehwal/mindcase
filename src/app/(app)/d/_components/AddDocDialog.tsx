"use client";

import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { AddDocs } from "./AddDocs";
import { Databases } from "@/lib/db";
import { NewDbType } from "../page";

interface AddDocDialogProps {
  dbId: string;
  databases: Databases[];
  loadDatabases: () => Promise<void>;
}

export function AddDocDialog({
  dbId,
  databases,
  loadDatabases,
}: AddDocDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDb, setSelectedDb] = useState<NewDbType>(null);

  const selectDb = (id: string) => {
    const db = databases.find((d) => d.id === id);
    if (selectedDb?.id === id) {
      return;
    }
    if (db) {
      setSelectedDb(db);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>
        <Button
          id="upload-button"
          variant="outline"
          className={`w-auto whitespace-nowrap ${
            selectedDb?.id === dbId &&
            selectedDb.relatedDocuments?.length! < 1 &&
            "border-red-300"
          }`}
          onClick={() => {
            selectDb(dbId);
          }}
        >
          <UploadCloud size={"20"} className="mr-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Related Documents</DialogTitle>
        </DialogHeader>
        <AddDocs dbId={dbId} setOpen={setOpen} loadDatabases={loadDatabases} />
      </DialogContent>
    </Dialog>
  );
}
