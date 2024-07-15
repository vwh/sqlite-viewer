import { useState, useEffect, useCallback, useMemo } from "react";
import useSQLiteStore from "../store/useSQLiteStore";

import type { QueryExecResult } from "sql.js";
import type { TableRow } from "../types";

import { mapQueryResults } from "../lib/sqlite";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import PageSelect from "./page-select";
import { TableSelect } from "./table-select";
import DBTableComponent from "./table-data";

import { Delete, Play, ListRestart } from "lucide-react";

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

  let rowsPerPage = 30;
  console.log(rowPerPageOrAuto, rowsPerPage);
  if (rowPerPageOrAuto === "auto") {
    let rowHeight = 100;
    const screenHeight = window.innerHeight;
    const isXLScreen = screenHeight > 1500;
    const isLGScreen = screenHeight > 1000;
    const isSMScreen = screenHeight < 750;

    if (isXLScreen) rowHeight = 75;
    else if (isLGScreen) rowHeight = 90;
    else if (isSMScreen) rowHeight = 130;
    rowsPerPage = Math.max(1, Math.floor(screenHeight / rowHeight));
  } else {
    rowsPerPage = rowPerPageOrAuto;
  }

  useEffect(() => {
    setPage(0);
    setIsCustomQuery(false);
  }, [tableName]);

  useEffect(() => {
    if (db && tableName && !isCustomQuery) {
      try {
        const queryString = `SELECT * FROM "${tableName}" LIMIT ${rowsPerPage} OFFSET ${page};`;
        const tableResult: QueryExecResult[] = query(queryString);
        const { data, columns } = mapQueryResults(tableResult);
        setColumns(columns);
        setData(data);
        setQueryError(null);
        setCustomQuery(queryString);
      } catch (error) {
        if (error instanceof Error) {
          setQueryError(error.message);
        }
      }
    }
  }, [tableName, page, rowsPerPage]);

  const handleResetQuery = useCallback(() => {
    setQueryError(null);
    setCustomQuery("");
    setIsCustomQuery(false);
  }, [setIsCustomQuery, setQueryError]);

  const handleResetPage = useCallback(() => {
    setPage(0);
    setQueryError(null);
    setCustomQuery("");
    setIsCustomQuery(false);
  }, [setIsCustomQuery, setQueryError]);

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
    <div className="flex flex-col gap-2 mb-2">
      <section className="flex flex-col gap-2 p-3 pb-1 border rounded">
        <TableSelect />
        <div className="flex gap-1">
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
            <Delete className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleResetPage}
            title="Reset to first page"
            disabled={page === 0}
          >
            <ListRestart className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-red-500 capitalize text-center">
          {queryError}
        </p>
      </section>
      {data.length > 0 ? (
        <div className="border rounded">
          <DBTableComponent
            data={data}
            columns={columns}
            tableName={tableName}
            tableSchemas={tableSchemas}
          />
        </div>
      ) : (
        <p className="text-center font-semibold md:text-2xl p-20 border rounded">
          Table {tableName} is empty
        </p>
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
