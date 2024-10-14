import { useState, useEffect, useCallback } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import { Input } from "@/components/ui/input";

import {
  ArrowDownNarrowWideIcon,
  ArrowUpNarrowWideIcon,
  ArrowUpDownIcon
} from "lucide-react";

export function TableFilter({ columnName }: { columnName: string }) {
  const {
    appendToFilters,
    selectedTable,
    filtersNeedClear,
    setFiltersNeedClear
  } = useSQLiteStore();
  const [inputValue, setInputValue] = useState("");

  // Reset the input value when the table changes
  useEffect(() => {
    setInputValue("");
  }, [selectedTable]);

  // Clear filters when required
  useEffect(() => {
    if (filtersNeedClear) {
      setInputValue("");
      setFiltersNeedClear(false);
    }
  }, [filtersNeedClear]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      appendToFilters(columnName, value);
    },
    [appendToFilters, columnName]
  );

  return (
    <Input
      value={inputValue}
      onChange={handleFilterChange}
      className="mt-[2px] max-h-7 w-full text-xs"
      placeholder="Filter"
    />
  );
}

export function TableOrderBy({ columnName }: { columnName: string }) {
  const { orderBy, setOrderBy } = useSQLiteStore();

  const handleOrderByClick = useCallback(() => {
    if (orderBy.column === columnName) {
      if (orderBy.direction === "ASC") setOrderBy(columnName, "DESC");
      else if (orderBy.direction === "DESC") setOrderBy(null, "ASC");
    } else setOrderBy(columnName, "ASC"); // Start sorting with ASC for the new column
  }, [orderBy, columnName, setOrderBy]);

  return (
    <div
      onClick={handleOrderByClick}
      onKeyUp={handleOrderByClick}
      className="flex items-center"
    >
      {orderBy.column === columnName ? (
        orderBy.direction === "ASC" ? (
          <button title="Descending" type="button" aria-label="Sort Descending">
            <ArrowDownNarrowWideIcon className="h-4 w-4" />
          </button>
        ) : (
          <button title="Ascending" type="button" aria-label="Sort Ascending">
            <ArrowUpNarrowWideIcon className="h-4 w-4" />
          </button>
        )
      ) : (
        <button title="Sort column" type="button" aria-label="Sort Column">
          <ArrowUpDownIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
