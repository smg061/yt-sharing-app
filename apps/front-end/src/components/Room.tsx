import Chatbox from "../components/Chatbox";
import VideoPlayer from "../components/VideoPlayer";
import VideoQueue from "../components/VideoQueue";
import "../App.css";
import { useEmitSocketEvents } from "../hooks/useWebSocket";
import { useEffect, useRef } from "react";
import { useUserId } from "../hooks/useUserId";
import useRoomId from "../hooks/useRoomId";

const App = () => {
  const roomId = useRoomId();
  const userId = useUserId();
  const alreadyJoined = useRef<boolean>(false);

  const { joinRoom } = useEmitSocketEvents();

  useEffect(() => {
    if (!roomId || !userId.length || alreadyJoined.current) return;
    joinRoom({ roomId: roomId, userId: userId });
    alreadyJoined.current = true;
  }, [userId]);

  return (
    <>
      <div className='grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-4 rounded-l'>
        <div className='col-span-3 row-span-1 '>
          <VideoPlayer />
        </div>
        <div>
          <div className='row-span-2 w-full sm:row-span-1 absolute top-1/2 sm:relative sm:top-0'>
            <VideoQueue />
            <Chatbox />
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
