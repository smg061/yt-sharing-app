import Header from "./components/Header";
import { Route, Routes, Link } from "react-router-dom";
import "./index.css";
import Room from "./routes/Room";

import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./routes/Home";
const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Routes>
          <Route index element={<Room />} />
          <Route path='/listRooms' element={<Home/>} />
        </Routes>
      </QueryClientProvider>
    </>
  );
};
export default App;
