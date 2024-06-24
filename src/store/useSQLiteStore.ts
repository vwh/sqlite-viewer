import { create } from "zustand";
import initSqlJs, { Database, QueryExecResult } from "sql.js";

interface TableInfo {
  [key: string]: { [columnName: string]: string };
}

interface SQLiteState {
  db: Database | null;
  loadDatabase: (file: File) => Promise<void>;
  query: (sql: string) => QueryExecResult[] | [];
  tables: { name: string; count: number }[];
  setTables: (tables: { name: string; count: number }[]) => void;
  selectedTable: string;
  setSelectedTable: (value: string) => void;
  isLoading: boolean;
  tableSchemas: TableInfo;
  setTableSchemas: (schemas: TableInfo) => void;
}

const useSQLiteStore = create<SQLiteState>((set, get) => ({
  db: null,
  isLoading: false,

  loadDatabase: async (file: File) => {
    set({ isLoading: true });

    // Load database from file
    const arrayBuffer = await file.arrayBuffer();
    const SQL = await initSqlJs({
      locateFile: (fileName) => `https://sql.js.org/dist/${fileName}`,
    });
    const database = new SQL.Database(new Uint8Array(arrayBuffer));
    set({ db: database });
    console.log("Database loaded successfully");

    // Load table information here after database is loaded
    const tablesResult = database.exec(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    if (tablesResult.length > 0) {
      const tableNames = tablesResult[0].values.map((row) => row[0]);

      // Get row count and schema for each table
      const tableCountsPromises = tableNames.map(async (tableName) => {
        const countResult = database.exec(
          `SELECT COUNT(*) FROM "${tableName}"`
        );
        const count = parseInt(countResult[0].values[0][0] as string, 10);
        const tableInfoResult = database.exec(
          `PRAGMA table_info("${tableName}")`
        );
        const tableSchema = tableInfoResult[0].values.reduce((acc, row) => {
          acc[row[1] as string] = row[2] as string; // row[1] is the column name, row[2] is the type
          return acc;
        }, {} as { [columnName: string]: string });
        return { name: tableName as string, count, schema: tableSchema };
      });

      const tablesWithCountsAndSchemas = await Promise.all(tableCountsPromises);
      console.log(
        "Tables with row counts and schemas:",
        tablesWithCountsAndSchemas
      );
      set({
        tables: tablesWithCountsAndSchemas.map(({ name, count }) => ({
          name,
          count,
        })),
        tableSchemas: tablesWithCountsAndSchemas.reduce(
          (acc, { name, schema }) => {
            acc[name] = schema;
            return acc;
          },
          {} as TableInfo
        ),
      });
    }

    set({ isLoading: false });
  },

  query: (sql: string): QueryExecResult[] | [] => {
    const db = get().db;
    if (!db) {
      console.warn("Database is not loaded.");
      return [];
    }

    const result: QueryExecResult[] = db.exec(sql);
    console.log("Query executed:", sql, result);

    return result.length > 0 ? result : [];
  },

  tables: [],
  setTables: (tables: { name: string; count: number }[]) => set({ tables }),

  selectedTable: "0",
  setSelectedTable: (value: string) => set({ selectedTable: value }),

  tableSchemas: {},
  setTableSchemas: (schemas: TableInfo) => set({ tableSchemas: schemas }),
}));

export default useSQLiteStore;
