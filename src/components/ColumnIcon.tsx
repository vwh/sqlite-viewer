import { memo } from "react";
import {
  isDate,
  isNumber,
  isText,
  isBlob,
  isBoolean,
} from "@/lib/sqlite-type-check";

import type { TableSchemaRow } from "@/types";

import {
  KeyRoundIcon,
  KeySquareIcon,
  CuboidIcon,
  CalendarIcon,
  TypeIcon,
  HashIcon,
  ToggleLeftIcon,
  HelpCircleIcon,
} from "lucide-react";

export const ColumnIcon: React.FC<{ columnSchema: TableSchemaRow }> = memo(
  ({ columnSchema }) => {
    if (!columnSchema) return null; // Avoids errors when it's undefined

    const { type, isPrimaryKey, isForeignKey } = columnSchema;

    const typeIcon = isBlob(type) ? (
      <CuboidIcon className="h-4 w-4 text-green-500" />
    ) : isDate(type) ? (
      <CalendarIcon className="h-4 w-4 text-blue-500" />
    ) : isText(type) ? (
      <TypeIcon className="h-4 w-4 text-indigo-500" />
    ) : isNumber(type) ? (
      <HashIcon className="h-4 w-4 text-red-500" />
    ) : isBoolean(type) ? (
      <ToggleLeftIcon className="h-4 w-4 text-pink-500" />
    ) : (
      <HelpCircleIcon className="h-4 w-4 text-gray-500" />
    );

    if (isPrimaryKey)
      return <KeyRoundIcon className="h-4 w-4 text-yellow-500" />;
    if (isForeignKey)
      return <KeySquareIcon className="h-4 w-4 text-purple-500" />;
    return typeIcon;

    // return (
    //   <div className="flex items-center gap-[2px]">
    //     {isPrimaryKey && <KeyRoundIcon className="h-4 w-4 text-yellow-500" />}
    //     {isForeignKey && <KeySquareIcon className="h-4 w-4 text-purple-500" />}
    //     {typeIcon}
    //   </div>
    // );
  }
);
