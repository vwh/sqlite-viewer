import { useEffect, memo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import type { Database } from "sql.js";

import DBTable from "@/components/database/upper-section";
import UploadFile from "@/components/dropzone";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import UrlFetch from "@/components/landing/url-fetch";
import Footer from "@/components/landing/footer";

interface DBTableProps {
  isDatabaseLoaded: Database;
}

const areEqual = (
  prevProps: DBTableProps,
  nextProps: DBTableProps
): boolean => {
  if (prevProps == null || nextProps == null) {
    return false;
  }
  return prevProps.isDatabaseLoaded === nextProps.isDatabaseLoaded;
};

const MemoizedDBTable = memo<DBTableProps>(DBTable, areEqual);
const MemoizedUploadFile = memo(UploadFile);
const MemoizedUrlFetch = memo(UrlFetch);

export default function App() {
  const {
    db: isDatabaseLoaded,
    loadDatabaseBytes,
    expandPage
  } = useSQLiteStore();

  // useEffect for window message handling
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
      {!isDatabaseLoaded && (
        <>
          <Hero /> <MemoizedUploadFile /> <MemoizedUrlFetch />
          <Features />
          <Footer />
        </>
      )}
      {isDatabaseLoaded && (
        <MemoizedDBTable isDatabaseLoaded={isDatabaseLoaded} />
      )}
    </main>
  );
}
