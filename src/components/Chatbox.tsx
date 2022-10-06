import { useState } from "react";

type Message = { user: string; userId: string; content: string };
type props = {
  messages: Message[];
  enqueueVideo: (videoUrl: string) => void;
  currentUser: string;
};

const OtherChatMsg = ({ user, content }: { user: string; content: string }) => {
  return (
    <div className='flex w-full mt-2 space-x-3 max-w-xs'>
      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-300'></div>
      <div>
        <div className='bg-gray-300 p-3 rounded-r-lg rounded-bl-lg'>
          <p className='text-sm'>{content}</p>
        </div>
        <span className='text-xs text-gray-500 leading-none'>2 min ago</span>
      </div>
    </div>
  );
};
const OwnChatMsg = ({ user, content }: { user: string; content: string }) => {
  return (
    <div className='flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end'>
      <div>
        <div className='bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg'>
          <p className='text-sm'>{content}</p>
        </div>
        <span className='text-xs text-gray-500 leading-none'>2 min ago</span>
      </div>
      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-300'></div>
    </div>
  );
};
const Chatbox = ({ enqueueVideo, messages, currentUser }: props) => {
  const [messagesLocal, setMessagesLocal] = useState<Message[]>(messages);
  return (
    <div className='flex flex-col flex-grow w-full max-w-xl bg-black shadow-xl rounded-lg overflow-hidden'>
      <div className='flex flex-col flex-grow h-0 p-4 overflow-auto'>
        {messagesLocal.map((message,i) =>
          message.user === currentUser ? (
            <OwnChatMsg key={Object.values(message).reduce((curr, prev) => curr + prev, i.toString())} {...message} />
          ) : (
            <OtherChatMsg key={Object.values(message).reduce((curr, prev) => curr + prev, i.toString())} {...message} />
          )
        )}
      </div>
      <div className='bg-gray-300 p-4'>
        <input
          className='flex items-center h-10 w-full rounded px-3 text-sm'
          type='text'
          placeholder='Type your message…'
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.currentTarget.value.includes("!queue:")) {
                const videoUrl = e.currentTarget.value.split("!queue:")[1];
                enqueueVideo(videoUrl);
              } else {
                setMessagesLocal([
                  ...messagesLocal,
                  { user: currentUser, content: e.currentTarget.value, userId: "whateber" },
                ]);
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
