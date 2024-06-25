import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import Footer from "./components/footer.tsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="container mx-auto p-4">
      <App />
      <Footer />
    </main>
  </React.StrictMode>
);
