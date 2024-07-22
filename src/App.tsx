import useSQLiteStore from "./store/useSQLiteStore";
import { useEffect, useState, useRef } from "react";

import { DBTable } from "./components/table";
import { UploadFile } from "./components/dropzone";
import Loading from "./components/loading";
import Logo from "./components/logo";
import ErrorMessage from "./components/error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function App() {
  const { db, tables, isLoading, loadDatabase } = useSQLiteStore();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [urlToFetch, setUrlToFetch] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchDatabase = async (url: string, useProxy: boolean = false) => {
    try {
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
            `Error fetching database from URL (with proxy): ${url} - ${error.message}`
          );
        }
      }
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
    <div className="flex flex-col gap-3">
      {!db && <Logo />}
      <UploadFile />
      <Loading />
      {fetchError && !db && <ErrorMessage>{fetchError}</ErrorMessage>}
      {!isLoading &&
        db &&
        (tables.length > 0 ? (
          <DBTable />
        ) : (
          <ErrorMessage>Your database is empty, no tables found</ErrorMessage>
        ))}

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retry using a proxy?</AlertDialogTitle>
            <AlertDialogDescription>
              Failed to load the database from the provided URL due to possible
              CORS restrictions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-sm font-semibold">
            Using the proxy may expose your database to corsproxy.io services.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRetryWithProxy}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
