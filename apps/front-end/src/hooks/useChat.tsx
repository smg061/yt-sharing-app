import { useEffect, useState } from "react";
import { SOCKET_EVENT } from "./SocketEvents";
import { Message } from "./types";
import { useSocket } from "./useWebSocket";
import { useUserId } from "./useUserId";
const { NEW_MESSAGE } = SOCKET_EVENT;

export const useChat = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const id = useUserId();

  useEffect(() => {
    const addMessage = (data: {payload: Message, roomId: string}) => {
      setMessages((prev) => {
        return [...prev, data.payload];
      });
    };
    socket.on(NEW_MESSAGE, addMessage);
    return () => {
      socket.off(NEW_MESSAGE, addMessage);
    };
  }, [socket, socket.id]);

  const sendMessage = (data: {payload: Message, roomId:string}) => {
    socket.emit(NEW_MESSAGE, data);
  };

  return {
    messageQueue: messages,
    id,
    sendMessage,
  };
};
