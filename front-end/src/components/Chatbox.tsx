import { useRef } from "react";
import { useChat } from "../hooks/useChat";
import useVoteToSkip from "../hooks/useVoteToSkip";
import { useSocket } from "../hooks/useWebSocket";
import SearchBox from "./SearchBox";
import VideoQueue from "./VideoQueue";

const OtherChatMsg = ({ user, content }: { user: string; content: string }) => {
  return (
    <div className='flex w-full mt-2 space-x-3 max-w-xs'>
      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-300'></div>
      <div>
        <div className='bg-gray-600 p-3 rounded-r-lg rounded-bl-lg'>
          <p className='text-sm'>{content}</p>
        </div>
      {user}
      </div>
    </div>
  );
};
const OwnChatMsg = ({ user, content }: { user: string; content: string }) => {
  return (
    <div className='flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end'>
      <div>
        {user}
        <div className='bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg'>
          <p className='text-sm'>{content}</p>
        </div>
      </div>
      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-300'></div>
    </div>
  );
};

const Chatbox = () => {
  const { messageQueue, sendMessage, id, queueVideo } = useChat();
  const { voteToSkip, allowedToVote } = useVoteToSkip();
  const userName = useRef<string>("");

  return (
    <div className='grid h-[82vh] bg-black shadow-xl rounded-lg overflow-hidden'>
      <div className="grid grid-cols-2">
        <div className="">
          <div>Set user name:</div>
          <input defaultValue={userName.current} onChange={(e) => (userName.current = e.target.value)}></input>
        </div>
        <div className="flex">
          {/* <button onClick={onSkip} className='bg-blue-500 h-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Skip video
          </button>    */}
          <button
            onClick={voteToSkip}
            disabled={!allowedToVote}
            className={`text-white font-bold py-2 px-4 rounded ${
              allowedToVote ? " bg-blue-500 hover:bg-blue-700" : "bg-red-500 hover:bg-red-400"
            }`}
          >
            Vote to skip
          </button>
        </div>

      </div>
        <SearchBox />

      <div className='flex flex-col p-4 overflow-auto'>
        {messageQueue.map((message, i) =>
          message.userId === id ? (
            <OwnChatMsg key={Object.values(message).reduce((curr, prev) => curr + prev, i.toString())} {...message} />
          ) : (
            <OtherChatMsg key={Object.values(message).reduce((curr, prev) => curr + prev, i.toString())} {...message} />
          )
        )}
      </div>
      <div className='bg-gray-300 p-4'>
        <input
          className={"flex items-center h-10 w-full rounded px-3 text-sm"}
          type='text'
          placeholder={userName.current.length === 0 ? "Select a username before chatting" : "Type your message…"}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim().length) {
              if (e.currentTarget.value.includes("youtube.com/watch")) {
                const videoUrl = e.currentTarget.value;
                queueVideo(videoUrl);
              } else {
                sendMessage({
                  user: userName.current,
                  userId: id,
                  content: e.currentTarget.value,
                });
              }
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chatbox;
