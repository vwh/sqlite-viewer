import useSQLiteStore from "./store/useSQLiteStore";
import { useEffect, useState, useRef } from "react";

import { DBTable } from "./components/table";
import UploadFile from "./components/dropzone";
import Loading from "./components/loading";
import Logo from "./components/logo";
import ErrorMessage from "./components/error";
import Dialog from "./components/dialog";
import Footer from "./components/footer.tsx";

function App() {
  const { db, tables, isLoading, loadDatabase } = useSQLiteStore();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [urlToFetch, setUrlToFetch] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const hasFetched = useRef(false);

  const fetchDatabase = async (url: string, useProxy: boolean = false) => {
    try {
      setIsFetching(true);
      const fetchUrl = useProxy ? `https://corsproxy.io/?${url}` : url;
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        setFetchError(`URL not found or invalid: ( ${response.status} )`);
      } else {
        const blob = await response.blob();
        const file = new File([blob], "database.sqlite");
        await loadDatabase(file);
        setFetchError(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (!useProxy) {
          setUrlToFetch(url);
          setShowDialog(true);
        } else {
          setFetchError(
            `Error fetching database from URL (with proxy): ${url} - ${error.message}`,
          );
        }
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const url = decodeURIComponent(urlParams.get("url") || "");

    if (url) {
      fetchDatabase(url);
      hasFetched.current = true;
    }
  }, []);

  const handleRetryWithProxy = () => {
    if (urlToFetch) {
      fetchDatabase(urlToFetch, true);
      setShowDialog(false);
    }
  };

  return (
    <>
      {!db && <Logo />}
      <UploadFile />
      {isLoading ? (
        <Loading>Loading SQLite file</Loading>
      ) : isFetching ? (
        <Loading>Fetching SQLite file</Loading>
      ) : null}
      {fetchError && !db && <ErrorMessage>{fetchError}</ErrorMessage>}
      {!isLoading &&
        db &&
        (tables.length > 0 ? (
          <DBTable />
        ) : (
          <ErrorMessage>Your database is empty, no tables found</ErrorMessage>
        ))}
      <Dialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        fn={handleRetryWithProxy}
      />
      {!db && <Footer />}
    </>
  );
}

export default App;
