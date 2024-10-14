import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  "application/vnd.sqlite3": [".sqlite", ".sqlite3", ".db", ".sqlitedb"],
  "application/x-sqlite3": [".sqlite", ".sqlite3", ".db", ".sqlitedb"],
  "application/sqlite3": [".sqlite", ".sqlite3", ".db", ".sqlitedb"],
  "application/octet-stream": [".sqlite", ".sqlite3", ".db", ".sqlitedb"],
  "application/sql": [".sql"],
  "application/x-sql": [".sql"],
  "text/x-sql": [".sql"],
  "text/sql": [".sql"],
  "text/x-sqlite3": [".sql", ".sqlite", ".sqlite3", ".db", ".sqlitedb"],
  "text/x-sqlite": [".sql", ".sqlite", ".sqlite3", ".db", ".sqlitedb"],
  "text/sqlite": [".sql", ".sqlite", ".sqlite3", ".db", ".sqlitedb"],
  "text/x-sqlite3-dump": [".sql"],
  "text/x-sqlite-dump": [".sql"],
  "text/sqlite-dump": [".sql"]
};

export default function UploadFile() {
  const { loadDatabaseBytes, db } = useSQLiteStore();

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
      if (acceptedFiles.length > 0) {
        try {
          const bytes = new Uint8Array(await acceptedFiles[0].arrayBuffer());
          await loadDatabaseBytes(bytes);
        } catch (error) {
          if (error instanceof Error) {
            return toast(error.message, { position: "bottom-right" });
          }
          return toast("Failed to load database", {
            position: "bottom-right"
          });
        }
      }
    },
    [loadDatabaseBytes]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED_TYPES
  });

  const MemoizedDrop = useMemo(
    (hasDatabase = Boolean(db)) => (
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
    [db, getRootProps, getInputProps, isDragActive]
  );

  return (
    <section className="mx-auto w-full">
      {MemoizedDrop}
      <FileStats errors={errors} />
    </section>
  );
}

const FileStats: React.FC<{ errors?: FileError[] }> = React.memo(
  ({ errors }) => {
    useEffect(() => {
      if (errors) {
        for (const error of errors) {
          toast(error.message, { position: "bottom-right" });
        }
      }
    }, [errors]);
    return null;
  }
);
