import { useCallback, useMemo } from "react";
import { useTheme } from "./theme/themeProvider";

import CodeMirror from "@uiw/react-codemirror";
import { darcula } from "@uiw/codemirror-theme-darcula";
import { sql, SQLite } from "@codemirror/lang-sql";
import {
  autocompletion,
  type CompletionContext,
} from "@codemirror/autocomplete";

import type { TableSchema } from "@/types";

// SQLlite Keywords used for autocompletion
const SQLITE_KEYWORDS = [
  "ABORT",
  "ACTION",
  "ADD",
  "AFTER",
  "ALL",
  "ALTER",
  "ANALYZE",
  "AND",
  "AS",
  "ASC",
  "ATTACH",
  "AUTOINCREMENT",
  "BEFORE",
  "BEGIN",
  "BETWEEN",
  "BY",
  "CASCADE",
  "CASE",
  "CAST",
  "CHECK",
  "COLLATE",
  "COLUMN",
  "COMMIT",
  "CONFLICT",
  "CONSTRAINT",
  "CREATE",
  "CROSS",
  "CURRENT_DATE",
  "CURRENT_TIME",
  "CURRENT_TIMESTAMP",
  "DATABASE",
  "DEFAULT",
  "DEFERRABLE",
  "DEFERRED",
  "DELETE",
  "DESC",
  "DETACH",
  "DISTINCT",
  "DROP",
  "EACH",
  "ELSE",
  "END",
  "ESCAPE",
  "EXCEPT",
  "EXCLUSIVE",
  "EXISTS",
  "EXPLAIN",
  "FAIL",
  "FOR",
  "FOREIGN",
  "FROM",
  "FULL",
  "GLOB",
  "GROUP",
  "HAVING",
  "IF",
  "IGNORE",
  "IMMEDIATE",
  "IN",
  "INDEX",
  "INDEXED",
  "INITIALLY",
  "INNER",
  "INSERT",
  "INSTEAD",
  "INTERSECT",
  "INTO",
  "IS",
  "ISNULL",
  "JOIN",
  "KEY",
  "LEFT",
  "LIKE",
  "LIMIT",
  "MATCH",
  "NATURAL",
  "NO",
  "NOT",
  "NOTNULL",
  "NULL",
  "OF",
  "OFFSET",
  "ON",
  "OR",
  "ORDER",
  "OUTER",
  "PLAN",
  "PRAGMA",
  "PRIMARY",
  "QUERY",
  "RAISE",
  "RECURSIVE",
  "REFERENCES",
  "REGEXP",
  "REINDEX",
  "RELEASE",
  "RENAME",
  "REPLACE",
  "RESTRICT",
  "RIGHT",
  "ROLLBACK",
  "ROW",
  "SAVEPOINT",
  "SELECT",
  "SET",
  "TABLE",
  "TEMP",
  "TEMPORARY",
  "THEN",
  "TO",
  "TRANSACTION",
  "TRIGGER",
  "UNION",
  "UNIQUE",
  "UPDATE",
  "USING",
  "VACUUM",
  "VALUES",
  "VIEW",
  "VIRTUAL",
  "WHEN",
  "WHERE",
  "WITH",
  "WITHOUT",
];

interface CustomSQLTextareaProps {
  value: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  tableSchema: TableSchema;
  columns: string[];
}

export default function CustomSQLTextarea({
  query,
  setQuery,
  tableSchema,
  columns,
}: CustomSQLTextareaProps) {
  const { theme } = useTheme();
  const tableNames = useMemo(() => Object.keys(tableSchema), [tableSchema]);

  const completionOptions = useMemo(
    () => [
      ...SQLITE_KEYWORDS.map((keyword) => ({
        label: keyword,
        type: "keyword",
      })),
      ...tableNames.map((table) => ({ label: table, type: "table" })),
      ...columns.map((column) => ({ label: column, type: "column" })),
    ],
    [tableNames, columns]
  );

  const myCompletions = useCallback(
    (context: CompletionContext) => {
      const word = context.matchBefore(/\w*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;

      return {
        from: word.from,
        to: word.to,
        options: completionOptions,
      };
    },
    [completionOptions]
  );

  const handleChange = useCallback(
    (newValue: string) => {
      setQuery(newValue);
    },
    [setQuery]
  );

  const extensions = useMemo(
    () => [SQLite, sql(), autocompletion({ override: [myCompletions] })],
    [myCompletions]
  );

  return (
    <CodeMirror
      value={query}
      height="100%"
      extensions={extensions}
      onChange={handleChange}
      className="w-full h-full"
      theme={theme === "dark" ? darcula : "light"}
    />
  );
}
