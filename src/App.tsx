import { memo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import type { Database } from "sql.js";

import DBTable from "@/components/database/upper-section";
import UploadFile from "@/components/landing/dropzone";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import UrlFetch from "@/components/landing/url-fetch";
import Footer from "@/components/landing/footer";

interface DBTableProps {
  isDatabaseLoaded: Database;
}

const MemoizedDBTable = memo<DBTableProps>(DBTable);
const MemoizedUploadFile = memo(UploadFile);
const MemoizedUrlFetch = memo(UrlFetch);

export default function App() {
  const { db: isDatabaseLoaded, expandPage } = useSQLiteStore();

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
