import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-4 font-semibold md:text-2xl p-10 border rounded">
      <AlertTriangle className="w-10 h-10" />
      {children}
    </div>
  );
}
