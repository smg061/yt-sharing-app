import { VideoInfo, VideoSearchResult } from "./types";

export function toVideoResponse(data?: VideoSearchResult[]): VideoInfo[] {
    if(!data) return [];
    return data.map((video)=> {
        return {
            id: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails['default'] || video.snippet.thumbnails['medium'],
            channelTitle: video.snippet.channelTitle
        }
    })
}