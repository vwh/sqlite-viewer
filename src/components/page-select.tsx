import { Button } from "./ui/button";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

interface PageSelectProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  rowCount: number;
}

export default function PageSelect({
  page,
  setPage,
  rowsPerPage,
  rowCount
}: PageSelectProps) {
  const totalPages = Math.ceil(rowCount / rowsPerPage);
  const currentPage = Math.floor(page / rowsPerPage) + 1;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setPage(page + rowsPerPage);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setPage(page - rowsPerPage);
    }
  };

  return (
    <section className="fixed bottom-[8px] left-0 right-0 z-10 mx-auto w-[270px]">
      <div className="flex justify-between gap-2 rounded border bg-secondary p-[6px]">
        <Button onClick={prevPage} disabled={currentPage === 1}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="flex items-center justify-center text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={nextPage} disabled={currentPage >= totalPages}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
