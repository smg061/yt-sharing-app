import { useState } from "react";
import { Link } from "react-router-dom";
import useVoting from "../hooks/useVoteToSkip";

const Header = () => {
  const { showMessage, currentVotes, timer } = useVoting();
  const [uwu, setUwu] = useState<boolean>(true);
  return (
    <div className='rounded-lg left-0 top-0 grid sm:grid-cols-3 grid-rows-1 w-screen bg-slate-600'>
      <div className='flex items-center justify-start rows-span-1 rounded'>
        <div className='w-36 grid'>
          <div className='flex align-center justify-center' onMouseOver={() => setUwu(false)} onMouseLeave={() => setUwu(true)}>
            <p className='text-6xl mx-px rounded hover:bg-violet-400'>
              {uwu ? "uwu" : "owo"}
              <span className='text-sm mx-[-1px]'>.io</span>
            </p>
          </div>
        </div>
        <div className='mx-2 flex items-center h-full rounded '>
          <Link className=' hover:bg-violet-400 rounded' to='/'>
            Home
          </Link>
        </div>
        <div className='mx-2 flex items-center h-full rounded '>
          <Link className='hover:bg-violet-400 rounded' to=''>
            Rooms <span className='text-xs'></span>
          </Link>
        </div>
        <div className="">

          <Link to="/draw" className='hover:bg-violet-400 rounded'> Draw Together</Link>
        </div>
      </div>
      <div className=''>
        <h1 className='text-xl'></h1>
      </div>
      <div>
        {showMessage && <div>One user has voted to skip the current video. Total votes: {currentVotes}</div>}
        {timer !== 0 && <div>Skipping video in {timer}</div>}
      </div>
    </div>
  );
};

export default Header;
