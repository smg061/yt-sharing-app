import { useContext, useEffect, useState } from "react";
import { SOCKET_EVENT } from "./SocketEvents";
import { Message } from "./types";
import { SocketContext } from "./useWebSocket";
import { useUserId } from "./useUserId";
const { VIDEO_QUEUED, NEW_MESSAGE, CONNECT } = SOCKET_EVENT;

export const  useChat = () => {
  const { socket } = useContext(SocketContext);
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
  const queueVideo = (video: string) => {
    socket.emit(VIDEO_QUEUED, video);
  };
  return {
    messageQueue: messages,
    id,
    sendMessage,
    queueVideo,
  };
};
