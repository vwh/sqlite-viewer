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

export function DBTable() {
  const { query, db, tables, selectedTable } = useSQLiteStore();
  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const tableName = tables[parseInt(selectedTable)].name;
  const rowCount = tables[parseInt(selectedTable)].count;

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
    setPage(0);
  }, [tableName]);

  useEffect(() => {
    if (db && tableName) {
      const tableResult: QueryExecResult[] = query(
        `SELECT * FROM "${tableName}" LIMIT ${rowsPerPage} OFFSET ${page};`
      );
      if (tableResult.length > 0) {
        const tableData: TableRow[] = tableResult[0].values.map((row) =>
          tableResult[0].columns.reduce((acc, col, index) => {
            acc[col] = row[index];
            return acc;
          }, {} as TableRow)
        );
        setColumns(tableResult[0].columns);
        setData(tableData);
        console.log(tableData);
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
