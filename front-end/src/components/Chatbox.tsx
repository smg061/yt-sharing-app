import { useRef } from "react";
import { useChat } from "../hooks/useChat";
import { useChatScroll } from "../hooks/useChatScroll";
import useVoteToSkip from "../hooks/useVoteToSkip";
import { useSocket } from "../hooks/useWebSocket";
import SearchBox from "./SearchBox";
import VideoQueue from "./VideoQueue";

const OtherChatMsg = ({ user, content }: { user: string; content: string }) => {
  return (
    <div className='flex w-full mt-2 space-x-3 max-w-xs'>
      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-300'></div>
      <div>
        <div className='bg-slate-600 p-3 rounded-r-lg rounded-bl-lg'>
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
        <div className=' bg-indigo-500 text-white p-3 rounded-l-lg rounded-br-lg'>
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
  const chatRef = useChatScroll(messageQueue.length);
  return (
    <div className='grid h-[85vh]  grid-rows-[0.5fr_5fr_1fr] grid-flow-row bg-black shadow-xl rounded-lg overflow-hidden'>
      <div className='grid grid-cols-6 grid-rows-1 relative bg-slate-600 top-12 items-center'>
        <div className='flex bg-slate-600 col-span-4'>
          <div className='mx-1 px-1'>Set user name:</div>
          <input defaultValue={userName.current} onChange={(e) => (userName.current = e.target.value)}></input>
        </div>
        <div className='justify-self-end self-center col-span-2'>
          <button
            onClick={voteToSkip}
            disabled={!allowedToVote}
            className={`text-white font-bold py-2 px-4 rounded ${
              allowedToVote ? " bg-violet-400 hover:bg-violet-500" : "bg-gray-500 hover:bg-gray-400"
            }`}
          >
            Vote to skip
          </button>
        </div>
      </div>
      <SearchBox />

      <div className='flex row-span-5 flex-col p-4 py-12 overflow-auto' ref={chatRef}>
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
