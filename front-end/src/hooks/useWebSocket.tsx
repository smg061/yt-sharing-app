import { useState, createContext, useEffect, useContext, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_EVENT } from "./SocketEvents";
import { Message } from "./types";
const { VIDEO_QUEUED, NEW_MESSAGE, VIDEO_ENDED, SKIP_VIDEO, VOTE_TO_SKIP } = SOCKET_EVENT;

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
  return <SocketContext.Provider value={{ socket }}>{props.children}</SocketContext.Provider>;
};

type SocketState = {
  videoQueue: string[];
  currentVideo: string;
  id: string;
};

export const useSocket = () => {
  const { socket } = useContext(SocketContext);
  const [state, setState] = useState<SocketState>({
    videoQueue: [],
    currentVideo: "",
    id: socket.id,
  });

  useEffect(() => {
    const addVideo = (currentVideo: string) => {
      setState((prev) => {
        return {
          ...prev,
          videoQueue: [...prev.videoQueue, currentVideo],
        };
      });
    };
    const setCurrentVideo = (url: string) => {
      setState((prev) => {
        return {
          ...prev,
          currentVideo: url,
        };
      });
    };
    const setId = () => {
      setState((prev) => ({ ...prev, id: socket.id }));
    };
    socket.on(VIDEO_QUEUED, addVideo);
    socket.on(VIDEO_ENDED, setCurrentVideo);
    socket.on("connect", setId);
    return () => {
      socket.off(VIDEO_QUEUED, addVideo);
      socket.off(VIDEO_ENDED, setCurrentVideo);
      socket.off("connect", setId);
    };
  }, [socket.id]);

  useEffect(() => {
    socket.emit("connection");
  }, []);

  return { ...state };
};

export const useEmitSocketEvents = () => {
  const { socket } = useContext(SocketContext);
  const sendMessage = (message: Message) => {
    socket.emit(NEW_MESSAGE, message);
  };
  const queueVideo = (newUrl: string) => {
    socket.emit(VIDEO_QUEUED, newUrl);
  };
  const onVideoEnd = () => {
    socket.emit(VIDEO_ENDED, null);
  };

  const onSkip = () => {
    socket.emit(SKIP_VIDEO, null);
  };
  const voteToSkip = () => {
    socket.emit(VOTE_TO_SKIP, socket.id);
  };

  return {
    queueVideo,
    onVideoEnd,
    onSkip,
    sendMessage,
    voteToSkip,
  };
};
