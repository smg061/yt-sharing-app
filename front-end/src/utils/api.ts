const baseUrl = import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:3000";

type Thumbnail = {
    url: string,
    width: number,
    height: number
}
export type VideoResult = {
    id: string,
    title: string,
    description?: string,
    thumbnail: Thumbnail,
    channelTitle: string,
}
type Api = {
    searchVideos:(query: string)=> Promise<VideoResult[]>,
    queueVideo: (videoId: string)=> Promise<any>,
}


const api: Api = {
    
    searchVideos: async(query: string)=> {
        console.log(baseUrl)
        if(!query.trim().length) return []
        const response = await fetch(`${baseUrl}/videoSearch?video=${query}`);
        return await response.json()
    }, 
    queueVideo: async(videoId:string)=> {
        const response = await fetch(`${baseUrl}/queueVideo?id=${videoId}`)
        return await response.json();
    }
}


export default api;