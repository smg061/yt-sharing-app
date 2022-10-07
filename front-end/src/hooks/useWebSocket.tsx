import { useState, createContext, useEffect, useContext } from "react";
import io from "socket.io-client";

interface SocketProvider {
  children: React.ReactNode;
}
const socket = io(import.meta.env.WEBSOCKET_URL || "http://localhost:3000");

export const SocketContext = createContext(socket);

export const SocketProvider = (props: SocketProvider) => {
  console.log("mounted");
  console.log("import", import.meta.env)
  useEffect(() => {
    socket.on("message", (data: any) => {
      console.log(data);
    }); 
    socket.emit("connection");
  }, []);
  return <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
export default {};
