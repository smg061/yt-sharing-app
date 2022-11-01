import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SocketProvider } from "./hooks/useWebSocket";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./index.css";
import Room from "./routes/Room";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
    <App/>
    </Router>
  </React.StrictMode>
);
