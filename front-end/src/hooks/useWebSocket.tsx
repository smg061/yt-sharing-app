import { useState, createContext, useEffect, useContext } from "react";
import io from "socket.io-client";
import { VideoInfo } from "../utils/api";
import { SOCKET_EVENT } from "./SocketEvents";
import { Message } from "./types";
import useRoomId from "./useRoomId";
import { useUserId } from "./useUserId";

const { USER_CONNECT, SET_QUEUE_ON_CONNECT, VIDEO_QUEUED, NEW_MESSAGE, VIDEO_ENDED, SKIP_VIDEO, JOIN_ROOM } =
  SOCKET_EVENT;

type SocketProviderProps = {
  children: React.ReactNode;
};

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

const defaultState = {
  socket,
};

export type SocketContextType = typeof defaultState;

export const SocketContext = createContext<SocketContextType>(defaultState);

export const SocketProvider = (props: SocketProviderProps) => {
  const socket = defaultState.socket;
  const id = useUserId();
  const roomId = useRoomId();
  useEffect(() => {
    if (id.trim().length) {
      socket.emit(USER_CONNECT, { userId: id, roomId: roomId });
    }
  }, [id, roomId]);
  return <SocketContext.Provider value={{ socket }}>{props.children}</SocketContext.Provider>;
};

type SocketState = {
  videoQueue: VideoInfo[];
  currentVideo: VideoInfo | null;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

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
  const roomId = useRoomId();

  const sendMessage = (data: { payload: Message; roomId: string }) => {
    socket.emit(NEW_MESSAGE, { payload: data.payload, roomId: roomId });
  };
  const queueVideo = (payload: VideoInfo) => {
    socket.emit(VIDEO_QUEUED, { payload: payload, roomId: roomId });
  };
  const onVideoEnd = () => {
    console.log(roomId)
    socket.emit(VIDEO_ENDED, roomId);
  };

  const onSkip = () => {
    socket.emit(SKIP_VIDEO, roomId);
  };
  const joinRoom = ({ roomId, userId }: { roomId: string; userId: string }) => {
    socket.emit(JOIN_ROOM, { roomId, userId });
  };
  return {
    queueVideo,
    onVideoEnd,
    onSkip,
    sendMessage,
    joinRoom,
  };
};
