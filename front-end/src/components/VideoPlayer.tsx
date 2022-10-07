import { useState } from "react";
import ReactPlayer from "react-player";

type props = {
  onDuration: (duration: number) => void;
  onVideoEnd: () => void;
  videoSrc: string;
  currentVideoDuration: number;
  setNextVideoCounter: (counter: number) => void;
};
const VideoPlayer = ({
  onDuration,
  onVideoEnd,
  videoSrc,
  setNextVideoCounter,
  currentVideoDuration,
}: props) => {
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
        url={videoSrc}
      ></ReactPlayer>
    </div>
  );
};

export default VideoPlayer;
