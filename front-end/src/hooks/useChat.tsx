import { useContext, useEffect, useState } from "react";
import { Message } from "../components/Chatbox";
import { SOCKET_EVENT } from "./types";
import { SocketContext } from "./useWebSocket";

const { VIDEO_QUEUED, NEW_MESSAGE } = SOCKET_EVENT;

export const useChat = () => {
  const socket = useContext(SocketContext).socket;
  const [state, setState] = useState<Message[]>([]);

  useEffect(() => {
    const addMessage = (msg: Message) => {
      setState((prev) => {
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
    messageQueue: state,
    id: socket.id,
    sendMessage,
    queueVideo,
  };
};
