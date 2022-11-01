import { useState } from "react";
import { useVideoSearch } from "../hooks/useVideoSearch";
import { useEmitSocketEvents } from "../hooks/useWebSocket";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import VideoCard from "./VideoCard";
const SearchBox = () => {
  const { setQuery, query, videos } = useVideoSearch();
  const { queueVideo } = useEmitSocketEvents();
  const [expand, setExpand] = useState<boolean>(false);
  return (
    <div className='grid absolute w-full  sm:w-full px-2  bg-slate-600 rounded border-solid border-2 border-slate-600 overflow-scroll'>
      <div className='grid grid-cols-12 grid-flow-col'>
        <input
          className='w-full col-span-11 bg-slate-600'
          placeholder='search for a video'
          value={query}
          onChange={(e) => {
            setExpand(true);
            setQuery(e.target.value);
          }}
        ></input>
        <MagnifyingGlassIcon className="col-span-1 sm:mx-6 self-center hover:cursor-pointer" onClick={() => setExpand((prev) => !prev)} />
      </div>
      {expand && videos.length > 0 && (
        <div className='w-full grid h-96 gap-2 overflow-y-scroll bg-slate-700'>
          <button 
            onClick={() => setExpand((prev) => !prev)} 
            className='w-full h-4  bg-violet-400 '>
            {expand ? "^" : "v"}
          </button>
          {videos.map((video) => (
            <VideoCard queueVideo={queueVideo} videoInfo={video} key={video.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
