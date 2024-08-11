import { useCallback, useEffect, useMemo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import useTheme from "@/hooks/useTheme";

import { format } from "sql-formatter";
import { sql, SQLite } from "@codemirror/lang-sql";

import CodeMirror from "@uiw/react-codemirror";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

import { nord } from "@uiw/codemirror-theme-nord";

// SQL Keywords used for autocompletion
const KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "DROP",
  "ALTER",
  "JOIN",
  "LEFT",
  "RIGHT",
  "INNER",
  "OUTER",
  "GROUP BY",
  "ORDER BY",
  "LIMIT",
  "OFFSET",
  "AND",
  "OR",
  "NOT",
  "NULL",
  "LIKE",
  "IN",
  "IS",
  "AS"
];

export default function SqlRepl() {
  const { customQuery, setCustomQuery, queryHistory } = useSQLiteStore();
  const isDark = useTheme();

  // update customQuery formatted on queryHistory change
  useEffect(() => {
    setCustomQuery(sqlFormat(customQuery));
  }, [queryHistory]);

  const myCompletions = useCallback((context: CompletionContext) => {
    const word = context.matchBefore(/\w*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;
    return {
      from: word.from,
      to: word.to,
      options: KEYWORDS.map((keyword) => ({ label: keyword, type: "keyword" }))
    };
  }, []);

  const handleBlur = useCallback(() => {
    setCustomQuery(sqlFormat(customQuery));
  }, [customQuery, setCustomQuery]);

  const handleChange = useCallback(
    (newValue: string) => {
      setCustomQuery(newValue);
    },
    [setCustomQuery]
  );

  const extensions = useMemo(
    () => [SQLite, sql(), autocompletion({ override: [myCompletions] })],
    [myCompletions]
  );

  return (
    <CodeMirror
      value={customQuery}
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
  return format(code, {
    language: "sqlite",
    useTabs: false,
    keywordCase: "upper",
    tabWidth: 2,
    expressionWidth: 100,
    linesBetweenQueries: 1
  });
}
