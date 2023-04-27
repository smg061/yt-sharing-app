import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import Room from "./routes/Room";

import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import RoomList from "./routes/Rooms";
import Draw from "./routes/Draw";
import { Write } from "./routes/Write";
import { AuthProvider } from "./auth/AuthContext";
import LoginPage from "@routes/Login";
import { RequireAuth } from "./auth/RequireAuth";
import { Home } from "./routes/Home";
const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/draw" element={<Draw />} />
            <Route element={<RequireAuth />}>
              <Route path="/write" element={<Write />} />
            </Route>
            <Route path="login" element={<LoginPage />} />
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
};
export default App;
