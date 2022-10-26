import { useState } from "react";
import { useSocket } from "../hooks/useWebSocket";
import { VideoResult } from "../utils/api";



const SingleCard = ({ videoInfo }: { videoInfo: VideoResult }) => {
  return (
    <div className='grid grid-cols-8 h-24 overflow-hidden '>
      <div className='col-span-2'>
        <img
          className='md:h-auto object -cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg'
          src={videoInfo.thumbnail.url}
          alt=''
        />
      </div>
      <div className='p-6 col-span-4 justify-start'>
        <h5 className='text-white-900  text-xs  mb-2'>{videoInfo.title}</h5>
        <p className='text-white-600 text-xs'>{videoInfo.channelTitle}</p>
      </div>
      <div className='col-span-2'></div>
    </div>
  );
};
const VideoQueue = () => {
  const { videoQueue } = useSocket();

  const [expandList, setExpandList] = useState<boolean>(false);
  return (
    <div>
      <div className="hover:bg-violet-400 hover:cursor-pointer" onClick={()=> setExpandList((v)=>!v)}>Current Queue (click to expand)</div>
      {expandList && videoQueue.map((video) => (
        <SingleCard videoInfo={video} />
      ))}
    </div>
  );
};

export default VideoQueue;
