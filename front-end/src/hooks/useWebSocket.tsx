import { useState, createContext, useEffect, useContext, useReducer } from "react";
import io, { Socket, } from "socket.io-client";
import { Message } from "../components/Chatbox";

interface SocketProvider {
  children: React.ReactNode;
}
const socket = io(import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:3000");

type SocketContextType = {
  socket:  Socket,
  messageQueue: Message[]
  sendMessage: (socket: Socket, message: Message)=> void,
  videoQueue: string[]
}
const defaultState: SocketContextType = {
  socket,
  messageQueue: [],
  sendMessage: (socket, message) => {
    socket.emit('message', message)
  },
  videoQueue: [],
}
export const SocketContext = createContext(defaultState);

export const SocketProvider = (props: SocketProvider) => {
  const [state, setState] = useState(defaultState)
  useEffect(() => {
    socket.on("message", (data: Message[]) => {
      setState((prev)=> {
        return {
          ...prev,
          messageQueue: data
        }
      })
    }); 
  }, [socket]);
  
  useEffect(()=> {    
    socket.emit("connection");
  },[])
  return <SocketContext.Provider value={state}>{props.children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
export default {};
