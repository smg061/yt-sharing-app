import { useContext, useRef, useState } from "react";
import Chatbox from "./components/Chatbox";
import Header from "./components/Header";
import { useEmitSocketEvents, useSocket } from "./hooks/useWebSocket";
import VideoPlayer from "./components/VideoPlayer";
import SearchBox from "./components/SearchBox";
import useVoteToSkip from "./hooks/useVoteToSkip";

const App = () => {

  const onDuration = (duration: number) => {
    // setShowVideoCounter(queue.length > 0);
    // setNextVideoCounter(duration);
    // setCurrentVideoDuration(duration);
  };

  return (
    <>
      <Header />
      <div className='grid grid-cols-4 grid-rows-1'>
        <VideoPlayer onDuration={onDuration} />
        <div>
          <div className='h-1/2 col-span-1 rows-span-1'>
            <Chatbox />
            <SearchBox />
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
