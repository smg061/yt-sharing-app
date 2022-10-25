import { useState } from "react";
import useVoting from "../hooks/useVoteToSkip";

const Header = () => {
  const { showMessage, currentVotes, timer } = useVoting();
  const [uwu, setUwu] = useState<boolean>(true);
  return (
    <nav className=' left-0 top-0 grid grid-cols-3 grid-rows-1 w-screen bg-slate-600'>
      <div className='flex items-center justify-start rows-span-1 rounded'>
        <div className="w-1/4 flex">
          <p
            className='text-6xl  mx-2 rounded hover:bg-violet-400'
            onMouseOver={() => setUwu(false)}
            onMouseLeave={() => setUwu(true)}
          >
            {uwu ? "uwu" : "owo"}
            <span className="text-sm">.io</span>
          </p>
        </div>
        <div className='mx-2 rounded  hover:bg-violet-400'>
          <a href='/'>Home</a>
        </div>
        <div className='mx-2 rounded  hover:bg-violet-400'>
          <a href=''>
            Rooms <span className='text-xs'>(coming soon)</span>
          </a>
        </div>
      </div>
      <div className=''>
        <h1 className='text-xl'></h1>
      </div>
      <div>
        {showMessage && <div>One user has voted to skip the current video. Total votes: {currentVotes}</div>}
        {timer !== 0 && <div>Skipping video in {timer}</div>}
      </div>
    </nav>
  );
};

export default Header;
