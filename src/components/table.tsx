import { useState, useEffect } from "react";
import useSQLiteStore from "../store/useSQLiteStore";

import { SqlValue, QueryExecResult } from "sql.js";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TTableRow,
} from "./ui/table";
import { Button } from "./ui/button";

interface TableRow {
  [key: string]: SqlValue;
}

interface DBTableProps {
  tableName: string;
  rowCount: number;
}

export function DBTable({ tableName, rowCount }: DBTableProps) {
  const { query, db } = useSQLiteStore();
  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [isEmpty, setIsEmpty] = useState(true);

  const rowsPerPage = 30;
  const totalPages = Math.ceil(rowCount / rowsPerPage);

  const nextPage = () => {
    setPage((prev) =>
      prev + rowsPerPage < rowCount ? prev + rowsPerPage : prev
    );
  };

  const prevPage = () => {
    setPage((prev) => (prev > 0 ? prev - rowsPerPage : 0));
  };

  useEffect(() => {
    if (db) {
      const tableResult: QueryExecResult[] = query(
        `SELECT * FROM ${tableName} LIMIT ${rowsPerPage} OFFSET ${page};`
      );
      if (tableResult.length > 0) {
        setIsEmpty(false);
        const tableData: TableRow[] = tableResult[0].values.map((row) =>
          tableResult[0].columns.reduce((acc, col, index) => {
            acc[col] = row[index];
            return acc;
          }, {} as TableRow)
        );
        setColumns(tableResult[0].columns);
        setData(tableData);
        console.log(tableData);
      } else {
        setIsEmpty(true);
      }
    }
  }, [db, query, tableName, page]);

  return (
    <div>
      {data.length > 0 && (
        <Table>
          <TableHeader>
            <TTableRow>
              {columns.map((col, index) => (
                <TableHead key={index}>{col}</TableHead>
              ))}
            </TTableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TTableRow key={rowIndex}>
                {columns.map((col, cellIndex) => (
                  <TableCell key={cellIndex}>{row[col]}</TableCell>
                ))}
              </TTableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <section className="flex items-center justify-center fixed bottom-2 left-0 right-0">
        <div className="flex justify-between gap-2 bg-secondary p-2 border rounded">
          <Button onClick={prevPage} disabled={page === 0}>
            Prev
          </Button>
          <span className="text-sm flex items-center justify-center">
            Page {Math.floor(page / rowsPerPage) + 1} of {totalPages}
          </span>
          <Button onClick={nextPage} disabled={page + rowsPerPage >= rowCount}>
            Next
          </Button>
        </div>
      </section>
    </div>
  );
}
