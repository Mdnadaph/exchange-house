import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import { PermissionProvider } from "./contexts/PermissionContext.js";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <CookiesProvider>
      <PermissionProvider>
        <App />
      </PermissionProvider>
    </CookiesProvider>
  </QueryClientProvider>,
);
