export type Message = { user: string; userId: string; content: string };

type ThumbnailQuality = "default" | "medium" | "high"

type Thumbnail = {
    url: string,
    width: number,
    height: number,
}
export type VideoSearchResult = {
    snippet: {
        publishedAt: string,
        channelId: string,
        title: string,
        description: string,
        thumbnails: {[key in ThumbnailQuality]: Thumbnail}
        channelTitle: string,
    }
    id: {
        kind: string,
        videoId: string
    }
}

export type VideoInfo = {
    id: string,
    title: string,
    description?: string,
    thumbnail: Thumbnail,
    channelTitle: string,
}
