import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";
import { Home } from "./routes/Home";
import { lazy } from "react";
import { WithSuspense } from "@/utils/WithSuspense";
const queryClient = new QueryClient();

const LoginPage = lazy(() => import("@routes/Login"));
const WriteTogether = lazy(() => import("@routes/Write"));
const Room = lazy(() => import("@routes/Room"));
const RoomList = lazy(() => import("@routes/Rooms"));
const Draw = lazy(() => import("@routes/Draw"));

const App = () => {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={WithSuspense(RoomList)} />
            <Route path="/room/:roomId" element={WithSuspense(Room)} />
            <Route path="/draw" element={WithSuspense(Draw)} />
            <Route element={<RequireAuth />}>
              <Route path="/write" element={WithSuspense(WriteTogether)} />
            </Route>
            <Route path="login" element={WithSuspense(LoginPage)} />
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
};
export default App;
