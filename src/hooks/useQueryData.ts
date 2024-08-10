import { useState, useEffect, useCallback } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import { mapQueryResults } from "@/lib/sqlite";
import type { QueryExecResult } from "sql.js";
import type { TableRow } from "@/types";

export function useQueryData(
  tableName: string,
  rowsPerPage: number,
  page: number
) {
  const {
    db,
    setQueryError,
    setIsCustomQuery,
    query,
    unShiftToQueryHistory,
    customQuery,
    setCustomQuery,
    filters,
    totalRows,
    setTotalRows,
    orderBy,
    orderByDirection,
    selectedTable,
    tables
  } = useSQLiteStore();

  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isQueryLoading, setIsQueryLoading] = useState(true);

  // Only god knows what this does but it is the main useEffect for all the site
  useEffect(() => {
    if (db && tableName) {
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
          let queryString = `SELECT ${columnSelects} FROM "${tableName}"`;
          if (Object.keys(cleanFilters).length > 0) {
            const filterQuery = Object.entries(cleanFilters)
              .map(([key, value]) => {
                return `LOWER(${key}) LIKE LOWER('%${value}%')`;
              })
              .join(" AND ");
            queryString += ` WHERE ${filterQuery}`;
          }

          if (orderBy)
            queryString += ` ORDER BY "${orderBy}" ${orderByDirection}`;
          queryString += ` LIMIT ${rowsPerPage} OFFSET ${page};`;

          const tableResult: QueryExecResult[] = query(queryString);
          const { data, columns } = mapQueryResults(tableResult);
          setColumns(columns);
          setData(data);
          setQueryError(null);
          setCustomQuery(queryString);
          unShiftToQueryHistory(queryString);
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
    setQueryError,
    query,
    unShiftToQueryHistory,
    filters,
    setTotalRows,
    orderBy,
    orderByDirection
  ]);

  const handleCustomQuery = useCallback(() => {
    if (customQuery.trim() === "") {
      setQueryError(null);
      return;
    }
    setIsQueryLoading(true);
    (async () => {
      try {
        const tableName = tables[parseInt(selectedTable)].name;
        const customResult: QueryExecResult[] = query(
          // @ used to represent the current table name
          // Just for a shorter query :/
          customQuery.replace("@", `"${tableName}"`)
        );
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
