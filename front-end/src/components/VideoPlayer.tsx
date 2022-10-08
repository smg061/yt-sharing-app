import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../hooks/useWebSocket";

type props = {
  onDuration: (duration: number) => void;
  onVideoEnd: () => void;
  videoSrc: string;
  currentVideoDuration: number;
  setNextVideoCounter: (counter: number) => void;
};
const VideoPlayer = ({ onDuration, videoSrc, setNextVideoCounter, currentVideoDuration }: props) => {
  const { onVideoEnd, currentVideo } = useSocket();
  useEffect(()=> {
    console.log(currentVideo)
    if(!currentVideo) {
      console.log("no current video,, requesting more data",currentVideo)
      onVideoEnd()
    }
  },[currentVideo])
  return (
    <div className="h-screen">
      <ReactPlayer
        controls
        muted
        playing
        volume={50}
        onDuration={onDuration}
        onEnded={onVideoEnd}
        onProgress={(e) => {
          setNextVideoCounter(currentVideoDuration - e.playedSeconds);
        }}
        height={"100%"}
        width={"100%"}
        url={currentVideo}
      ></ReactPlayer>
    </div>
  );
};

export default VideoPlayer;
