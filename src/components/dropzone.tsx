import { useState, useCallback } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import { useDropzone, type FileError } from "react-dropzone";
import { FileStats } from "./dropzone-helpers";
import Settings from "./settings";
import ThemeToggle from "./theme-toggle";

export default function UploadFile() {
  const { loadDatabase, setTables, setSelectedTable, db } = useSQLiteStore();
  const [errors, setErrors] = useState<FileError[]>([]);

  const onDrop = useCallback(
    async (
      acceptedFiles: File[],
      fileRejections: { file: File; errors: FileError[] }[],
    ) => {
      setErrors([]);
      setTables([]);
      setSelectedTable("0");

      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        await loadDatabase(selectedFile);
      }

      if (fileRejections.length > 0) {
        const rejectionErrors = fileRejections.flatMap(
          (rejection) => rejection.errors,
        );
        setErrors(rejectionErrors);
      }
    },
    [loadDatabase, setTables, setSelectedTable],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/vnd.sqlite3": [".sqlite", ".sqlite3"],
      "application/x-sqlite3": [".sqlite", ".sqlite3"],
      "application/octet-stream": [".db"],
      "application/sql": [".sql"],
    },
  });

  const renderDropzoneContent = (hasDatabase: boolean) => (
    <div className="flex items-center gap-2 justify-center h-full">
      <div
        {...getRootProps()}
        className={`grow h-full border p-6 rounded cursor-pointer text-center flex flex-col items-center justify-center ${
          hasDatabase ? "" : "py-32"
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
            href="https://github.com/vwh/sqlite-viewer/raw/main/db_examples/chinook.db"
            className="text-sm text-link hover:underline"
            title="Download sample file"
          >
            Or download & try this sample file
          </a>
        )}
      </div>
      {hasDatabase && (
        <div className="flex flex-col gap-1">
          <Settings />
          <ThemeToggle />
        </div>
      )}
    </div>
  );

  return (
    <section>
      {renderDropzoneContent(Boolean(db))}
      <div>
        <FileStats errors={errors} />
      </div>
    </section>
  );
}
