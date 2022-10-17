import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../hooks/useWebSocket";

type props = {
  onDuration: (duration: number) => void;
  setNextVideoCounter: (counter: number) => void;
};
const VideoPlayer = ({ onDuration, setNextVideoCounter }: props) => {
  const { onVideoEnd, currentVideo } = useSocket();
  const [volume, setVolume] = useState<number>(0);
  return (
    <div id='videoPlayer' className='col-span-3'>
      <div className='relative h-auto w-auto'>
        <ReactPlayer
          className='top-0 left-0'
          playing
          volume={volume}
          onDuration={onDuration}
          onEnded={onVideoEnd}
          controls
          playsinline
          height="720px"
          width="1280px"
          url={currentVideo}
        ></ReactPlayer>
      </div>
        <div >
          <div>Volume: {(volume * 100).toFixed(0)}</div>
          <input
            className='w-13'
            min={0}
            max={1}
            step={0.01}
            value={volume}
            type='range'
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          ></input>
        </div>
    </div>
  );
};

export default VideoPlayer;
