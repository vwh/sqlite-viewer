import { useCallback, useEffect, useMemo, useState } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import useTheme from "@/hooks/useTheme";

import { format } from "sql-formatter";
import { sql, SQLite } from "@codemirror/lang-sql";

import CodeMirror from "@uiw/react-codemirror";
import {
  autocompletion,
  type CompletionContext
} from "@codemirror/autocomplete";

import { nord } from "@uiw/codemirror-theme-nord";

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
  "WITHOUT"
];

interface QueryTextareaProps {
  columnNames: string[];
}

export default function QueryTextarea({ columnNames }: QueryTextareaProps) {
  const { customQuery, setCustomQuery, tables } = useSQLiteStore();

  const [sqlQuery, setSqlQuery] = useState(customQuery);
  const isDark = useTheme();

  useEffect(() => {
    setSqlQuery(sqlFormat(customQuery));
  }, [customQuery]);

  const myCompletions = useCallback(
    (context: CompletionContext) => {
      const word = context.matchBefore(/\w*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;

      const options = [
        ...SQLITE_KEYWORDS.map((keyword) => ({
          label: keyword,
          type: "keyword"
        })),
        ...tables.map((table) => ({ label: table.name, type: "table" })),
        ...columnNames.map((column) => ({ label: column, type: "column" }))
      ];

      return {
        from: word.from,
        to: word.to,
        options: options
      };
    },
    [tables, columnNames]
  );

  const handleBlur = useCallback(() => {
    setSqlQuery(sqlFormat(customQuery));
  }, [customQuery]);

  const handleChange = useCallback(
    (newValue: string) => {
      setCustomQuery(newValue);
      setSqlQuery(newValue);
    },
    [setCustomQuery]
  );

  const extensions = useMemo(
    () => [SQLite, sql(), autocompletion({ override: [myCompletions] })],
    [myCompletions]
  );

  return (
    <CodeMirror
      value={sqlQuery}
      height="126px"
      extensions={extensions}
      onChange={handleChange}
      onBlur={handleBlur}
      className="rounded-md border"
      theme={isDark ? nord : "light"}
    />
  );
}

function sqlFormat(code: string) {
  try {
    return format(code, {
      language: "sqlite",
      useTabs: false,
      keywordCase: "upper",
      tabWidth: 2,
      expressionWidth: 100,
      linesBetweenQueries: 1
    });
  } catch {
    return code;
  }
}
