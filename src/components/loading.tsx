import useSQLiteStore from "@/store/useSQLiteStore";

import { Loader } from "lucide-react";

export default function Loading() {
  const { isLoading } = useSQLiteStore();
  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center mb-2 font-semibold p-4 border rounded">
          <Loader className="w-5 h-5 animate-spin" />
          <span className="ml-2">Reading SQLite file</span>
        </div>
      )}
    </>
  );
}
