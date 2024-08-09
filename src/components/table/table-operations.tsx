import React, { useState, useEffect } from "react";
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

  // reset the input value when the table changes
  useEffect(() => {
    setInputValue("");
  }, [selectedTable]);

  useEffect(() => {
    if (filtersNeedClear) {
      setInputValue("");
      setFiltersNeedClear(false);
    }
  }, [filtersNeedClear]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    appendToFilters(columnName, e.target.value);
  };

  return (
    <Input
      value={inputValue}
      onChange={handleInputChange}
      className="mt-[2px] max-h-7 w-full text-xs"
      placeholder="Filter"
    />
  );
}

export function TableOrderBy({ columnName }: { columnName: string }) {
  const { orderBy, setOrderBy, orderByDirection, setOrderByDirection } =
    useSQLiteStore();

  const handleButtonClick = () => {
    if (orderBy === columnName) {
      if (orderByDirection === "ASC") {
        setOrderByDirection("DESC");
      } else {
        setOrderByDirection("ASC");
      }
    } else {
      setOrderBy(columnName);
      setOrderByDirection("ASC");
    }
  };

  return (
    <div onClick={handleButtonClick} className="flex items-center">
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
