import { useQuery } from "react-query";
import { PlusIcon } from "@radix-ui/react-icons";
import api from "../utils/api";
import RoomTile from "../components/RoomTile";
import { useRef } from "react";
const Home = () => {
  const { data: rooms, isLoading } = useQuery("rooms", api.listRooms, {
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    staleTime: 3000,
  });
  const roomName = useRef<string>("");
  //   const createRoom = async (roomName: string) => {
  //     const res = await api.createRoom(roomName);
  //     console.log(res);
  //   };
  const createRoom = async (roomName: string) => {
    const res = await api.createRoom(roomName);
    window.location.replace(`/rooms?roomId=${res.roomId}`);
    //navigate(`/rooms?roomId=${res.roomId}`);
  };
  if (isLoading) {
    return <></>;
  }
  return (
    <>
      <section className='flex justify-center'>
        {rooms && (
          <div className='flex flex-wrap flex-row w-1/2 mb-4 my-12 items-center gap-4 justify-between'>
            {rooms.map((room) => (
              <RoomTile key={room.id + room.name} {...room} />
            ))}
            <div className='flex flex-col items-center justify-center bg-slate-700 text-slate-100 w-48 text-lg font-bold text-center p-10 rounded-lg'>
              <p>Create room</p>
              <div className=''>
                <p>room name:</p>
                <input
                  className='w-full'
                  defaultValue={roomName.current}
                  onChange={(e) => (roomName.current = e.target.value)}
                ></input>
              </div>
              <div>
                <button
                  className='self-center bg-violet-400 hover:bg-violet-500 text-white font-bold py-2 px-2 rounded'
                  onClick={() => createRoom(roomName.current)}
                >
                  <PlusIcon />
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
