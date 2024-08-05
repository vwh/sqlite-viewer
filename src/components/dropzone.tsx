import React, { useState, useCallback, useMemo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import {
  useDropzone,
  type FileError,
  type FileRejection
} from "react-dropzone";

import { toast } from "sonner";
import Settings from "./settings";
import ThemeModeToggle from "./theme-mode-toggle";

const ACCEPTED_TYPES = {
  "application/vnd.sqlite3": [".sqlite", ".sqlite3"],
  "application/x-sqlite3": [".sqlite", ".sqlite3"],
  "application/octet-stream": [".db"],
  "application/sql": [".sql"]
};

const EXAMPLES = {
  CHINOOK:
    "https://github.com/vwh/sqlite-viewer/raw/main/db_examples/chinook.db"
};

export default function UploadFile() {
  const { loadDatabase, setTables, setSelectedTable, db } = useSQLiteStore();
  const [errors, setErrors] = useState<FileError[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setErrors([]);
      setTables([]);
      setSelectedTable("0");

      if (acceptedFiles.length > 0) {
        await loadDatabase(acceptedFiles[0]);
      }

      if (fileRejections.length > 0) {
        const rejectionErrors = fileRejections.flatMap(
          (rejection) => rejection.errors
        );
        setErrors(rejectionErrors);
      }
    },
    [loadDatabase, setTables, setSelectedTable]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED_TYPES
  });

  const renderDropzoneContent = useCallback(
    (hasDatabase: boolean) => (
      <div
        className={`flex h-full items-center justify-center gap-2 ${hasDatabase ? "px-[10px]" : "px-0"}`}
      >
        <div
          {...getRootProps()}
          className={`flex h-full grow cursor-pointer flex-col items-center justify-center rounded border p-6 text-center ${
            hasDatabase ? "py-0" : "py-32"
          }`}
        >
          <input id="file-upload" {...getInputProps()} />
          <label htmlFor="file-upload" className="sr-only">
            Upload SQLite File
          </label>
          <p className="hidden sm:block">
            Drag and drop a SQLite file here, or click to select one
          </p>
          <p className="block sm:hidden">
            {hasDatabase
              ? "Click to select a file"
              : "Click to select a SQLite file"}
          </p>
          {!hasDatabase && (
            <a
              href={EXAMPLES.CHINOOK}
              className="text-sm text-link hover:underline"
              title="Download sample file"
            >
              Or download & try this sample file
            </a>
          )}
        </div>
        {hasDatabase && (
          <div className="flex flex-col gap-1">
            <ThemeModeToggle />
            <Settings />
          </div>
        )}
      </div>
    ),
    [getRootProps, getInputProps]
  );

  const memoizedContent = useMemo(
    () => renderDropzoneContent(Boolean(db)),
    [renderDropzoneContent, db]
  );

  return (
    <section>
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
