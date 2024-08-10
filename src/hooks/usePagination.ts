import { useState, useEffect, useMemo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

export function usePagination(rowPerPageOrAuto: "auto" | number) {
  const { setIsCustomQuery } = useSQLiteStore();
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
    setIsCustomQuery(false);
  }, [setIsCustomQuery]);

  const rowsPerPage = useMemo(() => {
    if (rowPerPageOrAuto !== "auto") {
      return rowPerPageOrAuto;
    }

    const screenHeight = window.innerHeight;

    // Base row height calculation
    const baseRowHeight = 40; // Minimum row height
    const maxRowHeight = 2000; // Maximum row height
    const scaleFactor = 0.03; // Adjust this to change how quickly row height increases with screen size

    // Calculate adaptive row height
    const adaptiveRowHeight = Math.min(
      maxRowHeight,
      baseRowHeight + screenHeight * scaleFactor
    );

    // Calculate rows per page
    const calculatedRowsPerPage = Math.max(
      1,
      Math.floor(screenHeight / adaptiveRowHeight)
    );

    // Ensure a minimum and maximum number of rows per page
    const minRowsPerPage = 5;
    const maxRowsPerPage = 50;

    return Math.min(
      Math.max(calculatedRowsPerPage, minRowsPerPage),
      maxRowsPerPage
    );
  }, [rowPerPageOrAuto]);

  return { page, setPage, rowsPerPage };
}
