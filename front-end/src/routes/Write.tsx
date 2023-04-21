import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../utils/api";
export function Write() {
  const { user } = useAuth();
  const [text, setText] = useState<string>("");
 const [proomptText, setProomptText] = useState<string[]>([]);
  const handleSubmit = async () => {
    if (!text.trim().length) return;
    const res = await api.proompt(text);
    if(!res) return;
    console.log(res);
    setProomptText([...proomptText, res.response]);
  };
  if (!user) {
    return <div>Not logged in</div>;
  }
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-center">Write Together</h1>
        <p className="text-xl font-bold text-center">
          Write with the help of AI together with your friends
        </p>
        <div className="flex flex-col items-center justify-center h-screen">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={async () => {
              await handleSubmit();
            }}
          >
            Submit
          </button>
     
        {proomptText.map((text) => {
            return <div>
                <p className="text-xl text-white font-bold text-center">
                    {text}
                </p>
            </div>;
          })
          }
        </div>
      </div>
    </div>
  );
}
