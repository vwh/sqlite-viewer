import { useMemo } from "react";
import { useDatabaseStore } from "@/store/useDatabaseStore";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Span } from "@/components/ui/span";

const CustomQueryDataTable = () => {
  const customQueryObject = useDatabaseStore(
    (state) => state.customQueryObject
  );

  return useMemo(
    () => (
      <>
        {customQueryObject ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                {customQueryObject.columns.map((column) => (
                  <TableHead key={column} className="p-1 text-xs">
                    <div className="flex items-center gap-1">
                      <Span className="text-foreground font-medium capitalize">
                        {column}
                      </Span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {customQueryObject.data && customQueryObject.data.length > 0 ? (
                customQueryObject.data.map((row, i) => (
                  <TableRow key={i} className="hover:bg-primary/5 text-xs">
                    {row.map((value, j) => (
                      <TableCell key={j} className="p-2">
                        {value ? (
                          <Span>{value}</Span>
                        ) : (
                          <span className="text-muted-foreground italic">
                            NULL
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={customQueryObject?.columns?.length || 1}
                    className="h-32 text-center"
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-1 px-4">
                      <p className="text-md whitespace-nowrap">
                        No Data To Show
                      </p>
                      <p className="text-sm whitespace-nowrap">
                        Seems like there is no data to display
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 px-4">
            <p className="text-md whitespace-nowrap">No Data To Show</p>
            <p className="text-sm whitespace-nowrap">
              Execute a query to view data
            </p>
          </div>
        )}
      </>
    ),
    [customQueryObject]
  );
};

export default CustomQueryDataTable;
