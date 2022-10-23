import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./useWebSocket";
import { SOCKET_EVENT } from "./SocketEvents";
const { VOTE_TO_SKIP, VIDEO_ENDED } = SOCKET_EVENT;

const useListenForVotes = () => {
  const { socket } = useContext(SocketContext);

  const [currentVotes, setCurrentVotes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(1);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const incrementVotes = (data: { currentVotes: number; totalUsers: number }) => {
      setCurrentVotes(data.currentVotes);
      setTotalUsers(data.totalUsers);
      setShowMessage(true);
      setInterval(() => {
        setShowMessage(false);
      }, 10_000);
    };
    const resetVotes = () => {
      setCurrentVotes(0);
    };
    socket.on(VOTE_TO_SKIP, incrementVotes);
    socket.on(VIDEO_ENDED, resetVotes);
    return () => {
      socket.off(VOTE_TO_SKIP, incrementVotes);
      socket.off(VIDEO_ENDED, resetVotes);
    };
  }, []);

  return { showMessage, currentVotes, totalUsers };
};

export default useListenForVotes;
