import { useEffect } from "react";
import useSQLiteStore from "./store/useSQLiteStore";

import { DBTable } from "./components/table";

function App() {
  const { db, query, loadDatabase, tables, setTables } = useSQLiteStore();

  useEffect(() => {
    if (db) {
      const tablesResult = query(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      if (tablesResult.length > 0) {
        const tableNames = tablesResult[0].values.map((row) => row[0]);
        const tableCountsPromises = tableNames.map(async (tableName) => {
          const countResult = query(`SELECT COUNT(*) FROM ${tableName}`);
          const count = parseInt(countResult[0].values[0][0] as string, 10);
          return { name: tableName as string, count };
        });

        Promise.all(tableCountsPromises).then((tablesWithCounts) => {
          console.log("Tables with row counts:", tablesWithCounts);
          setTables(tablesWithCounts);
        });
      }
    }
  }, [db, query, setTables]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await loadDatabase(file);
    }
  };

  if (!db) {
    return (
      <div>
        <h1>SQLite File Loader</h1>
        <input type="file" onChange={handleFileChange} />
      </div>
    );
  }
  if (tables.length > 0) {
    return (
      <div className="dark">
        <DBTable tableName={tables[0].name} rowCount={tables[0].count} />
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default App;
