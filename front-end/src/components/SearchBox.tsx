import { useVideoSearch } from "../hooks/useVideoSearch";
import { useEmitSocketEvents } from "../hooks/useWebSocket";
import VideoCard from "./VideoCard";
const SearchBox = () => {
  const { setQuery, query, videos } = useVideoSearch();
  const { queueVideo } = useEmitSocketEvents();
  return (
    <div className='grid relative h-full w-full overflow-scroll z-10'>
      <div className='w-full'>
        <input
          className='w-full'
          placeholder='search for a video'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        ></input>
      </div>
      <div className='w-full grid h-96 gap-2 overflow-y-scroll '>
        {videos.map((video) => (
          <VideoCard queueVideo={queueVideo} videoInfo={video} key={video.id} />
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
