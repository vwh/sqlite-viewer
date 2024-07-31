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
    setCustomQuery,
    filters,
    totalRows,
    setTotalRows
  } = useSQLiteStore();

  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isQueryLoading, setIsQueryLoading] = useState(true);

  useEffect(() => {
    if (db && tableName && !isCustomQuery) {
      setIsQueryLoading(true);
      (async () => {
        try {
          const columnInfoQuery = `PRAGMA table_info("${tableName}");`;
          const columnInfoResult: QueryExecResult[] = query(columnInfoQuery);
          const columnInfo = columnInfoResult[0].values.map((row) => ({
            name: row[1] as string,
            type: row[2] as string
          }));

          // Construct the query string with BLOB columns converted to hex
          const columnSelects = columnInfo
            .map((col) =>
              col.type.toUpperCase() === "BLOB"
                ? `hex(${col.name}) as ${col.name}`
                : col.name
            )
            .join(", ");

          const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== "")
          );
          // Construct the count query string
          let countQueryString = `SELECT COUNT(*) as count FROM "${tableName}"`;
          if (Object.keys(cleanFilters).length > 0) {
            const filterQuery = Object.entries(cleanFilters)
              .map(([key, value]) => {
                return `LOWER(${key}) LIKE LOWER('%${value}%')`;
              })
              .join(" AND ");
            countQueryString = `SELECT COUNT(*) as count FROM "${tableName}" WHERE ${filterQuery}`;
          }

          // Execute the count query
          const countResult: QueryExecResult[] = query(countQueryString);
          const totalRows = countResult[0].values[0][0] as number;
          setTotalRows(totalRows);

          // Construct the data query string
          let queryString = `SELECT ${columnSelects} FROM "${tableName}" LIMIT ${rowsPerPage} OFFSET ${page};`;
          if (Object.keys(cleanFilters).length > 0) {
            const filterQuery = Object.entries(cleanFilters)
              .map(([key, value]) => {
                return `LOWER(${key}) LIKE LOWER('%${value}%')`;
              })
              .join(" AND ");
            queryString = `SELECT ${columnSelects} FROM "${tableName}" WHERE ${filterQuery} LIMIT ${rowsPerPage} OFFSET ${page};`;
          }

          const tableResult: QueryExecResult[] = query(queryString);
          const { data, columns } = mapQueryResults(tableResult);
          setColumns(columns);
          setData(data);
          setQueryError(null);
          setCustomQuery(queryString);
          unShiftToQueryHestory(queryString);
        } catch (error) {
          if (error instanceof Error) setQueryError(error.message);
        } finally {
          setIsQueryLoading(false);
        }
      })();
    }
  }, [
    db,
    tableName,
    page,
    rowsPerPage,
    isCustomQuery,
    setQueryError,
    query,
    setCustomQuery,
    unShiftToQueryHestory,
    filters,
    setTotalRows
  ]);

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
    handleCustomQuery,
    totalRows
  };
}
