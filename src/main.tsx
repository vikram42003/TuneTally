import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

// @ts-expect-error: The error `Cannot find module '@fontsource-variable/inter'
// or its corresponding type declarations.ts(2307)` is a bug in fontsource library
// Refer to https://github.com/fontsource/fontsource/issues/1038 for more details
import "@fontsource-variable/inter";
// @ts-expect-error: The error `Cannot find module '@fontsource-variable/inter'
import "@fontsource/josefin-sans";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);
