import { LoaderIcon } from "lucide-react";

export default function Loading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-5 rounded border p-4 font-semibold">
      <LoaderIcon className="h-6 w-6 animate-spin" />
      <span className="ml-2 font-semibold">{children}</span>
    </div>
  );
}
