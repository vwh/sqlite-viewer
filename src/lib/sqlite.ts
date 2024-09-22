import initSqlJs, { type Database, type QueryExecResult } from "sql.js";
import { saveAs } from "file-saver";
import type { TableRow } from "@/types";

const SQL_WASM_PATH = "/sql.wasm";

// Initialize SQL.js once
let SQL: Awaited<ReturnType<typeof initSqlJs>>;
const initSQL = async () => {
  if (!SQL) {
    SQL = await initSqlJs({ locateFile: () => SQL_WASM_PATH });
  }
  return SQL;
};

export const loadDatabaseBytes = async (
  bytes: Uint8Array
): Promise<Database> => {
  try {
    const SQL = await initSQL();
    return new SQL.Database(bytes);
  } catch (error) {
    console.error("Failed to load database:", error);
    throw error;
  }
};

export const getTableNames = (database: Database): string[] => {
  try {
    const stmt = database.prepare(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    const names: string[] = [];
    while (stmt.step()) {
      names.push(stmt.get()[0] as string);
    }
    stmt.free();
    return names;
  } catch (error) {
    console.error("Failed to get table names:", error);
    return [];
  }
};

export const getTableSchema = (database: Database, tableName: string) => {
  try {
    const tableSchema: Record<
      string,
      {
        type: string;
        isPrimaryKey: boolean;
        isForeignKey: boolean;
        nullable: boolean;
      }
    > = {};

    const tableInfoStmt = database.prepare(
      `PRAGMA table_info("${tableName}");`
    );
    while (tableInfoStmt.step()) {
      const row = tableInfoStmt.getAsObject();
      tableSchema[row.name as string] = {
        type: row.type
          ? (row.type as string).toUpperCase()
          : (row.type as string),
        isPrimaryKey: row.pk === 1,
        isForeignKey: false,
        nullable: row.notnull === 0
      };
    }
    tableInfoStmt.free();

    const foreignKeyStmt = database.prepare(
      `PRAGMA foreign_key_list("${tableName}");`
    );
    while (foreignKeyStmt.step()) {
      const row = foreignKeyStmt.getAsObject();
      if (tableSchema[row.from as string]) {
        tableSchema[row.from as string].isForeignKey = true;
      }
    }
    foreignKeyStmt.free();

    return tableSchema;
  } catch (error) {
    console.error(`Failed to get schema for table "${tableName}":`, error);
    throw error;
  }
};

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
    const stmt = database.prepare(query);
    const columns: string[] = stmt.getColumnNames();
    const data: TableRow[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject();
      data.push(row as TableRow);
    }
    stmt.free();

    if (data.length === 0) {
      throw new Error(`Query "${query}" returned no results.`);
    }

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
  const tableNames = getTableNames(database);
  for (const tableName of tableNames) {
    const query = `SELECT * FROM "${tableName}"`;
    exportFromQuery(query, database, tableName);
  }
};

export const exportCustomQueryAsCSV = (
  database: Database,
  query: string
): void => {
  exportFromQuery(query, database, "custom_query");
};
