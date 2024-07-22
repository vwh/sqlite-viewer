import type { FileError } from "react-dropzone";
import { bytesToValue } from "@/lib/file";

import { FileWarning, FileCheck } from "lucide-react";

export function FileData({ file }: { file: File }) {
  return (
    <li
      className="flex w-full items-center justify-center gap-2 font-mono text-sm"
      title={file.name}
    >
      <p className="max-w-[250px] truncate">{file.name}</p>
      <span className="text-xs font-semibold">{bytesToValue(file.size)}</span>
    </li>
  );
}

export function FileStats({ errors }: { errors?: FileError[] }) {
  return errors ? (
    <>
      {errors.map((error) => (
        <div
          className="flex items-center justify-center text-sm text-red-600 gap-2 rounded border border-red-600 p-4 mb-2"
          key={error.code}
        >
          <FileWarning />
          {error.message}
        </div>
      ))}
    </>
  ) : (
    <li className="flex w-full items-center justify-center text-sm text-green-600">
      <FileCheck className="mr-2" />
      Uploaded successfully
    </li>
  );
}
