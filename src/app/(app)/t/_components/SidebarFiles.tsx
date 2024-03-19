import { CheckBox2 } from "@/components/ui/checkbox2";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Flex, Text, Box } from "@radix-ui/themes";

import { FileIcons } from "./FileIcons";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
type Args = {
  file: File;
  index: number;
  handleCheckboxChange: (index: number) => void;
  checkedFiles: number[];
};

export const FileItem: FC<Args> = ({
  file,
  index,
  handleCheckboxChange,
  checkedFiles,
}) => {
  const formatFileSize = (bytes: number, decimalPoint?: number) => {
    if (bytes === 0) return "0 Bytes";
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };
  return (
    <li className="h-12 w-full flex items-center justify-start rounded-lg p-[2px]">
      <CheckBox2
        checked={checkedFiles.includes(index)}
        onChange={() => handleCheckboxChange(index)}
      />
      <Flex className="w-full p-1 rounded-md items-center" justify="start">
        <Box className="p-2 rounded-md mr-1">
          <FileIcons fileType={file.type} />
        </Box>
        <Flex className="flex w-[90%] overflow-hidden">
          <Text className="text-md font-medium tracking-normal cursor-pointer">
            {`${file.name.slice(0, 22)} ${
              file.name.split(".")[0].length > 15
                ? "." + file.name.split(".")[1]
                : ""
            }`}
          </Text>
        </Flex>
      </Flex>
    </li>
  );
};

export const FileDeleteDialog = ({
  handleFileRemove,
  deleteload,
}: {
  handleFileRemove: () => void;
  deleteload: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleDelete = () => {
    handleFileRemove();
    !deleteload && setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="link" className="bg-blue-200">
          <TrashIcon className="w-[18px] h-[18px] text-black" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onKeyDown={(e) => e.key === "Enter" && handleDelete()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
        </DialogHeader>
        <Text size="2" className="mb-4">
          Are you sure you want to delete this file? This action cannot be
          undone.
        </Text>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button variant="destructive" type="button" onClick={() => handleDelete()}>
          {deleteload ? (
            <>
              <Loader2 className="w-8 h-8 animte-spin" />
              Files Deleting...
            </>
          ) : (
            "Confirm Delete"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
