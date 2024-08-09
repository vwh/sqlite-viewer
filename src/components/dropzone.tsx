import React, { useState, useCallback, useMemo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import {
  useDropzone,
  type FileError,
  type FileRejection
} from "react-dropzone";

import { toast } from "sonner";
import Settings from "@/components/settings/settings-drawer";
import ThemeModeToggle from "@/components/settings/theme-mode-toggle";

const ACCEPTED_TYPES = {
  "application/vnd.sqlite3": [".sqlite", ".sqlite3"],
  "application/x-sqlite3": [".sqlite", ".sqlite3"],
  "application/octet-stream": [".db"],
  "application/sql": [".sql"]
};

export default function UploadFile() {
  const { loadDatabase, setTables, setSelectedTable, db } = useSQLiteStore();
  const [errors, setErrors] = useState<FileError[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const rejectionErrors = fileRejections.flatMap(
          (rejection) => rejection.errors
        );
        setErrors(rejectionErrors);
        return;
      }

      setErrors([]);
      setTables([]);
      setSelectedTable("0");

      if (acceptedFiles.length > 0) {
        try {
          await loadDatabase(acceptedFiles[0]);
        } catch (error) {
          if (error instanceof Error) {
            return toast(error.message, { position: "bottom-right" });
          } else {
            return toast("Failed to load database", {
              position: "bottom-right"
            });
          }
        }
      }
    },
    [loadDatabase, setTables, setSelectedTable]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED_TYPES
  });

  const renderDropzoneContent = useCallback(
    (hasDatabase: boolean) => (
      <div className="flex w-full items-center justify-between gap-2">
        <div
          {...getRootProps()}
          className={`flex w-full grow transform cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors duration-300 ease-in-out hover:bg-secondary ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-primary dark:border-gray-700"
          } ${hasDatabase ? "py-7" : "py-12"}`}
        >
          <input id="file-upload" {...getInputProps()} />
          <label htmlFor="file-upload" className="sr-only">
            Upload SQLite File
          </label>
          <div className="text-center text-sm md:text-base">
            <span className="hidden sm:block lg:text-lg">
              Drag and drop file here, or click to select one
            </span>
            <div className="block sm:hidden">
              {hasDatabase ? (
                <span className="font-medium">Click to select a file</span>
              ) : (
                <span className="font-medium">
                  Click to select a SQLite file
                </span>
              )}
            </div>
          </div>
        </div>
        {hasDatabase && (
          <div className="flex flex-col gap-1">
            <ThemeModeToggle />
            <Settings />
          </div>
        )}
      </div>
    ),
    [getRootProps, getInputProps, isDragActive, db]
  );

  const memoizedContent = useMemo(
    () => renderDropzoneContent(Boolean(db)),
    [renderDropzoneContent, db]
  );

  return (
    <section className="mx-auto w-full">
      {memoizedContent}
      <FileStats errors={errors} />
    </section>
  );
}

const FileStats: React.FC<{ errors?: FileError[] }> = React.memo(
  ({ errors }) => {
    React.useEffect(() => {
      errors?.forEach((error) =>
        toast(error.message, { position: "bottom-right" })
      );
    }, [errors]);

    return null;
  }
);
