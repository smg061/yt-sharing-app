import { useState, createContext, useEffect, useContext, useReducer, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { VideoResult } from "../utils/api";
import { SOCKET_EVENT } from "./SocketEvents";
import { Message } from "./types";
import {useUserId} from './useUserId'
const {USER_CONNECT, VIDEO_QUEUED, NEW_MESSAGE, VIDEO_ENDED, SKIP_VIDEO, USER_DISCONNECTED } = SOCKET_EVENT;

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
  useEffect(()=> {
    if(id.trim().length){
      socket.emit(USER_CONNECT, {userId: id})
    }

  },[id])
  return <SocketContext.Provider value={{ socket }}>{props.children}</SocketContext.Provider>;
};

type SocketState = {
  videoQueue: VideoResult[];
  currentVideo: VideoResult | null;
};

export const useSocket = () => {
  const { socket } = useContext(SocketContext);
  const id = useUserId();
  const [state, setState] = useState<SocketState>({
    videoQueue: [],
    currentVideo: null,
  });

  useEffect(() => {
    const addVideo = (currentVideo: VideoResult[]) => {
      setState((prev) => {
        return {
          ...prev,
          videoQueue: currentVideo
        };
      });
    };
    
    const setCurrentVideo = (newVideo: VideoResult) => {
      setState((prev) => {
        return {
          ...prev,
          currentVideo: newVideo,
        };
      });
    };
    socket.on(VIDEO_QUEUED, addVideo);
    socket.on(VIDEO_ENDED, setCurrentVideo);

    return () => {
      socket.off(VIDEO_QUEUED, addVideo);
      socket.off(VIDEO_ENDED, setCurrentVideo);
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
  const queueVideo = (video: VideoResult) => {
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
