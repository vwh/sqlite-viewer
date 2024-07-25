import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-5 font-semibold p-4 border rounded">
      <AlertTriangle className="w-6 h-6" />
      {children}
    </div>
  );
}
