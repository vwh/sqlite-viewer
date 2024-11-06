import useSQLiteStore from "@/store/useSQLiteStore";
import { useCallback, useEffect, useRef, useState } from "react";

import ProxyMessage from "@/components/landing/proxy-message";
import StatusMessage from "@/components/stats-message";

const REGEX_URL =
  /^(https?:\/\/(?:www\.)?[a-zA-Z0-9-]{1,256}\.[a-zA-Z]{2,6}(?:\/[^\s]*)?)$/i;

const CORS_SERVER = "https://cors.eu.org";

export default function UrlFetch() {
  const {
    db: isDatabaseLoaded,
    isLoading,
    loadDatabaseBytes,
    setDatabaseData
  } = useSQLiteStore();

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [urlToFetch, setUrlToFetch] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const hasFetched = useRef(false);

  const fetchDatabase = useCallback(
    async (url: string, useProxy = false) => {
      if (!REGEX_URL.test(url)) {
        setFetchError("Invalid URL");
        return;
      }

      try {
        setIsFetching(true);
        const fetchUrl = useProxy
          ? `${CORS_SERVER}/${encodeURIComponent(url)}`
          : url;
        const response = await fetch(fetchUrl);

        if (!response.ok) throw new Error("URL not found or invalid");

        const blob = await response.blob();
        const file = new File([blob], "database.sqlite");
        const bytes = new Uint8Array(await file.arrayBuffer());

        setDatabaseData({ name: file.name, size: file.size });
        await loadDatabaseBytes(bytes);
        setFetchError(null);
      } catch (error) {
        if (!useProxy) {
          setUrlToFetch(url);
          setShowDialog(true);
        } else {
          setFetchError(
            `Error while fetching, ${error instanceof Error ? error.message : String(error)}`
          );
        }
      } finally {
        setIsFetching(false);
      }
    },
    [loadDatabaseBytes, setDatabaseData]
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

  return (
    <>
      {showDialog && (
        <ProxyMessage
          key="proxy-message"
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          onConfirm={handleRetryWithProxy}
        />
      )}
    </>
  );
}
