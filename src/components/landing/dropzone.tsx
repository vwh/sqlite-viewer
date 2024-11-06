import { useState, useEffect, useCallback, useMemo, memo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import {
  useDropzone,
  type FileError,
  type FileRejection
} from "react-dropzone";

import { toast } from "sonner";

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

function UploadFile() {
  const { loadDatabaseBytes, setDatabaseData } = useSQLiteStore();

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
          const file = acceptedFiles[0];
          const bytes = new Uint8Array(await file.arrayBuffer());
          setDatabaseData({ name: file.name, size: file.size });
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
    [loadDatabaseBytes, setDatabaseData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED_TYPES
  });

  const MemoizedDrop = useMemo(
    () => (
      <div className="flex w-full items-center justify-between gap-2">
        <div
          {...getRootProps()}
          className={`flex w-full grow transform cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-100/50 p-6 transition-colors duration-300 ease-in-out hover:bg-secondary dark:bg-gray-700/50 ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-primary py-12 dark:border-gray-700"
          }`}
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
              <span className="text-lg font-medium">
                Click to select a SQLite file
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    [getRootProps, getInputProps, isDragActive]
  );

  return (
    <section className="mx-auto w-full">
      {MemoizedDrop}
      <FileStats errors={errors} />
    </section>
  );
}

const FileStats: React.FC<{ errors?: FileError[] }> = memo(({ errors }) => {
  useEffect(() => {
    if (errors) {
      for (const error of errors) {
        toast(error.message, { position: "bottom-right" });
      }
    }
  }, [errors]);
  return null;
});

export default memo(UploadFile);
