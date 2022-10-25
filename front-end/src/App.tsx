import Chatbox from "./components/Chatbox";
import Header from "./components/Header";
import { useSocket } from "./hooks/useWebSocket";
import VideoPlayer from "./components/VideoPlayer";
import VideoQueue from "./components/VideoQueue";

const App = () => {
  const onDuration = (duration: number) => {
    // setShowVideoCounter(queue.length > 0);
    // setNextVideoCounter(duration);
    // setCurrentVideoDuration(duration);
  };

  const { videoQueue } = useSocket();
  return (
    <>
      <Header />
      <div className='grid grid-cols-4 grid-rows-1'>
        <VideoPlayer onDuration={onDuration} />
        <div>
          <VideoQueue data={videoQueue} />
          <div className='h-1/2 col-span-1 rows-span-1'>
            <Chatbox />
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
