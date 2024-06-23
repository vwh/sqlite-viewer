import { useState, useEffect } from "react";
import "./App.css";

import { SqlValue, QueryExecResult } from "sql.js";
import useSQLiteStore from "./store/useSQLiteStore";

interface TableProps {
  tableName: SqlValue;
}

interface TableRow {
  [key: string]: SqlValue;
}

export function Table({ tableName }: TableProps) {
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
        <table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, cellIndex) => (
                  <td key={cellIndex}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={prevPage}>Prev</button>
      <button onClick={nextPage} disabled={isEmpty}>
        Next
      </button>
    </div>
  );
}

function App() {
  const { db, query, loadDatabase, tables, setTables } = useSQLiteStore();

  useEffect(() => {
    if (db) {
      const tablesResult = query(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      if (tablesResult.length > 0) {
        console.log("Tables:", tablesResult);
        setTables(tablesResult[0].values);
      }
    }
  }, [db, query, setTables]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await loadDatabase(file);
    }
  };

  if (!db) {
    return (
      <div>
        <h1>SQLite File Loader</h1>
        <input type="file" onChange={handleFileChange} />
      </div>
    );
  }
  if (tables.length > 0) {
    return (
      <>
        <Table tableName={tables[0][0]} />
      </>
    );
  }

  return <div>Loading...</div>;
}

export default App;
