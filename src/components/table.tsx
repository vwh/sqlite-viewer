import { useState, useEffect, useCallback, useMemo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import type { QueryExecResult } from "sql.js";
import type { TableRow } from "@/types";

import { mapQueryResults } from "@/lib/sqlite";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import PageSelect from "./page-select";
import TableSelect from "./table-select";
import DBTableComponent from "./table-data";
import ErrorMessage from "./error";
import Loading from "./loading";
import { Trash, Play, ListRestart } from "lucide-react";

export function DBTable() {
  const {
    query,
    db,
    tables,
    selectedTable,
    tableSchemas,
    queryError,
    setQueryError,
    rowPerPageOrAuto,
    isCustomQuery,
    setIsCustomQuery,
  } = useSQLiteStore();

  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [customQuery, setCustomQuery] = useState<string>("");
  const [isQueryLoading, setIsQueryLoading] = useState(true);

  const tableName = useMemo(
    () => tables[parseInt(selectedTable)]?.name,
    [tables, selectedTable],
  );
  const rowCount = useMemo(
    () => tables[parseInt(selectedTable)]?.count || 0,
    [tables, selectedTable],
  );

  // Reset query and page when table changes
  useEffect(() => {
    setPage(0);
    setIsCustomQuery(false);
  }, [tableName]);

  useEffect(() => {
    if (db && tableName && !isCustomQuery) {
      setIsQueryLoading(true);
      const queryString = `SELECT * FROM "${tableName}" LIMIT ${rowsPerPage} OFFSET ${page};`;
      (async () => {
        try {
          const tableResult: QueryExecResult[] = query(queryString);
          const { data, columns } = mapQueryResults(tableResult);
          setColumns(columns);
          setData(data);
          setQueryError(null);
          setCustomQuery(queryString);
        } catch (error) {
          if (error instanceof Error) setQueryError(error.message);
        } finally {
          setIsQueryLoading(false);
        }
      })();
    }
  }, [db, tableName, page, rowPerPageOrAuto]);

  const handleResetQuery = useCallback(() => {
    setQueryError(null);
    setCustomQuery("");
    setIsCustomQuery(false);
  }, [setIsCustomQuery, setQueryError]);

  const handleResetPage = useCallback(() => {
    setPage(0);
    handleResetQuery();
  }, [handleResetQuery]);

  const handleCustomQuery = useCallback(() => {
    if (customQuery.trim() === "") {
      setQueryError(null);
      return;
    }

    setIsQueryLoading(true);
    (async () => {
      try {
        const customResult: QueryExecResult[] = query(customQuery);
        const { data, columns } = mapQueryResults(customResult);
        setColumns(columns);
        setData(data);
        setIsCustomQuery(true);
        setQueryError(null);
      } catch (error) {
        if (error instanceof Error) setQueryError(error.message);
      } finally {
        setIsQueryLoading(false);
      }
    })();
  }, [customQuery, db, query, setQueryError, setIsCustomQuery]);

  let rowsPerPage = 30;
  if (rowPerPageOrAuto === "auto") {
    let rowHeight = 110;
    const screenHeight = window.innerHeight;
    if (screenHeight > 1500) rowHeight = 75;
    else if (screenHeight > 1000) rowHeight = 90;
    else if (screenHeight < 750) rowHeight = 150;
    rowsPerPage = Math.max(1, Math.floor(screenHeight / rowHeight));
  } else {
    rowsPerPage = rowPerPageOrAuto;
  }

  return (
    <div className="flex flex-col gap-3 mb-2">
      <section className="flex flex-col gap-2 p-3 pb-1 border rounded">
        <TableSelect />
        <div className="flex gap-1 mb-1">
          <Input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Enter your custom query"
            className="w-full"
          />
          <Button onClick={handleCustomQuery} title="Run custom query">
            <Play className="h-5 w-5" />
          </Button>
          <Button onClick={handleResetQuery} title="Reset query">
            <Trash className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleResetPage}
            title="Reset to first page"
            disabled={page === 0}
          >
            <ListRestart className="h-5 w-5" />
          </Button>
        </div>
        {queryError && (
          <p className="text-xs text-red-500 capitalize text-center">
            {queryError}
          </p>
        )}
      </section>
      {isQueryLoading ? (
        <Loading>Loading {tableName}</Loading>
      ) : data.length > 0 ? (
        <div className="border rounded">
          <DBTableComponent
            data={data}
            columns={columns}
            tableName={tableName}
            tableSchemas={tableSchemas}
          />
        </div>
      ) : (
        <ErrorMessage>Table {tableName} is empty</ErrorMessage>
      )}
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
