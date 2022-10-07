import { useState, createContext, useEffect, useContext, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { Message } from "../components/Chatbox";

interface SocketProvider {
  children: React.ReactNode;
}
const socket = io(import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:3000");

type SocketContextType = {
  socket: Socket;
  messageQueue: Message[];
  videoQueue: string[];
};
const defaultState: SocketContextType = {
  socket,
  messageQueue: [],
  videoQueue: [],
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
    socket.on("message", addMessage);
    return () => {
      socket.off("message", addMessage);
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
    state.socket.emit("message", message);
  };
  return { ...state, sendMessage };
};
export default {};
