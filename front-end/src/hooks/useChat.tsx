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
    const addMessage = (msg: Message) => {
      setMessages((prev) => {
        return [...prev, msg];
      });
    };
    socket.on(NEW_MESSAGE, addMessage);
    return () => {
      socket.off(NEW_MESSAGE, addMessage);
    };
  }, [socket, socket.id]);

  const sendMessage = (msg: Message) => {
    socket.emit(NEW_MESSAGE, msg);
  };

  return {
    messageQueue: messages,
    id,
    sendMessage,
  };
};
