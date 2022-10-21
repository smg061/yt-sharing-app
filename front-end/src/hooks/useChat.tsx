import { useContext, useEffect, useState } from "react";
import { SOCKET_EVENT, Message } from "./types";
import { SocketContext } from "./useWebSocket";

const { VIDEO_QUEUED, NEW_MESSAGE } = SOCKET_EVENT;

export const useChat = () => {
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState<Message[]>([]);
  console.log(socket)
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
  }, []);

  const sendMessage = (msg: Message) => {
    socket.emit(NEW_MESSAGE, msg);
  };
  const queueVideo = (video: string) => {
    socket.emit(VIDEO_QUEUED, video);
  };
  return {
    messageQueue: messages,
    id: socket.id,
    sendMessage,
    queueVideo,
  };
};
