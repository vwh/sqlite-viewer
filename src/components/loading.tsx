import { Loader } from "lucide-react";

export default function Loading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center mb-2 font-semibold p-4 border rounded">
      <Loader className="w-5 h-5 animate-spin" />
      <span className="ml-2">{children}</span>
    </div>
  );
}
