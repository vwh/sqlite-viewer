import type { SqlValue } from "sql.js";

export interface TableInfo {
  [key: string]: {
    [columnName: string]: {
      type: string;
      isPrimaryKey: boolean;
      isForeignKey: boolean;
    };
  };
}

export interface TableRow {
  [key: string]: SqlValue;
}

export interface ColumnSchema {
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  type?: string;
}
