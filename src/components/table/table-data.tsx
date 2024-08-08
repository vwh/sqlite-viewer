import React, { useMemo, useState, useEffect } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import { TableInfo, TableRow } from "@/types";
import { dateFormats } from "@/lib/date-format";
import {
  isDate,
  IsNumber,
  isText,
  isBlob,
  isBoolean
} from "@/lib/sqlite-type-check";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TTableRow
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import { Badge } from "../ui/badge";

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

interface DBTableComponentProps {
  data: TableRow[];
  columns: string[];
  tableName: string;
  tableSchemas: TableInfo;
}

interface ColumnSchema {
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  type?: string;
}

const ColumnIcon: React.FC<{ columnSchema: ColumnSchema }> = React.memo(
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
      if (IsNumber(type)) return <HashIcon className="h-4 w-4 text-red-500" />;
      if (isBoolean(type))
        return <ToggleLeftIcon className="h-4 w-4 text-pink-500" />;
    }

    return <HelpCircleIcon className="h-4 w-4 text-gray-500" />;
  }
);

function TableHeadFilter({ col }: { col: string }) {
  const { appendToFilters, selectedTable } = useSQLiteStore();
  const [inputValue, setInputValue] = useState("");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    appendToFilters(col, e.target.value);
  };

  useEffect(() => {
    setInputValue("");
  }, [selectedTable]);

  return (
    <Input
      value={inputValue}
      onChange={onInputChange}
      className="mt-[2px] max-h-7 w-full text-xs"
      placeholder="Filter"
    />
  );
}

const TableHeadCell: React.FC<{
  col: string;
  columnSchema: ColumnSchema;
}> = React.memo(({ col, columnSchema }) => (
  <TableHead className="bg-gray-100 py-2 dark:bg-gray-700">
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex cursor-pointer items-center space-x-1">
          <span>{col}</span>
          {columnSchema && <ColumnIcon columnSchema={columnSchema} />}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="mb-1 flex items-center space-x-1">
          <p className="text-sm font-medium">{col}</p>
          {columnSchema?.isPrimaryKey && (
            <p className="text-sm font-semibold text-yellow-600">(Primary)</p>
          )}
          {columnSchema?.isForeignKey && (
            <p className="text-sm font-semibold text-purple-600">(Foreign)</p>
          )}
        </div>
        {
          <Badge className="w-full self-start text-xs font-semibold">
            {columnSchema?.type || "Unknown"}
          </Badge>
        }
      </HoverCardContent>
    </HoverCard>
    <TableHeadFilter col={col} />
  </TableHead>
));

const TableBodyCell: React.FC<{ value: any; dataType?: string }> = React.memo(
  ({ value, dataType }) => {
    const { dateFormatValue } = useSQLiteStore();

    const renderCellContent = () => {
      if (!value) {
        return <span className="italic text-gray-400">NULL</span>;
      }

      if (dataType && isDate(dataType)) {
        if (dateFormats[dateFormatValue]) {
          return dateFormats[dateFormatValue].func(value);
        }
      }

      return value;
    };

    return (
      <TableCell dataType={dataType} className="px-5 py-[11px] text-sm">
        {renderCellContent()}
      </TableCell>
    );
  }
);

export default function DBTableComponent({
  data,
  columns,
  tableName,
  tableSchemas
}: DBTableComponentProps) {
  const tableHead = useMemo(
    () => (
      <TableHeader>
        <TTableRow>
          {columns.map((col, index) => (
            <TableHeadCell
              key={index}
              col={col}
              columnSchema={tableSchemas[tableName][col]}
            />
          ))}
        </TTableRow>
      </TableHeader>
    ),
    [columns, tableSchemas, tableName]
  );

  const tableBody = useMemo(
    () => (
      <TableBody>
        {data.map((row, rowIndex) => (
          <TTableRow key={rowIndex}>
            {columns.map((col, cellIndex) => (
              <TableBodyCell
                key={cellIndex}
                value={row[col]}
                dataType={tableSchemas[tableName][col]?.type}
              />
            ))}
          </TTableRow>
        ))}
      </TableBody>
    ),
    [data, columns, tableSchemas, tableName]
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        {tableHead}
        {data.length > 0 && tableBody}
      </Table>
      {data.length === 0 && (
        <div className="w-full p-4 text-center font-medium">
          No data available for {tableName}
        </div>
      )}
    </div>
  );
}
