import { useState, useEffect } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

export function usePagination(rowPerPageOrAuto: "auto" | number) {
  const { setIsCustomQuery } = useSQLiteStore();
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
    setIsCustomQuery(false);
  }, [setIsCustomQuery]);

  let rowsPerPage = 30;
  if (rowPerPageOrAuto === "auto") {
    const screenHeight = window.innerHeight;
    const thresholds = [
      { height: 1700, rowHeight: 70 },
      { height: 1300, rowHeight: 75 },
      { height: 1200, rowHeight: 75 },
      { height: 1100, rowHeight: 80 },
      { height: 1000, rowHeight: 85 },
      { height: 900, rowHeight: 95 },
      { height: 850, rowHeight: 100 },
      { height: 799, rowHeight: 110 },
      { height: 750, rowHeight: 120 },
      { height: 700, rowHeight: 130 },
      { height: 599, rowHeight: 140 },
      { height: 500, rowHeight: 200 },
      { height: 0, rowHeight: 280 }
    ];
    const defaultRowHeight = 120;
    let rowHeight = defaultRowHeight;
    for (const threshold of thresholds) {
      if (screenHeight > threshold.height) {
        rowHeight = threshold.rowHeight;
        break;
      }
    }
    rowsPerPage = Math.max(1, Math.floor(screenHeight / rowHeight));
  } else {
    rowsPerPage = rowPerPageOrAuto;
  }

  return { page, setPage, rowsPerPage };
}
