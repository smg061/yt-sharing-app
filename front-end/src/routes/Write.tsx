import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../utils/api";
import { Textarea } from "../components/textarea";
import {ScrollArea} from '../components/scrollarea/scroll-area'
import { PromiseQueue, delayFunc } from "../utils/PromiseQueue";

export function Write() {
  const { user, loading } = useAuth();
  const [text, setText] = useState<string>("");
  const [proomptText, setProomptText] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const queue = useMemo(() => new PromiseQueue(), []);

  const mockPromptText = async (input: string, cb: (val: string) => void) => {
    queue.enqueue(delayFunc(cb, "Write something to get started", 400));
    queue.enqueue(delayFunc(cb, "Some text to get started", 450));
    queue.enqueue(delayFunc(cb, "Some text to get started", 500));
    queue.enqueue(delayFunc(cb, "Some text to get started", 550));
    queue.enqueue(delayFunc(cb, "Some text to get started", 600));
    queue.enqueue(delayFunc(cb, "Some text to get started", 650));
    queue.enqueue(delayFunc(cb, "Some text to get started", 700));
    queue.enqueue(delayFunc(cb, "Some text to get started", 750));
    queue.enqueue(delayFunc(cb, "Some text to get started", 800));
    queue.enqueue(delayFunc(cb, "Some text to get started", 850));
  };

  const handleSubmit = async () => {
    if (!text.trim().length) return;
    setProomptText((prev) => [...prev, currentMessage, `user: ${text}`,]);
    setCurrentMessage("");
    const res = await api.proompt(text, (res) => {
      console.log(res);
      setCurrentMessage(prev => prev+res)
    });

  };

  useEffect(() => {
    // the first time we load the page, we want to get some text to get started
    // but if we are loading, the promises will be queued up twice and we will get
    // double the text; so we return if we are loading
    if (loading) return;
    // mockPromptText(text, (res) => {
    //   setCurrentMessage(prev => prev+res)
    // });
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
        <ScrollArea  className="border-2  w-[40vw] h-[400px]    rounded-lg p-4" >
          {proomptText.map((text) => {
            return (
              <div>
                <p className="text-xl text-white font-bold text-center">
                  {text}
                </p>
              </div>
            );
          })}
          <p className="text-xl text-white font-bold text-center"> {currentMessage}</p>
        </ScrollArea>
        <div className="">
          <div className="flex flex-col items-center justify-center ">
            <Textarea className=" resize-none border border-white  rounded-lg" value={text} onChange={(e) => setText(e.target.value)} />
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
