import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import Room from "./routes/Room";

import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./routes/Home";
import Draw from "./routes/Draw";
const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/rooms" element={<Room/>}/>
          <Route path="/draw" element={<Draw/>}/>
        </Routes>
      </QueryClientProvider>
    </>
  );
};
export default App;
