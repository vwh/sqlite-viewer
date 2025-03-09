import initSqlJs from "sql.js";
import DEMO_DB from "./demo-db";

import type { Database, SqlJsStatic } from "sql.js";
import type { IndexSchema, TableSchema, TableSchemaRow } from "@/types";

export default class Sqlite {
  static sqlJsStatic?: SqlJsStatic;
  private db: Database;

  private limit: number = 50;
  public firstTable: string | null = null;
  public tablesSchema: TableSchema = {};
  public indexesSchema: IndexSchema[] = [];

  private constructor(db: Database, isFile = false) {
    this.db = db;

    // Check if user is opening a file or creating a new database.
    if (!isFile) {
      // The demo database
      this.db.exec(DEMO_DB);
    }

    this.getDatabaseSchema();
  }

  // Initialize SQL.js
  private static async initSQLjs(): Promise<SqlJsStatic> {
    if (Sqlite.sqlJsStatic) return Sqlite.sqlJsStatic;
    return await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
  }

  // Initialize a new database
  public static async create(): Promise<Sqlite> {
    const SQL = await Sqlite.initSQLjs();
    const db = new SQL.Database();
    return new Sqlite(db, false);
  }

  // Initialize a new database from a file
  public static async open(file: Uint8Array): Promise<Sqlite> {
    const SQL = await Sqlite.initSQLjs();
    const db = new SQL.Database(file);
    return new Sqlite(db, true);
  }

  // Execute a SQL statement
  public exec(sql: string) {
    const results = this.db.exec(sql);
    const upperSql = sql.toUpperCase();
    // If the statement requires schema updates
    let doTablesChanged = false;

    // Update tables if the SQL statement is a CREATE TABLE statement.
    if (isStructureChangeable(upperSql)) {
      this.getDatabaseSchema(); // Update schema after creating a new table.
      doTablesChanged = true;
    }

    return [results, doTablesChanged] as const;
  }

  // Return the database as bytes
  // Used for downloading the database
  public download() {
    return this.db.export();
  }

  // Get the information of a table
  // This includes the columns, primary key, default values, ...
  private getTableInfo(tableName: string) {
    const [pragmaTableInfoResults] = this.exec(
      `PRAGMA table_info(${tableName})`
    );
    const [pragmaForeignKeysResults] = this.exec(
      `PRAGMA foreign_key_list("${tableName}")`
    );

    const foreignKeys: Record<string, boolean> = {};
    if (pragmaForeignKeysResults.length > 0) {
      for (const row of pragmaForeignKeysResults[0].values) {
        foreignKeys[row[3] as string] = true; // Get the 'from'
      }
    }

    const tableSchema: TableSchemaRow[] = [];
    if (pragmaTableInfoResults.length > 0) {
      for (const row of pragmaTableInfoResults[0].values) {
        const [cid, name, type, notnull, dflt_value, pk] = row;
        tableSchema.push({
          name: (name as string) || "Unknown",
          cid: cid as number,
          type: (type as string) || "Unknown",
          dflt_value: dflt_value as string,
          IsNullable: (notnull as number) === 0,
          isPrimaryKey: (pk as number) === 1,
          isForeignKey: foreignKeys[name as string] ?? false,
        });
      }
    } else {
      console.error("No table info found");
    }

    return tableSchema;
  }

  // Get the schema of the database
  // This includes tables, indexes, and foreign keys
  // TODO: Add foreign keys
  private getDatabaseSchema() {
    // Reset the schema
    this.tablesSchema = {};
    this.indexesSchema = [];
    this.firstTable = null;

    const [results] = this.exec(
      "SELECT type, name, sql, tbl_name FROM sqlite_master WHERE name != 'sqlite_sequence'"
    );

    if (results.length === 0) return;

    for (const row of results[0].values) {
      const [type, name, sql, tableName] = row;
      if (type === "table") {
        const tableSchema = this.getTableInfo(tableName as string);
        this.tablesSchema[tableName as string] = {
          schema: tableSchema,
          sql: sql as string,
        };
      } else if (type === "index") {
        this.indexesSchema.push({
          name: name as string,
          sql: sql as string,
          tableName: tableName as string,
        });
      }
    }

    this.firstTable = Object.keys(this.tablesSchema)[0];
  }

  // Get the max size of the requested table
  // Used for pagination
  private getMaxSizeOfTable(
    tableName: string,
    filters: Record<string, string> | null = null
  ) {
    const [results] = this.exec(`
      SELECT COUNT(*) FROM ${tableName} 
      ${buildWhereClause(filters)}
    `);

    if (results.length === 0) return 0;

    return Math.ceil((results[0].values[0][0] as number) / this.limit);
  }

  // Get the data for the requested table
  // Applies filters and sorters to the data
  public getTableData(
    table: string,
    page: number,
    filters: Record<string, string> | null = null,
    sorters: Record<string, string> | null = null
  ) {
    const [limit, offset] = [this.limit, (page - 1) * this.limit];
    const [results] = this.exec(`
      SELECT * FROM ${table} 
      ${buildWhereClause(filters)} 
      ${buildOrderByClause(sorters)} 
      LIMIT ${limit} OFFSET ${offset}
    `);

    // If the table is empty return an empty array
    if (results.length === 0) return [];

    const maxSize = this.getMaxSizeOfTable(table, filters);
    return [results, maxSize] as const;
  }

  // Update the values of a row in a table
  public update(
    table: string,
    columns: string[],
    values: string[],
    whereValues: string[]
  ) {
    try {
      const setClause = columns.map((column) => `${column} = ?`).join(", ");
      const whereClause = columns
        .map((column) => `${column} = ?`)
        .join(" AND ");
      const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
      const stmt = this.db.prepare(query);

      stmt.run([...values, ...whereValues]);
      stmt.free();
    } catch (error) {
      throw new Error(`Error while updating table ${table}: ${error}`);
    }
  }

  // Delete a row from a table
  public delete(table: string, columns: string[], values: string[]) {
    try {
      const whereClause = columns
        .map((column) => `${column} = ?`)
        .join(" AND ");
      const query = `DELETE FROM ${table} WHERE ${whereClause}`;
      const stmt = this.db.prepare(query);
      stmt.run([...values]);
      stmt.free();
    } catch (error) {
      throw new Error(`Error while deleting from table ${table}: ${error}`);
    }
  }
}

// Check if the SQL statement is a structure changeable statement
function isStructureChangeable(sql: string) {
  const match = sql.match(/^\s*(CREATE|DROP|ALTER)\s/i);
  return match !== null;
}

// Build the WHERE clause for a SQL statement
function buildWhereClause(filters: Record<string, string> | null = null) {
  if (!filters) return "";

  const filtersArray = Object.entries(filters)
    .map(([column, value]) => `${column} LIKE '%${value}%' ESCAPE '\\'`)
    .join(" AND ");
  return `WHERE ${filtersArray}`;
}

// Build the ORDER BY clause for a SQL statement
function buildOrderByClause(sorters: Record<string, string> | null = null) {
  if (!sorters) return "";

  const sortersArray = Object.entries(sorters)
    .map(([column, order]) => `${column} ${order}`)
    .join(", ");
  return `ORDER BY ${sortersArray}`;
}
