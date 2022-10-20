export type Message = { user: string; userId: string; content: string };

export enum SOCKET_EVENT {
    NEW_MESSAGE = "NEW_MESSAGE",
    VIDEO_QUEUED = "VIDEO_QUEUED",
    VIDEO_ENDED = "VIDEO_ENDED",
    SKIP_VIDEO = "SKIP_VIDEO",
  }