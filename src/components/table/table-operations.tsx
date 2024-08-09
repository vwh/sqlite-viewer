import React, { useState, useEffect } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import { Input } from "@/components/ui/input";

import { ArrowDownNarrowWideIcon, ArrowUpNarrowWideIcon } from "lucide-react";

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
  const { orderBy, setOrderBy } = useSQLiteStore();

  const handleButtonClick = () => {
    if (orderBy === columnName) {
      setOrderBy(null);
    } else {
      setOrderBy(columnName);
    }
  };

  return (
    <button onClick={handleButtonClick}>
      {orderBy === columnName ? (
        <ArrowUpNarrowWideIcon className="h-4 w-4" />
      ) : (
        <ArrowDownNarrowWideIcon className="h-4 w-4" />
      )}
    </button>
  );
}
