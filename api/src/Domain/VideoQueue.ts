import { VideoInfo } from "../types";
import { Queue } from "./Queue";

export class VideoQueue extends Queue<VideoInfo> {
  private _currentVideo: VideoInfo | null | undefined = null;
  constructor(items: VideoInfo[] = []) {
    super(items);
  }
  get currentVideo() {
    return this._currentVideo;
  }
  set currentVideo(v: VideoInfo | null | undefined) {
    this._currentVideo = v;
  }
}
