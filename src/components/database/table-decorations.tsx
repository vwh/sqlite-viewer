import React from "react";

import type { ColumnSchema } from "@/types";

import {
  isDate,
  isNumber,
  isText,
  isBlob,
  isBoolean
} from "@/lib/sqlite-type-check";

import {
  KeyRoundIcon,
  KeySquareIcon,
  CuboidIcon,
  CalendarIcon,
  TypeIcon,
  HashIcon,
  ToggleLeftIcon,
  HelpCircleIcon
} from "lucide-react";

export const KeyIcon: React.FC<{ columnSchema: ColumnSchema }> = React.memo(
  ({ columnSchema }) => {
    return (
      <>
        {columnSchema?.isPrimaryKey && (
          <p className="text-sm font-semibold text-yellow-600">(Primary)</p>
        )}
        {columnSchema?.isForeignKey && (
          <p className="text-sm font-semibold text-purple-600">(Foreign)</p>
        )}
      </>
    );
  }
);

export const ColumnIcon: React.FC<{ columnSchema: ColumnSchema }> = React.memo(
  ({ columnSchema }) => {
    const { type, isPrimaryKey, isForeignKey } = columnSchema;

    if (isPrimaryKey)
      return <KeyRoundIcon className="h-4 w-4 text-yellow-500" />;
    if (isForeignKey)
      return <KeySquareIcon className="h-4 w-4 text-purple-500" />;

    if (type) {
      if (isBlob(type))
        return <CuboidIcon className="h-4 w-4 text-green-500" />;
      if (isDate(type))
        return <CalendarIcon className="h-4 w-4 text-blue-500" />;
      if (isText(type)) return <TypeIcon className="h-4 w-4 text-indigo-500" />;
      if (isNumber(type)) return <HashIcon className="h-4 w-4 text-red-500" />;
      if (isBoolean(type))
        return <ToggleLeftIcon className="h-4 w-4 text-pink-500" />;
    }

    return <HelpCircleIcon className="h-4 w-4 text-gray-500" />;
  }
);
