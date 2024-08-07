import { useEffect, useState, useRef, useCallback } from "react";
import useSQLiteStore from "./store/useSQLiteStore";

import DBTable from "./components/table/table";
import UploadFile from "./components/landing/dropzone";
import StatusMessage from "./components/table/stats-message";
import Logo from "./components/landing/logo";
import Dialog from "./components/landing/dialog";
import Footer from "./components/landing/footer";
import Features from "./components/landing/features";

function App() {
  const { db, tables, isLoading, loadDatabase, expandPage } = useSQLiteStore();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [urlToFetch, setUrlToFetch] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const hasFetched = useRef(false);

  const fetchDatabase = useCallback(
    async (url: string, useProxy: boolean = false) => {
      const isGoodURL =
        /^(https?:\/\/(?:www\.)?[a-zA-Z0-9-]{1,256}\.[a-zA-Z]{2,6}(?:\/[^\s]*)?)$/i.test(
          url
        );
      if (!isGoodURL) {
        setFetchError("Invalid URL");
        return;
      }
      try {
        setIsFetching(true);
        const fetchUrl = useProxy
          ? `https://cors.eu.org/${encodeURIComponent(url)}`
          : url;
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error("URL not found or invalid");
        }
        const blob = await response.blob();
        const file = new File([blob], "database.sqlite");
        await loadDatabase(file);
        setFetchError(null);
      } catch (error) {
        if (!useProxy) {
          setUrlToFetch(url);
          setShowDialog(true);
        } else {
          setFetchError(
            `Error whilefetching, ${error instanceof Error ? error.message : String(error)}`
          );
        }
      } finally {
        setIsFetching(false);
      }
    },
    [loadDatabase]
  );

  useEffect(() => {
    if (hasFetched.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get("url");

    if (url) {
      fetchDatabase(decodeURIComponent(url));
      hasFetched.current = true;
    }
  }, [fetchDatabase]);

  const handleRetryWithProxy = useCallback(() => {
    if (urlToFetch) {
      fetchDatabase(urlToFetch, true);
      setShowDialog(false);
    }
  }, [urlToFetch, fetchDatabase]);

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <StatusMessage type="loading">
          {isFetching ? "Fetching" : "Loading"} SQLite file
        </StatusMessage>
      );
    }
    if (fetchError && !db) {
      return <StatusMessage type="error">{fetchError}</StatusMessage>;
    }
    if (db) {
      return tables.length > 0 ? (
        <DBTable />
      ) : (
        <StatusMessage type="info">
          Your database is empty, no tables found
        </StatusMessage>
      );
    }
    return null;
  };

  return (
    <main
      id="main"
      className={`mx-auto flex h-screen flex-col ${db ? "gap-3" : "gap-4"} p-4 ${expandPage ? "w-full" : "container"}`}
    >
      {!db && <Logo />}
      <UploadFile />
      {renderContent()}
      <Dialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        fn={handleRetryWithProxy}
      />
      {!db && (
        <>
          <Features /> <Footer />
        </>
      )}
    </main>
  );
}

export default App;
