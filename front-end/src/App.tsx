import {useRef, useState } from "react";
import Chatbox from "./components/Chatbox";
import Header from "./components/Header";
import {toCountDownString } from "./utils/urlUtils";
import { Queue } from "./utils/Queue";
import { useSocket } from "./hooks/useWebSocket";
import VideoPlayer from "./components/VideoPlayer";
import SearchBox from "./components/SearchBox";

const App = () => {
  const [nextVideoCounter, setNextVideoCounter] = useState<number>(0);
  const [currentVideoDuration, setCurrentVideoDuration] = useState<number>(0);
  const [showVideoCounter, setShowVideoCounter] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const {videoQueue} = useSocket();

  const queue = new Queue<string>(videoQueue);
  const videoIsRunning = useRef<boolean>(false);
  const list = queue.getItems();


  const onDuration = (duration: number) => {
    setShowVideoCounter(queue.length > 0);
    setNextVideoCounter(duration);
    setCurrentVideoDuration(duration);
    videoIsRunning.current = true;
  };


  return (
    <>
      <Header  />
      {showVideoCounter && (
        <div className="relative left-1000 top-0 bg-slate-600 border-blue-700 w-75 h-10 hover:-border-blue-700">
          <h1>{currentUser} queued a video. Playing video in {toCountDownString(nextVideoCounter)}</h1>
        </div>
      )}
      {list.map((item, i) => (
        <div key={item+i}>{`${i + 1}. ${item}`}</div>
      ))}
      <div className="grid grid-cols-4">
          <VideoPlayer
            currentVideoDuration={currentVideoDuration}
            setNextVideoCounter={setNextVideoCounter}
            onDuration={onDuration}
          />
        <Chatbox setCurrentUser={setCurrentUser} currentUser={currentUser}  />
      </div>
      <SearchBox/>
    </>
  );
};
export default App;
