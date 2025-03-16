export type TableSchema = Record<
  string,
  {
    schema: TableSchemaRow[];
  }
>;

export type IndexSchema = {
  name: string;
  tableName: string;
};

export type TableSchemaRow = {
  name: string; // Column name
  cid: number;
  type: string | null;
  dflt_value: string;
  IsNullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
};
