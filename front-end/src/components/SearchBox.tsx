import { useState } from "react";
import { useVideoSearch } from "../hooks/useVideoSearch";
import { useEmitSocketEvents } from "../hooks/useWebSocket";
import VideoCard from "./VideoCard";
const SearchBox = () => {
  const { setQuery, query, videos } = useVideoSearch();
  const { queueVideo } = useEmitSocketEvents();
  const [expand, setExpand] = useState<boolean>(false);
  return (
    <div className='grid absolute w-1/4 bg-slate-600 rounded border-solid border-2 border-slate-600 overflow-scroll'>
      <div className=''>
        <input
          className='w-11/12 h-8'
          placeholder='search for a video'
          value={query}
          onChange={(e) => {
            setExpand(true)
            setQuery(e.target.value);
          }}
        ></input>
        <button onClick={() => setExpand((prev) => !prev)} className='w-1/12 rounded  bg-violet-400 '>
          {expand? '^': 'v'}
        </button>
      </div>
      {expand && videos.length > 0 && (
        <div className='w-full grid h-96 gap-2 overflow-y-scroll '>
          {videos.map((video) => (
            <VideoCard queueVideo={queueVideo} videoInfo={video} key={video.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
