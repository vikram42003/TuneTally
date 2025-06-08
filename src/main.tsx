import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";

// @ts-expect-error: The error `Cannot find module '@fontsource-variable/inter' 
// or its corresponding type declarations.ts(2307)` is a bug in fontsource library
// Refer to https://github.com/fontsource/fontsource/issues/1038 for more details
import '@fontsource-variable/inter';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />,
    </BrowserRouter>
  </StrictMode>,
);
