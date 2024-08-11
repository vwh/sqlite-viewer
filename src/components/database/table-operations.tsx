import React, { useState, useEffect, useCallback } from "react";
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
  const { orderBy, setOrderBy, orderByDirection, setOrderByDirection } =
    useSQLiteStore();

  const handleOrderByClick = useCallback(() => {
    if (orderBy === columnName) {
      if (orderByDirection === "ASC") {
        setOrderByDirection("DESC");
      } else if (orderByDirection === "DESC") {
        setOrderBy(null);
        setOrderByDirection("ASC");
      } else {
        setOrderBy(columnName);
        setOrderByDirection("ASC");
      }
    } else {
      setOrderBy(columnName); // Start sorting with ASC for the new column
      setOrderByDirection("ASC");
    }
  }, [orderBy, orderByDirection, columnName, setOrderBy, setOrderByDirection]);

  return (
    <div onClick={handleOrderByClick} className="flex items-center">
      {orderBy === columnName ? (
        orderByDirection === "ASC" ? (
          <button title="Descending">
            <ArrowDownNarrowWideIcon className="h-4 w-4" />
          </button>
        ) : (
          <button title="Ascending">
            <ArrowUpNarrowWideIcon className="h-4 w-4" />
          </button>
        )
      ) : (
        <button title="Sort column">
          <ArrowUpDownIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
