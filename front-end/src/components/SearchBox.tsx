import { useVideoSearch } from "../hooks/useVideoSearch";
import VideoCard from "./VideoCard";
const SearchBox = () => {

const {setQuery, query, videos} = useVideoSearch();

  return (
    <div>
        <input value={query} onChange={(e)=> setQuery(e.target.value)}></input>
        <div>
            {videos.map((video)=> (
                // <div key={video.id}>{video.title}</div>
                <VideoCard videoInfo={video} key={video.id}/>
            ))}
        </div>
    </div>
  )
}

export default SearchBox