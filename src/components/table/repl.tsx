import { useCallback, useEffect } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import useTheme from "@/hooks/useTheme";

import { format } from "sql-formatter";

import CodeMirror from "@uiw/react-codemirror";
import { sql, SQLite } from "@codemirror/lang-sql";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { nord } from "@uiw/codemirror-theme-nord"; // Import the Nord theme

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

  // Format query on change
  useEffect(() => {
    setCustomQuery(sqlFormat(customQuery));
  }, [queryHistory]);

  const myCompletions = useCallback((context: CompletionContext) => {
    const word = context.matchBefore(/\w*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    return {
      from: word.from,
      to: word.to,
      options: [
        ...KEYWORDS.map((keyword) => ({ label: keyword, type: "keyword" }))
      ]
    };
  }, []);

  const handleBlur = useCallback(() => {
    setCustomQuery(sqlFormat(customQuery));
  }, [customQuery, sqlFormat]);

  const handleChange = useCallback((newValue: string) => {
    setCustomQuery(newValue);
  }, []);

  return (
    <CodeMirror
      value={customQuery}
      height="126px"
      extensions={[
        SQLite,
        sql(),
        autocompletion({ override: [myCompletions] })
      ]}
      onChange={handleChange}
      onBlur={handleBlur}
      className="rounded-md border"
      theme={isDark ? nord : "light"} // Apply Nord theme
    />
  );
}

function sqlFormat(code: string) {
  return format(code, {
    language: "sqlite",
    useTabs: false
  });
}
