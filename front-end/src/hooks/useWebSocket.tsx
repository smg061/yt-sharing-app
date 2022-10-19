import { useState, createContext, useEffect, useContext, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { Message } from "../components/Chatbox";

export enum SOCKET_EVENT {
  NEW_MESSAGE = "NEW_MESSAGE",
  VIDEO_QUEUED = "VIDEO_QUEUED",
  VIDEO_ENDED = "VIDEO_ENDED",
  SKIP_VIDEO = "SKIP_VIDEO",
}
const { VIDEO_QUEUED, NEW_MESSAGE, VIDEO_ENDED, SKIP_VIDEO } = SOCKET_EVENT;
interface SocketProvider {
  children: React.ReactNode;
}
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

type SocketContextType = {
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

type StateType = {
  messageQueue: Message[];
  videoQueue: string[];
  currentVideo: string;
  id: string,
};

export const useChat = ()=> {
  const socket = useContext(SocketContext).socket;

  const [state, setState] = useState<Message[]>([]);

  useEffect(()=> {
    const addMessage = (msg: Message) => {
      setState((prev) => {
        return {
          ...prev,
          messageQueue: [...prev, msg],
        };
      });
    };

    socket.on(NEW_MESSAGE, addMessage);

    return ()=> {
      socket.off(NEW_MESSAGE, addMessage)
    }
  },[])

}
export const useSocket = () => {
  const socket = useContext(SocketContext).socket;
  const [state, setState] = useState<StateType>({
    messageQueue: [],
    videoQueue: [],
    currentVideo: "",
    id:socket.id,
  });
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
    const setCurrentVideo = (url: string) => {
      setState((prev) => {
        return {
          ...prev,
          currentVideo: url,
        };
      });
    };
    socket.on(NEW_MESSAGE, addMessage);
    socket.on(VIDEO_QUEUED, addVideo);
    socket.on(VIDEO_ENDED, setCurrentVideo);
    return () => {
      socket.off(NEW_MESSAGE, addMessage);
      socket.off(VIDEO_QUEUED, addVideo);
      socket.off(VIDEO_ENDED, setCurrentVideo);
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("connection");
  }, []);
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
  return { ...state, sendMessage, queueVideo, onVideoEnd, onSkip };
};
