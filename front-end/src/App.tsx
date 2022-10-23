import { useContext, useRef, useState } from "react";
import Chatbox from "./components/Chatbox";
import Header from "./components/Header";
import { useEmitSocketEvents, useSocket } from "./hooks/useWebSocket";
import VideoPlayer from "./components/VideoPlayer";
import SearchBox from "./components/SearchBox";
import useListenForVotes from "./hooks/useListenForSkipVotes";

const App = () => {
  const { onSkip, voteToSkip } = useEmitSocketEvents();
  const onDuration = (duration: number) => {
    // setShowVideoCounter(queue.length > 0);
    // setNextVideoCounter(duration);
    // setCurrentVideoDuration(duration);
  };
  const { showMessage, currentVotes } = useListenForVotes();

  return (
    <>
      <Header />
      {showMessage && <div>One user has voted to skip the current video. Total votes: {currentVotes}</div>}
      <div className='grid grid-cols-4 grid-rows-1 sm:grid-rows-2'>
        <VideoPlayer onDuration={onDuration} />
        <div>
          <div className='h-1/2 col-span-1 rows-span-1'>
            <button onClick={onSkip} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Skip video
            </button>
            <button
              onClick={voteToSkip}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Vote to skip
            </button>
            <Chatbox />
            <SearchBox />
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
