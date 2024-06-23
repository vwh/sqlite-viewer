import { create } from "zustand";
import initSqlJs, { Database, QueryExecResult } from "sql.js";

interface SQLiteState {
  db: Database | null;
  loadDatabase: (file: File) => Promise<void>;
  query: (sql: string) => QueryExecResult[] | [];
  tables: { name: string; count: number }[];
  setTables: (tables: { name: string; count: number }[]) => void;
}

const useSQLiteStore = create<SQLiteState>((set, get) => ({
  db: null,

  loadDatabase: async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const SQL = await initSqlJs({
      locateFile: (fileName) => `https://sql.js.org/dist/${fileName}`,
    });
    const database = new SQL.Database(new Uint8Array(arrayBuffer));
    set({ db: database });
    console.log("Database loaded successfully");
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
}));

export default useSQLiteStore;
