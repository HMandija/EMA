import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ReactGA from "react-ga4";
import { trackVisitor } from "./utils/trackVisitor";

// Initialize Google Analytics
if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
  trackVisitor("page_load");
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
