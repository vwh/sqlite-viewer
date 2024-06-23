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
        console.log("Tables:", tablesResult);
        setTables(tablesResult[0].values);
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
        <DBTable tableName={tables[0][0]} />
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default App;
