import { useRef } from "react";
import { useChat } from "../hooks/useChat";
import { useChatScroll } from "../hooks/useChatScroll";
import useRoomId from "../hooks/useRoomId";
import useVoteToSkip from "../hooks/useVoteToSkip";
import { useVideoQueue } from "../hooks/useWebSocket";
import SearchBox from "./SearchBox";

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
  const { messageQueue, sendMessage, id } = useChat();
  const { voteToSkip, allowedToVote } = useVoteToSkip();
  const { videoQueue } = useVideoQueue();
  const userName = useRef<string>("");
  const chatRef = useChatScroll(messageQueue.length);
  const roomId = useRoomId();
  return (
    <div className='grid h-[50vh] sm:h-[82vh]  w-full grid-rows-[0.5fr_5fr_1fr] grid-flow-row bg-black shadow-xl rounded-lg overflow-hidden'>
      <div className='grid grid-cols-6 grid-rows-1 relative bg-slate-600 top-9 sm:top-9 items-center'>
        <div className='flex bg-slate-600 gap-4 col-span-4'>
          <div className=''>User name:</div>
          <input
            placeholder='Please set a user name'
            className='h-1/2 self-center'
            defaultValue={userName.current}
            onChange={(e) => (userName.current = e.target.value)}
          ></input>
        </div>
        <div className='justify-self-end px-2 self-center col-span-2'>
          <button
            onClick={voteToSkip}
            disabled={!allowedToVote || videoQueue.length === 0}
            className={`text-white font-bold text-sm py-2 px-4 rounded  ${
              allowedToVote && videoQueue.length
                ? " bg-violet-400 hover:bg-violet-500"
                : "bg-gray-500 hover:bg-gray-400"
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
              // if (e.currentTarget.value.includes("youtube.com/watch")) {
              //   const videoUrl = e.currentTarget.value;
              //   queueVideo(videoUrl);
              // } else {
              sendMessage({
                payload: {
                  user: userName.current,
                  userId: id,
                  content: e.currentTarget.value,
                },
                roomId: roomId,
              });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chatbox;
