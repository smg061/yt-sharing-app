import RoomComponent from "../components/Room";
import { SocketProvider } from "../hooks/useWebSocket";

const Room = () => {
  return (
    <SocketProvider>
      <RoomComponent />
    </SocketProvider>
  );
};

export default Room;
