import { useState, createContext, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { VideoInfo } from "../utils/api";
import { SOCKET_EVENT } from "./SocketEvents";
import { Message } from "./types";
import { useUserId } from "./useUserId";
const { USER_CONNECT, SET_QUEUE_ON_CONNECT, VIDEO_QUEUED, NEW_MESSAGE, VIDEO_ENDED, SKIP_VIDEO, USER_DISCONNECTED } =
  SOCKET_EVENT;

type SocketProvider = {
  children: React.ReactNode;
};

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

export type SocketContextType = {
  socket: Socket;
};
const defaultState: SocketContextType = {
  socket,
};

export const SocketContext = createContext(defaultState);

export const SocketProvider = (props: SocketProvider) => {
  const socket = defaultState.socket;
  const id = useUserId();
  useEffect(() => {
    if (id.trim().length) {
      socket.emit(USER_CONNECT, { userId: id });
    }
  }, [id]);
  return <SocketContext.Provider value={{ socket }}>{props.children}</SocketContext.Provider>;
};

type SocketState = {
  videoQueue: VideoInfo[];
  currentVideo: VideoInfo | null;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket
}
export const useVideoQueue = () => {
  const { socket } = useContext(SocketContext);
  const id = useUserId();
  const [state, setState] = useState<SocketState>({
    videoQueue: [],
    currentVideo: null,
  });

  useEffect(() => {
    const addVideo = (currentVideos: VideoInfo[]) => {
      setState((prev) => {
        return {
          ...prev,
          videoQueue: currentVideos,
        };
      });
    };

    const setCurrentVideo = (newVideo: VideoInfo) => {
      setState((prev) => {
        return {
          ...prev,
          currentVideo: newVideo,
          // returns a list with everything except the first element
          videoQueue: prev.videoQueue.filter((_, i) => i !== 0),
        };
      });
    };

    socket.on(VIDEO_QUEUED, addVideo);
    // identical result, but only happends when user first connects i.e. if they join in an
    // already occuring queue
    socket.on(SET_QUEUE_ON_CONNECT, addVideo);
    socket.on(VIDEO_ENDED, setCurrentVideo);
    return () => {
      socket.off(VIDEO_QUEUED, addVideo);
      socket.off(VIDEO_ENDED, setCurrentVideo);
      socket.off(SET_QUEUE_ON_CONNECT, addVideo);
    };
  }, [id]);

  useEffect(() => {
    socket.emit("connection");
  }, [id]);

  return state;
};

export const useEmitSocketEvents = () => {
  const { socket } = useContext(SocketContext);
  const sendMessage = (message: Message) => {
    socket.emit(NEW_MESSAGE, message);
  };
  const queueVideo = (video: VideoInfo) => {
    socket.emit(VIDEO_QUEUED, video);
  };
  const onVideoEnd = () => {
    socket.emit(VIDEO_ENDED, null);
  };

  const onSkip = () => {
    socket.emit(SKIP_VIDEO, null);
  };

  return {
    queueVideo,
    onVideoEnd,
    onSkip,
    sendMessage,
  };
};
