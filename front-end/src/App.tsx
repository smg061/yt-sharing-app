import Chatbox from "./components/Chatbox";
import Header from "./components/Header";
import { useSocket } from "./hooks/useWebSocket";
import VideoPlayer from "./components/VideoPlayer";
import VideoQueue from "./components/VideoQueue";
import './App.css'
const App = () => {

  return (
    <>
      <Header />
      <div className='grid grid-cols-4 grid-rows-1 rounded-l'>
        <VideoPlayer/>
        <div>
          <VideoQueue />
          <div className='h-1/2 col-span-1 rows-span-1'>
            <Chatbox />
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
