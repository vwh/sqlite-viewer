import { useMemo, useCallback } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import { useQueryData } from "@/hooks/useQueryData";
import { usePagination } from "@/hooks/usePagination";

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
    tables,
    selectedTable,
    tableSchemas,
    queryError,
    setQueryError,
    rowPerPageOrAuto,
    isCustomQuery,
    setIsCustomQuery
  } = useSQLiteStore();

  const { page, setPage, rowsPerPage } = usePagination(rowPerPageOrAuto);

  const tableName = useMemo(
    () => tables[parseInt(selectedTable)]?.name,
    [tables, selectedTable]
  );
  const rowCount = useMemo(
    () => tables[parseInt(selectedTable)]?.count || 0,
    [tables, selectedTable]
  );

  const {
    data,
    columns,
    customQuery,
    setCustomQuery,
    isQueryLoading,
    handleCustomQuery
  } = useQueryData(tableName, rowsPerPage, page, isCustomQuery);

  const handleResetQuery = useCallback(() => {
    setQueryError(null);
    setCustomQuery("");
    setIsCustomQuery(false);
  }, [setIsCustomQuery, setQueryError, setCustomQuery]);

  const handleResetPage = useCallback(() => {
    setPage(0);
    handleResetQuery();
  }, [handleResetQuery, setPage]);

  return (
    <div className="flex flex-col gap-3 pb-8">
      <section className="flex flex-col gap-2 p-3 border rounded pb-2">
        <TableSelect />
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Enter your custom query"
            className="w-full"
          />
          <div className="flex gap-1">
            <Button
              className="w-full"
              onClick={handleCustomQuery}
              title="Run custom query"
            >
              <Play className="h-5 w-5" />
            </Button>
            <Button
              className="w-full"
              onClick={handleResetQuery}
              title="Reset query"
            >
              <Trash className="h-5 w-5" />
            </Button>
            <Button
              className="w-full"
              onClick={handleResetPage}
              title="Reset to first page"
              disabled={page === 0}
            >
              <ListRestart className="h-5 w-5" />
            </Button>
          </div>
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
