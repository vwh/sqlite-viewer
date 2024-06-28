import initSqlJs, { type Database } from "sql.js";

export const loadDatabase = async (file: File): Promise<Database> => {
  const arrayBuffer = await file.arrayBuffer();
  const SQL = await initSqlJs({
    locateFile: (fileName) => `https://sql.js.org/dist/${fileName}`,
  });
  return new SQL.Database(new Uint8Array(arrayBuffer));
};

export const getTableNames = (database: Database): string[] => {
  const result = database.exec(
    "SELECT name FROM sqlite_master WHERE type='table';"
  );
  return result[0]?.values.map((row) => row[0] as string) || [];
};

export const getTableSchema = async (database: Database, tableName: string) => {
  const tableInfoResult = database.exec(`PRAGMA table_info("${tableName}")`);
  const tableSchema = tableInfoResult[0].values.reduce((acc, row) => {
    acc[row[1] as string] = {
      type: row[2] as string,
      isPrimaryKey: (row[5] as number) === 1,
      isForeignKey: false,
    };
    return acc;
  }, {} as { [columnName: string]: { type: string; isPrimaryKey: boolean; isForeignKey: boolean } });

  const foreignKeyInfoResult = database.exec(
    `PRAGMA foreign_key_list("${tableName}")`
  );
  if (foreignKeyInfoResult.length > 0) {
    foreignKeyInfoResult[0].values.forEach((row) => {
      const columnName = row[3] as string;
      if (tableSchema[columnName]) {
        tableSchema[columnName].isForeignKey = true;
      }
    });
  }
  return tableSchema;
};
