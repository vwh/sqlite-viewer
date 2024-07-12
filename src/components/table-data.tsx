import type { TableInfo, TableRow } from "../types";

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

export default function DBTableComponent({
  data,
  columns,
  tableName,
  tableSchemas,
}: DBTableComponentProps) {
  return (
    <Table>
      <TableHeader>
        <TTableRow>
          {columns.map((col, index) => (
            <TableHead key={index}>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="hover:underline cursor-pointer">
                    <div className="flex gap-1">
                      {col}
                      {tableSchemas[tableName][col]?.isPrimaryKey && (
                        <KeyRound className="h-4 w-4" />
                      )}
                      {tableSchemas[tableName][col]?.isForeignKey && (
                        <KeySquare className="h-4 w-4" />
                      )}
                      {tableSchemas[tableName][col]?.type === "BLOB" && (
                        <Cuboid className="h-4 w-4" />
                      )}
                      {tableSchemas[tableName][col]?.type === "DATETIME" && (
                        <Clock9 className="h-4 w-4" />
                      )}
                    </div>
                  </span>
                </HoverCardTrigger>
                <HoverCardContent side="bottom" align="start">
                  {tableSchemas[tableName][col]?.type.length == 0
                    ? "Unknown" // sqlite_sequence table doesn't have type
                    : tableSchemas[tableName][col]?.type}
                </HoverCardContent>
              </HoverCard>
            </TableHead>
          ))}
        </TTableRow>
      </TableHeader>
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
    </Table>
  );
}
