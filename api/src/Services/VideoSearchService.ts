import { VideoInfo, VideoSearchResult } from "../types"
import fetch from 'node-fetch'
import { youtube, youtube as youtubeSearch } from 'scrape-youtube';
import { Video } from 'scrape-youtube/lib/interface'

export type VideoSearchService = {
    searchVideos: (query: string) => Promise<VideoInfo[]>
    searchVideoDetails: (videoId: string) => Promise<VideoInfo>
}

export class YTScrapeVideoSearchService {
    constructor(private youtube: typeof youtubeSearch) { }

    public toString() {
        return 'YTScrapeVideoSearchService'
    }
    private toVideoResponse(videos?: Video[]): VideoInfo[] {
        if (!videos) return [];
        return videos.map((video) => {
            return {
                id: video.id,
                title: video.title,
                thumbnail: {
                    url: video.thumbnail,
                    width: 0,
                    height: 0,
                },
                duration: video.duration,
                channelTitle: video.channel.name,
            }
        })
    }

    public async searchVideos(query: string) {
        const result = await this.youtube.search(query);
        return this.toVideoResponse(result.videos);
    }

    public async searchVideoDetails(video: string): Promise<VideoInfo> {
        // not implemented
        return await Promise.resolve().then(() => {

            const res: VideoInfo = {
                id: "",
                title: video,
                thumbnail: {
                    url: "",
                    width: 0,
                    height: 0
                },
                channelTitle: "",
                duration: 0,
            }
            return res
        })
    }
}

export class YTAPIVideoSearchService {

    private baseSearchURL: string;

    constructor(API_KEY?: string) {
        if (typeof API_KEY === 'undefined') {
            throw new Error('Failed to provide API key to ' + YTAPIVideoSearchService)
        }
        this.baseSearchURL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&q=`;
    }
    public toString() {
        return 'YTAPIVideoSearchService'
    }
    private toVideoResponse(data?: VideoSearchResult[]): VideoInfo[] {
        if (!data) return [];
        return data.map((video) => {
            return {
                id: video.id.videoId,
                title: video.snippet.title,
                thumbnail: video.snippet.thumbnails['default'] || video.snippet.thumbnails['medium'],
                channelTitle: video.snippet.channelTitle,
                // not implemented
                duration: 0,
            }
        })
    }
    public async searchVideos(query: string): Promise<VideoInfo[]> {
        const searchUrl = `${this.baseSearchURL}${query}`
        const result = await fetch(searchUrl)
        const data = await result.json() as { items: VideoSearchResult[], error: any }
        if (data.error) {
            return this.toVideoResponse(testData)
        }
        return this.toVideoResponse(data.items)

    }
    public async searchVideoDetails(video: string): Promise<VideoInfo> {
        // not implemented
        return await Promise.resolve().then(() => {
            const res: VideoInfo = {
                id: "",
                title: video,
                thumbnail: {
                    url: "",
                    width: 0,
                    height: 0
                },
                channelTitle: "",
                duration: 0,
            }
            return res
        })
    }

}

export default new YTScrapeVideoSearchService(youtube) as VideoSearchService;

const testData = [
    {
        id: {
            kind: "",
            videoId: "7lCDEYXw3mM"
        },
        snippet: {
            publishedAt: "2012-06-20T22:45:24.000Z",
            channelId: "UC_x5XG1OV2P6uZZ5FSM9Ttw",
            title: "Google I/O 101: Q&A On Using Google APIs",
            description: "Antonio Fuentes speaks to us and takes questions on working with Google APIs and OAuth 2.0.",
            thumbnails: {
                default: {
                    "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg",
                    "width": 0,
                    height: 0,
                },
                medium: {
                    "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/mqdefault.jpg",
                    "width": 0,
                    height: 0,
                },
                high: {
                    url: "https://i.ytimg.com/vi/7lCDEYXw3mM/hqdefault.jpg",
                    width: 0,
                    height: 0,
                }
            },
            channelTitle: "Test Title"
        }
    },
]
