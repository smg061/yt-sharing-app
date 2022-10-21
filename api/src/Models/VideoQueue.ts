import { Queue } from "./Queue";

export class VideoQueue extends Queue<string> {
  private _currentVideo: string | null | undefined = null;
  constructor(items: string[] = [], currentVideo: string | null | undefined = null) {
    super(items);
    this._currentVideo = currentVideo;
  }
  get currentVideo() {
    return this._currentVideo;
  }
  set currentVideo(v: string | null | undefined) {
    this._currentVideo = v;
  }
}
