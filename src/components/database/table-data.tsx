import { useMemo, useCallback, memo } from "react";
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
}> = memo(({ columnName, columnSchema }) => (
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

const hexToDataUrl = (hex: string): string => {
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16))
  );
  const blob = new Blob([bytes], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
};

const TableBodyCell: React.FC<{ value: any; dataType?: string }> = memo(
  ({ value, dataType }) => {
    const { dateFormatValue } = useSQLiteStore();

    const isBlob = dataType?.toUpperCase() === "BLOB";

    const content = useMemo(() => {
      if (!value) {
        return <span className="italic text-gray-400">NULL</span>;
      }

      if (dataType && isDate(dataType)) {
        if (dateFormats[dateFormatValue]) {
          return dateFormats[dateFormatValue].func(value);
        }
        return value;
      }

      const stringValue = typeof value === "string" ? value : String(value);
      return stringValue.length > 40
        ? `${stringValue.slice(0, 40)}...`
        : stringValue;
    }, [value, dataType, dateFormatValue]);

    return (
      <TableCell className="px-5 py-[11px] text-sm">
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="cursor-pointer hover:underline">
              {isBlob ? (
                <span className="italic opacity-40">BLOB</span>
              ) : (
                content
              )}
            </span>
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="start">
            <div className="flex flex-col justify-center gap-1">
              {isBlob && typeof value === "string" ? (
                <>
                  <img
                    src={hexToDataUrl(value)}
                    alt="BLOB content"
                    className="flex max-h-40 flex-col items-center justify-center gap-2 rounded object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    Blob length: {value.length}
                  </span>
                </>
              ) : (
                <span className="max-w-full break-words">{content}</span>
              )}
              <Badge className="w-full self-start text-center text-xs font-semibold">
                {dataType || "Unknown"}
              </Badge>
            </div>
          </HoverCardContent>
        </HoverCard>
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
