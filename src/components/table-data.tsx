import React, { useMemo } from "react";
import type { TableInfo, TableRow } from "@/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TTableRow
} from "./ui/table";
import { KeyRound, KeySquare, Cuboid, Clock9 } from "lucide-react";

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
    if (columnSchema?.isPrimaryKey) return <KeyRound className="h-4 w-4" />;
    if (columnSchema?.isForeignKey) return <KeySquare className="h-4 w-4" />;
    if (columnSchema?.type === "BLOB") return <Cuboid className="h-4 w-4" />;
    if (columnSchema?.type === "DATETIME")
      return <Clock9 className="h-4 w-4" />;
    return null;
  }
);

const TableHeadCell: React.FC<{ col: string; columnSchema: ColumnSchema }> =
  React.memo(({ col, columnSchema }) => (
    <TableHead>
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="cursor-pointer hover:underline">
            <div className="flex gap-1">
              {col}
              <ColumnIcon columnSchema={columnSchema} />
            </div>
          </span>
        </HoverCardTrigger>
        <HoverCardContent side="bottom" align="start">
          {columnSchema?.type || "Unknown"}
        </HoverCardContent>
      </HoverCard>
    </TableHead>
  ));

const TableBodyCell: React.FC<{ value: any; dataType?: string }> = React.memo(
  ({ value, dataType }) => (
    <TableCell dataType={dataType}>
      {value ? value : <span className="italic opacity-40">NULL</span>}
    </TableCell>
  )
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
    <Table>
      {tableHead}
      {tableBody}
    </Table>
  );
}
