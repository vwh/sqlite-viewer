import { memo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import DBTable from "@/components/database/upper-section";
import UploadFile from "@/components/landing/dropzone";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import UrlFetch from "@/components/landing/url-fetch";
import Footer from "@/components/landing/footer";

const MemoizedDBTable = memo(DBTable);
const MemoizedUploadFile = memo(UploadFile);
const MemoizedUrlFetch = memo(UrlFetch);

export default function App() {
  const { db, expandPage } = useSQLiteStore();

  return (
    <main
      className={`mx-auto flex h-screen flex-col ${db ? "gap-3" : "gap-4"} p-4 ${expandPage ? "w-full" : "container"}`}
    >
      {!db ? (
        <>
          <Hero /> <MemoizedUploadFile /> <MemoizedUrlFetch />
          <Features />
          <Footer />
        </>
      ) : (
        <MemoizedDBTable />
      )}
    </main>
  );
}
