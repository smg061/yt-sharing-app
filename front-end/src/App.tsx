import Chatbox from "./components/Chatbox";
import Header from "./components/Header";
import VideoPlayer from "./components/VideoPlayer";
import VideoQueue from "./components/VideoQueue";
import "./App.css";
const App = () => {
  return (
    <>
      <Header />
      <div className='grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-4 rounded-l'>
        <div className='col-span-3 row-span-1 '>
          <VideoPlayer />
        </div>
        <div>
          <div className='row-span-2 w-full sm:row-span-1 absolute top-1/2 sm:relative sm:top-0'>
            <VideoQueue />
            <Chatbox />
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
