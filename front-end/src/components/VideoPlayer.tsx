import { useState, Suspense, lazy } from "react";
import { useEmitSocketEvents, useVideoQueue } from "../hooks/useWebSocket";
import VideoFooter from "./VideoFooter";
import ReactPlayer from 'react-player'

type props = {
  onDuration?: (duration: number) => void;
};
const isTouchScreen = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
const VideoPlayer = ({ onDuration }: props) => {
  const { onVideoEnd } = useEmitSocketEvents();
  const { currentVideo } = useVideoQueue();
  const [volume, setVolume] = useState<number>(0);

  return (
    <Suspense fallback={<div>Loading</div>}>
      <div id='videoPlayer'>
        <div className='w-auto h-auto'>
          <ReactPlayer
            className='react-player absolute'
            playing
            volume={volume}
            controls={!!isTouchScreen}
            onDuration={onDuration}
            onEnded={onVideoEnd}
            playsinline
            url={currentVideo?.id ? `https://www.youtube.com/watch?v=${currentVideo.id}` : ""}
          ></ReactPlayer>
        </div>
        {!isTouchScreen && (
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
        )}
        <VideoFooter/>
      </div>
    </Suspense>
  );
};

export default VideoPlayer;
