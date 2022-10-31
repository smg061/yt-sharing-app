import { useQuery } from "react-query";
import { PersonIcon, PlayIcon  } from "@radix-ui/react-icons";
import api from "../utils/api";
import RoomTile from "../components/RoomTile";

const Home = () => {
  const { data: rooms, isLoading } = useQuery("rooms", api.listRooms);

  console.log(rooms);

  return (
    <div className='flex items-center'>
      {rooms?.length && (
        <div className="grid items-center justify-center">
          {rooms.map((room) => (
            <RoomTile {...room}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
