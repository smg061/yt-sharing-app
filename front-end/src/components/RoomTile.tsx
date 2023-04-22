import { PersonIcon, PlayIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import api from "../utils/api";

type props = Awaited<ReturnType<typeof api.listRooms>>[number] & {
  // will maybe extend in the future
};
const RoomTile = ({ name, id, currentlyPlaying, numberOfUsers }: props) => {
  return (
    <div className='grid grid-rows-6 w-64 bg-slate-700 text-slate-100 font-bold text-center p-4 rounded-lg  h-64 transform  hover:bg-slate-600 transition duration-700 hover:scale-105'>
      <div>{name}</div>
      <div className='flex items-center justify-center'>
        <PersonIcon />
        <p>{numberOfUsers}</p>
      </div>
      <div className='row-span-3 flex items-center justify-center'>
        <div>
          <div className="flex flex-row align-center justify-center">
            <PlayIcon className='self-center mx-1 h-4 w-4  fill-violet-500' />
            Currently playing:
          </div>
          <div className='flex align-center justify-center'>
            <p className='text-center sm:text-sm text-ellipsis overflow-hidden'>{currentlyPlaying}</p>
          </div>
        </div>
      </div>
      <div className=''>
        <Link
          to={`/rooms?roomId=${id}`}
          state={{
            roomId: id,
          }}
          type='button'
          className=' bg-violet-400 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded'
        >
          Join room
        </Link>
      </div>
    </div>
  );
};

export default RoomTile;
