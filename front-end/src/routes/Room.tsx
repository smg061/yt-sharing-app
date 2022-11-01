import RoomComponent from "../components/Room";
import { SocketProvider } from "../hooks/useWebSocket";
import './Room.css'
const Room = () => {
  return (
    <SocketProvider>
      <RoomComponent />
    </SocketProvider>
  );
};

export default Room;
