import { useState, useEffect, useCallback, useMemo } from "react";
import useSQLiteStore from "../store/useSQLiteStore";

import type { QueryExecResult } from "sql.js";
import type { TableRow } from "../types";

import { mapQueryResults } from "../lib/sqlite";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import PageSelect from "./page-select";
import { TableSelect } from "./table-select";
import DBTableComponent from "./table-data";

export function DBTable() {
  const {
    query,
    db,
    tables,
    selectedTable,
    tableSchemas,
    queryError,
    setQueryError,
  } = useSQLiteStore();

  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [customQuery, setCustomQuery] = useState<string>("");
  const [isCustomQuery, setIsCustomQuery] = useState<boolean>(false);

  const tableName = useMemo(
    () => tables[parseInt(selectedTable)]?.name,
    [tables, selectedTable]
  );

  const rowCount = useMemo(
    () => tables[parseInt(selectedTable)]?.count || 0,
    [tables, selectedTable]
  );

  const rowsPerPage = 30;

  useEffect(() => {
    setPage(0);
    setIsCustomQuery(false);
  }, [tableName]);

  useEffect(() => {
    if (db && tableName && !isCustomQuery) {
      try {
        const tableResult: QueryExecResult[] = query(
          `SELECT * FROM "${tableName}" LIMIT ${rowsPerPage} OFFSET ${page};`
        );
        const { data, columns } = mapQueryResults(tableResult);
        setColumns(columns);
        setData(data);
        setQueryError(null);
      } catch (error) {
        if (error instanceof Error) {
          setQueryError(error.message);
        }
      }
    }
  }, [tableName, page]);

  const handleCustomQuery = useCallback(() => {
    if (customQuery.trim() === "") {
      setQueryError(null);
      return;
    }

    if (db && customQuery.trim() !== "") {
      try {
        const customResult: QueryExecResult[] = query(customQuery);
        const { data, columns } = mapQueryResults(customResult);
        setColumns(columns);
        setData(data);
        setIsCustomQuery(true);
        setQueryError(null);
      } catch (error) {
        if (error instanceof Error) {
          setQueryError(error.message);
        }
      }
    }
  }, [customQuery, db, query, setQueryError]);

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
      <p className="text-xs text-red-500 mt-1 capitalize">{queryError}</p>
      <Separator className="mt-2" />
      {data.length > 0 ? (
        <DBTableComponent
          data={data}
          columns={columns}
          tableName={tableName}
          tableSchemas={tableSchemas}
        />
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
