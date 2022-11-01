import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useRoomId = () => {
  const [searchParams] = useSearchParams();
  const roomIdFromParams = searchParams.get("roomId");
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    if (!roomIdFromParams) return;
    setRoomId(roomIdFromParams);
  }, [roomIdFromParams]);

  return roomId;
};

export default useRoomId;
