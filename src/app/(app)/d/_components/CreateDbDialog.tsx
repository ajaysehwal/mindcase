"use client";

import { FolderPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { CreateDb } from "./CreateDb";
import { NewDbType } from "../page";

interface CreateDBDialogProps {
  createNewDatabase: (values: any) => Promise<NewDbType>;
}
export function CreateDbDialog({ createNewDatabase }: CreateDBDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>
        <Button variant={"default"} className="w-auto whitespace-nowrap">
          <FolderPlusIcon size={"20"} className="mr-2" />
          Add Database
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Database</DialogTitle>
        </DialogHeader>
        <CreateDb setOpen={setOpen} createNewDatabase={createNewDatabase} />
      </DialogContent>
    </Dialog>
  );
}
