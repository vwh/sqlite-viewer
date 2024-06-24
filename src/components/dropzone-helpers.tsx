import type { FileError } from "react-dropzone";
import { bytesToValue } from "../lib/file.ts";

import { FileWarning, FileCheck } from "lucide-react";

export function FileData({ file }: { file: File }) {
  return (
    <>
      <li
        className="flex w-full items-center justify-center gap-2 font-mono text-sm"
        title={file.name}
      >
        <p className="max-w-[250px] truncate">{file.name}</p>
        <span className="text-xs font-semibold">{bytesToValue(file.size)}</span>
      </li>
    </>
  );
}

export function FileStats({ errors }: { errors?: FileError[] }) {
  if (errors)
    return (
      <>
        {errors.map((e) => {
          if (e.code !== "file-too-large") {
            return (
              <li
                className="flex w-full items-center justify-center text-sm text-red-600"
                key={e.code}
              >
                <FileWarning className="mr-2" />
                {e.message}
              </li>
            );
          }
        })}
      </>
    );

  return (
    <li className="flex w-full items-center justify-center text-sm text-green-600">
      <FileCheck className="mr-2" />
      Uploaded successfully
    </li>
  );
}
