import { useState, lazy, Suspense } from "react";
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
    <Suspense fallback={<div>Loading</div>}>
      <div id='videoPlayer'>
        <div className='w-auto h-auto'>
          <ReactPlayer
            className='react-player absolute'
            playing
            volume={volume}
            onDuration={onDuration}
            onEnded={onVideoEnd}
            playsinline
            url={currentVideo?.id ? `https://www.youtube.com/watch?v=${currentVideo.id}` : ""}
          ></ReactPlayer>
        </div>
        <div className='absolute top-72  sm:top-3/4 sm:py-24'>
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
    </Suspense>
  );
};

export default VideoPlayer;
