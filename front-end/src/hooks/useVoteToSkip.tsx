import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./useWebSocket";
import { SOCKET_EVENT } from "./SocketEvents";
const { VOTE_TO_SKIP, VIDEO_ENDED, SKIPPING_IN_PROGRESS} = SOCKET_EVENT;

const useCountDown = ( start :number) => {
  const [timer, setTimer] = useState(start || 0);
  const intervalRef = useRef<NodeJS.Timer>();

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startTimer = (time: number) => {
    setTimer(time);
  };

  const resetTimer = ()=> {
    setTimer(0);
  }

  useEffect(() => {
    if (timer <= 0) return stopTimer();
    intervalRef.current = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer]);

  return { timer, startTimer, resetTimer, stopTimer };
};
const useVoteToSkip = () => {
  const { socket } = useContext(SocketContext);

  const [currentVotes, setCurrentVotes] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(1);
  const [allowedToVote, setAllowedToVote] = useState<boolean>(true);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const {timer, startTimer} = useCountDown(0);
  const voteToSkip = () => {
    setAllowedToVote(false);
    socket.emit(VOTE_TO_SKIP, socket.id);
  };

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
      setAllowedToVote(true);
    };

    const notifySkipInProgress = ()=> {
      startTimer(5);
    }
    socket.on(VOTE_TO_SKIP, incrementVotes);
    socket.on(VIDEO_ENDED, resetVotes);
    socket.on(SKIPPING_IN_PROGRESS, notifySkipInProgress)
    return () => {
      socket.off(VOTE_TO_SKIP, incrementVotes);
      socket.off(VIDEO_ENDED, resetVotes);
      socket.off(SKIPPING_IN_PROGRESS, notifySkipInProgress);
    };
  }, []);

  return { showMessage, timer, allowedToVote, currentVotes, totalUsers, voteToSkip };
};

export default useVoteToSkip;
