import { useMemo, useCallback, memo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import { Button } from "@/components/ui/button";

import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

const MemoizedChevronLeftIcon = memo(ChevronLeftIcon);
const MemoizedChevronRightIcon = memo(ChevronRightIcon);

interface PageSelectProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
}

export default function PageSelect({
  page,
  setPage,
  rowsPerPage
}: PageSelectProps) {
  const { totalRows } = useSQLiteStore();

  const totalPages = useMemo(
    () => Math.ceil(totalRows / rowsPerPage),
    [totalRows, rowsPerPage]
  );

  const currentPage = useMemo(
    () => Math.ceil(page / rowsPerPage) + 1,
    [page, rowsPerPage]
  );

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  const nextPage = useCallback(() => {
    if (canGoNext) {
      setPage((prevPage) => prevPage + rowsPerPage);
    }
  }, [canGoNext, rowsPerPage, setPage]);

  const prevPage = useCallback(() => {
    if (canGoPrev) {
      setPage((prevPage) => prevPage - rowsPerPage);
    }
  }, [canGoPrev, rowsPerPage, setPage]);

  return (
    <section className="fixed bottom-2 left-1/2 z-10 w-[270px] -translate-x-1/2 transform">
      <div className="flex justify-between gap-2 rounded border bg-secondary p-[6px]">
        <Button onClick={prevPage} title="Previous page" disabled={!canGoPrev}>
          <MemoizedChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="flex items-center justify-center text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={nextPage} title="Next page" disabled={!canGoNext}>
          <MemoizedChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
