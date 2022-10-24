import React from "react";
import useVoteToSkip from "../hooks/useVoteToSkip";

const Header = () => {
  const { showMessage, currentVotes, timer } = useVoteToSkip();

  return (
    <div className='flex h-24 align-middle justify-center w-screen'>
      <h1 className=''>
        Non-chan's video sharing site (extremely good)
      </h1>
      <p className='mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400'></p>
      {showMessage && <div>One user has voted to skip the current video. Total votes: {currentVotes}</div>}
      {timer !== 0 && <div>Skipping video in {timer}</div>}
    </div>
  );
};

export default Header;
