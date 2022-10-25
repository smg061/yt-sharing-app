import { useContext, useEffect, useState } from "react";
import { SOCKET_EVENT } from "./SocketEvents";
import { Message } from "./types";
import { SocketContext } from "./useWebSocket";
import {nanoid} from 'nanoid';
const { VIDEO_QUEUED, NEW_MESSAGE, CONNECT } = SOCKET_EVENT;

export const  useChat = () => {
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [id, setId] = useState('');

  useEffect(() => {
    const addMessage = (msg: Message) => {
      setMessages((prev) => {
        return [...prev, msg];
      });
    };
    const storedId = localStorage.getItem('userId');
    if(storedId === null) {
      const generatedId = nanoid();
      setId(generatedId);
      localStorage.setItem('userId', generatedId)
    } else {
      setId(storedId)
    }
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
