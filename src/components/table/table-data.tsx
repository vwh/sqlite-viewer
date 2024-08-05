import useSQLiteStore from "@/store/useSQLiteStore";
import React, { useMemo, useEffect, useState } from "react";

import type { TableInfo, TableRow } from "@/types";
import { dateFormats } from "@/lib/date-format";

import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TTableRow
} from "@/components/ui/table";
import StatusMessage from "./stats-message";

import {
  KeyRoundIcon,
  KeySquareIcon,
  CuboidIcon,
  CalendarIcon
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
    if (columnSchema?.isPrimaryKey) return <KeyRoundIcon className="h-4 w-4" />;
    if (columnSchema?.isForeignKey)
      return <KeySquareIcon className="h-4 w-4" />;
    if (columnSchema?.type === "BLOB")
      return <CuboidIcon className="h-4 w-4" />;
    if (columnSchema?.type?.includes("DATE"))
      return <CalendarIcon className="h-4 w-4" />;
    return null;
  }
);

const ColumnTitle: React.FC<{ columnSchema: ColumnSchema }> = React.memo(
  ({ columnSchema }) => {
    if (columnSchema?.isPrimaryKey)
      return <span className="font-bold">(Primary Key)</span>;
    if (columnSchema?.isForeignKey)
      return <span className="font-bold">(Foreign Key)</span>;
    return null;
  }
);

const TableHeadCell: React.FC<{
  col: string;
  columnSchema: ColumnSchema;
  children?: React.ReactNode;
}> = React.memo(({ col, columnSchema, children }) => (
  <TableHead className="py-2">
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer hover:underline">
          <div className="flex items-center gap-1">
            {col}
            <ColumnIcon columnSchema={columnSchema} />
          </div>
          {children}
        </span>
      </HoverCardTrigger>
      <TableHeadFilter col={col} />
      <HoverCardContent side="bottom" align="start">
        {columnSchema?.type || "Unknown"}{" "}
        <ColumnTitle columnSchema={columnSchema} />
      </HoverCardContent>
    </HoverCard>
  </TableHead>
));

const TableBodyCell: React.FC<{ value: any; dataType?: string }> = React.memo(
  ({ value, dataType }) => {
    const { dateFormatValue } = useSQLiteStore();
    const isDate = dataType === "DATE" || dataType === "DATETIME";
    const renderCellContent = () => {
      if (!value) {
        return <span className="italic opacity-40">NULL</span>;
      }

      if (isDate) {
        if (dateFormats[dateFormatValue]) {
          return dateFormats[dateFormatValue].func(value);
        }
      }

      return value;
    };

    return <TableCell dataType={dataType}>{renderCellContent()}</TableCell>;
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
            ></TableHeadCell>
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
    <>
      <Table>
        {tableHead}
        {data.length > 0 && tableBody}
      </Table>
      {data.length === 0 && (
        <div className="w-full">
          <StatusMessage type="info" className="rounded-none">
            {tableName} return no data
          </StatusMessage>
        </div>
      )}
    </>
  );
}
