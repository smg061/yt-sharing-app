import React from "react";
import { useChat } from "../hooks/useChat";


export type Message = { user: string; userId: string; content: string };
type props = {
  currentUser: string;
  setCurrentUser: (user: string) => void;
};

const OtherChatMsg = ({ user, content }: { user: string; content: string }) => {
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-xs">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
      <div>
        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
          <p className="text-sm">{content}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">2 min ago</span>
      </div>
    </div>
  );
};
const OwnChatMsg = ({ user, content }: { user: string; content: string }) => {
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
      <div>
        {user}
        <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
          <p className="text-sm">{content}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">2 min ago</span>
      </div>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
    </div>
  );
};
const Chatbox = ({ currentUser, setCurrentUser }: props) => {
  const { messageQueue, sendMessage ,id, queueVideo} = useChat();

  return (
    <div className="flex h-full flex-col flex-grow w-full max-w-xl bg-black shadow-xl rounded-lg overflow-hidden">
      <div>
        <div>Set user name:</div>
        <input value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}></input>
      </div>
      <div className="flex flex-col flex-grow p-4 overflow-auto">
        {messageQueue.map((message, i) =>
          message.user === currentUser ? (
            <OwnChatMsg
              key={Object.values(message).reduce((curr, prev) => curr + prev, i.toString())}
              {...message}
            />
          ) : (
            <OtherChatMsg
              key={Object.values(message).reduce((curr, prev) => curr + prev, i.toString())}
              {...message}
            />
          )
        )}
      </div>
      <div className="bg-gray-300 p-4">
        <input
          className={"flex items-center h-10 w-full rounded px-3 text-sm"}
          type="text"
          placeholder={currentUser.length === 0 ? "Select a username before chatting" : "Type your message…"}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim().length) {
              if (e.currentTarget.value.includes("youtube.com")) {
                const videoUrl = e.currentTarget.value;
                queueVideo(videoUrl);
              } else {
                sendMessage({
                  user: currentUser,
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

export default React.memo(Chatbox);
