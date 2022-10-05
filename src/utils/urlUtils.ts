export function convertYoutubeUrl (ogUrl: string): string {
    const urlArr = ogUrl.split('v=')
    if(urlArr.length < 2) {
        return ''
    }
    return `https://www.youtube.com/embed/${urlArr[1]}?autoplay=1&mute=1`
}

export async function getYTVideoDuration(url: string): Promise<number> {
    const urlArr = url.split('v=');
    
    return new Promise((res, rej)=> res(0));
}

