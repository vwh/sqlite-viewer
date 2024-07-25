import type { FileError } from "react-dropzone";
import { bytesToValue } from "@/lib/file";

import { toast } from "sonner";

export function FileData({ file }: { file: File }) {
  return (
    <li
      className="flex w-full items-center justify-center gap-2 font-mono text-sm"
      title={file.name}
    >
      <p className="max-w-[250px] truncate font-semibold">{file.name}</p>
      <span className="text-xs font-semibold">{bytesToValue(file.size)}</span>
    </li>
  );
}

export function FileStats({ errors }: { errors?: FileError[] }) {
  errors && (
    <>
      {errors.map((error) =>
        toast(error.message, { position: "bottom-right" })
      )}
    </>
  );
  return <></>;
}
