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
      { height: 1700, rowHeight: 65 },
      { height: 1300, rowHeight: 70 },
      { height: 1200, rowHeight: 75 },
      { height: 1100, rowHeight: 75 },
      { height: 1000, rowHeight: 80 },
      { height: 950, rowHeight: 85 },
      { height: 900, rowHeight: 90 },
      { height: 850, rowHeight: 95 },
      { height: 800, rowHeight: 100 },
      { height: 750, rowHeight: 105 },
      { height: 700, rowHeight: 110 },
      { height: 600, rowHeight: 120 },
      { height: 550, rowHeight: 150 },
      { height: 500, rowHeight: 190 },
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
