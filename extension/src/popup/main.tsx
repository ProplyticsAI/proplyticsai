import React from "react";
import { createRoot } from "react-dom/client";
import { PopupApp } from "./PopupApp";
import "../ui/extension.css";

const surface = window.location.pathname.includes("sidepanel")
  ? "sidepanel"
  : "popup";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PopupApp surface={surface} />
  </React.StrictMode>
);
