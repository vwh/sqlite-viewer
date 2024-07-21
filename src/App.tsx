import useSQLiteStore from "./store/useSQLiteStore";
import { useEffect, useState } from "react";

import { DBTable } from "./components/table";
import { UploadFile } from "./components/dropzone";
import Loading from "./components/loading";
import Logo from "./components/logo";

function App() {
  const { db, tables, isLoading, loadDatabase } = useSQLiteStore();
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const url = decodeURIComponent(urlParams.get("url") || "");

    const fetchDatabase = async () => {
      if (url) {
        try {
          const response = await fetch(`https://corsproxy.io/?${url}`);
          if (response.ok) {
            const blob = await response.blob();
            const file = new File([blob], "database.sqlite");
            await loadDatabase(file);
          } else {
            setFetchError(`URL not found or invalid: ( ${response.status} )`);
          }
        } catch (error) {
          if (error instanceof Error) {
            setFetchError(
              `${error.message}, Error while fetching database from URL: ${url}`
            );
          }
        }
      }
    };

    fetchDatabase();
  }, [loadDatabase]);

  return (
    <div className="flex flex-col gap-3">
      {!db && <Logo />}
      <UploadFile />
      <Loading />
      {fetchError && (
        <div className="text-center text-red-500 font-semibold md:text-2xl p-10 border rounded mb-2">
          {fetchError}
        </div>
      )}
      {!isLoading &&
        db &&
        (tables.length > 0 ? (
          <DBTable />
        ) : (
          <div className="text-center font-semibold md:text-2xl p-10 border rounded mb-2">
            Your database is empty, no tables found
          </div>
        ))}
    </div>
  );
}

export default App;
