export type TableSchema = Record<
  string,
  {
    sql: string;
    schema: TableSchemaRow[];
  }
>;

export type IndexSchema = {
  name: string;
  sql: string;
  tableName: string;
};

export type TableSchemaRow = {
  name: string; // Column name
  cid: number;
  type: string;
  notnull: number;
  dflt_value: string;
  pk: number;
};
