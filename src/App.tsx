import { useEffect, memo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import DBTable from "@/components/database/upper-section";
import UploadFile from "@/components/dropzone";
import StatusMessage from "@/components/stats-message";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import UrlFetch from "@/components/landing/url-fetch";
import Footer from "@/components/landing/footer";

const MemoizedDBTable = memo(DBTable);
const MemoizedUploadFile = memo(UploadFile);
const MemoizedUrlFetch = memo(UrlFetch);

export default function App() {
  const {
    db: isDatabaseLoaded,
    tables,
    loadDatabaseBytes,
    expandPage
  } = useSQLiteStore();

  // Add loadDatabaseBytes to the window object to support Iframes
  // https://github.com/vwh/sqlite-viewer/issues/50
  useEffect(() => {
    window.loadDatabaseBytes = loadDatabaseBytes;
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === "invokeLoadDatabaseBytes") {
        try {
          const bytes = event.data.bytes;
          await loadDatabaseBytes(bytes);
          event.source?.postMessage(
            { type: "loadDatabaseBytesSuccess" },
            event.origin as WindowPostMessageOptions
          );
        } catch (error) {
          event.source?.postMessage(
            {
              type: "loadDatabaseBytesError",
              error: error instanceof Error ? error.message : String(error)
            },
            event.origin as WindowPostMessageOptions
          );
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [loadDatabaseBytes]);

  return (
    <main
      className={`mx-auto flex h-screen flex-col ${isDatabaseLoaded ? "gap-3" : "gap-4"} p-4 ${expandPage ? "w-full" : "container"}`}
    >
      {!isDatabaseLoaded && <Hero />}
      <MemoizedUploadFile />
      <MemoizedUrlFetch />
      {isDatabaseLoaded ? (
        tables.length > 0 ? (
          <MemoizedDBTable />
        ) : (
          <StatusMessage type="info">
            Your database is empty, no tables found
          </StatusMessage>
        )
      ) : (
        <>
          <Features />
          <Footer />
        </>
      )}
    </main>
  );
}
