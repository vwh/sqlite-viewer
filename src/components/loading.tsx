import { Loader } from "lucide-react";

export default function Loading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-5font-semibold p-4 border rounded">
      <Loader className="w-6 h-6 animate-spin" />
      <span className="ml-2 font-semibold">{children}</span>
    </div>
  );
}
