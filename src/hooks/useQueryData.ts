import { useState, useEffect, useCallback } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import { mapQueryResults } from "@/lib/sqlite";
import type { QueryExecResult } from "sql.js";
import type { TableRow } from "@/types";

export function useQueryData(
  tableName: string,
  rowsPerPage: number,
  page: number,
  isCustomQuery: boolean
) {
  const {
    db,
    setQueryError,
    setIsCustomQuery,
    query,
    unShiftToQueryHestory,
    customQuery,
    setCustomQuery
  } = useSQLiteStore();

  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isQueryLoading, setIsQueryLoading] = useState(true);

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
          unShiftToQueryHestory(queryString);
        }
      })();
    }
  }, [db, tableName, page, rowsPerPage, isCustomQuery, setQueryError, query]);

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
  }, [customQuery, query, setQueryError, setIsCustomQuery]);

  return {
    data,
    columns,
    customQuery,
    setCustomQuery,
    isQueryLoading,
    handleCustomQuery
  };
}
