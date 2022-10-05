import React, { useEffect, useRef, useState } from "react";
import Chatbox from "./components/Chatbox";
import Counter from "./components/Counter";
import Header from "./components/Header";
import { PromiseQueue, delayFunc } from "./utils/PromiseQueue";
import { convertYoutubeUrl } from "./utils/urlUtils";
import ReactPlayer from 'react-player'
import { Queue } from "./utils/Queue";

const queue = new Queue();
const App = () => {
  const [videoSrc, setVideoSrc] = useState<string>("https://www.youtube.com/embed/4WPO4nO4XXY?autoplay=1");
  const [nextVideoCounter, setNextVideoCounter] = useState<number>(0);
  const [showVideoCounter, setShowVideoCounter] = useState(false);
  const currentTimeout = useRef(10000);

  const enqueueVideo = (video: string) => {
    currentTimeout.current+=10000;
    setShowVideoCounter(true)
    setNextVideoCounter(currentTimeout.current);
    queue.enqueue(delayFunc<string>((video) => setVideoSrc(video), convertYoutubeUrl(video), currentTimeout.current));

  };
  // useEffect(() => {
  //   setNextVideoCounter(10000);
  //   setShowVideoCounter(true)
  //   queue.enqueue(
  //     delayFunc<string>(
  //       (message) => setVideoSrc(message),
  //       convertYoutubeUrl("https://www.youtube.com/watch?v=zwUgftbSAdc"),
  //       10000
  //     )
  //   );
  // }, []);

  useEffect(() => {
    if (!showVideoCounter) return;
    const interval = setInterval(() => {
      setNextVideoCounter((prev)=> {
        if(prev <= 1000) {
          clearInterval(interval);
          setNextVideoCounter(0)
          setShowVideoCounter(false)
          return 0
        }
        return prev-1000
      })
    }, 1000);
    return () => {
      clearInterval(interval);
      setShowVideoCounter(false)
      setNextVideoCounter(0)
    };
  }, [showVideoCounter]);
  return (
    <>
      <Header />
      {showVideoCounter && <div className="relative left-1000 top-0 bg-slate-600 border-blue-700 w-75 h-10 hover:-border-blue-700"><h1>Non-chan queued a video. Playing video in {nextVideoCounter/1000}</h1></div>}
      <div className='grid grid-cols-4'>
        <div className='grid grid-flow-row col-span-3'>
          <ReactPlayer controls muted playing volume={50} onDuration={(duration)=> console.log(duration)} width={1280} height={720} url={videoSrc}></ReactPlayer>
        </div>
        <Chatbox messages={[]} enqueueVideo={enqueueVideo} />
      </div>
    </>
  );
};
export default App;
