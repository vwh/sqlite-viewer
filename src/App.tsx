import { useEffect, useState, useRef, useCallback } from "react";
import useSQLiteStore from "./store/useSQLiteStore";

import DBTable from "./components/database/upper-section";
import UploadFile from "./components/dropzone";
import StatusMessage from "./components/stats-message";
import Hero from "./components/landing/hero";
import ProxyMessage from "./components/landing/proxy-message";
import Footer from "./components/landing/footer";
import Features from "./components/landing/features";

function App() {
  const {
    db: isDatabaseLoaded,
    tables,
    isLoading,
    loadDatabase,
    expandPage
  } = useSQLiteStore();
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

  // Fetch database on page load if url in url params
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
    if (fetchError && !isDatabaseLoaded) {
      return <StatusMessage type="error">{fetchError}</StatusMessage>;
    }
    if (isDatabaseLoaded) {
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
      className={`mx-auto flex h-screen flex-col ${isDatabaseLoaded ? "gap-3" : "gap-4"} p-4 ${expandPage ? "w-full" : "container"}`}
    >
      {!isDatabaseLoaded && <Hero />}
      <UploadFile />
      {renderContent()}
      {!isDatabaseLoaded && (
        <>
          <Features /> <Footer />
        </>
      )}
      <ProxyMessage
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        onConfirm={handleRetryWithProxy}
      />
    </main>
  );
}

export default App;
