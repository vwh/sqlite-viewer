import { useEffect } from "react";
import useSQLiteStore from "./store/useSQLiteStore";

import { DBTable } from "./components/table";
import { Separator } from "./components/ui/separator";
import { TableSelect } from "./components/table-select";
import { UploadFile } from "./components/dropzone";

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
    <>
      <UploadFile />
      {/* {!db && !tables.length && <p>Loading...</p>} */}
      {db && tables.length > 0 && (
        <>
          <TableSelect />
          <Separator className="mt-2" />
          <DBTable />
        </>
      )}
    </>
  );
}

export default App;
