import { useEffect, useState } from "react";
import api, { VideoInfo } from "../utils/api";
import { useDebounce } from "./useDebounce";
import { useQuery } from "react-query";

const kebabCase = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

export const useVideoSearch = () => {
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);
  const { isLoading, data, error } = useQuery(
    [kebabCase(debouncedQuery), debouncedQuery],
    () => api.searchVideos(debouncedQuery),
    { staleTime: Infinity, refetchOnWindowFocus: false, keepPreviousData: true }
  );

  return {
    videos: data ?? [],
    query,
    setQuery,
    error,
    isLoading,
  };
};
