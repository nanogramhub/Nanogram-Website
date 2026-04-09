import { File as FileIcon, RefreshCw, Upload, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { type Accept, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { cn, formatFileSize } from "@/lib/utils";

interface FileUploaderProps {
  id: string;
  onFileChange: (file: File | null) => void;
  initialFileUrl?: string; // URL or name of existing file
  initialFileName?: string;
  acceptedFileTypes?: Accept;
  maxSize?: number; // in bytes
  className?: string;
  containerClassName?: string;
  dropzoneClassName?: string;
  fileInfoClassName?: string;
  label?: string;
  description?: string;
}

const FileUploader = ({
  onFileChange,
  initialFileUrl = "",
  initialFileName = "",
  acceptedFileTypes,
  maxSize,
  className,
  containerClassName,
  dropzoneClassName,
  fileInfoClassName,
  label = "Upload File",
  description = "Drag & drop or click to choose",
}: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>(initialFileName);
  const [fileUrl, setFileUrl] = useState<string>(initialFileUrl);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const droppedFile = acceptedFiles[0];
      if (droppedFile) {
        setFile(droppedFile);
        setFileName(droppedFile.name);
        setFileUrl(URL.createObjectURL(droppedFile));
        onFileChange(droppedFile);
      }
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes,
      maxSize: maxSize,
      multiple: false,
    });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setFileName("");
    setFileUrl("");
    onFileChange(null);
  };

  return (
    <div className={cn("w-full max-w-full mx-auto", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 transition-all cursor-pointer min-h-[160px] group hover:border-primary/50 hover:bg-muted/50",
          isDragActive && "border-primary bg-primary/5",
          (fileName || fileUrl) && "border-solid bg-muted/30",
          dropzoneClassName,
          containerClassName,
        )}
      >
        <input {...getInputProps()} />

        {fileName || fileUrl ? (
          <div
            className={cn(
              "relative w-full flex items-center gap-4 p-4 rounded-lg bg-background border border-border shadow-sm",
              fileInfoClassName,
            )}
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileIcon className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {fileName || "Selected file"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {file && (
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                )}
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium uppercase">
                  {file?.type.split("/")[1] ||
                    fileName.split(".").pop() ||
                    "File"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // The container click handles re-opening the dialog
                }}
              >
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={removeFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary/20">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-base">{label}</p>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                {description}
              </p>
            </div>
            {acceptedFileTypes && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {Object.values(acceptedFileTypes)
                  .flat()
                  .map((ext) => (
                    <span
                      key={ext}
                      className="text-[10px] bg-muted px-2 py-0.5 rounded border border-border text-muted-foreground uppercase font-semibold"
                    >
                      {ext.replace(".", "")}
                    </span>
                  ))}
              </div>
            )}
          </div>
        )}

        {fileRejections.length > 0 && (
          <div className="mt-4 p-2 w-full bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs text-center">
            {fileRejections[0].errors[0].message}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
