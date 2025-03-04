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
  dflt_value: string;
  IsNullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
};
