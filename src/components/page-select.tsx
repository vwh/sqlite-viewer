import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

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
  rowCount,
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
    <section className="fixed bottom-[9px] left-0 right-0 w-[270px] mx-auto z-10">
      <div className="flex justify-between gap-2 bg-secondary p-[6px] border rounded">
        <Button onClick={prevPage} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm flex items-center justify-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={nextPage} disabled={currentPage >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
