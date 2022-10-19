import { useEffect, useState } from "react";
import api, { VideoResult } from "../utils/api";
import { useDebounce } from "./useDebounce";

export const useVideoSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    let cancel = false;
    const fetchVideos = async () => {
      const response = await api.searchVideos(query);
      setVideos(response);
    };
    if (cancel) return;
    fetchVideos();
    return () => {
      cancel = true;
    };
  }, [debouncedQuery]);

  return {
    videos,
    query,
    setQuery,
  };
};
