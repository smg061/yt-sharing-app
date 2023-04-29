import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useWebSocket";
import { SOCKET_EVENT } from "../hooks/SocketEvents";
import { EyeOpenIcon } from "@radix-ui/react-icons";
const { USER_CONNECT, USER_DISCONNECTED } = SOCKET_EVENT;

const VideoFooter = () => {
  const { socket } = useSocket();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const setCount = (count: number) => {
      setUserCount(count);
    };
    socket.on(USER_CONNECT, setCount);
    socket.on(USER_DISCONNECTED, setCount);
    return () => {
      socket.off(USER_CONNECT, setCount);
      socket.off(USER_DISCONNECTED, setCount);
    };
  }, []);

  return (
    <div className='flex absolute items-center justify-start gap-1 opacity-50 top-96 w-3/4 h-12 z-¸20 sm:top-[90vh] mx-2 '>
      <EyeOpenIcon height={20} width={20} />
      <p>{userCount} </p>
    </div>
  );
};

export default VideoFooter;
