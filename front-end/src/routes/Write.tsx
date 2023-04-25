import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../utils/api";
import { Textarea } from "../components/Textarea";
import { ScrollArea } from "../components/scrollarea/scroll-area";
import { PromiseQueue, delayFunc } from "../utils/PromiseQueue";
import { X, Bot, User } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/avatar";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

function ChatIcon({ role }: { role: "user" | "bot" }) {
  return (
    <span className={`${role === "bot" ? "" : ""} pt-1`}>
      <Avatar className="">
        <AvatarImage 
   
        />
      
      </Avatar>
    </span>
  );
}

function Chatmessage(props: { currentMessage: ChatMessage }) {
  return (
    <div className="flex">
      <div
        className={`text-lg rounded-[8px] p-6 text-white  text-center ${
          props.currentMessage.role === "bot" ? "bg-slate-600" : ""
        }`}
      >
        <ChatIcon role={props.currentMessage.role} />
        {`${props.currentMessage.text}`}
      </div>
    </div>
  );
}


export function Write() {
  const { user, loading } = useAuth();
  const [text, setText] = useState<string>("");
  const [proomptHistory, setProomptHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ChatMessage>({
    role: "bot",
    text: "",
  });
  const currentTextRef = useRef<HTMLParagraphElement>(null);
  const queue = useMemo(() => new PromiseQueue(), []);
  const mockPromptText = async (
    input: string,
    cb: (val: string) => void,
    onEnd?: () => void
  ) => {
    for (let i = 0; i <  200; i++) {
      queue.enqueue(delayFunc(cb, "aaaaaa\n", i * 3 + (i+100)));
    }
  };

  const handleSubmit = async () => {
    if (!text.trim().length) return;
    setText("");
    const scrollRef = currentTextRef.current;
    setProomptHistory((prev) => [
      ...prev,
      currentMessage,
      { role: "user", text },
    ]);
    setCurrentMessage({
      role: "user",
      text: "",
    });
    if (scrollRef) {
      currentTextRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    await api.proompt(text, (res) => {
      setCurrentMessage((prev) => ({
        role: "bot",
        text: prev.text + res,
      }));
      currentTextRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };
  useEffect(() => {
    // the first time we load the page, we want to get some text to get started
    // but if we are loading, the promises will be queued up twice and we will get
    // double the text; so we return if we are loading
    if (loading) return;
    mockPromptText(text, (res) => {
      if (currentTextRef.current) {
        currentTextRef.current.scrollIntoView({ behavior: "auto" });
      }
      setCurrentMessage((prev) => ({
        role: "bot",
        text: prev.text + res,
      }));
    });
  }, [loading]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center">Writing assistant</h1>
      <p className="text-xl font-bold text-center">Write with the help of AI</p>
      <div className="grid items-center justify-center w-screen max-w-screen">
        <ScrollArea className="border  w-screen p-8  md:w-[40vw] h-[700px]  rounded-[5px]">
          {proomptHistory.map(({ role, text }) => {
            if (!text.trim().length) return null;
            return (
              <Chatmessage
                key={`${role}-${text}`}
                currentMessage={{ role, text }}
              ></Chatmessage>
            );
          })}
          {currentMessage.text && (
            <Chatmessage
              currentMessage={currentMessage}
            ></Chatmessage>
          )}
          <div className="h-10" ref={currentTextRef}></div>
        </ScrollArea>
        <div className="">
          <div className="flex flex-col items-center justify-center ">
            <Textarea
              className=" resize-none border    rounded-[2px] h-12"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write here"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await handleSubmit();
                }
              }}
            />
            <button
              onClick={async () => {
                await handleSubmit();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
