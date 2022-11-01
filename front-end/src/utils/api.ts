const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Thumbnail = {
    url: string,
    width: number,
    height: number
}
export type VideoInfo = {
    id: string,
    title: string,
    description?: string,
    thumbnail: Thumbnail,
    channelTitle: string,
    duration: number,
}
type Api = {
    searchVideos: (query: string) => Promise<VideoInfo[]>,
    queueVideo: (videoId: string) => Promise<any>,
    createRoom: (roomName: string) => Promise<{ roomId: string }>,
    listRooms: () => Promise<{ id: string, name: string, numberOfUsers: number, currentlyPlaying: string }[]>
}


const api: Api = {
    searchVideos: async (query: string) => {
        if (!query.trim().length) return []
        const response = await fetch(`${baseUrl}/videoSearch?video=${query}`);
        return await response.json()
    },
    queueVideo: async (videoId: string) => {
        const response = await fetch(`${baseUrl}/queueVideo?id=${videoId}`)
        return await response.json();
    },
    createRoom: async (roomName) => {
        if (!roomName.trim().length) {
            throw new Error('Error: tried making a room with an empty name')
        }
        const response = await fetch(`${baseUrl}/createroom`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: "POST", body: JSON.stringify({ roomName: roomName })
        });
        return await response.json();
    },
    listRooms: async () => {
        const response = await fetch(`${baseUrl}/listRooms`)
        return await response.json();
    },

}


export default api;