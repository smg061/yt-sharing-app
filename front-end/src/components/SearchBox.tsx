import { useVideoSearch } from "../hooks/useVideoSearch";
import VideoCard from "./VideoCard";
const SearchBox = () => {
  const { setQuery, query, videos } = useVideoSearch();

  return (
    <div className='grid h-[15vh]'>
      <div className='w-full'>
        <input
          className='w-full'
          placeholder='search for a video'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        ></input>
      </div>
      <div className='w-full h-60 overflow-y-scroll '>
        {videos.map((video) => (
          <VideoCard videoInfo={video} key={video.id} />
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
