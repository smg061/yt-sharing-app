import { VideoInfo } from "../utils/api";

type props = {
  videoInfo: VideoInfo;
  queueVideo: (video: VideoInfo) => void;
};

const VideoCard = ({ videoInfo, queueVideo }: props) => {
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
      <div className='col-span-2'>
        <button
          type='button'
          className=' bg-violet-400 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded'
          onClick={() => queueVideo(videoInfo)}
        >
          Add video to queue
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
