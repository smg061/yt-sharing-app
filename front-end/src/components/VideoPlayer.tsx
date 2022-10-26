import { useState } from "react";
import ReactPlayer from "react-player";
import { useEmitSocketEvents, useSocket } from "../hooks/useWebSocket";

type props = {
  onDuration?: (duration: number) => void;
};
const VideoPlayer = ({ onDuration }: props) => {
  const { onVideoEnd } = useEmitSocketEvents();
  const { currentVideo } = useSocket();
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
          url={currentVideo?.id ?`https://www.youtube.com/watch?v=${currentVideo.id}`: ''}
          width='75%'
          height='85%'
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
