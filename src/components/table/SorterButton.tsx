import { memo } from "react";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";
import { useDatabaseStore } from "@/store/useDatabaseStore";

import {
  ArrowDownNarrowWideIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon
} from "lucide-react";

const MemoizedArrowUpDownIcon = memo(ArrowUpDownIcon);
const MemoizedArrowUpNarrowWideIcon = memo(ArrowUpNarrowWideIcon);
const MemoizedArrowDownNarrowWideIcon = memo(ArrowDownNarrowWideIcon);

const SorterButton = memo(({ column }: { column: string }) => {
  const sorters = useDatabaseStore((state) => state.sorters);
  const { handleQuerySorter } = useDatabaseWorker();

  return (
    <>
      {sorters?.[column] ? (
        sorters[column] === "asc" ? (
          <button
            title="Sort column in descending order"
            type="button"
            aria-label="Sort Descending"
            onClick={() => handleQuerySorter(column)}
          >
            <MemoizedArrowDownNarrowWideIcon className="h-4 w-3" />
          </button>
        ) : (
          <button
            title="Sort column in ascending order"
            type="button"
            aria-label="Sort Ascending"
            onClick={() => handleQuerySorter(column)}
          >
            <MemoizedArrowUpNarrowWideIcon className="h-3 w-3" />
          </button>
        )
      ) : (
        <button
          title="Sort column in ascending order"
          type="button"
          aria-label="Sort Column"
          onClick={() => handleQuerySorter(column)}
        >
          <MemoizedArrowUpDownIcon className="h-3 w-3" />
        </button>
      )}
    </>
  );
});

export default SorterButton;
