import { useState, useEffect } from "react";
import useSQLiteStore from "../store/useSQLiteStore";

import type { SqlValue, QueryExecResult } from "sql.js";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TTableRow,
} from "./ui/table";
import { Separator } from "./ui/separator";
import PageSelect from "./page-select";
import { TableSelect } from "./table-select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

import { KeyRound } from "lucide-react";

interface TableRow {
  [key: string]: SqlValue;
}

export function DBTable() {
  const { query, db, tables, selectedTable, tableSchemas } = useSQLiteStore();
  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [customQuery, setCustomQuery] = useState<string>("");
  const [isCustomQuery, setIsCustomQuery] = useState<boolean>(false);

  const tableName = tables[parseInt(selectedTable)]?.name;
  const rowCount = tables[parseInt(selectedTable)]?.count || 0;
  const rowsPerPage = 30;

  useEffect(() => {
    setPage(0);
    setIsCustomQuery(false);
  }, [tableName]);

  useEffect(() => {
    if (db && tableName && !isCustomQuery) {
      const tableResult: QueryExecResult[] = query(
        `SELECT * FROM "${tableName}" LIMIT ${rowsPerPage} OFFSET ${page};`
      );
      if (tableResult.length > 0) {
        const tableData: TableRow[] = tableResult[0].values.map((row) =>
          tableResult[0].columns.reduce((acc, col, index) => {
            acc[col] = row[index];
            return acc;
          }, {} as TableRow)
        );
        setColumns(tableResult[0].columns);
        setData(tableData);
      } else {
        setData([]);
      }
    }
  }, [db, query, tableName, page, isCustomQuery]);

  const handleCustomQuery = () => {
    if (db && customQuery.trim() !== "") {
      const customResult: QueryExecResult[] = query(customQuery);
      if (customResult.length > 0) {
        const customData: TableRow[] = customResult[0].values.map((row) =>
          customResult[0].columns.reduce((acc, col, index) => {
            acc[col] = row[index];
            return acc;
          }, {} as TableRow)
        );
        setColumns(customResult[0].columns);
        setData(customData);
        setIsCustomQuery(true);
      }
    }
  };

  return (
    <div>
      <TableSelect />
      <div className="flex gap-2 mt-2">
        <Input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          placeholder="Enter your custom query"
          className="w-full"
        />
        <Button onClick={handleCustomQuery}>Run Query</Button>
      </div>
      <Separator className="mt-2" />
      {data.length > 0 ? (
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
                        </div>
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent side="bottom" align="start">
                      {tableSchemas[tableName][col]?.type}
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
                  <TableCell key={cellIndex}>
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
      ) : (
        <p className="text-center py-2 font-semibold">No data on the table</p>
      )}
      <Separator />
      {!isCustomQuery && (
        <PageSelect
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          rowCount={rowCount}
        />
      )}
    </div>
  );
}
