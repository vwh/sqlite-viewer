import initSqlJs from "sql.js";
import type { Database, SqlJsStatic } from "sql.js";

export default class Sqlite {
  static debug = 0;
  static sqlJsStatic?: SqlJsStatic;

  private db: Database;

  public tables: string[] = [];
  public schema: Map<
    string,
    {
      name: string;
      cid: number;
      type: string;
      notnull: number;
      dflt_value: string;
      pk: number;
    }[]
  > = new Map();

  private constructor(db: Database, isFile = false) {
    this.db = db;

    // Check if user is opening a file or creating a new database.
    if (isFile) {
      this.getTableNames();
      this.getDatabaseSchema();
    } else {
      this.exec(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)"
      );
      this.exec(
        "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, content TEXT)"
      );
      this.exec("INSERT INTO users (name) VALUES ('John')");
      this.exec("INSERT INTO users (name) VALUES ('Jane')");
      this.exec(
        "INSERT INTO posts (user_id, title, content) VALUES (1, 'Hello', 'World')"
      );
      this.exec(
        "INSERT INTO posts (user_id, title, content) VALUES (2, 'Hello', 'World')"
      );
      this.getDatabaseSchema();
    }
  }

  private static async initSQLjs(): Promise<SqlJsStatic> {
    if (Sqlite.sqlJsStatic) return Sqlite.sqlJsStatic;

    Sqlite.debug += 1;
    console.log("Initializing SQLite", Sqlite.debug);

    return await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
  }

  public static async create(): Promise<Sqlite> {
    const SQL = await Sqlite.initSQLjs();
    const db = new SQL.Database();
    return new Sqlite(db, false);
  }

  public static async open(file: Uint8Array): Promise<Sqlite> {
    const SQL = await Sqlite.initSQLjs();
    const db = new SQL.Database(file);
    return new Sqlite(db, true);
  }

  public exec(sql: string) {
    let doTablesChanged = false;

    const results = this.db.exec(sql);
    const upperSql = sql.toUpperCase();

    // Update tables if the SQL statement is a CREATE TABLE statement.
    if (upperSql.includes("CREATE TABLE")) {
      this.getTableNames();
      this.getDatabaseSchema(); // Update schema after creating a new table.
      doTablesChanged = true;
    }

    // Update schema if the SQL statement is ALTER TABLE || UPDATE statements.
    if (upperSql.includes("ALTER TABLE") || upperSql.includes("UPDATE")) {
      this.getDatabaseSchema();
    }

    return [results, doTablesChanged] as const;
  }

  private getTableNames() {
    const [results] = this.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence'"
    );

    if (results.length === 0) return [];
    this.tables = results[0].values.map((value) => value[0] as string);
  }

  private getTableSchema(tableName: string) {
    const [results] = this.exec(`PRAGMA table_info(${tableName})`);

    if (results.length === 0) throw new Error("Table not found");

    const tableSchema: {
      name: string;
      cid: number;
      type: string;
      notnull: number;
      dflt_value: string;
      pk: number;
    }[] = [];
    for (const row of results[0].values) {
      const [cid, name, type, notnull, dflt_value, pk] = row;
      tableSchema.push({
        name: name as string,
        cid: cid as number,
        type: type as string,
        notnull: notnull as number,
        dflt_value: dflt_value as string,
        pk: pk as number,
      });
    }

    this.schema.set(tableName, tableSchema);
  }

  private getDatabaseSchema() {
    const tables = this.tables;
    for (const table of tables) {
      this.getTableSchema(table);
    }
  }

  public getTableData(table: string, page: number) {
    const [limit, offset] = [10, (page - 1) * 10];
    const [results] = this.exec(
      `SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`
    );

    if (results.length === 0) return [];
    return results;
  }
}
