export function convertYoutubeUrl (ogUrl: string): string {
    const urlArr = ogUrl.split('v=')
    if(urlArr.length < 2) {
        return ''
    }
    return `https://www.youtube.com/embed/${urlArr[1]}?autoplay=1&mute=1`
}

export function toCountDownString(timeInSeconds: number) :string {
  const date = new Date(timeInSeconds*1000);
  return date.toISOString().substring(11,19)
}
