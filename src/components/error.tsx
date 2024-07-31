import { AlertTriangleIcon } from "lucide-react";

export default function ErrorMessage({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-3 rounded border p-4">
      <AlertTriangleIcon className="h-6 w-6" />
      <span className="font-semibold">{children}</span>
    </div>
  );
}
