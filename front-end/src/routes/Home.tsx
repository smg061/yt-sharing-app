import { useQuery } from "react-query";
import { PlusIcon } from "@radix-ui/react-icons";
import api from "../utils/api";
import RoomTile from "../components/RoomTile";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { data: rooms, isLoading } = useQuery("rooms", api.listRooms, {
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    staleTime: 3000,
  });
  const navigate = useNavigate();

  const roomName = useRef<string>("");

  const createRoom = async (roomName: string) => {
    const res = await api.createRoom(roomName);
    navigate(`/rooms?roomId=${res.roomId}`, {
      state: { roomId: res.roomId },
    });
  };
  if (isLoading) {
    return <></>;
  }
  return (
    <>
      <section id='rooms-screen' className='dark flex h-[93vh] justify-center'>
        {rooms && (
          <div className=' flex flex-wrap flex-row w-1/2 mb-4 my-12 items-center gap-3 justify-between'>
            {rooms.map((room) => (
              <RoomTile key={room.id + room.name} {...room} />
            ))}
            <div className='flex flex-col items-center gap-2 justify-center bg-slate-700 text-slate-100 w-48 text-lg font-bold text-center p-10 rounded-lg ransform hover:bg-slate-600 transition duration-700 hover:scale-105'>
              <p>Create room</p>
              <div className=''>
                <input
                  className='w-full text-center text-sm h-6'
                  placeholder='room name'
                  defaultValue={roomName.current}
                  onChange={(e) => (roomName.current = e.target.value)}
                ></input>
              </div>
              <div className="">
                <button
                  className='flex  items-center justify-center bg-violet-400 hover:bg-violet-500 text-white font-bold py-2 px-2 rounded'
                  onClick={() => createRoom(roomName.current)}
                >
                  <PlusIcon className=" w-8 h-8 rounded-sm"/>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
