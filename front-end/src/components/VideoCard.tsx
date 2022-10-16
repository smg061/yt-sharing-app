import { useSocket } from "../hooks/useWebSocket";
import { VideoResult } from "../utils/api";

type props = {
  videoInfo: VideoResult;
};

const VideoCard = ({ videoInfo }: props) => {
    const {queueVideo, currentVideo} = useSocket();
    console.log(currentVideo)
  return (
    <div className='flex justify-center'>
      <div className='flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg'>
        <img
          className=' w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg'
          src={videoInfo.thumbnail.url}
          alt=''
        />
        <div className='p-6 flex flex-col justify-start'>
          <h5 className='text-gray-900 text-xl font-medium mb-2'>{videoInfo.title}</h5>
          <p className='text-gray-700 text-base mb-4'>{videoInfo.description}</p>
          <p className='text-gray-600 text-xs'></p>
        </div>
        <button
          type='button'
          className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
            onClick={()=> queueVideo(`https://www.youtube.com/watch?v=${videoInfo.id}`)}
        >
          Add video to queue
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
