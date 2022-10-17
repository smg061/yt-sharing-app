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
      <div className='w-auto h-auto'>
        <ReactPlayer
          className='react-player absolute'
          playing
          volume={volume}
          onDuration={onDuration}
          onEnded={onVideoEnd}
          playsinline
          url={currentVideo}
          width='75%'
          height='75%'
        ></ReactPlayer>
      </div>
      <div className='absolute bottom-48'>
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
