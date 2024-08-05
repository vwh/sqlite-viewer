import React from "react";
import {
  AlertTriangleIcon,
  LoaderIcon,
  CheckCircleIcon,
  TextSearchIcon
} from "lucide-react";

type MessageType = "error" | "loading" | "success" | "info";

interface StatusMessageProps {
  type: MessageType;
  children: React.ReactNode;
  className?: string;
}

export default function StatusMessage({
  type,
  children,
  className
}: StatusMessageProps) {
  let icon;
  switch (type) {
    case "error":
      icon = <AlertTriangleIcon className="h-6 w-6 text-red-500" />;
      break;
    case "loading":
      icon = <LoaderIcon className="h-6 w-6 animate-spin" />;
      break;
    case "success":
      icon = <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      break;
    case "info":
      icon = <TextSearchIcon className="h-6 w-6" />;
      break;
    default:
      icon = null;
  }

  return (
    <div
      className={`${className} flex items-center justify-center gap-3 rounded border p-4`}
    >
      {icon}
      <span className="font-semibold">{children}</span>
    </div>
  );
}
