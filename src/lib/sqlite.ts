import initSqlJs, { type Database, type QueryExecResult } from "sql.js";
import { saveAs } from "file-saver";
import type { TableRow } from "@/types";

const SQL_WASM_PATH = "/sql.wasm";

export const loadDatabase = async (file: File): Promise<Database> => {
  try {
    const [arrayBuffer, SQL] = await Promise.all([
      file.arrayBuffer(),
      initSqlJs({ locateFile: () => SQL_WASM_PATH })
    ]);
    return new SQL.Database(new Uint8Array(arrayBuffer));
  } catch (error) {
    console.error("Failed to load database:", error);
    throw error;
  }
};

export const getTableNames = (database: Database): string[] => {
  try {
    const result = database.exec(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    return (result[0]?.values.flat() as string[]) || [];
  } catch (error) {
    console.error("Failed to get table names:", error);
    return [];
  }
};

export const getTableSchema = async (database: Database, tableName: string) => {
  try {
    const [tableInfoResult, foreignKeyInfoResult] = database.exec(`
      PRAGMA table_info("${tableName}");
      PRAGMA foreign_key_list("${tableName}");
    `);

    const tableSchema = tableInfoResult.values.reduce(
      (acc, row) => {
        acc[row[1] as string] = {
          type: row[2] ? (row[2] as string).toUpperCase() : (row[2] as string),
          isPrimaryKey: (row[5] as number) === 1, // 1 means the column is a primary key
          isForeignKey: false,
          nullable: (row[3] as number) === 0 // 0 means the column is nullable
        };
        return acc;
      },
      {} as Record<
        string,
        {
          type: string;
          isPrimaryKey: boolean;
          isForeignKey: boolean;
          nullable: boolean;
        }
      >
    );

    foreignKeyInfoResult?.values.forEach((row) => {
      const columnName = row[3] as string;
      if (tableSchema[columnName]) {
        tableSchema[columnName].isForeignKey = true;
      }
    });

    return tableSchema;
  } catch (error) {
    console.error(`Failed to get schema for table "${tableName}":`, error);
    throw error;
  }
};

// Map query results to data and columns
export const mapQueryResults = (
  result: QueryExecResult[]
): {
  data: TableRow[];
  columns: string[];
} => {
  if (result.length === 0) return { data: [], columns: [] };

  const { columns, values } = result[0];
  const data = values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
  return { data, columns };
};

export const downloadDatabase = (database: Database): void => {
  try {
    const binaryArray = database.export();
    const blob = new Blob([binaryArray], { type: "application/x-sqlite3" });
    saveAs(blob, "database.sqlite");
  } catch (error) {
    console.error("Failed to export database:", error);
    throw error;
  }
};

const arrayToCSV = (columns: string[], rows: any[]): string => {
  const header = columns.map((col) => `"${col}"`).join(",");
  const csvRows = rows.map((row) =>
    columns.map((col) => `"${row[col] ?? ""}"`).join(",")
  );
  return [header, ...csvRows].join("\n");
};

const exportFromQuery = (
  query: string,
  database: Database,
  tableName: string
): void => {
  try {
    const result = database.exec(query);
    if (result.length === 0) {
      throw new Error(`Query "${query}" returned no results.`);
    }
    const { data, columns } = mapQueryResults(result);
    const csvContent = arrayToCSV(columns, data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${tableName}.csv`);
  } catch (error) {
    console.error(`Failed to get CSV for query "${query}":`, error);
    throw error;
  }
};

export const exportTableAsCSV = (
  database: Database,
  tableIndex: number
): void => {
  const tableNames = getTableNames(database);
  const tableName = tableNames[tableIndex];
  const query = `SELECT * FROM "${tableName}"`;
  exportFromQuery(query, database, tableName);
};

export const exportAllTablesAsCSV = (database: Database): void => {
  getTableNames(database).forEach((tableName) => {
    const query = `SELECT * FROM "${tableName}"`;
    exportFromQuery(query, database, tableName);
  });
};

export const exportCustomQueryAsCSV = (
  database: Database,
  query: string
): void => {
  exportFromQuery(query, database, "custom_query");
};
