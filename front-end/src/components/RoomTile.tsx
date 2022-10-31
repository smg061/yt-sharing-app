import { PersonIcon, PlayIcon } from '@radix-ui/react-icons';
import api from '../utils/api';

type props = Awaited<ReturnType<typeof api.listRooms>>[number] & {
    // will maybe extend in the future

}
const RoomTile = ({name, id, currentlyPlaying, numberOfUsers}: props) => {
  return (
    <div className='bg-slate-700 text-slate-100 text-lg font-bold text-center p-10 rounded-lg'>
    <div>{name}</div>
    <div className="flex items-center justify-center"> 
      <PersonIcon/>
      <p>{numberOfUsers}</p>
    </div>
    <div>
      <PlayIcon/>
      <p>Currently playing{currentlyPlaying}</p>
    </div>
    <button
          type='button'
          className=' bg-violet-400 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded'
          onClick={() => {}}
        >
          Join room
        </button>
  </div>
  )
}

export default RoomTile