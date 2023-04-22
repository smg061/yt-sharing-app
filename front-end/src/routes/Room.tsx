import { useLocation, useNavigate, redirect, Navigate } from "react-router-dom";
import RoomComponent from "../components/Room";
import { SocketProvider } from "../hooks/useWebSocket";

const Room = () => {

  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state);
  if(!location.state?.roomId) {
    return <Navigate to="/" />
  }
  return (
    <SocketProvider>
      <RoomComponent />
    </SocketProvider>
  );
};

export default Room;
