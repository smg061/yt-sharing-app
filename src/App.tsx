import React, { useEffect, useRef, useState } from "react";
import Chatbox from "./components/Chatbox";
import Counter from "./components/Counter";
import Header from "./components/Header";
import { PromiseQueue, delayFunc } from "./utils/PromiseQueue";
import { convertYoutubeUrl } from "./utils/urlUtils";

const App = () => {
  const queue = useRef<PromiseQueue | null>(new PromiseQueue());
  const [videoSrc, setVideoSrc] = useState<string>("https://www.youtube.com/embed/4WPO4nO4XXY?autoplay=1");
  const [nextVideoCounter, setNextVideoCounter] = useState<number>(0);
  const [showVideoCounter, setShowVideoCounter] = useState(false);
  const currentTimeout = useRef(10000)
  const enqueueVideo = (video: string) => {
    if (!queue.current) return;
    currentTimeout.current+=10000;
    setShowVideoCounter(true)
    setNextVideoCounter(currentTimeout.current);
    queue.current.enqueue(delayFunc<string>((video) => setVideoSrc(video), convertYoutubeUrl(video), currentTimeout.current));

  };
  useEffect(() => {
    if (!queue.current) return;
    setNextVideoCounter(10000);
    setShowVideoCounter(true)
    queue.current.enqueue(
      delayFunc<string>(
        (message) => setVideoSrc(message),
        convertYoutubeUrl("https://www.youtube.com/watch?v=zwUgftbSAdc"),
        10000
      )
    );
  }, []);

  useEffect(() => {
    if (!showVideoCounter) return;
    const interval = setInterval(() => {
      setNextVideoCounter((prev)=> {
        if(prev <= 1000) {
          clearInterval(interval);
          setNextVideoCounter(0)
          setShowVideoCounter(false)
        }
        return prev-1000
      })
      if(nextVideoCounter  <= 0) {
      }
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
          <iframe width='1280' height='720' src={videoSrc}></iframe>
        </div>
        <Chatbox messages={[]} enqueueVideo={enqueueVideo} />
      </div>
    </>
  );
};
export default App;
