import { useState, useCallback } from "react";
import useSQLiteStore from "../store/useSQLiteStore";
import { useDropzone, type FileError } from "react-dropzone";

import { FileStats, FileData } from "./dropzone-helpers";

interface DropzoneProps {
  isLandingPage?: boolean;
}

export function UploadFile({ isLandingPage = false }: DropzoneProps) {
  const { loadDatabase, setTables, setSelectedTable } = useSQLiteStore();
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FileError[]>([]);

  const onDrop = useCallback(
    async (
      acceptedFiles: File[],
      fileRejections: { file: File; errors: FileError[] }[]
    ) => {
      setErrors([]);
      setTables([]);
      setSelectedTable("0");

      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        await loadDatabase(selectedFile);
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
    accept: {
      "application/vnd.sqlite3": [".sqlite", ".sqlite3"],
      "application/x-sqlite3": [".sqlite", ".sqlite3"],
      "application/octet-stream": [".db"],
      "application/sql": [".sql"],
    },
  });

  return (
    <section>
      {isLandingPage ? (
        <div
          {...getRootProps()}
          className="border p-6 py-24 rounded cursor-pointer text-center"
        >
          <input {...getInputProps()} />
          <p>Drag drop a SQLite file here, or click to select one</p>
          <a
            href="https://github.com/vwh/sqlite-viewer/examples/chinook.db"
            className="text-sm text-[#003B57] hover:underline"
          >
            … or download & try this sample file
          </a>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="border p-6 rounded cursor-pointer text-center"
        >
          <input {...getInputProps()} />
          <p>Drag drop a SQLite file here, or click to select one</p>
        </div>
      )}
      <div className="my-2">
        {file && <FileData file={file} />}
        <FileStats errors={errors} />
      </div>
    </section>
  );
}
