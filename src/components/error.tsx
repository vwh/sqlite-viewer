import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-5 rounded border p-4 font-semibold">
      <AlertTriangle className="h-6 w-6" />
      {children}
    </div>
  );
}
