import { type ReactNode, memo } from "react";

import {
  AlertTriangleIcon,
  Loader2Icon,
  CheckCircleIcon,
  InfoIcon
} from "lucide-react";

const MemoizedLoaderIcon = memo(Loader2Icon);

type MessageType = "error" | "loading" | "success" | "info";

interface StatusMessageProps {
  type: MessageType;
  children: ReactNode;
  className?: string;
}

export default function StatusMessage({
  type,
  children,
  className = ""
}: StatusMessageProps) {
  let icon: ReactNode;
  let typeClasses: string;

  switch (type) {
    case "error":
      icon = <AlertTriangleIcon className="mr-3 h-6 w-6 text-red-500" />;
      typeClasses = "bg-red-100 text-red-800 border-l-4 border-red-500";
      break;
    case "loading": {
      icon = (
        <MemoizedLoaderIcon className="mr-3 h-6 w-6 animate-spin text-blue-500" />
      );
      typeClasses = "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
      break;
    }
    case "success":
      icon = <CheckCircleIcon className="mr-3 h-6 w-6 text-green-500" />;
      typeClasses = "bg-green-100 text-green-800 border-l-4 border-green-500";
      break;
    case "info":
      icon = <InfoIcon className="mr-3 h-6 w-6 text-yellow-500" />;
      typeClasses =
        "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500";
      break;
    default:
      icon = null;
      typeClasses = "";
  }

  return (
    <div
      className={`flex items-center rounded-lg p-4 shadow-md ${typeClasses} ${className}`}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </div>
  );
}
