import { LoaderIcon } from "lucide-react";

export default function Loading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded border p-4">
      <LoaderIcon className="h-6 w-6 animate-spin" />
      <span className="font-semibold">{children}</span>
    </div>
  );
}
