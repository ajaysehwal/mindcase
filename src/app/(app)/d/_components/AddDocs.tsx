"use client";

import Dropzone, { Accept, DropEvent, FileRejection } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { createClient } from "@/lib/supabase/client";

interface AddDocsProps {
  dbId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loadDatabases: () => Promise<void>;
}

export function AddDocs({ dbId, setOpen, loadDatabases }: AddDocsProps) {
  const supabase = createClient();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [eachFileLoading, setEachFileLoading] = useState<
    { filePath: string; loading: boolean }[]
  >([]);

  const handleDrop = async (
    acceptedFiles: File[]
    // fileRejections: FileRejection[],
    // event: DropEvent
  ) => {
    // console.log("acceptedFiles", acceptedFiles);
    // console.log("fileRejections", fileRejections);
    // console.log("event", event);
    setFiles((pf) => [...pf, ...acceptedFiles]);
    const fileUrlPromises = acceptedFiles.map(async (file, index) => {
      const filePath = `${dbId}/${file.name}`;
      setEachFileLoading((p) => [...p, { filePath: filePath, loading: true }]);
      const uploadedFile = await supabase.storage
        .from("DatabaseDocs")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadedFile.error) {
        return "";
      }
      const url = await supabase.storage
        .from("DatabaseDocs")
        .createSignedUrl(uploadedFile.data.path, 6000000);
      return url.data?.signedUrl || "";
    });
    const fileUrls = await Promise.all(fileUrlPromises);
    const urls = fileUrls.filter((url) => url.length > 0);
    setFileUrls(urls);
    setEachFileLoading([]);
  };

  const handleFileRemove = (index: number) => {
    const updatedFiles = [...files];
    const filePath = `${dbId}/${updatedFiles[index].name}`;
    supabase.storage
      .from("DatabaseDocs")
      .remove([filePath])
      .then(({ data }) => {
        console.log(data);
      });

    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleFinisingUpload = async () => {
    setLoading(true);
    try {
      supabase
        .from("Databases")
        .select("relatedDocuments")
        .eq("id", dbId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            return;
          }
          const prevRelatedDocuments: string[] = data.relatedDocuments || [""];
          supabase
            .from("Databases")
            .update({
              relatedDocuments: [...prevRelatedDocuments, ...fileUrls],
            })
            .eq("id", dbId)
            .then(({ error }) => {
              if (error) {
                console.error(error.message);
                return;
              }
              loadDatabases();
              setFiles([]);
              setOpen(false);
            });
        });
    } catch (error) {
      console.error("Error in handleUpload:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className=" grid gap-2 p-20 text-center border border-solid border-gray-300 rounded-lg">
        <Dropzone onDrop={handleDrop} accept={allowedFileTypes}>
          {({ getRootProps, getInputProps }) => (
            <section {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Upload your files or drag and drop here</p>
              <p className="text-sm text-gray-500">
                Supported file formats: .doc, .docx, .eml, .htm, .html, .pdf,
                .rtf, .txt, .wpd
              </p>
            </section>
          )}
        </Dropzone>
        {files.length > 0 && (
          <ul className="mt-4 gap-2 flex flex-wrap justify-center h-[50%] overflow-y-scroll overflow-x-clip">
            {files.map((file, index) => (
              <li
                key={index}
                className="w-full flex items-center gap-4 p-2 rounded-lg"
              >
                <Label className="w-[50%]">{file.name}</Label>
                <Button
                  size="icon"
                  variant="destructive"
                  className="w-[28px] h-[28px]"
                  onClick={() => handleFileRemove(index)}
                >
                  <TrashIcon size={12} />
                </Button>
                {eachFileLoading.find((fl) =>
                  fl.filePath.includes(file.name)
                ) && <Spinner />}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <Button
          className=""
          type="button"
          onClick={handleFinisingUpload}
          disabled={eachFileLoading.length > 0}
        >
          {loading ? <Spinner /> : <Label>Done</Label>}
        </Button>
      </div>
    </div>
  );
}

const allowedFileTypes: Accept = {
  ".doc": ["application/msword"],
  ".docx": [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ".eml": ["message/rfc822"],
  ".htm": ["text/html"],
  ".html": ["text/html"],
  ".pdf": ["application/pdf"],
  ".rtf": ["application/rtf"],
  ".txt": ["text/plain"],
  ".wpd": ["application/wordperfect"],
};
