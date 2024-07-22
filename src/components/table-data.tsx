import type { TableInfo, TableRow } from "@/types";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TTableRow,
} from "./ui/table";
import { KeyRound, KeySquare, Cuboid, Clock9 } from "lucide-react";

interface DBTableComponentProps {
  data: TableRow[];
  columns: string[];
  tableName: string;
  tableSchemas: TableInfo;
}

const getIcon = (columnSchema: any) => {
  if (columnSchema?.isPrimaryKey) return <KeyRound className="h-4 w-4" />;
  if (columnSchema?.isForeignKey) return <KeySquare className="h-4 w-4" />;
  if (columnSchema?.type === "BLOB") return <Cuboid className="h-4 w-4" />;
  if (columnSchema?.type === "DATETIME") return <Clock9 className="h-4 w-4" />;
  return null;
};

const renderTableHead = (
  columns: string[],
  tableSchemas: TableInfo,
  tableName: string
) => (
  <TableHeader>
    <TTableRow>
      {columns.map((col, index) => (
        <TableHead key={index}>
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="hover:underline cursor-pointer">
                <div className="flex gap-1">
                  {col}
                  {getIcon(tableSchemas[tableName][col])}
                </div>
              </span>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" align="start">
              {tableSchemas[tableName][col]?.type || "Unknown"}
            </HoverCardContent>
          </HoverCard>
        </TableHead>
      ))}
    </TTableRow>
  </TableHeader>
);

const renderTableBody = (
  data: TableRow[],
  columns: string[],
  tableSchemas: TableInfo,
  tableName: string
) => (
  <TableBody>
    {data.map((row, rowIndex) => (
      <TTableRow key={rowIndex}>
        {columns.map((col, cellIndex) => (
          <TableCell
            key={cellIndex}
            dataType={tableSchemas[tableName][col]?.type}
          >
            {row[col] ? (
              row[col]
            ) : (
              <span className="italic opacity-40">NULL</span>
            )}
          </TableCell>
        ))}
      </TTableRow>
    ))}
  </TableBody>
);

export default function DBTableComponent({
  data,
  columns,
  tableName,
  tableSchemas,
}: DBTableComponentProps) {
  return (
    <Table>
      {renderTableHead(columns, tableSchemas, tableName)}
      {renderTableBody(data, columns, tableSchemas, tableName)}
    </Table>
  );
}
