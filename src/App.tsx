import { useEffect } from "react";
import useSQLiteStore from "./store/useSQLiteStore";

import { DBTable } from "./components/table";
import { UploadFile } from "./components/dropzone";
import Loading from "./components/loading";

function App() {
  const { db, query, tables, setTables } = useSQLiteStore();

  useEffect(() => {
    if (db) {
      const tablesResult = query(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      if (tablesResult.length > 0) {
        const tableNames = tablesResult[0].values.map((row) => row[0]);
        const tableCountsPromises = tableNames.map(async (tableName) => {
          const countResult = query(`SELECT COUNT(*) FROM "${tableName}"`);
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

  return (
    <div className="flex flex-col gap-2">
      {!db && (
        <>
          <section className="flex justify-center border rounded py-2">
            <div className="flex flex-col items-center gap-2">
              <img
                title="SQLite Logo"
                src="https://raw.githubusercontent.com/vwh/sqlite-viewer/main/public/logo.webp"
                alt="SQLite Logo"
                className="h-20"
              />
              <p className="text-sm">View SQLite file online</p>
            </div>
          </section>
        </>
      )}
      <UploadFile />
      <Loading />
      {tables.length > 0 && <DBTable />}
    </div>
  );
}

export default App;
