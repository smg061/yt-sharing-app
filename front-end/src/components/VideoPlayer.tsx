import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../hooks/useWebSocket";

type props = {
  onDuration: (duration: number) => void;
  currentVideoDuration: number;
  setNextVideoCounter: (counter: number) => void;
};
const VideoPlayer = ({ onDuration, setNextVideoCounter, currentVideoDuration }: props) => {
  const { onVideoEnd, currentVideo } = useSocket();
  const [volume,setVolume] = useState<number>(0);
  return (
    <div className="h-screen">
      <div>Volume: {(volume*100).toFixed(0)}</div>
      <input min={0} max={1} step={0.01}  value={volume} type="range" onChange={(e)=> setVolume(parseFloat(e.target.value))}></input>
      <ReactPlayer
        playing
        volume={volume}
        onDuration={onDuration}
        onEnded={onVideoEnd}
        onProgress={(e) => {
          setNextVideoCounter(currentVideoDuration - e.playedSeconds);
        }}
        height={"100%"}
        width={"100%"}
        playsinline
        url={currentVideo}
      ></ReactPlayer>
    </div>
  );
};

export default VideoPlayer;
