import { useState, createContext, useEffect, useContext, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { Message } from "../components/Chatbox";

export enum SOCKET_EVENT {
  NEW_MESSAGE = "NEW_MESSAGE",
  VIDEO_QUEUED = "VIDEO_QUEUED",
  VIDEO_ENDED = "VIDEO_ENDED",
}
const { VIDEO_QUEUED, NEW_MESSAGE , VIDEO_ENDED} = SOCKET_EVENT;
interface SocketProvider {
  children: React.ReactNode;
}
const socket = io(import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:3000");

type SocketContextType = {
  socket: Socket;
  messageQueue: Message[];
  videoQueue: string[];
  currentVideo: string
};
const defaultState: SocketContextType = {
  socket,
  messageQueue: [],
  videoQueue: [],
  currentVideo: ''
};
export const SocketContext = createContext(defaultState);

export const SocketProvider = (props: SocketProvider) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const addMessage = (msg: Message) => {
      setState((prev) => {
        return {
          ...prev,
          messageQueue: [...prev.messageQueue, msg],
        };
      });
    };
    const addVideo = (currentVideo: string) => {
      setState((prev) => {
        return {
          ...prev,
          videoQueue: [...prev.videoQueue, currentVideo],
        };
      });
    };
    const setCurrentVideo = (url: string)=> {
      setState((prev) => {
        return {
          ...prev,
          currentVideo: url
        }
      })
    }
    socket.on(NEW_MESSAGE, addMessage);
    socket.on(VIDEO_QUEUED, addVideo);
    socket.on(VIDEO_ENDED, setCurrentVideo)
    return () => {
      socket.off(NEW_MESSAGE, addMessage);
      socket.off(VIDEO_QUEUED, addVideo);
      socket.off(VIDEO_ENDED, setCurrentVideo);
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("connection");
  }, []);

  return <SocketContext.Provider value={state}>{props.children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const state = useContext(SocketContext);
  const sendMessage = (message: Message) => {
    state.socket.emit(NEW_MESSAGE, message);
  };
  const queueVideo = (newUrl: string) => {
    state.socket.emit(VIDEO_QUEUED, newUrl);
  };
  const onVideoEnd = ()=> {
    state.socket.emit(VIDEO_ENDED, null)
  }
  return { ...state, sendMessage, queueVideo, onVideoEnd};
};
export default {};
