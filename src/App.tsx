import { Button } from "@/components/ui/button";
import Sqlite from "./lib/sqlite";
import { useState, useEffect } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [sqlite, setSqlite] = useState<Sqlite | null>(null);

  useEffect(() => {
    // Initialize the sqlite instance asynchronously.
    async function initDb() {
      const instance = await Sqlite.create();
      setSqlite(instance);
    }
    initDb();
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const instance = await Sqlite.open(uint8Array);
      setSqlite(instance);
    };
    reader.readAsArrayBuffer(file);
  }

  function getTableNames() {
    if (!sqlite) return;
    console.log(sqlite.tables);
  }

  function getDatabaseSchema() {
    if (!sqlite) return;
    console.log(sqlite.schema);
  }

  function executeSql() {
    if (!sqlite) return;
    console.log(sqlite.exec(query));
  }

  // If the sqlite instance is not initialized, return a loading state.
  if (!sqlite) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <input
        type="text"
        placeholder="Enter SQL"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button onClick={executeSql}>Execute SQL</Button>

      <Button onClick={getTableNames}>Get Table Names</Button>

      <Button onClick={getDatabaseSchema}>Get Database Schema</Button>

      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default App;
