import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SocketProvider } from "./hooks/useWebSocket";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
