import { useRef, useState } from "react";
import Chatbox from "./components/Chatbox";
import Header from "./components/Header";
import { toCountDownString } from "./utils/urlUtils";
import { Queue } from "./utils/Queue";
import { useSocket } from "./hooks/useWebSocket";
import VideoPlayer from "./components/VideoPlayer";
import SearchBox from "./components/SearchBox";

const App = () => {
  const [nextVideoCounter, setNextVideoCounter] = useState<number>(0);
  const [showVideoCounter, setShowVideoCounter] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");
  const { videoQueue, onSkip } = useSocket();

  const queue = new Queue<string>(videoQueue);
  const list = queue.getItems();

  const onDuration = (duration: number) => {
    // setShowVideoCounter(queue.length > 0);
    // setNextVideoCounter(duration);
    // setCurrentVideoDuration(duration);
  };

  return (
    <>
      <Header />
      {list.map((item, i) => (
        <div key={item + i}>{`${i + 1}. ${item}`}</div>
      ))}
      <div>
        <button onClick={onSkip} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Skip video</button>
      </div>
      <div className='grid grid-cols-4'>
        <VideoPlayer
          setNextVideoCounter={setNextVideoCounter}
          onDuration={onDuration}
        />
        <Chatbox setCurrentUser={setCurrentUser} currentUser={currentUser} />
      </div>
      <SearchBox />
    </>
  );
};
export default App;
