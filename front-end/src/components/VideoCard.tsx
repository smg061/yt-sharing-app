import { VideoResult } from "../utils/api";

type props = {
  videoInfo: VideoResult;
  queueVideo: (video: string)=> void
};

const VideoCard = ({ videoInfo, queueVideo }: props) => {
  return (
    <div className='flex w-full h-24'>
      <div className='flex flex-col md:flex-row md:max-w-xl rounded-lg bg-black shadow-lg w-full'>
        <img
          className='md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg'
          src={videoInfo.thumbnail.url}
          alt=''
        />
        <div className='p-6 flex flex-col justify-start'>
          <h5 className='text-white-900 text-md font-small mb-2'>{videoInfo.title}</h5>
          {/* <p className='text-white-700 text-base '>{videoInfo.description}</p> */}
          <p className='text-white-600 text-xs'>{videoInfo.channelTitle}</p>
        </div>
        <button
          type='button'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => queueVideo(`https://www.youtube.com/watch?v=${videoInfo.id}`)}
        >
          Add video to queue
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
