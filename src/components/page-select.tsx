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
  const nextPage = () => {
    setPage((prev) =>
      prev + rowsPerPage < rowCount ? prev + rowsPerPage : prev
    );
  };

  const prevPage = () => {
    setPage((prev) => (prev > 0 ? prev - rowsPerPage : 0));
  };

  const totalPages = Math.ceil(rowCount / rowsPerPage);

  return (
    <section className="flex items-center justify-center fixed bottom-2 left-0 right-0">
      <div className="flex justify-between gap-2 bg-secondary p-[6px] border rounded">
        <Button onClick={prevPage} disabled={page === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm flex items-center justify-center">
          Page {Math.floor(page / rowsPerPage) + 1} of {totalPages}
        </span>
        <Button onClick={nextPage} disabled={page + rowsPerPage >= rowCount}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
