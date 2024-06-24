import { useState, useEffect } from "react";
import useSQLiteStore from "../store/useSQLiteStore";

import type { SqlValue, QueryExecResult } from "sql.js";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TTableRow,
} from "./ui/table";
import { Separator } from "./ui/separator";
import PageSelect from "./page-select";

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
      <Separator />
      <PageSelect
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        rowCount={rowCount}
      />
    </div>
  );
}
