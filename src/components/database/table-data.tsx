import React, { useMemo, useCallback } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import type { TableInfo, TableRow, ColumnSchema } from "@/types";

import { dateFormats } from "@/lib/date-format";
import { isDate } from "@/lib/sqlite-type-check";

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
import { TableFilter, TableOrderBy } from "./table-operations";
import { ColumnIcon, KeyIcon } from "./table-decorations";
import { Button } from "../ui/button";

interface DBTableComponentProps {
  data: TableRow[];
  columns: string[];
  tableName: string;
  tableSchemas: TableInfo;
}

const TableHeadCell: React.FC<{
  columnName: string;
  columnSchema: ColumnSchema;
}> = React.memo(({ columnName, columnSchema }) => (
  <TableHead className="bg-gray-100 py-2 dark:bg-gray-700">
    <div className="flex items-center gap-1">
      <TableOrderBy columnName={columnName} />
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex cursor-pointer items-center space-x-1">
            <span className="max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap">
              {columnName}
            </span>
            {columnSchema && <ColumnIcon columnSchema={columnSchema} />}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="mb-1 flex items-center space-x-1">
            <p className="text-sm font-medium">{columnName}</p>
            <KeyIcon columnSchema={columnSchema} />
          </div>
          <div className="flex items-center gap-1">
            <Badge className="w-full self-start text-center text-xs font-semibold">
              {columnSchema?.type || "Unknown"}
            </Badge>
            {columnSchema?.nullable && (
              <Badge className="w-full self-start text-center text-xs font-semibold">
                NULLABLE
              </Badge>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
    <TableFilter columnName={columnName} />
  </TableHead>
));

const TableBodyCell: React.FC<{ value: any; dataType?: string }> = React.memo(
  ({ value, dataType }) => {
    const { dateFormatValue } = useSQLiteStore();

    const CellContent = () => {
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
        {CellContent()}
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
  const { filters, setFiltersNeedClear, setFilters } = useSQLiteStore();

  const tableHead = useMemo(
    () => (
      <TableHeader>
        <TTableRow>
          {columns.map((columnName, index) => (
            <TableHeadCell
              key={index}
              columnName={columnName}
              columnSchema={tableSchemas[tableName][columnName]}
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
            {columns.map((columnName, cellIndex) => (
              <TableBodyCell
                key={cellIndex}
                value={row[columnName]}
                dataType={tableSchemas[tableName][columnName]?.type}
              />
            ))}
          </TTableRow>
        ))}
      </TableBody>
    ),
    [data, columns, tableSchemas, tableName]
  );

  const handleFiltersClear = useCallback(() => {
    setFiltersNeedClear(true);
    setFilters({});
  }, [setFiltersNeedClear, setFilters]);

  return (
    <div className="overflow-x-auto">
      <Table>
        {tableHead}
        {data.length > 0 && tableBody}
      </Table>
      {data.length === 0 && (
        <>
          <div className="w-full p-4 text-center font-medium">
            No data available for {tableName}
          </div>
          {Object.keys(filters).length > 0 && (
            <Button
              className="w-full rounded-none"
              variant={"outline"}
              onClick={handleFiltersClear}
            >
              Clear filters
            </Button>
          )}
        </>
      )}
    </div>
  );
}
