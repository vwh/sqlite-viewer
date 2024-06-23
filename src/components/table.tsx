import { useState, useEffect } from "react";
import useSQLiteStore from "../store/useSQLiteStore";

import { SqlValue, QueryExecResult } from "sql.js";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TTableRow,
} from "./ui/table";

interface TableProps {
  tableName: SqlValue;
}

interface TableRow {
  [key: string]: SqlValue;
}

export function DBTable({ tableName }: TableProps) {
  const { query, db } = useSQLiteStore();
  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const [page, setPage] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);

  function nextPage() {
    setPage(page + 30);
  }

  function prevPage() {
    if (page > 0) {
      setPage(page - 30);
    }
  }

  useEffect(() => {
    if (db) {
      const tableResult: QueryExecResult[] = query(
        `SELECT * FROM ${tableName} LIMIT ${page}, 30;`
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
          <TableCaption>A list of your recent invoices.</TableCaption>
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
      <button onClick={prevPage}>Prev</button>
      <button onClick={nextPage} disabled={isEmpty}>
        Next
      </button>
    </div>
  );
}
