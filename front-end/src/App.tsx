import { useCallback, useEffect, useRef, useState } from "react";
import Chatbox, { Message } from "./components/Chatbox";
import Header from "./components/Header";
import { convertYoutubeUrl, toCountDownString } from "./utils/urlUtils";
import ReactPlayer from "react-player";
import { Queue } from "./utils/Queue";
import { useSocket } from "./hooks/useWebSocket";
import VideoPlayer from "./components/VideoPlayer";

const queue = new Queue<string>();
const currentUser = "Non-chan";

const App = () => {
  const [videoSrc, setVideoSrc] = useState<string>("https://www.youtube.com/watch?v=I_tTtAAYehs");
  const [nextVideoCounter, setNextVideoCounter] = useState<number>(0);
  const [currentVideoDuration, setCurrentVideoDuration] = useState<number>(0);
  const [showVideoCounter, setShowVideoCounter] = useState(false);

  const videoIsRunning = useRef<boolean>(false);

  const list = queue.getItems();

  const enqueueVideo = (video: string) => {
    if (videoIsRunning.current) {
      const formatedUrl = convertYoutubeUrl(video);
      if (formatedUrl !== videoSrc) {
        queue.enqueue(convertYoutubeUrl(video));
        setShowVideoCounter(queue.length > 0);
      }
    } else {
      setVideoSrc(video);
    }
  };

  const onDuration = (duration: number) => {
    setShowVideoCounter(queue.length > 0);
    setNextVideoCounter(duration);
    setCurrentVideoDuration(duration);
    videoIsRunning.current = true;
  };

  const onVideoEnd = () => {
    videoIsRunning.current = false;
    const src = queue.dequeue();
    if (typeof src === "string") {
      setVideoSrc(src);
      videoIsRunning.current = true;
    }
  };

  return (
    <>
      <Header />
      {showVideoCounter && (
        <div className="relative left-1000 top-0 bg-slate-600 border-blue-700 w-75 h-10 hover:-border-blue-700">
          <h1>Non-chan queued a video. Playing video in {toCountDownString(nextVideoCounter)}</h1>
        </div>
      )}
      {list.map((item, i) => (
        <div key={item+i}>{`${i + 1}. ${item}`}</div>
      ))}
      <div className="grid grid-cols-4 sm:grid-cols-4">
        <div className="grid grid-flow-row col-span-3">
          <VideoPlayer
            currentVideoDuration={currentVideoDuration}
            setNextVideoCounter={setNextVideoCounter}
            videoSrc={videoSrc}
            onVideoEnd={onVideoEnd}
            onDuration={onDuration}
          />
        </div>
        <Chatbox currentUser={currentUser} enqueueVideo={enqueueVideo} />
      </div>
    </>
  );
};
export default App;
