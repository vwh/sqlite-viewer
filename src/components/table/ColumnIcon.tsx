import { memo } from "react";

import {
  isDate,
  isNumber,
  isText,
  isBlob,
  isBoolean
} from "@/lib/sqlite/sqlite-type-check";

import type { TableSchemaRow } from "@/types";

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

const MemoizedKeyRoundIcon = memo(KeyRoundIcon);
const MemoizedKeySquareIcon = memo(KeySquareIcon);
const MemoizedCuboidIcon = memo(CuboidIcon);
const MemoizedCalendarIcon = memo(CalendarIcon);
const MemoizedTypeIcon = memo(TypeIcon);
const MemoizedHashIcon = memo(HashIcon);
const MemoizedToggleLeftIcon = memo(ToggleLeftIcon);
const MemoizedHelpCircleIcon = memo(HelpCircleIcon);

const ColumnIcon = memo(
  ({ columnSchema }: { columnSchema: TableSchemaRow | null }) => {
    if (!columnSchema) return null;

    const { type, isPrimaryKey, isForeignKey } = columnSchema;

    let typeIcon = null;
    if (type) {
      typeIcon = isBlob(type) ? (
        <MemoizedCuboidIcon className="h-4 w-4 text-green-500" />
      ) : isDate(type) ? (
        <MemoizedCalendarIcon className="h-4 w-4 text-blue-500" />
      ) : isText(type) ? (
        <MemoizedTypeIcon className="h-4 w-4 text-indigo-500" />
      ) : isNumber(type) ? (
        <MemoizedHashIcon className="h-4 w-4 text-red-500" />
      ) : isBoolean(type) ? (
        <MemoizedToggleLeftIcon className="h-4 w-4 text-pink-500" />
      ) : (
        <MemoizedHelpCircleIcon className="h-4 w-4 text-gray-500" />
      );
    }

    return (
      <div className="flex items-center gap-[2px]">
        {isPrimaryKey && (
          <MemoizedKeyRoundIcon className="h-4 w-4 text-yellow-500" />
        )}
        {isForeignKey && (
          <MemoizedKeySquareIcon className="h-4 w-4 text-purple-500" />
        )}
        {typeIcon}
      </div>
    );
  }
);

export default ColumnIcon;
